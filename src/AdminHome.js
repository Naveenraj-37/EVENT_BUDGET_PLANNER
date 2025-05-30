// src/pages/admin/AdminHome.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2>Admin Home</h2>
      <div style={styles.buttonGrid}>
        <button style={styles.button} onClick={() => navigate('/admin/view-users')}>
          View Users
        </button>
        <button style={styles.button} onClick={() => navigate('/admin/add-event-service')}>
          Add Event Services
        </button>
        <button style={styles.button} onClick={() => navigate('/admin/add-event-package')}>
          Add Event Service Packages
        </button>

        <button style={styles.button} onClick={() => navigate('/admin/view-event-packages')}>
          View Event Packages
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px'
  },
  buttonGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '30px',
    maxWidth: '300px',
    margin: 'auto'
  },
  button: {
    padding: '15px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default AdminHome;
