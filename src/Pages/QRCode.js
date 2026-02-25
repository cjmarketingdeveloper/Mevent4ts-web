import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import TopNavigation from "./../Components/Widgets/TopNavigation";
import scanAreaImage from '../assets/qrcode8739.png';
import { Link } from 'react-router-dom';


function QRCode() {
    const dispatch                                                      = useDispatch();
    
    const {user}                                                        = useSelector((state) => state.auth);
    
    const [scanMode, setScanMode]                                       = useState("scanone"); // Default is scanone

  return (
    <div>
        <div className="top-navbar">
            <TopNavigation title={"QR Code"} />
        </div>
        <div className="layer-block">
           <div className="layer-content">
               <img src={scanAreaImage} className="image-dispay-mid" />

               <div className={`bottom-scan-toggler ${scanMode}`}>
                    <div className="filter-scan">
                        <button
                            className={`btn btn-action btn-scan-on ${scanMode === "scanone" ? "active" : ""}`}
                            onClick={() => setScanMode("scanone")}
                          >
                              QR Code Scan</button>
                        <button 
                            className={`btn btn-action btn-scan-input ${scanMode === "scaninput" ? "active" : ""}`}
                            onClick={() => setScanMode("scaninput")}
                          >
                              QR Code Input</button>
                    </div>
                    <div className="scan-info-content">
                    {
                      scanMode === "scanone" ? 
                        <div className="scan-info scanning">
                          <div className="ct-scan">To scan a session or supplier QR Code</div>
                          <Link to="/qrcode-scan" className="btn btn-mevent btn-mevent-black">Scan Now</Link>
                        </div>
                        :
                        <div className="scan-info inputing">
                          <div className="ct-scan">To use the session or supplier code</div>
                          <Link to="/qrcode-input" className="btn btn-mevent">Use Code</Link>
                        </div>
                    }
                </div>
               </div>
              
               
           </div>
        </div>
    </div>
  )
}

export default QRCode