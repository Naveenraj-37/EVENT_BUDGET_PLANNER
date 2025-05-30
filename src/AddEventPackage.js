import React, { useState, useEffect } from 'react';

function AddEventPackage() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    service: '',
    title: '',
    description: '',
    items: '',
    cost: '',
    sample_image: null,
  });
  const [message, setMessage] = useState('');

  // ✅ Update with your backend URL
  const SERVICE_API_URL = 'http://127.0.0.1:8000/api/services/';
  const ADD_PACKAGE_API_URL = 'http://127.0.0.1:8000/api/packages/add/';

  useEffect(() => {
    fetch(SERVICE_API_URL)
      .then(async (res) => {
        try {
          const json = await res.json();
          setServices(json);
        } catch (e) {
          console.error('Invalid JSON response from service API');
          setMessage('Error loading services. Contact admin.');
        }
      })
      .catch((err) => {
        console.error('Service fetch failed:', err);
        setMessage('Network error while loading services');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'sample_image') {
      setFormData((prev) => ({ ...prev, sample_image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.service) {
      setMessage('Please select a service.');
      return;
    }

    const submitData = new FormData();
    submitData.append('service', formData.service);
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('items', formData.items);
    submitData.append('cost', formData.cost);
    if (formData.sample_image) {
      submitData.append('sample_image', formData.sample_image);
    }

    try {
      const response = await fetch(ADD_PACKAGE_API_URL, {
        method: 'POST',
        body: submitData,
      });

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (response.ok) {
          setMessage('Package added successfully!');
          setFormData({
            service: '',
            title: '',
            description: '',
            items: '',
            cost: '',
            sample_image: null,
          });
        } else {
          setMessage('Error: ' + (data?.detail || JSON.stringify(data)));
        }
      } catch (jsonErr) {
        console.error('Error parsing response JSON:', jsonErr);
        console.error('Server response was:', text);
        setMessage('Server error: Unexpected response. Contact admin.');
      }
    } catch (err) {
      console.error('Network error:', err);
      setMessage('Network error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '30px' }}>
      <h2>Add Event Package</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>
          Select Service:
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            style={{ display: 'block', width: '100%', marginBottom: '15px' }}
          >
            <option value="">-- Select a Service --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ display: 'block', width: '100%', marginBottom: '15px' }}
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ display: 'block', width: '100%', marginBottom: '15px' }}
          />
        </label>

        <label>
          Items (comma separated):
          <input
            type="text"
            name="items"
            value={formData.items}
            onChange={handleChange}
            required
            style={{ display: 'block', width: '100%', marginBottom: '15px' }}
          />
        </label>

        <label>
          Cost:
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
            min="0"
            style={{ display: 'block', width: '100%', marginBottom: '15px' }}
          />
        </label>

        <label>
          Sample Image:
          <input
            type="file"
            name="sample_image"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'block', marginBottom: '15px' }}
          />
        </label>

        <button type="submit" style={{ padding: '10px 20px' }}>
          Add Package
        </button>
      </form>

      {message && <p style={{ marginTop: '20px', color: 'red' }}>{message}</p>}
    </div>
  );
}

export default AddEventPackage;
