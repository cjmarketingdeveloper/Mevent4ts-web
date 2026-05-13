import React, { useState, useEffect } from 'react';

const IPhoneNotificationBanner = () => {
  const [isIPhone, setIsIPhone] = useState(false);

  useEffect(() => {
    // Detects iPhone or iPad (iOS devices)
    const checkIPhone = /iPhone|iPod/i.test(navigator.userAgent);
    setIsIPhone(checkIPhone);
  }, []);

  // If it's not an iPhone, this component returns nothing, 
  // but the rest of your App.js will still render.
  if (!isIPhone) return null;

  return (
    <div className="alert alert-warning text-center m-0 rounded-0 border-0" role="alert">
      <small>
        <strong>Note:</strong> Remember to bookmark your app on your home screen to get all notifications.
      </small>
    </div>
  );
};

export default IPhoneNotificationBanner;