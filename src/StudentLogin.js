import React, { useState } from 'react';
import { db as db } from './apiClient';

function StudentLogin() {
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents page refresh
    setLoading(true);
    setError(null);
    setStudentData(null);

    try {
      // 1. Fetch data from PostgreSQL
      const { data, error } = await db
        .from('students')
        .select('*')
        .eq('student_id', studentId)
        .single(); // We expect only one student with this ID

      if (error) {
        throw error;
      }

      // 2. If data is found, save it to state
      if (data) {
        setStudentData(data);
      }
    } catch (err) {
      console.error(err);
      setError('Student ID not found. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      {!studentData ? (
        /* SHOW LOGIN FORM IF NO DATA YET */
        <form onSubmit={handleLogin}>
          <h2>Student Verification</h2>
          <input
            type="text"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ padding: '10px', fontSize: '16px' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '10px 20px', marginLeft: '10px', fontSize: '16px', cursor: 'pointer' }}
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
          {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
        </form>
      ) : (
        /* SHOW STUDENT DETAILS IF LOGGED IN */
        <div style={{ textAlign: 'left', background: '#333', padding: '20px', borderRadius: '8px' }}>
          <h2 style={{ color: '#61dafb' }}>Welcome, {studentData.first_name}!</h2>
          <p><strong>Full Name:</strong> {studentData.first_name} {studentData.last_name}</p>
          <p><strong>Student ID:</strong> {studentData.student_id}</p>
          <p><strong>Course:</strong> {studentData.course}</p>
          <p><strong>Year Level:</strong> {studentData.year_level}</p>
          <button 
            onClick={() => setStudentData(null)}
            style={{ marginTop: '15px', padding: '8px 16px' }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentLogin;