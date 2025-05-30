import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    budget: '',
    contactNo: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    const newErrors = {};
    const { eventName, eventDate, budget, contactNo } = formData;
    const today = new Date().toISOString().split('T')[0];

    if (!eventName.trim()) newErrors.eventName = 'Event name is required.';
    if (!eventDate) newErrors.eventDate = 'Please select a date.';
    else if (eventDate < today) newErrors.eventDate = 'Please select a future date.';
    if (!budget || isNaN(budget) || Number(budget) < 1000) newErrors.budget = 'Budget must be at least 1000.';
    if (!/^\d{10}$/.test(contactNo)) newErrors.contactNo = 'Contact number must be exactly 10 digits.';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();

    if (Object.keys(formErrors).length === 0) {
      // Pass budget and user info separately
      navigate('/event-list', {
        state: {
          budget: formData.budget,
          userInfo: {
            eventName: formData.eventName,
            eventDate: formData.eventDate,
            contactNo: formData.contactNo,
          }
        }
      });
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Welcome to the Home Page</h1>
      <p>Please enter your event details to continue.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '15px' }}>
          <label>Event Name:</label><br />
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
          {errors.eventName && <p style={{ color: 'red' }}>{errors.eventName}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Event Date:</label><br />
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
          {errors.eventDate && <p style={{ color: 'red' }}>{errors.eventDate}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Budget (min 1000):</label><br />
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
          {errors.budget && <p style={{ color: 'red' }}>{errors.budget}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contact Number:</label><br />
          <input
            type="text"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
          {errors.contactNo && <p style={{ color: 'red' }}>{errors.contactNo}</p>}
        </div>

        <button type="submit" style={{ padding: '10px 20px' }}>
          Next
        </button>
      </form>
    </div>
  );
}

export default Home;
