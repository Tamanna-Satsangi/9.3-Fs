import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendData, setBackendData] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Fetch health status
    fetch(`${API_URL}/api/health`)
      .then(res => res.json())
      .then(data => {
        setHealthStatus(data);
      })
      .catch(err => console.error('Health check failed:', err));

    // Fetch backend data
    fetch(`${API_URL}/api/data`)
      .then(res => res.json())
      .then(data => {
        setBackendData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Data fetch failed:', err);
        setLoading(false);
      });
  }, [API_URL]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Full Stack AWS Deployment</h1>
        <h2>Practice 3 - Load Balancing Demo</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="data-container">
            {healthStatus && (
              <div className="health-status">
                <h3>Backend Health Status</h3>
                <p>Status: {healthStatus.status}</p>
                <p>Message: {healthStatus.message}</p>
                <p>Instance: {healthStatus.instance}</p>
                <p>Timestamp: {new Date(healthStatus.timestamp).toLocaleString()}</p>
              </div>
            )}
            
            {backendData && (
              <div className="backend-data">
                <h3>Backend Data</h3>
                <p>Data: {backendData.data}</p>
                <p>Served by Instance: {backendData.instance}</p>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
