import React from 'react';

const AppSimple = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a1a2e', 
      color: 'white', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🐋 Old Tom: The Living Legend</h1>
      <h2>Simple Version - App is Loading</h2>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '8px'
      }}>
        <h3>Debug Info:</h3>
        <p>✅ React is working</p>
        <p>✅ This simple component loaded</p>
        <p>❌ Main App component may have issues</p>
        
        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Reload Page
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Common Issues:</h3>
        <ul>
          <li>Audio services failing to initialize</li>
          <li>3D libraries not loading</li>
          <li>Missing environment variables</li>
        </ul>
      </div>
    </div>
  );
};

export default AppSimple;