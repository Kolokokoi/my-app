import React, { useState } from 'react';
import { CornerUpLeft } from 'lucide-react';
import { db } from '../apiClient';
import { styles } from '../appStyles';

export default function RegistrationScreen({ role, onBack }) {
  const [form, setForm] = useState({ userId: '', fullName: '', email: '', courseOrDepartment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const updateField = (field, value) => setForm(previous => ({ ...previous, [field]: value }));

  const submitRequest = async (event) => {
    event.preventDefault();
    setMessage('');
    const idPattern = role === 'Student' ? /^\d{3}-\d{5}$/ : /^FAC-\d{3,}$/;
    if (!idPattern.test(form.userId.trim())) {
      setMessage(role === 'Student' ? 'Use a valid CSU student ID, for example 123-00001.' : 'Use a valid faculty ID, for example FAC-001.');
      return;
    }
    if (!form.email.toLowerCase().endsWith('@csu.edu.ph')) {
      setMessage('Use your official CSU institutional email address.');
      return;
    }

    setSubmitting(true);
    try {
      await db.from('account_requests').insert([{
        role,
        user_id: form.userId.trim(),
        full_name: form.fullName.trim(),
        institutional_email: form.email.trim().toLowerCase(),
        course_or_department: form.courseOrDepartment.trim()
      }]).select();
      setMessage('Request submitted. An administrator must verify your CSU status before you can log in.');
      setForm({ userId: '', fullName: '', email: '', courseOrDepartment: '' });
    } catch (error) {
      setMessage(error.message.includes('duplicate') ? 'A request already exists for this ID or email.' : `Could not submit request: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'white', height: '100%', overflowY: 'auto' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', marginLeft: '-8px' }}><CornerUpLeft size={24} color="#64748b" /></button>
      <h2 style={{ color: '#1e293b', marginTop: '24px' }}>Request {role} Account</h2>
      <p style={{ color: '#64748b', fontSize: '13px' }}>Your CSU identity must be verified by an administrator before access is granted.</p>
      <form onSubmit={submitRequest}>
        <input style={styles.input} placeholder={role === 'Student' ? 'CSU Student ID' : 'Faculty ID'} value={form.userId} onChange={event => updateField('userId', event.target.value)} required />
        <input style={styles.input} placeholder="Complete name" value={form.fullName} onChange={event => updateField('fullName', event.target.value)} required />
        <input style={styles.input} type="email" placeholder="CSU institutional email" value={form.email} onChange={event => updateField('email', event.target.value)} required />
        <input style={styles.input} placeholder={role === 'Student' ? 'Course and year level' : 'Department and position'} value={form.courseOrDepartment} onChange={event => updateField('courseOrDepartment', event.target.value)} required />
        <button type="submit" style={{ ...styles.buttonPrimary, opacity: submitting ? 0.7 : 1 }} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Verification Request'}</button>
      </form>
      {message && <p style={{ color: message.startsWith('Request submitted') ? '#059669' : '#dc2626', fontSize: '13px', lineHeight: 1.4 }}>{message}</p>}
    </div>
  );
}
