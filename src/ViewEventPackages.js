import React, { useState, useEffect } from 'react';

function ViewEventPackages() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState('');

  const SERVICE_API_URL = 'http://127.0.0.1:8000/api/services/';
  const PACKAGES_API_URL = 'http://127.0.0.1:8000/api/packages/';

  useEffect(() => {
    fetch(SERVICE_API_URL)
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => setMessage('Failed to load services.'));
  }, []);

  useEffect(() => {
    if (!selectedService) {
      setPackages([]);
      return;
    }

    fetch(`${PACKAGES_API_URL}?service=${selectedService}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch packages');
        return res.json();
      })
      .then((data) => {
        setPackages(data);
        setMessage('');
      })
      .catch(() => setMessage('Failed to load packages.'));
  }, [selectedService]);

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '30px' }}>
      <h2>View Packages by Service</h2>

      <label>
        Select Service:
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '20px' }}
        >
          <option value="">-- Select a Service --</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      {packages.length > 0 ? (
        <div>
          <h3>Packages:</h3>
          <ul>
            {packages.map((pkg) => (
              <li key={pkg.id} style={{ marginBottom: '20px' }}>
                <strong>{pkg.title}</strong><br />
                Description: {pkg.description}<br />
                Items: {pkg.items}<br />
                Cost: ${pkg.cost}<br />
                {pkg.sample_image && (
                  <img
                    src={pkg.sample_image}
                    alt={pkg.title}
                    style={{ maxWidth: '200px', marginTop: '10px', display: 'block' }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : selectedService ? (
        <p>No packages found for this service.</p>
      ) : null}
    </div>
  );
}

export default ViewEventPackages;
