import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

const FinalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventData, eventId } = location.state || {}; 

  const [receiptData, setReceiptData] = useState(eventData || null);
  const [loading, setLoading] = useState(!eventData);

  useEffect(() => {
    if (!eventId && !eventData) {
      navigate('/'); 
      return;
    }

    if (!eventData && eventId) {
      setLoading(true);
      fetch(`http://127.0.0.1:8000/api/event/${eventId}/receipt/`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch receipt data");
          return res.json();
        })
        .then(data => {
          setReceiptData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching event data:", err);
          setLoading(false);
        });
    }
  }, [eventId, navigate, eventData]);

  const downloadReceipt = () => {
    const receipt = document.getElementById('receipt');
    html2canvas(receipt).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('event_receipt.pdf');
    });
  };

  if (loading) return <p>Loading receipt...</p>;
  if (!receiptData) return <p>No receipt data available</p>;

  const { event, user, packages, total_cost } = receiptData;

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <div id="receipt" style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
        <h2>🎉 Event Receipt</h2>

        <section>
          <h3>User Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Username:</strong> {user.username}</p>
        </section>

        <section>
          <h3>Event Information</h3>
          <p><strong>Event Name:</strong> {event.name}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Contact No:</strong> {event.contact_no}</p>
          <p><strong>Initial Budget:</strong> ₹{event.initial_budget}</p>
          <p><strong>Used Budget:</strong> ₹{event.used_budget}</p>
          <p><strong>Remaining Budget:</strong> ₹{event.remaining_budget}</p>
        </section>

        <section>
          <h3>Selected Packages</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ccc' }}>Service</th>
                <th style={{ borderBottom: '1px solid #ccc' }}>Title</th>
                <th style={{ borderBottom: '1px solid #ccc' }}>Items</th>
                <th style={{ borderBottom: '1px solid #ccc' }}>Count</th>
                <th style={{ borderBottom: '1px solid #ccc' }}>Unit Cost</th>
                <th style={{ borderBottom: '1px solid #ccc' }}>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, idx) => (
                <tr key={idx}>
                  <td>{pkg.service_name}</td>
                  <td>{pkg.title}</td>
                  <td>{pkg.items}</td>
                  <td>{pkg.count}</td>
                  <td>₹{pkg.unit_cost}</td>
                  <td>₹{pkg.total_cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={{ marginTop: '40px' }}>
          <h3>📊 Package Cost Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={packages.map(pkg => ({
                  name: pkg.title,
                  value: pkg.total_cost,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
                dataKey="value"
              >
                {packages.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      <button 
        onClick={downloadReceipt} 
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#0088FE', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Download as PDF
      </button>

      <div style={{ marginTop: '50px', fontFamily: 'Arial' }}>
        <h2>Programming the 8254</h2>
        <section>
          <h3>READ OPERATIONS</h3>
          <p>
            In some applications, especially in event counters, it is necessary to read the value of the counter in progress.
            This can be done by either of two methods:
          </p>
          <ul>
            <li>
              <strong>Method 1:</strong> Reading the counter while the count is in progress (known as reading on the fly).
            </li>
            <li>
              <strong>Method 2:</strong> Reading the counter using the Read Back command.
            </li>
          </ul>
          <p>
            The first input to the read command is read into the selected counter, and the second I/O operations are performed by the MPU.
          </p>
        </section>

        <section>
          <h3>READ-BACK COMMAND</h3>
          <p>
            The Read-Back Command in the 8254 allows the user to read the count and the status of the counter. This command is not available in the 8233.
            The format of the command is shown in the figure below.
          </p>
        </section>
      </div>
    </div>
  );
};

export default FinalPage;