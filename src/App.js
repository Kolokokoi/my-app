  import React, { useState, useEffect, useRef } from "react";
  import {
    LogIn,
    MapPin,
    CornerUpLeft,
    User,
    Briefcase,
    Calendar,
    Map as MapIcon,
    Bot,
    Clock,
    Wifi,
    Home,
    ChevronRight,
    X,
    LogOut,
    Heart,
    Info,
    Trash2, 
    Save,
    ToggleLeft,
    ToggleRight,
    UserCheck,
    UserX,
    Search,
    Users,
    Monitor,
    Lock,
    List,
    Grid, 
    BookOpen,
    Edit3,
    ShieldAlert,
    ChevronDown,
    Play,
    Edit,
    HelpCircle 
  } from "lucide-react";
    import { db } from './apiClient';
    import { approveAccountRequest } from './apiClient';
    import { styles } from './appStyles';
    import { formatFloor, getTimeMinutes, isClassActive } from './scheduleUtils';
    import AssistantScreen from './components/AssistantScreen';
    import RegistrationScreen from './components/RegistrationScreen';

  // --- CONFIGURATION ---
  const LOGO_URL = "/logo.png"; 
// RoomDetailModal.js

// RoomDetailModal.js - Focused on the action button block

function RoomDetailModal({ roomData, onClose }) {
  // Destructure the necessary properties, including the new room_type
  const { name, location, room_image_url, room_type } = roomData;
  
  // Define the types that should NOT show staff info
  const EXCLUDED_STAFF_TYPES = ['Classroom', 'Lecture Hall', 'Lab']; 

  // Check if the current room type is one of the excluded types
  const isStaffCheckAllowed = !EXCLUDED_STAFF_TYPES.includes(room_type); 

  return (
    <div className="room-detail-modal">
      {/* ... (Image display and basic info sections remain the same) ... */}
      
      <div className="room-info">
        {/* ... (Name, location, and close button remain the same) ... */}
        
        {/* === START: Conditional Button Rendering === */}
        {isStaffCheckAllowed ? (
          // If it's an Office/Non-Classroom: Show the "Check who's available" button
          <button className="check-available-button">
            <i className="icon-available"></i> Check who's available
          </button>
        ) : (
          // If it's a Classroom: Show a different, class-specific button/message
          <button className="view-schedule-button">
            <i className="icon-schedule"></i> View Class Schedule
          </button>
        )}
        {/* === END: Conditional Button Rendering === */}
        
      </div>
    </div>
  );
}

// export default RoomDetailModal;

