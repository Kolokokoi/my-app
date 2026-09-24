import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { db } from '../apiClient';
import { styles } from '../appStyles';

export default function AssistantScreen({ userId, allRooms, facultyList, allCourses }) {
  const [messages, setMessages] = useState([{ type: 'bot', text: 'Hi! Ask me about the building.' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [scheduleItems, setScheduleItems] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const { data } = await db.from('class_schedules').select('*');
        setScheduleItems(data || []);
      } catch (error) {
        console.error('Assistant schedule error:', error);
      }
    };
    loadSchedules();
  }, []);

  const generateCampusResponse = async (userQuery) => {
    const query = userQuery.toLowerCase();
    const rooms = allRooms || [];
    const faculty = facultyList || [];
    const courses = allCourses || [];
    const roomMatch = query.match(/(?:hiraya\s?)?(\d{3})/i);
    const room = roomMatch ? rooms.find(item => item.id === roomMatch[1]) : null;

    if (query.includes('hi') || query.includes('hello') || query.includes('help')) {
      return "I can answer questions about rooms, faculty, courses, and your schedule. Try 'Which rooms are free?', 'Where is Turing?', 'What courses are available?', or 'Show my schedule.'";
    }

    if (room) {
      const occupancy = room.status === 'Occupied'
        ? `\nOccupied by: ${room.occupantName || 'Unknown'}\nClass: ${room.subject || 'Unknown'}`
        : '';
      if (query.includes('schedule') || query.includes('timetable') || query.includes('class')) {
        const roomSchedules = scheduleItems.filter(schedule => schedule.room_id === room.id);
        return roomSchedules.length
          ? `${room.name} schedule: ${roomSchedules.map(schedule => `${schedule.course_title} (${schedule.schedule_time})`).join('; ')}.`
          : `${room.name} has no schedule records.`;
      }
      return `${room.name} (${room.id}) is ${room.status}. Floor: ${room.floor || 'Unknown'}.${occupancy}`;
    }

    const foundFaculty = faculty.find(member =>
      query.includes(member.id.toLowerCase()) ||
      member.name.toLowerCase().split(' ').some(namePart => namePart.length > 2 && query.includes(namePart))
    );
    if (foundFaculty) {
      if (query.includes('schedule') || query.includes('timetable') || query.includes('class')) {
        const facultySchedules = scheduleItems.filter(schedule => schedule.student_id === foundFaculty.id);
        return facultySchedules.length
          ? `${foundFaculty.name} schedule: ${facultySchedules.map(schedule => `${schedule.course_title} in Room ${schedule.room_id} (${schedule.schedule_time})`).join('; ')}.`
          : `${foundFaculty.name} has no schedule records.`;
      }
      const assignedRoom = rooms.find(item => item.id === foundFaculty.roomAssigned);
      const roomText = assignedRoom
        ? ` Assigned room: ${assignedRoom.name} is ${assignedRoom.status}.`
        : '';
      return `${foundFaculty.name} is currently ${foundFaculty.isAvailable ? 'IN' : 'OUT'} campus.${roomText}`;
    }

    if ((query.includes('room') || query.includes('rooms')) && (query.includes('free') || query.includes('available') || query.includes('vacant'))) {
      const freeRooms = rooms.filter(item => ['free', 'open'].includes(String(item.status).toLowerCase()));
      return freeRooms.length
        ? `Free rooms: ${freeRooms.map(item => `${item.name} (${item.id})`).join(', ')}.`
        : 'There are no free rooms right now.';
    }

    if (query.includes('occupied') || query.includes('busy')) {
      const occupiedRooms = rooms.filter(item => String(item.status).toLowerCase() === 'occupied');
      return occupiedRooms.length
        ? `Occupied rooms: ${occupiedRooms.map(item => `${item.name} (${item.id})`).join(', ')}.`
        : 'There are no occupied rooms right now.';
    }

    if (query.includes('faculty') || query.includes('teacher') || query.includes('professor')) {
      return faculty.length
        ? `Faculty: ${faculty.map(member => member.name).join(', ')}.`
        : 'No faculty records are available.';
    }

    if (query.includes('schedule') || query.includes('timetable') || query.includes('class')) {
      const ownSchedules = scheduleItems.filter(schedule => schedule.student_id === userId);
      return ownSchedules.length
        ? `Your schedule: ${ownSchedules.map(schedule => `${schedule.course_title} in Room ${schedule.room_id} (${schedule.schedule_time})`).join('; ')}.`
        : 'You do not have any schedule records yet.';
    }

    const foundCourse = courses.find(course =>
      query.includes(String(course.course_code).toLowerCase()) ||
      query.includes(String(course.description).toLowerCase())
    );
    if (foundCourse) return `${foundCourse.course_code}: ${foundCourse.description}.`;

    if (query.includes('course') || query.includes('subject')) {
      return courses.length
        ? `Available courses: ${courses.map(course => `${course.course_code} - ${course.description}`).join('; ')}.`
        : 'No course records are available.';
    }

    if (query.includes('room') || query.includes('building') || query.includes('floor')) {
      return rooms.length
        ? `I found ${rooms.length} rooms across the building. Ask about a room number or say "Which rooms are free?"`
        : 'No room records are available.';
    }

    return 'I could not find that in the campus data. Ask me about rooms, faculty, courses, or your schedule.';
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    const userMessage = { type: 'user', text: input };
    setMessages(previous => [...previous, userMessage]);
    setInput('');
    setIsTyping(true);
    const response = await generateCampusResponse(userMessage.text);
    setMessages(previous => [...previous, { type: 'bot', text: response }]);
    setIsTyping(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc', color: '#1e293b' }}>
      <div style={styles.header}><h2 style={{ margin: 0 }}>AI Assistant</h2></div>
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ ...styles.chatBubble, ...(message.type === 'user' ? styles.chatUser : styles.chatBot), backgroundColor: message.type === 'user' ? '#10b981' : 'white', color: message.type === 'user' ? 'white' : '#1e293b' }}>
            {message.text}
          </div>
        ))}
        {isTyping && <div style={{ ...styles.chatBubble, ...styles.chatBot, backgroundColor: 'white', color: '#1e293b', fontStyle: 'italic' }}>Typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ padding: '16px', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
        <input style={{ ...styles.input, marginTop: 0, marginBottom: 0 }} value={input} onChange={event => setInput(event.target.value)} placeholder="Type a message..." />
        <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', padding: '0 16px', cursor: 'pointer' }}><Send size={20} /></button>
      </form>
    </div>
  );
}
