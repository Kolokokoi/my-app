export const formatFloor = (floor) => {
  if (typeof floor === 'string' && floor.endsWith('st')) return floor;
  const floorNumber = Number(floor);
  if (floorNumber === 1) return '1st';
  if (floorNumber === 2) return '2nd';
  if (floorNumber === 3) return '3rd';
  return String(floor);
};

export const getTimeMinutes = (timeString) => {
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export const isClassActive = (scheduleString, date = new Date()) => {
  if (!scheduleString || !scheduleString.includes('@')) return false;
  const currentDay = date.toLocaleDateString('en-US', { weekday: 'short' });
  const currentMinutes = date.getHours() * 60 + date.getMinutes();
  const [daysPart, timePart] = scheduleString.split('@');
  const days = daysPart.split(',').map(day => day.trim());
  if (!days.includes(currentDay)) return false;
  const [startString, endString] = timePart.split('-').map(time => time.trim());
  return currentMinutes >= getTimeMinutes(startString) && currentMinutes <= getTimeMinutes(endString);
};