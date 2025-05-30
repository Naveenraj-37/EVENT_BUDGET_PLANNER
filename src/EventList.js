import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function EventList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { budget, userInfo } = location.state || {};

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/services-with-packages/")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch services with packages');
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

  const handleServiceClick = (service) => {
    navigate('/service-packages', {
      state: {
        selectedService: service,
        budget: budget,
        userInfo: userInfo,  // Pass full userInfo along here too, if needed in that page
      }
    });
  };

  const handleContinue = () => {
    // Pass ALL userInfo fields together inside the userInfo object:
    navigate('/final-page', {
      state: {
        budget,
        userInfo  // This is the full object, not just one field
      }
    });
  };

  if (loading) return <p>Loading services and packages...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Services</h2>

      {/* Display User Event Details */}
      {userInfo && (
        <div style={{
          backgroundColor: '#f9f9f9',
          border: '1px solid #ccc',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h3>User Event Details:</h3>
          <p><strong>Event Name:</strong> {userInfo.eventName}</p>
          <p><strong>Event Date:</strong> {userInfo.eventDate}</p>
          <p><strong>Contact Number:</strong> {userInfo.contactNo}</p>
          <p><strong>Budget:</strong> ₹{budget}</p>
          {/* Add other userInfo fields here if you have them, for preview */}
          {userInfo.email && <p><strong>Email:</strong> {userInfo.email}</p>}
          {userInfo.address && <p><strong>Address:</strong> {userInfo.address}</p>}
        </div>
      )}

      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        services.map(service => (
          <div
            key={service.id}
            style={{
              marginBottom: '30px',
              borderBottom: '2px solid #ddd',
              paddingBottom: '20px',
              cursor: 'pointer'
            }}
            onClick={() => handleServiceClick(service)}
          >
            <h3>{service.name}</h3>
            {service.image && (
              <img
                src={service.image}
                alt={service.name}
                style={{ maxWidth: '300px', height: 'auto', borderRadius: '8px' }}
              />
            )}
            {service.packages && service.packages.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  {service.packages.map(pkg => (
                    <li key={pkg.id} style={{ marginBottom: '10px', paddingLeft: '10px' }}>
                      <strong>{pkg.name}</strong>
                      {pkg.image && (
                        <div>
                          <img
                            src={pkg.image}
                            alt={pkg.name}
                            style={{ maxWidth: '200px', height: 'auto', borderRadius: '5px', marginTop: '5px' }}
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}

      <button
        style={{
          marginTop: '30px',
          padding: '10px 25px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}

export default EventList;
