import React, { useEffect, useState } from 'react'
import { Link, useNavigate , useLocation} from 'react-router-dom';
import { FaBars, FaQrcode , FaFileImage, FaHome, FaBezierCurve, FaTimes, FaList, FaTrophy, FaCompress, FaHive, FaUser, FaInbox, FaClipboardCheck } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout, reset } from '../../reduxAuth/authSlice';
import "./widgets.css";
import HeaderLogo from '../../assets/logo.png';

function BottomBar({member}) {
    const location          = useLocation();

    const navigate                                            = useNavigate();
    const dispatch                                            = useDispatch();
  
    // Helper function to check if the path matches
    const isActive = (path) => location.pathname === path ? "menuitem-active" : "";

    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Function to close menu when a link is clicked
    const closeMenu = () => {
        setIsOpen(false);
    };

    const onLogOut = () => {
        closeMenu();
        dispatch(logout());
        dispatch(reset());
        navigate("/login");
    }

  return (
    <div className="bottom-region-arena">
        <div className="bottom-region-arena-in shadow">
            {/*   */}
            <ul className="nav-box">
            <li className="bottom-line">
                <Link to="/" className={`nav-list-item ${isActive("/start")}`}>
                    <div>
                        <FaHome />
                    </div>
                    <div className="sm-border-title">
                        Home
                    </div>
                </Link>
            </li>
            <li className="bottom-line">
                    <Link to="/agendas" className={`nav-list-item ${isActive("/agendas")}`}>
                        <div className="home-icon-item">
                            <FaHive />
                        </div>
                        <div className="sm-border-title">
                            Agenda
                        </div>
                    </Link>
                </li>
                <li className="bottom-line mid-scan-block">
                    <Link to="/qrcode-scan" className={`nav-list-item mid-wide-circle ${isActive("/qrcode")}`}>
                        <div>
                        <FaQrcode />
                        </div>
                        <div className="sm-border-title-red">
                            Scan Now
                        </div>
                    </Link>
                </li>
                <li className="bottom-line">
                <Link to="/profile" className={`nav-list-item ${isActive("/profile")}`}>
                        <div>
                            <FaUser />
                        </div>
                        <div className="sm-border-title">
                            Profile
                        </div>                     
                    </Link>
                </li>             
                <li className="bottom-line mt-2">
                    <button className="nav-list-item " onClick={toggleMenu}>
                        <span>
                            <FaBars />
                        </span>
                    </button>
                </li>
            </ul>
        
            {/**/}
            <div className={`side-menu ${isOpen ? "open" : ""}`}>
                {/* Close Button */}
                <div className="view-navigation">
                        <button className="close-btn" onClick={toggleMenu}>
                            <FaTimes />
                        </button>
                </div>
                    <img src={HeaderLogo} className="navi-logo" />
                    {/* Navigation Links */}
                    <ul className="slide-inner">
                        <li>
                            <Link to="/" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaHome />
                                </span>
                                <span>Home</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/rsvp" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaInbox />
                                </span>
                                <span>RSVP</span>
                            </Link>
                        </li>
                       
                        <li>
                            <Link to="/qrcode-scan" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaQrcode />
                                </span>
                                <span>QR Scan</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/qrcode-input" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaQrcode />
                                </span>
                                <span>QR Code</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/competition-view" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaTrophy />
                                </span>
                                <span>Rewards</span>
                            </Link>
                        </li> 
                        <li>
                            <Link to="/gallery" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaFileImage />
                                </span>
                                <span>Gallery</span>
                            </Link>
                        </li> 
                        <li>
                            <Link to="/survey" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaClipboardCheck />
                                </span>
                                <span>Survey</span>
                            </Link>
                        </li> 
                        
                        
                        <li>
                            <Link to="/gala" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaBezierCurve />
                                </span>
                                <span>Gala</span>
                            </Link>                        
                        </li>
                        {/*                 
                        
                        <li>
                            <Link to="/add-event" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaCalendarDay />
                                </span>
                                <span>Find Events</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/sponsors" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaCompress />
                                </span>
                                <span>Scans</span>
                            </Link>
                        </li> 
                        
                        <li>
                            <Link to="/mulit-agendas/" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaList />
                                </span>
                                <span>Agendas</span>
                            </Link>
                        </li> 
                        */}
                        {/*
                        <li>
                            <Link to="/profile" onClick={closeMenu}>
                                <span className="rx-panel">
                                    <FaRegUser />
                                </span>
                                <span>Profile</span>
                            </Link>
                        </li>
                        */}
                        <li className="nav-log">
                            <button className="btn btn-mevent" onClick={() => onLogOut()}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Overlay when menu is open */}
                {isOpen && <div className="overlay" onClick={toggleMenu}></div>}

        </div>
    </div>
  )
}

export default BottomBar