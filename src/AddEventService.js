import React, { useState } from 'react';

function AddEventService() {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !image) {
      setMessage('Please provide both name and image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/services/add/', {  // <-- here
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Service added successfully!');
        setName('');
        setImage(null);
        e.target.reset(); // resets the file input
      } else {
        setMessage(data.message || 'Failed to add service');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error connecting to backend.');
    }
  };

  return (
    <div style={{ padding: '30px', textAlign: 'center' }}>
      <h2>Add Event Service</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ maxWidth: '400px', margin: 'auto' }}>
        <input
          type="text"
          placeholder="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Add Service</button>
      </form>
      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
}

export default AddEventService;
