import React, { useState, useEffect } from 'react';

function App() {
  const [listings, setListings] = useState([]);
  
  // Clean, isolated input tracking hooks
  const [itemName, setItemName] = useState('');
  const [donorName, setDonorName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryTime, setExpiryTime] = useState('');

  const API_URL = 'http://localhost:5000/api/food';

  // Fetch data cleanly when page mounts
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setListings(data);
        }
      })
      .catch(err => console.error("Error fetching listings from backend:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Submit button clicked!");
    console.log("Current values -> Item:", itemName, "| Donor:", donorName);

    // Bulletproof validation check
    if (!itemName || !itemName.trim() || !donorName || !donorName.trim()) {
      console.warn("Validation failed: Item Name or Donor Name is completely empty!");
      alert("Please fill in both the Food Item Name and Donor Name fields.");
      return;
    }

    const payload = {
      itemName: itemName.trim(),
      donorName: donorName.trim(),
      quantity: quantity.trim() || "Not Specified",
      expiryTime: expiryTime.trim() || "Available Now"
    };

    console.log("Sending payload to backend server:", payload);

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Backend responded with status code:", res.status);
        return res.json();
      })
      .then(newListing => {
        console.log("Data successfully saved by database:", newListing);
        
        if (newListing && newListing._id) {
          // Add to current visual UI list instantly
          setListings(prevListings => [...prevListings, newListing]);
          
          // Completely clear out inputs for next entry
          setItemName('');
          setDonorName('');
          setQuantity('');
          setExpiryTime('');
        } else {
          console.error("Backend did not return a valid database object with an _id row parameter.");
        }
      })
      .catch(err => console.error("Network connection error failed to hit server:", err));
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#2e7d32' }}>🌱 EcoScan: Food Surplus Connect</h1>
        <p>Connecting local vendors with surplus food to community members in real-time.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        
        {/* Left Input Section */}
        <div style={{ background: '#f1f8e9', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3>📢 List Surplus Food</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Food Item Name *</label>
            <input 
              type="text" 
              placeholder="e.g., 10 Veg Puffs" 
              value={itemName} 
              onChange={(e) => setItemName(e.target.value)} 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
              required 
            />
            
            <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Shop / Donor Name *</label>
            <input 
              type="text" 
              placeholder="e.g., City Bakery" 
              value={donorName} 
              onChange={(e) => setDonorName(e.target.value)} 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
              required 
            />
            
            <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Quantity</label>
            <input 
              type="text" 
              placeholder="e.g., 2 boxes, 3 kg" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
            
            <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>Available Until</label>
            <input 
              type="text" 
              placeholder="e.g., 9:00 PM tonight" 
              value={expiryTime} 
              onChange={(e) => setExpiryTime(e.target.value)} 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
            
            <button 
              type="submit" 
              style={{ background: '#2e7d32', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}
            >
              Share Surplus Food
            </button>
          </form>
        </div>

        {/* Right Output Display Section */}
        <div>
          <h3>😋 Available Food Nearby</h3>
          {listings.length === 0 ? (
            <p style={{ color: '#777', fontStyle: 'italic' }}>No surplus food listed right now. Check back soon!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {listings.map(item => (
                <div key={item._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#1b5e20', fontSize: '18px' }}>{item.itemName}</h4>
                  <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>
                    <strong>From:</strong> {item.donorName} | <strong>Qty:</strong> {item.quantity}
                  </p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#d32f2f', fontWeight: '500' }}>
                    ⏳ Pick up before: {item.expiryTime}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default App;
