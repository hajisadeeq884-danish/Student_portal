import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        'https://student-portal-backend-401n.onrender.com/auth/register',
        {
          name,
          email,
          password,
          role
        }
      );

      alert(res.data.message || 'Registration successful!');
    } catch (err) {
      console.error('Registration error:', err);

      alert(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <select
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}

export default Register;