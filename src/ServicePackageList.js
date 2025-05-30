import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function PackageSelection() {
  const [packages, setPackages] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [packageCounts, setPackageCounts] = useState({});
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [initialBudget, setInitialBudget] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [eventDetails, setEventDetails] = useState({ eventName: '', contactNo: '', eventDate: '', username: '' });

  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const PACKAGES_URL = 'http://127.0.0.1:8000/api/packages/';

  useEffect(() => {
    if (!locationState) {
      setError('No service or event data provided');
      setLoading(false);
      return;
    }
    const { selectedService, budget, selectedPackages: prevSelected, userInfo } = locationState;
    if (!selectedService || !budget) {
      setError('Invalid service or budget');
      setLoading(false);
      return;
    }
    setService(selectedService);
    setInitialBudget(budget);
    setRemainingBudget(budget);
    if (userInfo) {
      const formattedDate = userInfo.eventDate ? new Date(userInfo.eventDate).toISOString().split('T')[0] : '';
      setEventDetails({ ...userInfo, eventDate: formattedDate });
    }
    if (prevSelected) {
      setSelectedPackages(prevSelected);
      const allocated = prevSelected.reduce((sum, pkg) => sum + pkg.cost * pkg.count, 0);
      setRemainingBudget(budget - allocated);
    }
    fetch(`${PACKAGES_URL}?service=${selectedService.id}`)
      .then(res => res.ok ? res.json() : Promise.reject(`Failed to fetch packages: ${res.status}`))
      .then(data => {
        setPackages(data);
        setPackageCounts(Object.fromEntries(data.map(pkg => [pkg.id, 0])));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [locationState]);

  const handleCountChange = (pkgId, value) => setPackageCounts(prev => ({ ...prev, [pkgId]: Math.max(0, parseInt(value) || 0) }));

  const handleAddPackage = (pkgId) => {
    const count = packageCounts[pkgId] || 0;
    if (count <= 0) return setError('Please enter a valid count');
    const pkg = packages.find(p => p.id === pkgId);
    if (!pkg) return setError('Package not found');
    const packageCost = pkg.cost * count;
    if (packageCost > remainingBudget) return setError(`Insufficient budget! ₹${remainingBudget} remaining.`);
    setError('');
    setSuccessMessage('');
    const existingIndex = selectedPackages.findIndex(p => p.id === pkgId);
    let newSelected = [...selectedPackages];
    if (existingIndex >= 0) {
      if (newSelected[existingIndex].service_id !== service.id) {
        const oldCost = newSelected[existingIndex].cost * newSelected[existingIndex].count;
        setRemainingBudget(prev => prev + oldCost);
        newSelected[existingIndex] = { ...pkg, count, service_id: service.id, service_name: service.name };
      } else {
        newSelected[existingIndex].count += count;
      }
    } else {
      newSelected.push({ ...pkg, count, service_id: service.id, service_name: service.name });
    }
    setSelectedPackages(newSelected);
    setRemainingBudget(prev => prev - packageCost);
    setPackageCounts(prev => ({ ...prev, [pkgId]: 0 }));
  };

  const handleDiscardPackage = (pkgId) => {
    const pkg = selectedPackages.find(p => p.id === pkgId);
    if (!pkg) return;
    setSelectedPackages(selectedPackages.filter(p => p.id !== pkgId));
    setRemainingBudget(prev => prev + pkg.cost * pkg.count);
    setError('');
    setSuccessMessage('');
  };

  const handleGoBack = () => navigate('/event-list', { state: { ...locationState, updatedBudget: remainingBudget, selectedPackages } });

  const handleFinalize = () => {
    setIsFinalizing(true);
    setError('');
    setSuccessMessage('');
    if (!eventDetails.eventName || !eventDetails.contactNo || !eventDetails.eventDate) {
      setError('Please ensure all event details are filled');
      setIsFinalizing(false);
      return;
    }
    try {
      console.log('Order confirmed successfully!', { eventDetails, selectedPackages });
      setSuccessMessage('Order confirmed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3s
      setSelectedPackages([]);
      setPackageCounts(Object.fromEntries(packages.map(pkg => [pkg.id, 0])));
      setRemainingBudget(initialBudget);
      setEventDetails({ eventName: '', contactNo: '', eventDate: '', username: eventDetails.username });
    } catch (error) {
      setError('Failed to confirm order.');
      console.error('Finalize error:', error);
    } finally {
      setIsFinalizing(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (!service) return <div style={{ padding: '20px', color: 'red' }}>No service selected</div>;

  const currentPackages = packages.filter(pkg => pkg.service === service.id);

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '20px' }}>
      <h2>{service.name} Packages</h2>
      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #dee2e6' }}>
        <h3>Event Details</h3>
        <p><strong>Name:</strong> {eventDetails.eventName}</p>
        <p><strong>Date:</strong> {eventDetails.eventDate ? new Date(eventDetails.eventDate).toLocaleDateString() : ''}</p>
        <p><strong>Contact:</strong> {eventDetails.contactNo}</p>
        <p><strong>Budget:</strong> ₹{initialBudget} | <strong>Remaining:</strong> ₹{remainingBudget}</p>
      </div>
      {successMessage && <div style={{ color: '#155724', background: '#d4edda', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{successMessage}</div>}
      {error && <div style={{ color: '#721c24', background: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
      <h3>Available Packages</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px', marginTop: '20px' }}>
        {currentPackages.map(pkg => (
          <div key={pkg.id} id={`package-${pkg.id}`} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', background: '#fff' }}>
            <h4>{pkg.title}</h4>
            <p>{pkg.description}</p>
            <p><strong>Items:</strong> {pkg.items}</p>
            <p><strong>Cost:</strong> ₹{pkg.cost}</p>
            {pkg.sample_image && <img src={pkg.sample_image} alt={pkg.title} style={{ maxWidth: '100%', borderRadius: '5px' }} />}
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <input
                type="number"
                min="0"
                value={packageCounts[pkg.id] || 0}
                onChange={e => handleCountChange(pkg.id, e.target.value)}
                style={{ width: '70px', padding: '8px', border: '1px solid #ced4da', borderRadius: '4px' }}
              />
              <button
                onClick={() => handleAddPackage(pkg.id)}
                style={{ padding: '8px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {selectedPackages.some(p => p.id === pkg.id) ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <h3>Selected Packages</h3>
      {selectedPackages.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
          <thead>
            <tr style={{ background: '#343a40', color: 'white' }}>
              <th style={{ padding: '12px' }}>Service</th>
              <th style={{ padding: '12px' }}>Package</th>
              <th style={{ padding: '12px' }}>Count</th>
              <th style={{ padding: '12px' }}>Unit Cost</th>
              <th style={{ padding: '12px' }}>Total</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedPackages.map(pkg => (
              <tr key={pkg.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '12px' }}>{pkg.service_name || service.name}</td>
                <td style={{ padding: '12px' }}>{pkg.title}</td>
                <td style={{ padding: '12px' }}>{pkg.count}</td>
                <td style={{ padding: '12px' }}>₹{pkg.cost}</td>
                <td style={{ padding: '12px' }}>₹{pkg.cost * pkg.count}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => handleDiscardPackage(pkg.id)}
                    style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                  {pkg.service_id === service.id && (
                    <button
                      onClick={() => {
                        setPackageCounts(prev => ({ ...prev, [pkg.id]: pkg.count }));
                        document.getElementById(`package-${pkg.id}`)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{ padding: '6px 12px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '8px' }}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
            <tr style={{ background: '#e9ecef' }}>
              <td colSpan="3" style={{ padding: '12px', textAlign: 'right' }}>Total:</td>
              <td style={{ padding: '12px' }}></td>
              <td style={{ padding: '12px' }}>₹{selectedPackages.reduce((sum, pkg) => sum + pkg.cost * pkg.count, 0)}</td>
              <td style={{ padding: '12px' }}></td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No packages selected.</p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button
          onClick={handleGoBack}
          style={{ padding: '12px 25px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          ← Back
        </button>
        {selectedPackages.length > 0 && (
          <button
            onClick={handleFinalize}
            disabled={isFinalizing}
            style={{
              padding: '12px 25px',
              background: isFinalizing ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isFinalizing ? 'not-allowed' : 'pointer',
            }}
          >
            {isFinalizing ? 'Processing...' : 'Confirm Order'}
          </button>
        )}
      </div>
    </div>
  );
}

export default PackageSelection;