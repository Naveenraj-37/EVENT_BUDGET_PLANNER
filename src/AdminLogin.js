import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    passcode: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy authentication check
    if (formData.username === 'admin' && formData.passcode === 'admin123') {
      navigate('/admin/home');  // Redirect to AdminHome page
    } else {
      setError('Incorrect username or passcode');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Admin Login</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
            autoComplete="off"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="passcode"
            placeholder="Passcode"
            value={formData.passcode}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#d9534f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
