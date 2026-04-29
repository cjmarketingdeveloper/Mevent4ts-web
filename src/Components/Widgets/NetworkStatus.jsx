import React, { useState, useEffect } from 'react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Handler functions to update state
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);

    // Listen for browser network events
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    // Clean up listeners on unmount
    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  // If we're online, don't render anything
  if (isOnline) return null;

  return (
    <div style={styles.bar}>
      No Internet Connection
    </div>
  );
};

// Simple inline styles for the bottom bar
const styles = {
  bar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#261112',
    color: 'white',
    textAlign: 'center',
    padding: '10px',
    fontWeight: 'bold',
    zIndex: 1000,
    fontSize: '14px',
    fontFamily: 'sans-serif'
  }
};

export default NetworkStatus;