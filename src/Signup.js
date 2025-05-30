import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // frontend field
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });

  const [generatedUsername, setGeneratedUsername] = useState('');
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false
  });

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'email') {
      if (!value.includes('@gmail.com')) {
        error = 'Email must end with @gmail.com';
      }
    }
    
    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        error = 'Passwords do not match!';
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, formData[name])
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({
      email: true,
      password: true,
      confirmPassword: true
    });

    const newErrors = {
      email: validateField('email', formData.email),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
    };
    
    setErrors(newErrors);
    
    if (Object.values(newErrors).some(err => err)) {
      return;
    }

    // Prepare payload for backend
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save username to localStorage
        localStorage.setItem('username', data.username);
        setGeneratedUsername(data.username);
      } else {
        const errMsg =
          data.confirm_password?.[0] ||
          data.email?.[0] ||
          data.password?.[0] ||
          data.name?.[0] ||
          data.non_field_errors?.[0] ||
          'Registration failed';
        
        setErrors(prev => ({
          ...prev,
          general: errMsg
        }));
      }
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: 'Network error. Please try again.'
      }));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Sign Up</h2>
      
      {errors.general && (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          {errors.general}
        </div>
      )}
      
      {!generatedUsername ? (
        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
              autoComplete="off"
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              name="email"
              placeholder="Email (must be @gmail.com)"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="off"
              style={{ 
                width: '100%', 
                padding: '8px',
                borderColor: errors.email ? 'red' : '#ccc'
              }}
            />
            {errors.email && (
              <div style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                {errors.email}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
              autoComplete="new-password"
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              style={{ 
                width: '100%', 
                padding: '8px',
                borderColor: errors.confirmPassword ? 'red' : '#ccc'
              }}
            />
            {errors.confirmPassword && (
              <div style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                {errors.confirmPassword}
              </div>
            )}
          </div>
          
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p>Your username: <strong>{generatedUsername}</strong></p>
          <button 
            onClick={() => navigate('/home')}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#34a853',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            Continue to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default Signup;
