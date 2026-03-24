import React, { useEffect, useState } from 'react'
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function TiltGate({ children }) {

  const [isLandscape, setIsLandscape]                           = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(orientation: landscape)");
    
    // Initial check
    setIsLandscape(mql.matches);

    // Modern listener
    const handler = (e) => setIsLandscape(e.matches);
    mql.addEventListener("change", handler);

    return () => mql.removeEventListener("change", handler);
  }, []);

  return (
    <div className={`tilt-gate-container ${!isLandscape ? "is-blurred" : ""}`}>
      {!isLandscape && (
        <div className="tilt-overlay">
          <div className="overlay-content">
            <i className="bi bi-phone-landscape"></i>
            <p>Please tilt your device to landscape</p>
            <Link to={"/"} className="btn btn-mevent mt-5">
              <FaHome />
            </Link>
          </div>
        </div>
      )}
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}

export default TiltGate