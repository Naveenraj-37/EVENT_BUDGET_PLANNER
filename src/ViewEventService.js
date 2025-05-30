import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function EventList() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract budget & userInfo passed from previous page (Home.js)
  // Provide defaults if not found
  const budget = location.state?.budget || 'Not Provided';
  const userInfo = location.state?.userInfo || null; // expecting an object with user info

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/event-services/")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch event services');
        }
        return res.json();
      })
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleServiceSelect = (service) => {
    // On clicking a service, navigate to next page (e.g., /service-packages)
    // Pass budget, selected service, and userInfo forward for later use
    navigate('/service-packages', {
      state: { selectedService: service, budget, userInfo },
    });
  };

  if (loading) return <p>Loading services...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Your Budget: ₹{budget}</h2>
      <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Please select a service:</p>

      {services.length === 0 ? (
        <p>No event services found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
          {services.map(service => (
            <li
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: '#fafafa',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fafafa'}
            >
              {service.image && (
                <img
                  src={service.image}
                  alt={service.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                />
              )}
              <div>
                <h3 style={{ margin: 0 }}>{service.name}</h3>
                <p style={{ margin: '5px 0 0', color: '#555', fontSize: '14px' }}>{service.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventList;
