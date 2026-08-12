import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'https://student-portal-backend-401n.onrender.com/auth/login',
        {
          email,
          password
        }
      );

      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      alert(
        error.response?.data?.message ||
        'Login failed. Please check your email and password.'
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>

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

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;