// export default RoomDetailModal; // Or wherever you use it




  // --- LOGIC ---

  // --- COMPONENTS ---

  const ActionCard = ({ title, description, icon: Icon, color, onClick }) => (
      <button style={{
          ...styles.card, 
          // NEW BACKGROUND COLOR:
          backgroundColor: '#f1f5f9', // Light Slate Button Background
          border: '2px solid #cbd5e1' // Matching border
      }} onClick={onClick}>
        <div style={{padding: "10px", borderRadius: "10px", backgroundColor: 'white', marginRight: "16px", border: '1px solid #e2e8f0'}}>
          <Icon size={24} color={color === 'emerald' ? '#10b981' : color === 'red' ? '#ef4444' : '#0ea5e9'} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", color: "#1e293b" }}>{title}</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>{description}</p>
        </div>
        <ChevronRight size={16} color="#94a3b8" />
      </button>
  );

  const HelpScreen = ({ onBack, role }) => {
      return (
          <div style={{ height: "100%", backgroundColor: "#f8fafc", display: 'flex', flexDirection: 'column' }}>
              <div style={styles.header}>
                  <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: '8px', marginLeft: '-8px' }}><CornerUpLeft size={24} color="#64748b" /></button>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>User Guide</h2>
                  <div style={{width: 24}}></div>
              </div>
              <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#0ea5e9", marginBottom: "20px" }}>How to use as a {role}</h3>
                  
                  {/* --- STEPS FOR EVERYONE (1 & 2) --- */}
                  <div style={styles.instructionStep}>
                      <div style={styles.instructionNum}>1</div>
                      <div>
                          <h4 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold'}}>Check Room Map</h4>
                          <p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Go to the Map tab. Green is Free, Red is Occupied. Click a room to see details or navigate.</p>
                      </div>
                  </div>
                  <div style={styles.instructionStep}>
                      <div style={styles.instructionNum}>2</div>
                      <div>
                          <h4 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold'}}>Use the AI</h4>
                          <p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Tap the "Assistant" tab and ask "Is Room 301 free?" or "Where is Prof. Turing?".</p>
                      </div>
                  </div>

                  {/* --- ROLE SPECIFIC STEPS --- */}
                  {role === 'Teacher' ? (
                      /* TEACHER INSTRUCTIONS */
                      <>
                          <div style={styles.instructionStep}>
                              <div style={styles.instructionNum}>3</div>
                              <div>
                                  <h4 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold'}}>Set Your Status</h4>
                                  <p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>On the Home Screen, toggle the "My Status" switch. This lets students know if you are currently In or Out of campus.</p>
                              </div>
                          </div>
                          <div style={styles.instructionStep}>
                              <div style={styles.instructionNum}>4</div>
                              <div>
                                  <h4 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold'}}>Manage Rooms</h4>
                                  <p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Click a room on the Map. You can manually set it to "Occupied" (to claim it) or "Free" (to release it) using the buttons in the popup.</p>
                              </div>
                          </div>
                          <div style={styles.instructionStep}>
                              <div style={styles.instructionNum}>5</div>
                              <div>
                                  <h4 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold'}}>My Teaching Load</h4>
                                  <p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Go to "My Teaching Load" to add your class schedule. You can select the specific room and time, which helps keep the map accurate.</p>
                              </div>
                          </div>
                          <div style={styles.instructionStep}>
                              <div style={styles.instructionNum}>6</div>
                              <div>
                                  <h4 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold'}}>Faculty Directory</h4>
                                  <p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Access the directory to check the real-time availability and office locations of your colleagues.</p>
                              </div>
                          </div>
                      </>
                  ) : (
                      /* STUDENT INSTRUCTIONS */
                      <>
                          <div style={styles.instructionStep}>
                              <div style={styles.instructionNum}>3</div>
                              <div>
                                  <h4 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold'}}>Find Faculty</h4>
                                  <p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Click "Faculty Directory" on the Home Screen to see which teachers are currently in campus and where their office is located.</p>
                              </div>
                          </div>
                          <div style={styles.instructionStep}>
                              <div style={styles.instructionNum}>4</div>
                              <div>
                                  <h4 style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold'}}>Manage Schedule</h4>
                                  <p style={{margin: 0, fontSize: '13px', color: '#64748b'}}>Tap "My Schedule" to input your classes. This acts as your personal digital planner for the semester.</p>
                              </div>
                          </div>
                      </>
                  )}
              </div>
          </div>
      );
  };

  const FacultyDirectoryScreen = ({ onBack, facultyList, currentUserId, styles, allRooms }) => {
      const [searchQuery, setSearchQuery] = useState("");

      const filteredList = facultyList.filter(faculty => 
          faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faculty.position.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const sortedList = [...filteredList].sort((a, b) => {
          if (a.id === currentUserId) return -1;
          if (b.id === currentUserId) return 1;
          return a.name.localeCompare(b.name);
      });

      return (
          <div style={{ height: "100%", backgroundColor: "#f8fafc", display: 'flex', flexDirection: 'column', color: "#1e293b" }}>
              {/* Header */}
              <div style={{...styles.header, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0'}}>
                  <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: '8px', marginLeft: '-8px' }}>
                      <CornerUpLeft size={24} color="#64748b" />
                  </button>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: "#1e293b" }}>Faculty Status</h2>
                  <div style={{width: 24}}></div>
              </div>

              {/* Search Bar */}
              <div style={{ padding: "0 20px", marginTop: "16px" }}>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: "white", padding: '12px', borderRadius: '12px', border: "2px solid #cbd5e1", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                      <Search size={20} color="#64748b" />
                      <input 
                          placeholder="Search professor or position..." 
                          style={{ border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '14px', backgroundColor: 'transparent', color: "#1e293b" }} 
                          value={searchQuery} 
                          onChange={(e) => setSearchQuery(e.target.value)} 
                      />
                  </div>
              </div>
              
              {/* List */}
              <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
                  <p style={{fontSize: '13px', color: "#64748b", marginBottom: '16px'}}>Real-time availability of CCIS Faculty.</p>
                  
                  {sortedList.length === 0 ? (
                      <p style={{textAlign: 'center', color: '#94a3b8', marginTop: '20px'}}>No faculty found.</p>
                  ) : (
                      sortedList.map((faculty) => {
                          const isMe = faculty.id === currentUserId; 
                          
                          // Find the Room Name & ID
                          const assignedRoom = allRooms ? allRooms.find(r => r.id === faculty.roomAssigned) : null;
                          const locationName = assignedRoom ? assignedRoom.name : "No Office Assigned";
                          const roomId = assignedRoom ? assignedRoom.id : ""; // Get "HIRAYA 101"

                          let borderColor;
                          if (isMe) borderColor = '#3b82f6';
                          else if (faculty.isAvailable) borderColor = '#10b981';
                          else borderColor = '#ef4444';

                          return (
                              <div key={faculty.id} style={{
                                  ...styles.roomListCard, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  border: `3px solid ${borderColor}`, 
                                  backgroundColor: isMe ? '#eff6ff' : 'white',
                                  padding: '16px', 
                                  gap: '12px' 
                              }}>
                                  <div style={{
                                      width: '40px', height: '40px', borderRadius: '50%', 
                                      backgroundColor: faculty.isAvailable ? '#d1fae5' : '#fee2e2', 
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                      color: faculty.isAvailable ? '#059669' : '#dc2626', 
                                      fontWeight: 'bold', fontSize: '14px',
                                      flexShrink: 0 
                                  }}>
                                      {faculty.name.charAt(0)}
                                  </div>

                                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                          <h4 style={{margin: 0, color: "#1e293b", fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                              {faculty.name}
                                              {isMe && <span style={{fontSize: '10px', backgroundColor: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px'}}>YOU</span>}
                                          </h4>
                                      </div>

                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                          <p style={{margin: 0, color: "#64748b", fontSize: '11px', display:'flex', flexDirection:'column'}}>
                                              <span style={{fontWeight:'600'}}>{faculty.position}</span>
                                              {/* --- UPDATED: Show Room ID (HIRAYA 101) --- */}
                                              <span style={{fontSize:'10px', color:'#94a3b8'}}>
                                                  {locationName} {roomId && `• ${roomId}`}
                                              </span>
                                          </p>
                                          
                                          <span style={{
                                              fontSize: '11px', fontWeight: 'bold', 
                                              color: faculty.isAvailable ? '#059669' : '#dc2626', 
                                              padding: '4px 8px', borderRadius: '12px', 
                                              backgroundColor: faculty.isAvailable ? '#ecfdf5' : '#fef2f2',
                                              whiteSpace: 'nowrap'
                                          }}>
                                              {faculty.isAvailable ? "In Campus" : "Out"}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          );
                      })
                  )}
              </div>
          </div>
      );
  };

  const AdminLogScreen = ({ onBack, history }) => (
      <div style={{ height: "100%", backgroundColor: "#f8fafc", display: 'flex', flexDirection: 'column' }}>
          <div style={styles.header}>
              <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: '8px', marginLeft: '-8px' }}><CornerUpLeft size={24} color="#64748b" /></button>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>Login History</h2>
              <div style={{width: 24}}></div>
          </div>
          <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
              {history.length === 0 ? (<p style={{textAlign: 'center', color: '#94a3b8', marginTop: '40px'}}>No records found.</p>) : (
                  history.map((log, index) => (
                      <div key={index} style={styles.logEntry}>
                          <div><p style={{margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#1e293b'}}>{log.displayName}</p><p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#64748b'}}>{log.role} • <span style={{fontFamily: 'monospace'}}>{log.id}</span></p></div>
                          <div style={{textAlign: 'right'}}><p style={{margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#0ea5e9'}}>{log.time}</p></div>
                      </div>
                  ))
              )}
          </div>
      </div>
  );

  // --- REPLACE THE ENTIRE AdminDashboard COMPONENT WITH THIS UPDATED VERSION ---
  

  const AdminDashboard = ({ onBack, facultyList, allRooms, allCourses, styles, setScreen }) => {
      const [viewMode, setViewMode] = useState('menu'); 
      const [pendingRequests, setPendingRequests] = useState([]);
      
      // --- MODE: 'faculty' or 'student' ---
      const [assignType, setAssignType] = useState('faculty'); 

      // --- SELECTION STATES ---
      const [selectedFacultyId, setSelectedFacultyId] = useState("");
      const [facultyInput, setFacultyInput] = useState("");
      const [showFacultyList, setShowFacultyList] = useState(false);
       const [availableClasses, setAvailableClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null); // To store which class we picked

      // --- NEW: STUDENT SELECTION STATES ---
      const [selectedStudentId, setSelectedStudentId] = useState("");
      const [studentInput, setStudentInput] = useState("");
      const [studentOptions, setStudentOptions] = useState([]); // Search results
      const [showStudentList, setShowStudentList] = useState(false);

      const [selectedSubject, setSelectedSubject] = useState("");
      const [showSubjectList, setShowSubjectList] = useState(false);

      const [selectedRoomId, setSelectedRoomId] = useState("");
      const [roomInput, setRoomInput] = useState("");
      const [showRoomList, setShowRoomList] = useState(false);

      const [days, setDays] = useState([]);
      const [start, setStart] = useState("");
      const [end, setEnd] = useState("");
      const [loading, setLoading] = useState(false);
      const [scheduleList, setScheduleList] = useState([]);

      useEffect(() => {
          if (viewMode !== 'menu') return;
          db.from('account_requests').select('*').eq('status', 'Pending').order('created_at', { ascending: false })
              .then(({ data }) => setPendingRequests(data || []))
              .catch(error => console.error('Account request error:', error));
      }, [viewMode]);

      const approveRequest = async (request) => {
          if (!window.confirm(`Verify ${request.full_name} as a CSU ${request.role}? This will create the account and assign CCIS schedules.`)) return;
          try {
              await approveAccountRequest(request.id);
              setPendingRequests(previous => previous.filter(item => item.id !== request.id));
              alert(`${request.full_name} approved. Their account and CCIS schedules are ready.`);
          } catch (error) {
              alert(`Approval failed: ${error.message}`);
          }
      };

      const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      // --- FETCH EXISTING SCHEDULE (When User is Selected) ---

      // --- FETCH AVAILABLE CLASSES (For Student Enrollment) ---
    useEffect(() => {
        if (assignType === 'student') {
            const fetchClasses = async () => {
                // Get all schedules where the ID looks like a Faculty ID (FAC-...)
                const { data, error } = await db
                    .from('class_schedules')
                    .select('*')
                    .ilike('student_id', 'FAC-%'); // assuming faculty IDs start with FAC
                
                if (error) console.error("Error fetching classes:", error);
                if (data) setAvailableClasses(data);
            };
            fetchClasses();
        }
    }, [assignType]);
      useEffect(() => {
          const targetId = assignType === 'faculty' ? selectedFacultyId : selectedStudentId;
          if (!targetId) {
              setScheduleList([]);
              return;
          }
          const fetch = async () => {
              const { data } = await db.from('class_schedules').select('*').eq('student_id', targetId);
              if (data) setScheduleList(data);
          };
          fetch();
      }, [selectedFacultyId, selectedStudentId, assignType]);

      // --- NEW: DYNAMIC STUDENT SEARCH ---
      // --- NEW: DYNAMIC STUDENT SEARCH (FIXED) ---
    const handleStudentSearch = async (val) => {
        setStudentInput(val);
        setShowStudentList(true);

        // 1. Safety Check: If input is empty or too short, clear options and stop
        if (!val || val.trim().length < 2) {
            setStudentOptions([]);
            return; 
        }

        try {
            // 2. Perform the Search
            const { data, error } = await db
                .from('students')
                .select('*')
                // CRITICAL FIX: This checks BOTH First Name OR Last Name
                .or(`first_name.ilike.%${val}%,last_name.ilike.%${val}%`)
                .limit(5);

            if (error) throw error;
            
            // 3. Update the dropdown list
            if (data) setStudentOptions(data);

        } catch (error) {
            console.error("Error searching student:", error.message);
        }
    };

      // --- HELPER: FILTERING LISTS ---
      const filteredFaculty = facultyList.filter(f => 
          f.name.toLowerCase().includes(facultyInput.toLowerCase())
      );

      const filteredCourses = allCourses ? allCourses.filter(c => {
          const fullString = `${c.course_code} - ${c.description}`;
          return fullString.toLowerCase().includes(selectedSubject.toLowerCase());
      }) : [];

      // --- FILTER ROOMS (EXCLUDING OFFICES) ---
      const filteredRooms = allRooms.filter(r => 
          (r.name.toLowerCase().includes(roomInput.toLowerCase()) || 
          r.id.toLowerCase().includes(roomInput.toLowerCase())) &&
          r.type !== 'OFFICE' && r.type !== 'ADMIN'
      );

      // --- MAIN ACTION: ASSIGN SCHEDULE ---
     // --- MAIN ACTION: ASSIGN SCHEDULE ---
    const handleAssign = async (e) => {
        e.preventDefault();
        
        const targetId = assignType === 'faculty' ? selectedFacultyId : selectedStudentId;

        // Validation
        if (!targetId || !selectedSubject) {
            alert("Please select a user and a subject.");
            return;
        }

        // Specific checks
        if (assignType === 'faculty') {
            if (!selectedRoomId || days.length === 0 || !start || !end) {
                alert("Please complete the schedule details (Room, Days, Time).");
                return;
            }
        } else {
            // Student check
            if (!selectedClassId) {
                alert("Please select a class from the list.");
                return;
            }
        }

        setLoading(true);

        try {
            let finalPayload = {};
            let finalTime = "";

            if (assignType === 'faculty') {
                // MANUAL CREATION
                const timeStr = `${start} - ${end}`;
                const dayStr = days.join(", ");
                finalTime = `${dayStr} @ ${timeStr}`;

                finalPayload = {
                    student_id: targetId,
                    course_title: selectedSubject,
                    room_id: selectedRoomId,
                    schedule_time: finalTime
                };
            } else {
                // STUDENT ENROLLMENT (COPY FROM SELECTED CLASS)
                // We find the selected class object to get its details
                const classDetails = availableClasses.find(c => c.id === selectedClassId);
                
                finalPayload = {
                    student_id: targetId,
                    course_title: classDetails.course_title,
                    room_id: classDetails.room_id,         // Copy Room
                    schedule_time: classDetails.schedule_time // Copy Time
                };
            }

            // 1. Insert through the PostgreSQL API
            const { data: schedData, error: schedError } = await db
                .from('class_schedules')
                .insert([finalPayload])
                .select();

            if (schedError) throw schedError;

            // 2. Occupy Room (Only if Faculty)
            if (assignType === 'faculty') {
                const facultyName = facultyList.find(f => f.id === selectedFacultyId)?.name || "Faculty";
                await db.from('rooms').update({
                    status: 'Occupied',
                    occupant_id: selectedFacultyId,
                    occupant_name: facultyName,
                    subject: selectedSubject,
                    time: finalTime
                }).eq('id', selectedRoomId);
                
                alert("Class Created & Room Reserved!");
            } else {
                alert("Student successfully enrolled!");
            }

            setScheduleList([...scheduleList, schedData[0]]);
            
            // Reset
            setSelectedSubject(""); setSelectedRoomId(""); setDays([]); setStart(""); setEnd(""); setSelectedClassId(null);

        } catch (err) {
            console.error(err);
            alert("Error assigning schedule.");
        } finally {
            setLoading(false);
        }
    };

      const handleDelete = async (id, roomId) => {
          if(!window.confirm("Remove schedule entry?")) return;
          await db.from('class_schedules').delete().eq('id', id);
          
          // Only free the room if it was a Faculty schedule
          if (assignType === 'faculty') {
              await db.from('rooms').update({
                  status: 'Free', occupant_id: null, occupant_name: null, subject: null
              }).eq('id', roomId);
          }
          setScheduleList(scheduleList.filter(i => i.id !== id));
      };

      // --- STYLES FOR DROPDOWN ---
      const dropdownStyle = {
          position: 'absolute', zIndex: 10, backgroundColor: 'white', width: '100%', 
          maxHeight: '150px', overflowY: 'auto', border: '1px solid #cbd5e1', 
          borderRadius: '0 0 12px 12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      };
      const itemStyle = { padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '14px', color: '#1e293b' };

      // --- VIEW 1: MENU ---
      if (viewMode === 'menu') {
          return (
              <div style={{ padding: "24px", height: "100%", backgroundColor: "#f8fafc", display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: "24px" }}>
                      <h1 style={{ margin: 0, color: "#1e293b", fontSize: "26px" }}>Good Morning,</h1>
                      <span style={{ color: '#334155', fontSize: '22px', fontWeight: 'bold' }}>System Admin!</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ ...styles.roomListCard, cursor: 'default' }}>
                          <h3 style={{ margin: '0 0 12px', color: '#1e293b', fontSize: '15px' }}>Pending Account Verification ({pendingRequests.length})</h3>
                          {pendingRequests.length === 0 ? <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>No pending requests.</p> : pendingRequests.map(request => (
                              <div key={request.id} style={{ borderTop: '1px solid #e2e8f0', padding: '10px 0' }}>
                                  <strong style={{ color: '#1e293b', fontSize: '13px' }}>{request.full_name}</strong>
                                  <p style={{ margin: '3px 0', color: '#64748b', fontSize: '11px' }}>{request.role} • {request.user_id} • {request.institutional_email}</p>
                                  <p style={{ margin: '3px 0 8px', color: '#64748b', fontSize: '11px' }}>{request.course_or_department}</p>
                                  <button style={{ ...styles.buttonPrimary, padding: '9px', marginTop: 0, fontSize: '12px' }} onClick={() => approveRequest(request)}>Verify and Create Account</button>
                              </div>
                          ))}
                      </div>
                      <ActionCard title="Manage Schedules" description="Assign classes (Faculty/Student)" icon={Calendar} color="sky" onClick={() => setViewMode('assign')} />
                      <ActionCard title="Room Map & Status" description="View live classroom map" icon={MapIcon} color="emerald" onClick={() => setScreen("Map")} />
                      <ActionCard title="Faculty Directory" description="View staff list" icon={Users} color="violet" onClick={() => setScreen("FacultyDirectory")} />
                      <button onClick={() => setScreen("Welcome")} style={{ ...styles.buttonAdmin, backgroundColor: '#fee2e2', color: '#dc2626', border: '2px solid #fca5a5', marginTop: '24px' }}>
                          <LogOut size={20} strokeWidth={2.5} /> Sign Out
                      </button>
                  </div>
              </div>
          );
      }

      // --- VIEW 2: ASSIGNMENT FORM ---
      return (
          <div style={{ height: "100%", backgroundColor: "#f8fafc", display: 'flex', flexDirection: 'column' }}>
              <div style={styles.header}>
                  <button onClick={() => setViewMode('menu')} style={{ background: "none", border: "none", cursor: "pointer", padding: '8px', marginLeft: '-8px' }}><CornerUpLeft size={24} color="#64748b" /></button>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>Assign Schedule</h2>
                  <div style={{width: 24}}></div>
              </div>

              <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
                  
                  {/* 1. TOGGLE: WHO ARE WE ASSIGNING? */}
                  <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
                      <button 
                          onClick={() => { setAssignType('faculty'); setScheduleList([]); }}
                          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '13px', backgroundColor: assignType === 'faculty' ? 'white' : 'transparent', color: assignType === 'faculty' ? '#0f172a' : '#64748b', boxShadow: assignType === 'faculty' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}
                      >
                          Faculty Load
                      </button>
                      <button 
                          onClick={() => { setAssignType('student'); setScheduleList([]); }}
                          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '13px', backgroundColor: assignType === 'student' ? 'white' : 'transparent', color: assignType === 'student' ? '#0f172a' : '#64748b', boxShadow: assignType === 'student' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}
                      >
                          Student Class
                      </button>
                  </div>

                  {/* 2. USER SELECTION (Dynamic based on Toggle) */}
                  <div style={{ marginBottom: "20px", position: 'relative' }}>
                      <label style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b", marginBottom: "6px", display: "block" }}>
                          {assignType === 'faculty' ? "Select Faculty" : "Select Student"}
                      </label>
                      
                      {assignType === 'faculty' ? (
                          // FACULTY SEARCH
                          <>
                              <input 
                                  placeholder="Search Faculty Name..." 
                                  value={facultyInput}
                                  onClick={() => setShowFacultyList(true)}
                                  onChange={(e) => { setFacultyInput(e.target.value); setShowFacultyList(true); }}
                                  style={styles.input}
                              />
                              {showFacultyList && (
                                  <div style={dropdownStyle}>
                                      {filteredFaculty.length > 0 ? filteredFaculty.map(f => (
                                          <div key={f.id} style={itemStyle} onClick={() => {
                                              setFacultyInput(f.name);
                                              setSelectedFacultyId(f.id);
                                              setShowFacultyList(false);
                                          }}>
                                              <strong>{f.name}</strong> <span style={{fontSize:'12px', color:'#94a3b8'}}>({f.id})</span>
                                          </div>
                                      )) : <div style={{padding: '10px', color: '#94a3b8'}}>No faculty found</div>}
                                  </div>
                              )}
                          </>
                      ) : (
                          // STUDENT SEARCH
                          <>
                              <input 
                                  placeholder="Search Student Last Name..." 
                                  value={studentInput}
                                  onChange={(e) => handleStudentSearch(e.target.value)}
                                  style={styles.input}
                              />
                              {showStudentList && studentOptions.length > 0 && (
                                  <div style={dropdownStyle}>
                                      {studentOptions.map(s => (
                                          <div key={s.student_id} style={itemStyle} onClick={() => {
                                              setStudentInput(`${s.first_name} ${s.last_name}`);
                                              setSelectedStudentId(s.student_id);
                                              setShowStudentList(false);
                                          }}>
                                              <strong>{s.first_name} {s.last_name}</strong> <br/>
                                              <span style={{fontSize:'12px', color:'#94a3b8'}}>{s.student_id} • {s.course}</span>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </>
                      )}
                  </div>

                  {/* 3. ASSIGNMENT FORM (Only shows if a user is selected) */}
                 {/* 3. ASSIGNMENT FORM */}
                {((assignType === 'faculty' && selectedFacultyId) || (assignType === 'student' && selectedStudentId)) && (
                    <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
                        <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#0ea5e9" }}>
                            {assignType === 'faculty' ? "Create New Class" : "Enroll Student in Class"}
                        </h3>

                        {/* === FORM FOR STUDENTS (SELECT EXISTING CLASS) === */}
                        {assignType === 'student' ? (
                            <div style={{ marginBottom: "12px", position: 'relative' }}>
                                <label style={{ fontSize: "10px", fontWeight: "bold", color: "#64748b", marginBottom: "4px", display: "block" }}>Select Class Section</label>
                                <input 
                                    placeholder="Search Subject (e.g. CSC 101)..." 
                                    value={selectedSubject} // We reuse selectedSubject for the search text
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    style={styles.input}
                                />
                                {/* Dropdown of Available Classes */}
                                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '4px' }}>
                                    {availableClasses
                                        .filter(c => c.course_title.toLowerCase().includes(selectedSubject.toLowerCase()))
                                        .map(cls => {
                                            // 1. LOOKUP: Find the teacher's name using their ID
                                            const teacher = facultyList.find(f => f.id === cls.student_id);
                                            const teacherName = teacher ? teacher.name : cls.student_id; // Show Name, or fallback to ID if not found

                                            return (
                                                <div 
                                                    key={cls.id} 
                                                    onClick={() => {
                                                        setSelectedSubject(cls.course_title); 
                                                        setSelectedClassId(cls.id); 
                                                        setSelectedRoomId(cls.room_id);
                                                        setDays([]); 
                                                        setStart(cls.schedule_time); 
                                                    }}
                                                    style={{
                                                        padding: '12px', 
                                                        borderBottom: '1px solid #f1f5f9', 
                                                        cursor: 'pointer',
                                                        backgroundColor: selectedClassId === cls.id ? '#f0f9ff' : 'white',
                                                        borderLeft: selectedClassId === cls.id ? '4px solid #0ea5e9' : 'none'
                                                    }}
                                                >
                                                    <div style={{fontWeight: 'bold', color: '#1e293b'}}>{cls.course_title}</div>
                                                    <div style={{fontSize: '11px', color: '#64748b'}}>
                                                        {/* 2. DISPLAY: Show the Name here */}
                                                        Instructor: <span style={{color: '#0ea5e9', fontWeight: 'bold'}}>{teacherName}</span> <br/>
                                                        {cls.room_id} • {cls.schedule_time}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    {availableClasses.length === 0 && <div style={{padding:'12px', fontSize:'12px', color:'#94a3b8'}}>No active classes found. Add a Faculty Load first.</div>}
                                </div>
                            
                            </div>
                        ) : (
                            /* === FORM FOR FACULTY (MANUAL ENTRY) - KEEP AS IS === */
                            <>
                                {/* SUBJECT INPUT */}
                                <div style={{ marginBottom: "12px", position: 'relative' }}>
                                    <label style={{ fontSize: "10px", fontWeight: "bold", color: "#64748b", marginBottom: "4px", display: "block" }}>Subject</label>
                                    <input 
                                        placeholder="Search Subject..." 
                                        value={selectedSubject}
                                        onClick={() => setShowSubjectList(true)}
                                        onChange={(e) => { setSelectedSubject(e.target.value); setShowSubjectList(true); }}
                                        style={{...styles.input, marginTop: 0}}
                                    />
                                    {showSubjectList && (
                                        <div style={dropdownStyle}>
                                            {filteredCourses.map(c => (
                                                <div key={c.id || c.course_code} style={itemStyle} onClick={() => {
                                                    setSelectedSubject(`${c.course_code} - ${c.description}`);
                                                    setShowSubjectList(false);
                                                }}>
                                                    {c.course_code} - {c.description}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* ROOM INPUT */}
                                <div style={{ marginBottom: "12px", position: 'relative' }}>
                                    <label style={{ fontSize: "10px", fontWeight: "bold", color: "#64748b", marginBottom: "4px", display: "block" }}>Room</label>
                                    <input 
                                        placeholder="Search Room..." 
                                        value={roomInput}
                                        onClick={() => setShowRoomList(true)}
                                        onChange={(e) => { setRoomInput(e.target.value); setShowRoomList(true); }}
                                        style={{...styles.input, marginTop: 0}}
                                    />
                                    {showRoomList && (
                                        <div style={dropdownStyle}>
                                            {filteredRooms.map(r => (
                                                <div key={r.id} style={itemStyle} onClick={() => {
                                                    setRoomInput(r.name);
                                                    setSelectedRoomId(r.id);
                                                    setShowRoomList(false);
                                                }}>
                                                    <b>{r.name}</b> ({r.status})
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* DATE & TIME INPUTS */}
                                <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap', margin: "12px 0"}}>
                                    {daysOfWeek.map(day => (
                                        <button key={day} onClick={() => {
                                            if (days.includes(day)) setDays(days.filter(d => d !== day));
                                            else setDays([...days, day]);
                                        }} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: days.includes(day) ? 'none' : '1px solid #cbd5e1', backgroundColor: days.includes(day) ? '#3b82f6' : 'white', color: days.includes(day) ? 'white' : '#64748b', fontSize: '11px', fontWeight: 'bold' }}>{day}</button>
                                    ))}
                                </div>
                                <div style={{display: 'flex', gap: '12px'}}>
                                    <input type="time" style={{...styles.input, flex:1}} value={start} onChange={e=>setStart(e.target.value)} />
                                    <input type="time" style={{...styles.input, flex:1}} value={end} onChange={e=>setEnd(e.target.value)} />
                                </div>
                            </>
                        )}

                        {/* BUTTON */}
                        <button onClick={handleAssign} disabled={loading} style={{...styles.buttonAdmin, marginTop: "16px"}}>
                            {loading ? "Saving..." : (assignType === 'faculty' ? "Create Class" : "Enroll Student")}
                        </button>
                    </div>
                )}
                          {/* EXISTING LOAD LIST */}
                          <h3 style={{ fontSize: "14px", fontWeight: "bold", color: "#94a3b8", marginBottom: "12px" }}>
                              {assignType === 'faculty' ? "CURRENT LOAD" : "STUDENT'S CLASSES"}
                          </h3>
                          {scheduleList.length === 0 ? <p style={{color: '#cbd5e1', fontSize: '13px'}}>No classes yet.</p> : scheduleList.map(item => (
                              <div key={item.id} style={styles.scheduleCard}>
                                  <div>
                                      <h4 style={{ margin: 0, fontSize: "14px" }}>{item.course_title}</h4>
                                      <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>{item.room_id} • {item.schedule_time}</p>
                                  </div>
                                  <button onClick={() => handleDelete(item.id, item.room_id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}>
                                      <Trash2 size={16} color="#ef4444" />
                                  </button>
                              </div>
                          ))}
              </div>
          </div>
      );
  };
 const ScheduleScreen = ({ onBack, userId, styles, facultyList }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!userId) return;
            try {
                // 1. Fetch ALL schedules (Student's AND Faculty's)
                // We need the faculty schedules to find out who is teaching the class
                const { data: allSchedules } = await db
                    .from('class_schedules')
                    .select('*');

                if (allSchedules) {
                    // 2. Filter out only MY classes (The Student's)
                    const myClasses = allSchedules.filter(item => item.student_id === userId);
                    
                    // 3. Filter out all FACULTY classes (to look up the teacher)
                    // Assuming faculty IDs start with "FAC-"
                    const facultyClasses = allSchedules.filter(item => item.student_id.startsWith('FAC-'));

                    const formattedData = myClasses.map(myClass => {
                        // 4. SMART MATCH: Find the teacher who has the SAME room and SAME time
                        const matchedTeacherSched = facultyClasses.find(t => 
                            t.room_id === myClass.room_id && 
                            t.schedule_time === myClass.schedule_time
                        );

                        // 5. Get the Teacher's Name from the facultyList prop
                        let instructorName = "TBA";
                        if (matchedTeacherSched) {
                            const teacherInfo = facultyList ? facultyList.find(f => f.id === matchedTeacherSched.student_id) : null;
                            if (teacherInfo) instructorName = teacherInfo.name;
                        }

                        return {
                            id: myClass.id,
                            title: myClass.course_title,
                            room: myClass.room_id,
                            time: myClass.schedule_time,
                            instructor: instructorName // <--- New Field
                        };
                    });
                    
                    setItems(formattedData);
                }
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        fetchSchedule();
    }, [userId, facultyList]);

    return (
        <div style={{ height: "100%", backgroundColor: "#f8fafc", display: 'flex', flexDirection: 'column', color: "#1e293b" }}>
            <div style={{...styles.header, justifyContent: 'flex-start', gap: '12px'}}>
                <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: '8px', marginLeft: '-8px' }}>
                    <CornerUpLeft size={24} color="#64748b" />
                </button>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: "#1e293b" }}>
                    My Schedule
                </h2>
            </div>
            
            <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
                {loading ? (
                    <p style={{textAlign: 'center', color: '#94a3b8', marginTop: '20px'}}>Loading schedule...</p> 
                ) : items.length === 0 ? (
                    <div style={{textAlign: 'center', marginTop: '40px'}}>
                        <p style={{color: '#94a3b8'}}>No classes assigned yet.</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} style={styles.scheduleCard}>
                            <div style={{flex: 1}}>
                                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 'bold', color: "#1e293b" }}>{item.title}</h4>
                                
                                {/* DISPLAY INSTRUCTOR NAME */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                    <User size={14} color="#64748b" />
                                    <span style={{ fontSize: '13px', color: "#475569", fontWeight: '500' }}>
                                        {item.instructor}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                    <p style={{ margin: 0, fontSize: '12px', color: "#64748b", display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={12}/> {item.room}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '11px', color: "#0ea5e9", fontWeight: 'bold', backgroundColor: '#e0f2fe', padding: '4px 8px', borderRadius: '8px' }}>
                                        {item.time}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
  const LocationPermissionScreen = ({ onConfirm }) => {
      const [requesting, setRequesting] = useState(false);

      const requestLocation = () => {
          if (!navigator.geolocation) {
              window.alert('Location services are not available on this device.');
              return;
          }

          setRequesting(true);
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  localStorage.setItem('campusLocation', JSON.stringify({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                  }));
                  setRequesting(false);
                  onConfirm();
              },
              (error) => {
                  console.error('Location permission error:', error);
                  setRequesting(false);
                  window.alert('Location access was not granted. Please allow location access to continue.');
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
      };

      return (
          <div style={styles.modalOverlay}>
              <div style={styles.modalCard}>
                  <h3 style={styles.modalTitle}>WELCOME</h3>
                  <p style={styles.modalText}>Allow 3D Classroom to access this device's location <strong>all-the-time</strong>?</p>
                  <div style={styles.modalDivider}></div>
                  <button style={styles.modalButton} onClick={requestLocation} disabled={requesting}>
                      {requesting ? 'Requesting location...' : 'Allow all the time'}
                  </button>
                  <button style={{...styles.modalButton, ...styles.modalButtonLast}} onClick={requestLocation} disabled={requesting}>
                      Keep while-in-use access
                  </button>
              </div>
          </div>
      );
  };

  const ExitScreen = ({ onRedirect }) => {
      useEffect(() => { const timer = setTimeout(() => { onRedirect(); }, 3000); return () => clearTimeout(timer); }, [onRedirect]);
      return (
          <div style={{ padding: "40px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <div style={{ marginBottom: "24px" }}><Heart size={64} color="#10b981" strokeWidth={2} /></div>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", marginBottom: "16px" }}>Thank You!</h1>
              <p style={{ fontSize: "16px", color: "#475569", marginBottom: "40px", lineHeight: "1.5" }}>Thank you for using the Virtual Campus Navigator.</p>
              <p style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>Redirecting to the Welcome Screen...</p>
          </div>
      );
  };

  const AboutScreen = ({ onBack }) => (
      <div style={{ height: "100%", backgroundColor: "#f8fafc", display: 'flex', flexDirection: 'column', color: "#1e293b" }}>
          <div style={styles.header}>
              <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: '8px', marginLeft: '-8px' }}><CornerUpLeft size={24} color="#64748b" /></button>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: "#1e293b" }}>About App</h2>
              <div style={{width: 24}}></div>
          </div>
          <div style={{ padding: "32px", overflowY: "auto", textAlign: "center" }}>
              <div style={{ margin: "0 auto 24px auto" }}><img src={LOGO_URL} alt="Logo" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} /></div>
              
              <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", marginBottom: "8px" }}>Virtual Campus Navigator</h1>
              <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "32px", fontWeight: "500", lineHeight: '1.5' }}>
                  A 3D Interactive Classroom and Room Availability Management System for the Hiraya Building, CCIS
              </p>
              
              <div style={{ textAlign: "left", backgroundColor: "white", padding: "24px", borderRadius: "20px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#1e293b" }}>Our Mission</h3>
                  <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", lineHeight: '1.5' }}>
                      To provide a modern solution for students and faculty to locate classrooms and view real-time schedules, reducing confusion and enhancing campus efficiency.
                  </p>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#1e293b" }}>Key Features</h3>
                  <ul style={{ paddingLeft: '20px', marginBottom: '24px', fontSize: '14px', color: "#64748b", lineHeight: '1.6' }}>
                      <li>Interactive Room Map</li>
                      <li>Real-time Faculty Status</li>
                      <li>Live Room Availability</li>
                      <li>AI-Powered Assistant</li>
                  </ul>
                  <p style={{ fontSize: "12px", color: "#94a3b8", textAlign: 'center', marginTop: '24px' }}>Version 1.0 • CCIS Capstone Project</p>
              </div>
          </div>
      </div>
  );
const RoomDetailsScreen = ({ room, facultyList, onBack }) => {
    // 1. New State to hold the fetched time
    const [realTimeSchedule, setRealTimeSchedule] = useState("Loading...");

    const isOffice = room.type === 'OFFICE' || room.type === 'ADMIN';
    const staffInOffice = isOffice ? facultyList.filter(f => f.roomAssigned === room.id) : [];

    // 2. New Effect: Fetch Schedule from Database
    useEffect(() => {
        if (!isOffice && room.status === 'Occupied') {
            const fetchActiveSchedule = async () => {
                try {
                    // Query your existing class_schedules table
                    const { data } = await db
                        .from('class_schedules')
                        .select('schedule_time')
                        .eq('room_id', room.id);

                    if (data) {
                        // Use your existing helper to find which class is happening NOW
                        const activeClass = data.find(s => isClassActive(s.schedule_time));
                        
                        if (activeClass) {
                            setRealTimeSchedule(activeClass.schedule_time);
                        } else {
                            setRealTimeSchedule("Time not specified");
                        }
                    }
                } catch (err) {
                    console.error(err);
                    setRealTimeSchedule("Unavailable");
                }
            };
            fetchActiveSchedule();
        }
    }, [room, isOffice]);

    return (
        <div style={{ height: "100%", backgroundColor: "#f8fafc", display: 'flex', flexDirection: 'column', color: "#1e293b" }}>
            
            {/* --- HEADER --- */}
            <div style={{...styles.header, display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', flexShrink: 0}}>
                <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: '4px', display: 'flex', alignItems: 'center' }}>
                    <CornerUpLeft size={24} color="#64748b" />
                </button>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: "#1e293b" }}>{room.name}</h2>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{room.id} • <span style={{fontWeight:'bold', color: '#0ea5e9'}}>{room.type}</span></p>
                </div>
            </div>

            {/* --- ROOM IMAGE --- */}
            {room.imageUrl ? (
                <div style={{ width: '100%', height: '220px', backgroundColor: '#e2e8f0' }}>
                    <img src={room.imageUrl} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            ) : (
                <div style={{ width: '100%', height: '150px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{color: '#94a3b8', fontSize: '12px'}}>No Image Available</span>
                </div>
            )}

            <div style={{ padding: "24px", overflowY: "auto", flex: 1, paddingBottom: "100px" }}>
                
                {isOffice ? (
                    // === OFFICE VIEW ===
                    <div>
                        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase' }}>
                            Available Staff ({staffInOffice.length})
                        </h3>
                        {staffInOffice.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '30px', backgroundColor: 'white', borderRadius:'12px', border:'1px solid #e2e8f0' }}>
                                <p style={{margin:0, color: '#94a3b8'}}>No staff currently assigned here.</p>
                            </div>
                        ) : (
                            staffInOffice.map((staff) => (
                                <div key={staff.id} style={{
                                    ...styles.roomListCard, 
                                    display: 'flex', alignItems: 'center', 
                                    border: `2px solid ${staff.isAvailable ? '#10b981' : '#e2e8f0'}`,
                                    padding: '16px', gap: '12px', backgroundColor: 'white', marginBottom: '12px' 
                                }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%', 
                                        backgroundColor: staff.isAvailable ? '#d1fae5' : '#f1f5f9', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        color: staff.isAvailable ? '#059669' : '#64748b', fontWeight: 'bold'
                                    }}>{staff.name.charAt(0)}</div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: 0, color: "#1e293b", fontSize: '14px' }}>{staff.name}</h4>
                                        <p style={{ margin: 0, color: "#64748b", fontSize: '11px' }}>{staff.position}</p>
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: staff.isAvailable ? '#059669' : '#64748b' }}>
                                        {staff.isAvailable ? "In Campus" : "Out"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                ) : (
                    // === CLASSROOM VIEW ===
                    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        
                        {/* 1. STATUS CARD */}
                        <div style={{ 
                            backgroundColor: 'white', 
                            padding: '24px', 
                            borderRadius: '20px', 
                            border: `2px solid ${room.status === 'Free' ? '#10b981' : '#ef4444'}`,
                            boxShadow: '0 4px 12px -2px rgba(0,0,0,0.05)',
                            textAlign: 'center'
                        }}>
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Current Status</h3>
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: room.status === 'Free' ? '#10b981' : '#ef4444' }}></div>
                                <span style={{ fontSize: '28px', fontWeight: '800', color: room.status === 'Free' ? '#10b981' : '#ef4444' }}>
                                    {room.status === 'Free' ? 'AVAILABLE' : 'OCCUPIED'}
                                </span>
                            </div>

                            {room.status === 'Occupied' ? (
                                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>ONGOING CLASS</p>
                                    
                                    <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>
                                        {room.subject || "Class Session"}
                                    </p>

                                    <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', marginBottom: '8px'}}>
                                        <User size={14} color="#64748b"/>
                                        <span style={{ fontSize: '14px', color: '#475569' }}>Instructor: <strong>{room.occupantName || "Unknown"}</strong></span>
                                    </div>

                                    {/* Dynamic time from PostgreSQL */}
                                    <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'6px'}}>
                                        <Clock size={14} color="#64748b"/>
                                        <span style={{ fontSize: '14px', color: '#475569' }}>
                                            Time: <strong>{realTimeSchedule}</strong>
                                        </span>
                                    </div>

                                </div>
                            ) : (
                                <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#64748b' }}>
                                    This room is currently empty and available for use.
                                </p>
                            )}
                        </div>

                        {/* 2. LOCATION GUIDE */}
                        <div style={{ backgroundColor: '#f0f9ff', padding: '20px', borderRadius: '16px', border: '1px solid #bae6fd' }}>
                            <div style={{display:'flex', gap:'12px', alignItems:'center', marginBottom: '8px'}}>
                                <MapPin size={24} color="#0284c7" />
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#0369a1' }}>Location Guide</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
                                Located on the <strong>{room.floor} Floor</strong>.
                                <br/>
                                Check the floor map for room <strong>{room.id}</strong>.
                            </p>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

 const MapScreen = ({ role, userId, userName, allRooms, setAllRooms, onCheckOffice, facultyList }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filter, setFilter] = useState("");
  const [currentFloor, setCurrentFloor] = useState("1st");
  const [viewMode, setViewMode] = useState("map");

  // --- SMART SEARCH LOGIC ---
  const displayedRooms = allRooms.filter(r => {
      if (r.floor !== currentFloor && !filter) return false;

      const search = filter.toLowerCase();
      if (!search) return true;

      const matchRoom = r.name.toLowerCase().includes(search) || r.id.toLowerCase().includes(search);
      const matchOccupant = r.occupantName && r.occupantName.toLowerCase().includes(search);

      const staffInThisRoom = facultyList ? facultyList.filter(f => f.roomAssigned === r.id) : [];
      const matchFaculty = staffInThisRoom.some(staff => staff.name.toLowerCase().includes(search));

      return matchRoom || matchOccupant || matchFaculty;
  });

  const getStatusColor = (status) => {
    if (!status) return '#94a3b8';
    const s = status.toLowerCase();
    if (s === 'free' || s === 'open') return '#10b981'; 
    if (s === 'restricted') return '#f97316';           
    return '#ef4444';                                   
  };

  const isOffice = (room) => room.type === 'OFFICE' || room.type === 'ADMIN';

  const getBorderColor = (room) => {
      if (isOffice(room)) return '#94a3b8';
      return getStatusColor(room.status);
  };

  const getOccupantDisplay = (room) => {
      if (filter && facultyList) {
          const search = filter.toLowerCase();
          const staffInRoom = facultyList.filter(f => f.roomAssigned === room.id);
          const match = staffInRoom.find(s => s.name.toLowerCase().includes(search));
          if (match) return `Found: ${match.name}`;
      }
      if (room.occupantName) return room.occupantName;
      if (isOffice(room) && facultyList) {
          const count = facultyList.filter(f => f.roomAssigned === room.id).length;
          if (count > 0) return `${count} Staff Members`;
      }
      return null;
  };
console.log("Room Data Check:", displayedRooms);
  return (
    <div style={{ flex: 1, backgroundColor: "#f8fafc", display: 'flex', flexDirection: 'column', color: "#1e293b", position: 'relative' }}>
      
      <div style={{...styles.header, justifyContent: 'space-between'}}>
        <h2 style={{ margin: 0, color: "#1e293b" }}>{filter ? "Search Results" : `${currentFloor} Floor`}</h2>
        <button onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')} style={{background: 'none', border: "1px solid #e2e8f0", borderRadius: '8px', padding: '6px', cursor: 'pointer'}}>
          {viewMode === 'map' ? <List size={20} color="#64748b"/> : <Grid size={20} color="#64748b"/>}
        </button>
      </div>
      
      {!filter && (
        <div style={{...styles.floorTabContainer}}>
          {['1st', '2nd', '3rd'].map(floor => (
            <div key={floor} onClick={() => {setCurrentFloor(floor); setSelectedRoom(null);}} style={{...styles.floorTab, backgroundColor: currentFloor === floor ? "white" : 'transparent', color: currentFloor === floor ? '#0ea5e9' : "#94a3b8", boxShadow: currentFloor === floor ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}}>
              {floor} Floor
            </div>
          ))}
        </div>
      )}
      
      <div style={{ padding: "0 24px 16px 24px" }}>
        <div style={{display: 'flex', alignItems: 'center', backgroundColor: "white", padding: '12px', borderRadius: '12px', border: "1px solid #e2e8f0"}}>
          <Search size={20} color="#94a3b8" />
          <input placeholder="Search room or professor..." style={{border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '14px', backgroundColor: 'transparent', color: "#1e293b"}} value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
      </div>
      
      {/* VIEW MODE: MAP */}
      {viewMode === 'map' ? (
          <div style={styles.mapGrid}>
            {displayedRooms.map((room) => {
              const occupantInfo = getOccupantDisplay(room);
              const isSearchMatch = filter && occupantInfo && occupantInfo.startsWith("Found:");
              return (
                <button 
  key={room.id} 
  onClick={() => setSelectedRoom(room)} 
  style={{
      ...styles.roomBtn, 
      borderColor: isSearchMatch ? '#3b82f6' : getBorderColor(room), 
      borderWidth: isSearchMatch ? '3px' : '2px',
      ...(selectedRoom?.id === room.id ? { backgroundColor: '#f0f9ff' } : {}) 
  }}
>
  {/* --- NEW IMAGE SECTION START --- */}
  {room.imageUrl ? (
      <img 
        src={room.imageUrl} 
        alt={room.name} 
        style={{
            width: '100%', 
            height: '80px', 
            objectFit: 'cover', 
            borderRadius: '8px',
            marginBottom: '8px'
        }} 
      />
  ) : (
      // Optional: Placeholder gray box if no image exists
      <div style={{width: '100%', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <span style={{fontSize: '10px', color: '#cbd5e1'}}>No Image</span>
      </div>
  )}
  {/* --- NEW IMAGE SECTION END --- */}

  <div style={{flex: 1, display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'space-between'}}>
      <span style={{ fontWeight: "bold", color: "#334155", fontSize: '14px', alignSelf: 'flex-start' }}>{room.name}</span>
      
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <span style={{ 
              fontSize: "10px", 
              color: isSearchMatch ? "#3b82f6" : "#94a3b8",
              fontWeight: isSearchMatch ? "bold" : "normal",
              textAlign: "right",
              maxWidth: '75px',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {occupantInfo ? occupantInfo : room.type}
          </span>
          {!isOffice(room) && !occupantInfo && (
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: getStatusColor(room.status) }}></div>
          )}
      </div>
  </div>
</button>
              );
            })}
          </div>
      ) : (
          /* VIEW MODE: LIST */
          <div style={{padding: '0 24px', overflowY: 'auto', flex: 1}}>
            {displayedRooms.map(room => {
              const occupantInfo = getOccupantDisplay(room);
              const isSearchMatch = filter && occupantInfo && occupantInfo.startsWith("Found:");
              return (
                <div 
                  key={room.id} 
                  onClick={() => setSelectedRoom(room)} 
                  style={{
                      ...styles.roomListCard, 
                      cursor: 'pointer',
                      border: `3px solid ${getBorderColor(room)}` 
                  }}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                    <span style={{fontWeight: 'bold', color: "#1e293b", fontSize: '14px'}}>
                      {room.name} 
                      {filter && <span style={{fontSize:'10px', color:'#64748b', marginLeft:'8px'}}>({room.floor})</span>}
                    </span>
                    {!isOffice(room) && (
                      <span style={{fontSize: '11px', fontWeight: 'bold', color: getStatusColor(room.status)}}>{room.status}</span>
                    )}
                  </div>
                  {occupantInfo && (
                      <div style={{fontSize: '12px', color: isSearchMatch ? "#3b82f6" : "#64748b", marginTop:'4px', display:'flex', gap:'4px', alignItems:'center', fontWeight: isSearchMatch ? 'bold' : 'normal'}}>
                        <User size={12}/> {occupantInfo}
                      </div>
                  )}
                </div>
              );
            })}
          </div>
      )}
      
      {/* --- CENTERED FLOATING POPUP --- */}
    {/* --- CENTERED FLOATING POPUP --- */}
      {selectedRoom && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div onClick={() => setSelectedRoom(null)} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)'}}></div>

            <div style={{ width: '85%', maxWidth: '340px', backgroundColor: "white", borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', padding: '0', zIndex: 1001, border: "1px solid #e2e8f0", position: 'relative', overflow: 'hidden' }}>
                
                {/* 👇 ADD THIS IMAGE BLOCK HERE 👇 */}
                {selectedRoom.imageUrl && (
                  <div style={{ width: '100%', height: '140px' }}>
                    <img 
                      src={selectedRoom.imageUrl} 
                      alt={selectedRoom.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                )}
                
                <div style={{ padding: '24px' }}> {/* Add padding wrapper for text content */}
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                        <div style={{flex: 1, marginRight: '12px'}}>
                            <h3 style={{ margin: 0, fontSize: '18px', lineHeight: '1.3', color: "#1e293b" }}>{selectedRoom.name}</h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>{selectedRoom.id}</p>
                        </div>
                        <button onClick={() => setSelectedRoom(null)} style={{background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0}}>
                            <X size={20} color="#64748b" />
                        </button>
                    </div>

                    {!isOffice(selectedRoom) && (
                        <div style={{marginBottom: '16px'}}>
                            <span style={{fontSize: '12px', fontWeight: 'bold', color: getStatusColor(selectedRoom.status), padding: '4px 8px', borderRadius: '8px', backgroundColor: '#f1f5f9'}}>
                                {selectedRoom.status}
                            </span>
                        </div>
                    )}

                    {(!isOffice(selectedRoom) && (selectedRoom.occupantName || selectedRoom.subject)) && (
                        <div style={{backgroundColor: "#f8fafc", padding: '12px', borderRadius: '12px', marginBottom: '20px', border: "1px solid #e2e8f0"}}>
                          {selectedRoom.occupantName && (
                            <div style={{display:'flex', gap:'8px', marginBottom: '4px'}}>
                              <User size={14} color="#64748b"/> 
                              <span style={{fontSize: '13px', fontWeight:'bold', color: "#1e293b"}}>
                                Occupied by: <span style={{fontWeight: 'normal', marginLeft: '4px'}}>{selectedRoom.occupantName}</span>
                              </span>
                            </div>
                          )}
                          {selectedRoom.subject && (
                            <div style={{display:'flex', gap:'8px'}}>
                              <Info size={14} color="#64748b"/> 
                              <span style={{fontSize: '13px', color: "#64748b"}}>Class: {selectedRoom.subject}</span>
                            </div>
                          )}
                        </div>
                    )}

                   {/* 👇 UPDATED BUTTON SECTION 👇 */}
<div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px'}}>
                  {isOffice(selectedRoom) ? (
                      // === OFFICE: 2 BUTTONS ===
                      <>
                        {/* 1. Navigate Button (NOW GREEN / PRIMARY) */}
                        <button 
                            onClick={() => onCheckOffice(selectedRoom)} 
                            style={{ 
                                ...styles.buttonPrimary, 
                                padding: "12px", 
                                fontSize: "14px", 
                                width: '100%', 
                                borderRadius: '16px', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: '8px' 
                            }}
                        >
                          <MapPin size={18} /> Navigate
                        </button>

                        {/* 2. Check Staff Button (NOW WHITE / SECONDARY) */}
                        <button 
                            onClick={() => onCheckOffice(selectedRoom)} 
                            style={{ 
                                ...styles.buttonSecondary, 
                                padding: "12px", 
                                fontSize: "14px", 
                                width: '100%', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: '8px', 
                                borderRadius: '16px' 
                            }}
                        >
                          <Users size={18} /> Check who's available
                        </button>
                      </>
                  ) : (
                      // === CLASSROOM: STANDARD GREEN NAVIGATE ===
                       <button 
                            onClick={() => onCheckOffice(selectedRoom)} 
                            style={{ 
                                ...styles.buttonPrimary, 
                                padding: "12px", 
                                fontSize: "14px", 
                                width: '100%', 
                                borderRadius: '16px', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: '8px' 
                            }}
                        >
                          <MapPin size={18} /> Navigate
                        </button>
                  )}
                </div>

                </div> {/* End padding wrapper */}
            </div>
        </div>
      )}
    </div>
  );
};
  const HomeScreen = ({ setScreen, signInRole, userName, isFacultyAvailable, toggleMyStatus }) => {
    const [loginTime] = useState(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));

    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    };

    const getFirstNameOnly = (fullName) => {
      if (!fullName) return 'User';
      const parts = fullName.trim().split(' ');
      return parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0];
    };

    return (
      <div style={{ padding: "24px", backgroundColor: "#f8fafc", minHeight: "100%" }}>
        
        {/* --- HEADER SECTION --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
            
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, color: "#1e293b", lineHeight: '1.2' }}>
                <span style={{ fontSize: '26px' }}>{getGreeting()},</span> <br />
                <span style={{ color: '#0ea5e9', fontSize: '22px' }}>{getFirstNameOnly(userName)}!</span>
              </h1>
              
              <p style={{ margin: "8px 0 0 0", color: "#64748b", fontSize: "14px" }}>Welcome to Hiraya Bldg</p>
              
              <p style={{ margin: "12px 0 0 0", fontSize: "18px", color: "#007bff", fontWeight: "bold" }}>
                Login Time: {loginTime}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setScreen('Help')} 
                style={{
                  backgroundColor: 'white', 
                  border: '2px solid #cbd5e1',
                  borderRadius: '50%', 
                  width: '44px', 
                  height: '44px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <HelpCircle size={26} color="#64748b" strokeWidth={2.5} />
              </button>
            </div>
        </div>

        {/* --- STATUS CARD --- */}
        {signInRole === 'Teacher' ? (
            <div onClick={toggleMyStatus} style={{
                ...styles.statusCard, 
                backgroundColor: isFacultyAvailable ? '#bbf7d0' : '#fecaca', 
                border: isFacultyAvailable ? '2px solid #16a34a' : '2px solid #dc2626'
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    {isFacultyAvailable ? <UserCheck size={28} color="#14532d"/> : <UserX size={28} color="#7f1d1d"/> }
                    <div>
                        <h3 style={{margin: 0, fontSize: '16px', fontWeight: 'bold', color: isFacultyAvailable ? '#14532d' : '#7f1d1d'}}>My Status</h3>
                        <p style={{margin: 0, fontSize: '12px', color: isFacultyAvailable ? '#166534' : '#991b1b'}}>{isFacultyAvailable ? "Available" : "Unavailable"}</p>
                    </div>
                </div>
                <div>{isFacultyAvailable ? <ToggleRight size={32} color="#15803d" /> : <ToggleLeft size={32} color="#b91c1c" />}</div>
            </div>
        ) : (
          <div onClick={() => setScreen('FacultyDirectory')} style={{...styles.statusCard, backgroundColor: '#eff6ff', border: '2px solid #bfdbfe', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div style={{backgroundColor: 'white', padding: '8px', borderRadius: '50%'}}><Users size={24} color="#3b82f6"/></div>
              <div><h3 style={{margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1e3a8a'}}>Faculty Directory</h3><p style={{margin: 0, fontSize: '12px', color: '#64748b'}}>Check who is in campus</p></div>
            </div>
            <ChevronRight size={20} color="#94a3b8" />
          </div>
        )}

        {/* --- ACTION CARDS --- */}
        <div style={{ marginTop: "12px", display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* 1. NEW: Add Faculty Directory button here for Teachers too */}
          {signInRole === 'Teacher' && (
              <ActionCard title="Faculty Directory" description="Check colleagues" icon={Users} color="violet" onClick={() => setScreen("FacultyDirectory")} />
          )}

          <ActionCard title="Room Map" description="Find classrooms" icon={MapIcon} color="emerald" onClick={() => setScreen("Map")} />
          <ActionCard title="My Schedule" description="View classes" icon={Calendar} color="sky" onClick={() => setScreen("Schedule")} />
          <ActionCard title="AI Assistant" description="Ask questions" icon={Bot} color="red" onClick={() => setScreen("Assistant")} />
          
          <button 
                onClick={() => setScreen("Exit")} 
                style={{ 
                  width: "100%",
                  backgroundColor: '#fee2e2', 
                  color: '#dc2626',           
                  border: '2px solid #fca5a5', 
                  borderRadius: '16px',       
                  padding: '16px',            
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',   
                  gap: '8px',
                  marginTop: '12px',          
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <LogOut size={20} strokeWidth={2.5} />
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Sign Out</span>
          </button>
        </div>
      </div>
    );
  };

  // ... existing code (AssistantScreen, HomeScreen, etc.) ...

  export default function App() {
    const [screen, setScreen] = useState("Welcome");
    const [signInRole, setSignInRole] = useState("Student");
    const [idNum, setIdNum] = useState("");
    const [password, setPassword] = useState(""); 
    const [userName, setUserName] = useState(""); 
    const [isFacultyAvailable, setIsFacultyAvailable] = useState(false); 
    const [facultyList, setFacultyList] = useState([])
    const [loginHistory, setLoginHistory] = useState([]);
    const [allRooms, setAllRooms] = useState([]); 
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    const [isLoading, setIsLoading] = useState(false); 
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [allCourses, setAllCourses] = useState([]); // <--- New State
    const expiredScheduleWarnings = useRef(new Set());

    // --- EFFECT 1: CLOCK ---
    useEffect(() => { 
      const timer = setInterval(() => { 
        setCurrentTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })); 
      }, 1000); 
      return () => clearInterval(timer); 
    }, []);
    // --- FETCH COURSES ---
    useEffect(() => {
      const fetchCourses = async () => {
        const { data, error } = await db
          .from('courses')
          .select('*')
          .order('course_code', { ascending: true });
        
        if (error) console.error("Error loading courses:", error);
        if (data) setAllCourses(data);
      };
      fetchCourses();
    }, []);
    // --- EFFECT 2: FETCH ROOMS FROM DATABASE (Crucial!) ---
    useEffect(() => {
      const fetchRooms = async () => {
        try {
          const { data, error } = await db
            .from('rooms')
            .select('*')
            .order('id', { ascending: true });

          if (error) console.error("Database Error:", error);

          if (data && data.length > 0) {
            const formattedRooms = data.map(room => ({
              id: room.id,
              name: room.name,
              status: room.status,
              type: room.type ? room.type.toUpperCase() : "UNKNOWN",
              floor: formatFloor(room.floor),
              capacity: room.capacity,
              equipment: room.equipment,
              occupantName: room.occupant_name, 
              subject: room.subject,
              occupantId: room.occupant_id,
              imageUrl: room.image_url,
              time: room.time
            }));
            setAllRooms(formattedRooms);
          }
        } catch (err) {
          console.error("Connection Error:", err);
        }
      };
      fetchRooms();
    }, []);

  // --- EFFECT 3: FETCH FACULTY FROM DATABASE ---
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const { data, error } = await db
          .from('faculty')
          .select('*')
          .order('name', { ascending: true });

        if (error) console.error("Faculty database error:", error);

        if (data) {
          // Map DB columns to App structure
          const formattedFaculty = data.map(f => ({
            id: f.id,
            name: f.name,
            position: f.position,
            isAvailable: f.status, // Database uses 'status', App uses 'isAvailable'
            roomAssigned: f.room_assigned
          }));
          setFacultyList(formattedFaculty);
        }
      } catch (err) {
        console.error("Faculty Connection Error:", err);
      }
    };
    fetchFaculty();
  }, []);

  // --- REALTIME DATA SYNC ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await db
          .from('rooms')
          .select('*')
          .order('id', { ascending: true });

        if (error) console.error("Database Error:", error);

        if (data && data.length > 0) {
          const formattedRooms = data.map(room => ({
            id: room.id,
            name: room.name,
            status: room.status,
            type: room.type ? room.type.toUpperCase() : "UNKNOWN",
            floor: formatFloor(room.floor),
            capacity: room.capacity,
            equipment: room.equipment,
            occupantName: room.occupant_name, 
            subject: room.subject,
            occupantId: room.occupant_id,
            imageUrl: room.image_url,
            time: room.time
        
          }));
          setAllRooms(formattedRooms);
        }
      } catch (err) {
        console.error("Connection Error:", err);
      }
    };

    fetchData();

    const roomsChannel = db
      .channel('rooms-channel')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms' }, (payload) => {
        const updatedRoom = payload.new;
        setAllRooms((prevRooms) => 
          prevRooms.map((room) => 
            room.id === updatedRoom.id 
              ? {
                  ...room,
                  status: updatedRoom.status,
                  occupantName: updatedRoom.occupant_name,
                  occupantId: updatedRoom.occupant_id,
                  subject: updatedRoom.subject
                }
              : room
          )
        );
      })
      .subscribe();

    const facultyChannel = db
      .channel('faculty-channel')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'faculty' }, (payload) => {
        const updatedFaculty = payload.new;
        setFacultyList((prevList) => 
          prevList.map((f) => 
            f.id === updatedFaculty.id 
              ? { ...f, isAvailable: updatedFaculty.status, roomAssigned: updatedFaculty.room_assigned } 
              : f
          )
        );
      })
      .subscribe();

    return () => {
      db.removeChannel(roomsChannel);
      db.removeChannel(facultyChannel);
    };
  }, []);

  // --- EFFECT: SYNC ROOM STATUS WITH ACTIVE SCHEDULES ---
  useEffect(() => {
      const syncRoomAvailability = async () => {
          const [{ data: rooms }, { data: schedules }, { data: faculty }] = await Promise.all([
              db.from('rooms').select('*'),
              db.from('class_schedules').select('*'),
              db.from('faculty').select('*')
          ]);

          if (!rooms || !schedules || !faculty) return;

          await Promise.all(rooms.map(async (room) => {
              const facultySchedules = schedules.filter(schedule =>
                  schedule.room_id === room.id && schedule.student_id.startsWith('FAC-')
              );
              const activeSchedule = facultySchedules
                  .find(schedule => {
                      const instructor = faculty.find(member => member.id === schedule.student_id);
                      return instructor?.status && isClassActive(schedule.schedule_time);
                  });
              const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
              const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();
              const overstayedSchedule = facultySchedules.find(schedule => {
                  const instructor = faculty.find(member => member.id === schedule.student_id);
                  if (!instructor?.status || !schedule.schedule_time?.includes('@')) return false;
                  const [daysPart, timePart] = schedule.schedule_time.split('@');
                  if (!daysPart.split(',').map(day => day.trim()).includes(today)) return false;
                  const endTime = timePart.split('-')[1]?.trim();
                  return endTime && currentMinutes > getTimeMinutes(endTime);
              });

              const instructor = activeSchedule
                  ? faculty.find(member => member.id === activeSchedule.student_id)
                  : null;
              const warningInstructor = overstayedSchedule
                  ? faculty.find(member => member.id === overstayedSchedule.student_id)
                  : null;
              const nextRoomState = activeSchedule
                  ? {
                      status: 'Occupied',
                      occupant_id: activeSchedule.student_id,
                      occupant_name: instructor?.name || activeSchedule.student_id,
                      subject: activeSchedule.course_title,
                      time: activeSchedule.schedule_time
                  }
                  : overstayedSchedule && room.status === 'Occupied'
                  ? {
                      status: 'Occupied',
                      occupant_id: overstayedSchedule.student_id,
                      occupant_name: warningInstructor?.name || overstayedSchedule.student_id,
                      subject: overstayedSchedule.course_title,
                      time: overstayedSchedule.schedule_time
                  }
                  : {
                      status: 'Free',
                      occupant_id: null,
                      occupant_name: null,
                      subject: null,
                      time: null
                  };

              const hasChanged = room.status !== nextRoomState.status ||
                  room.occupant_id !== nextRoomState.occupant_id ||
                  room.subject !== nextRoomState.subject ||
                  room.time !== nextRoomState.time;

              if (hasChanged) {
                  await db.from('rooms').update(nextRoomState).eq('id', room.id);
                  setAllRooms(prev => prev.map(currentRoom =>
                      currentRoom.id === room.id
                          ? {
                              ...currentRoom,
                              status: nextRoomState.status,
                              occupantId: nextRoomState.occupant_id,
                              occupantName: nextRoomState.occupant_name,
                              subject: nextRoomState.subject,
                              time: nextRoomState.time
                          }
                          : currentRoom
                  ));
              }
          }));
      };

      syncRoomAvailability();
      const interval = setInterval(syncRoomAvailability, 60000);

      return () => clearInterval(interval);
  }, []);

  // --- EFFECT: WARN FACULTY WHEN THEY OVERSTAY A ROOM SCHEDULE ---
  useEffect(() => {
      if (signInRole !== 'Teacher' || !idNum) return undefined;

      const checkExpiredSchedule = async () => {
          const { data: schedules } = await db
              .from('class_schedules')
              .select('*')
              .eq('student_id', idNum);

          if (!schedules) return;

          const now = new Date();
          const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' });
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          const todayKey = now.toISOString().slice(0, 10);

          for (const schedule of schedules) {
              if (!schedule.schedule_time?.includes('@')) continue;
              const [daysPart, timePart] = schedule.schedule_time.split('@');
              const days = daysPart.split(',').map(day => day.trim());
              if (!days.includes(currentDay)) continue;

              const timeParts = timePart.split('-').map(time => time.trim());
              const endTime = timeParts[1];
              if (!endTime || currentMinutes <= getTimeMinutes(endTime)) continue;

              const { data: rooms } = await db
                  .from('rooms')
                  .select('*')
                  .eq('id', schedule.room_id);
              const room = rooms?.[0];
              const warningKey = `${schedule.id}-${todayKey}`;

              if (room?.status === 'Occupied' && room.occupant_id === idNum && !expiredScheduleWarnings.current.has(warningKey)) {
                  expiredScheduleWarnings.current.add(warningKey);
                  window.alert(`Your class in Room ${room.id} ended at ${endTime}. Please leave the room or contact the administrator to extend the schedule.`);
              }
          }
      };

      checkExpiredSchedule();
      const interval = setInterval(checkExpiredSchedule, 60000);
      return () => clearInterval(interval);
  }, [signInRole, idNum]);

  const toggleMyStatus = async () => {
        const newStatus = !isFacultyAvailable;
        setIsFacultyAvailable(newStatus); // Update toggle switch immediately

        // Only update database if it's a Teacher
        if (signInRole === 'Teacher' && idNum) {
            try {
                // 1. Update PostgreSQL through the API
                const { error } = await db
                    .from('faculty')
                    .update({ status: newStatus })
                    .eq('id', idNum);
                
                if (error) throw error;

                // 2. Update Local List (so the Directory updates instantly)
                setFacultyList(prev => prev.map(f => 
                    f.id === idNum ? { ...f, isAvailable: newStatus } : f
                ));

            } catch (err) {
                console.error("Error updating status:", err);
                alert("Failed to update status in database.");
                setIsFacultyAvailable(!newStatus); // Revert if failed
            }
        }
    };

  const handleLogin = async () => {
      // 1. Basic Input Validation
      if (!idNum.trim()) {
          alert("Please enter an ID/Username.");
          return;
      }

      setIsLoading(true);

      try {
          // --- OPTION A: STUDENT LOGIN (POSTGRESQL) ---
          if (signInRole === 'Student') {
              const { data, error } = await db
                  .from('students')
                  .select('*')
                  .eq('student_id', idNum)
                  .single();

              if (error || !data) {
                  alert("Student ID not found in database.");
                  setIsLoading(false);
                  return;
              }

              // Success!
              const firstName = data.first_name || "Student";
              const lastName = data.last_name || "";
              const displayName = `${firstName} ${lastName}`.trim();

              setUserName(displayName);

              setLoginHistory(prev => [{
                  id: data.student_id,
                  role: 'Student',
                  displayName: displayName,
                  time: new Date().toLocaleTimeString(),
                  date: new Date().toLocaleDateString()
              }, ...prev]);

              setScreen("LocationPermission");
          }

          // --- OPTION B: TEACHER LOGIN ---
          else if (signInRole === 'Teacher') {
              const facultyIdPattern = /^FAC-\d{3,}$/;
              if (!facultyIdPattern.test(idNum)) {
                  alert("Invalid Faculty ID format. Use FAC-001");
                  setIsLoading(false);
                  return;
              }

              if (password !== 'admin') {
                  alert("Incorrect Password!");
                  setIsLoading(false);
                  return;
              }

              // 1. Find the teacher in the Database List
              const teacher = facultyList.find(f => f.id === idNum);

              // 2. Set Name and Status based on Database
              const displayName = teacher ? teacher.name : "Unknown Faculty";
              const currentStatus = teacher ? teacher.isAvailable : false;

              setIsFacultyAvailable(currentStatus);
              setUserName(displayName);

              setLoginHistory(prev => [{
                  id: idNum,
                  role: 'Teacher',
                  displayName: displayName,
                  time: new Date().toLocaleTimeString(),
                  date: new Date().toLocaleDateString()
              }, ...prev]);

              setScreen("LocationPermission");
          }

          // --- OPTION C: ADMIN LOGIN (POSTGRESQL) ---
          else if (signInRole === 'Admin') {
              // 1. Fetch admin details from PostgreSQL
              const { data, error } = await db
                  .from('admins')
                  .select('*')
                  .eq('username', idNum)
                  .single();

              if (error || !data) {
                  alert("Admin username not found.");
                  setIsLoading(false);
                  return;
              }

              // 2. Verify Password (Direct comparison for now)
              if (data.password === password) {
                  setUserName(data.full_name || "System Administrator");
                  setScreen("AdminLog");
              } else {
                  alert("Invalid Admin Credentials!");
              }
              // Stop loading for admin flow
              setIsLoading(false);
          }

      } catch (err) {
          console.error("Login Error:", err);
          alert(`Database Error: ${err.message}`);
      } finally {
          // Ensure loading stops for everyone
          setIsLoading(false);
      }
  };


  const renderContent = () => {
      // --- HELPER: Where should the "Back" button go? ---
      // If Admin, go to AdminLog. If Student/Teacher, go to Home.
      const handleBackHome = () => setScreen(signInRole === 'Admin' ? "AdminLog" : "Home");

      switch (screen) {
        case "Welcome": return (
            <div style={{ padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", position: 'relative' }}>
              <button onClick={() => setScreen("About")} style={{ position: 'absolute', top: 20, right: 20, background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}><Info size={20} color="#64748b" /></button>
              <div style={{ margin: "0 auto 24px auto" }}><img src={LOGO_URL} alt="Logo" style={{ width: '160px', height: '160px', borderRadius: '50%', objectFit: 'cover' }} /></div>
              <h1 style={{ margin: "0 0 12px 0", color: "#1e293b", fontSize: '22px', fontWeight: '800', lineHeight: '1.3' }}>VIRTUAL CAMPUS NAVIGATOR</h1>
              <button style={styles.buttonPrimary} onClick={() => { setSignInRole("Student"); setScreen("SignIn"); setIdNum(""); setPassword(""); }}><User size={20} /> Student Portal</button>
              <button style={styles.buttonYellow} onClick={() => { setSignInRole("Teacher"); setScreen("SignIn"); setIdNum(""); setPassword(""); }}><Briefcase size={20} /> Faculty Portal</button>
              <button style={styles.buttonAdmin} onClick={() => { setSignInRole("Admin"); setScreen("SignIn"); setIdNum(""); setPassword(""); }}><ShieldAlert size={20} /> Admin Portal</button>
            </div>
        );

        case "SignIn": return (
            <div style={{ padding: "24px", backgroundColor: "white", height: "100%" }}>
              <button onClick={() => setScreen("Welcome")} style={{ background: "none", border: "none", cursor: "pointer", padding: '8px', marginLeft: '-8px' }}><CornerUpLeft size={24} color="#64748b" /></button>
              <div style={{ marginTop: "32px", textAlign: "center" }}>
                <h2 style={{ fontSize: "24px", color: "#1e293b" }}>Sign In</h2>
                <p style={{ color: "#94a3b8", marginBottom: "32px" }}>As {signInRole}</p>
                <input type="text" placeholder={signInRole === 'Admin' ? "Enter Admin Username" : "Enter ID Number"} style={styles.input} value={idNum} onChange={(e) => setIdNum(e.target.value)} />
                {(signInRole === 'Teacher' || signInRole === 'Admin') && (<input type="password" placeholder="Enter Password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />)}
                                <button style={{...styles.buttonPrimary, opacity: isLoading ? 0.7 : 1, marginTop: '24px'}} onClick={handleLogin} disabled={isLoading}>{isLoading ? "Checking Database..." : "Enter"}</button>
                                {signInRole !== 'Admin' && (
                                    <button style={styles.buttonSecondary} onClick={() => setScreen("Register")}>No account? Request verification</button>
                                )}
              </div>
            </div>
        );

        case "Register": return <RegistrationScreen role={signInRole} onBack={() => setScreen("SignIn")} />;

        // --- ADMIN DASHBOARD ---
        case "AdminLog": 
            return <AdminDashboard 
                      onBack={() => setScreen("Welcome")} 
                      setScreen={setScreen}
                      facultyList={facultyList} 
                      allRooms={allRooms} 
                      allCourses={allCourses}
                      styles={styles} 
                  />;

        // --- SCREENS WITH DYNAMIC BACK BUTTONS ---
        case "FacultyDirectory": 
            return <FacultyDirectoryScreen 
                      onBack={handleBackHome} // <--- UPDATED
                      facultyList={facultyList} 
                      currentUserId={idNum} 
                      styles={styles} 
                      allRooms={allRooms} 
                  />;

        case "Map": 
            return <MapScreen 
                      role={signInRole} 
                      userId={idNum} 
                      userName={userName} 
                      allRooms={allRooms} 
                      setAllRooms={setAllRooms} 
                      onCheckOffice={(room) => { setSelectedOffice(room); setScreen("OfficeDetails"); }}
                      facultyList={facultyList} 
                  />;

        case "OfficeDetails": 
            return <RoomDetailsScreen
                      room={selectedOffice}
                      facultyList={facultyList} 
                      onBack={() => setScreen("Map")} 
                  />;

        case "Schedule": 
            return <ScheduleScreen 
                      onBack={handleBackHome} // <--- UPDATED
                      role={signInRole} 
                      userId={idNum} 
                      userName={userName}
                      styles={styles} 
                      allRooms={allRooms} 
                      allCourses={allCourses}
                      facultyList={facultyList}
                  />;

        // --- OTHER SCREENS ---
        case "Home": return <HomeScreen setScreen={setScreen} signInRole={signInRole} userName={userName} isFacultyAvailable={isFacultyAvailable} toggleMyStatus={toggleMyStatus} />;
        case "Assistant": return <AssistantScreen signInRole={signInRole} userId={idNum} allRooms={allRooms} facultyList={facultyList} allCourses={allCourses} />;
        case "LocationPermission": return <LocationPermissionScreen onConfirm={() => setScreen(signInRole === 'Admin' ? "AdminLog" : "Home")} />;
        case "Exit": return <ExitScreen onRedirect={() => setScreen("Welcome")} />;
        case "About": return <AboutScreen onBack={() => setScreen("Welcome")} />;
        case "Help": return <HelpScreen onBack={handleBackHome} role={signInRole} />;
    

        
        default: return <HomeScreen setScreen={setScreen} signInRole={signInRole} userName={userName} />;
      }
    };
    
      return (
        <div style={styles.appContainer}>
          <div style={styles.mobileFrame}>
            <div style={styles.statusBar}><span>{currentTime}</span><Wifi size={14} /></div>
            <div style={styles.contentContainer}>{renderContent()}</div>
            {/* Only show Bottom Nav if NOT in these screens */}
                    {! ["Welcome", "SignIn", "Register", "LocationPermission", "Exit", "About", "Schedule", "AdminLog", "FacultyDirectory", "Help"].includes(screen) && (
            <div style={styles.bottomNav}>
              {[ 
                { id: "Home", icon: Home, label: "Home" }, 
                { id: "Map", icon: MapIcon, label: "Map" }, 
                { id: "Assistant", icon: Bot, label: "AI" } 
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => {
                      // --- NAVIGATION FIX ---
                      // If clicking Home AND user is Admin, go to AdminLog
                      if (item.id === "Home" && signInRole === 'Admin') {
                          setScreen("AdminLog");
                      } else {
                          setScreen(item.id);
                      }
                  }} 
                  style={styles.navItem}
                >
                  <item.icon size={24} color={screen === item.id ? "#10b981" : "#94a3b8"} />
                  <span style={{ marginTop: "4px", color: screen === item.id ? "#10b981" : "#94a3b8" }}>{item.label}</span>
                </button>
              ))}
            </div>
          )}
          </div>
        </div>
      );
  }