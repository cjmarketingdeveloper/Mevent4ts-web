import React, { useEffect, useRef, useState } from 'react'
import { FaBars , FaWifi, FaAppleAlt, FaAndroid, FaPhone, FaMailBulk, FaAmazonPay, FaFacebook, FaInstagram, FaGlobe } from 'react-icons/fa';
import axios from 'axios';
import './landing.css';
import { Link } from 'react-router-dom';
import cjContact from './../assets/cjmark1.png';

function Landing() {

    const [listScreenShots, setListScreenShots]                     = useState([]);

    const [listNavActive, setListNavActive]                         = useState(true);
    const [progressKey, setProgressKey]                             = useState(0);

    const imagelink1    = "https://cjmarketing.co/image_directory/mevent/mevent_14_01.png";
    const imagelink2    = "https://cjmarketing.co/image_directory/mevent/mevent_14_02.png";
    const imagelink3    = "https://cjmarketing.co/image_directory/mevent/section_2_phone.png";
    const imagelink4    = "https://cjmarketing.co/image_directory/mevent/mevent_14_03.png";
    const logoMevent    = "https://cjmarketing.co/image_directory/mevent/large_logo.png";
    const logoSub       = "https://cjmarketing.co/image_directory/mevent/mevent-logo.png";
    const imagelink5    = "https://cjmarketing.co/image_directory/mevent/scaitem.png";
    const imagelink6    = "https://cjmarketing.co/image_directory/mevent/peopleicon.png";
    const imagelink7    = "https://cjmarketing.co/image_directory/mevent/arrowright.png";
    const imagelink8    = "https://cjmarketing.co/image_directory/mevent/bottom-appphone.png";
    const videoLink     = "https://cjmarketing.co/videos/aiwork.mp4";

    const sectionsRef               = useRef([]);

    const [deviceType, setDeviceType] = useState('desktop');

    const [activeIndex, setActiveIndex] = useState(0); // First one open by default

    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase();
        if (/android/.test(ua)) {
          setDeviceType('android');
        } else if (/iphone|ipad|ipod/.test(ua)) {
          setDeviceType('ios');
        } else {
          setDeviceType('desktop');
        }

        getListOfScreenShots();

        if(window.innerWidth < 768) {
          setListNavActive(false);
        }
    }, []);

    useEffect(() => {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % listScreenShots.length);
        setProgressKey((prev) => prev + 1);
      }, 10000); // 10 seconds
  
      return () => clearInterval(interval);
    }, [listScreenShots.length]);

    useEffect(() => {
        const options = {
          threshold: 0.5,
        };
    
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
             // console.log("In view:", entry.target); 
              entry.target.classList.add("in-view");
            }
          });
        }, options);
    
        sectionsRef.current.forEach((section) => {
          if (section) observer.observe(section);
        });
    
        return () => {
          sectionsRef.current.forEach((section) => {
            if (section) observer.unobserve(section);
          });
        };
    }, []);

    const scrollToSection = (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const getListOfScreenShots = async () => {
      try{
        const res = await axios.get("https://demo.mevent.co.za/landing-page/api.php");
        const reversedData = res.data.data.reverse();
        setListScreenShots(reversedData);
      }catch(errors){
        console.log(errors);
      }
    }
  return (
    <div className="main-landing">
      <nav className="navbar navbar-expand-md navbar-lane-park fixed-top ">
         
         <div className="nav-complex">
         <button className="btn-toggle-view" onClick={() => setListNavActive(!listNavActive)}>
           <FaBars />
         </button>
         {
          listNavActive && (
            <ul className="navbar-nav me-auto mb-2 mb-md-0 mobile-fill" >
              <li className="nav-item" onClick={() => scrollToSection('sect-home')}>Home</li>
              <li className="nav-item" onClick={() => scrollToSection('sect-about')}>About</li>
              <li className="nav-item" onClick={() => scrollToSection('sect-howto')}>How It Works</li>
              <li className="nav-item" onClick={() => scrollToSection('sect-download')}>Download</li>
              <li className="nav-item" onClick={() => scrollToSection('sect-contact')}>Contact Us</li>
            </ul>
          )
         }
          
         </div>
      </nav>
      <div className="section-full-height sect-home back-blacks section"
                ref={(el) => (sectionsRef.current[0] = el)} id="sect-home"
            >
                <img src={imagelink1} className="image-one rotate-tilt1 fade-top first" alt="Mevent Screen" />
                <img src={imagelink2} className="image-two rotate-tilt1 fade-bottom second" alt="Mevant Screen" />
                <img src={logoMevent} className="logo-center fade-in third" alt="Mevent Logo" />
                <div className="copybottom right fade-in fourth">
                All-in-one event platform to engage, track, and elevate every attendee experience.
                </div>
      </div>
      <div
            className="section-full-height sect-about cream-gray section"
            ref={(el) => (sectionsRef.current[1] = el)}
            id="sect-about"
            >
                <div className="container">
                   <div className="row">
                    <div className="col-md-6">
                            <img src={imagelink3} className="img-sect2 fade-bottom first" alt="Image 3" />
                        </div>
                        <div className="col-md-6">
                            <h1 className="base-heading2 fade-in secondsec">Executive Summary</h1>
                            <ul className="clearul-style ">
                                <li className="fade-in thirdsec">
                                    <div className="content-number">
                                        <div className="number-item">01</div>
                                        <div className="content-info">QR scans, competitions, Q&As, and liveagendas keep attendees engaged throughout the event.</div>
                                    </div>
                                </li>
                                <li className="fade-in fourthsec">
                                    <div className="content-number">
                                        <div className="number-item">02</div>
                                        <div className="content-info">
                                        Real-time analytics and feedback toolsprovide actionable data to optimize eventperformance instantly.    
                                        </div>
                                    </div>
                                </li>
                                <li className="fade-in fifthsec">
                                    <div className="content-number">
                                        <div className="number-item">03</div>
                                        <div className="content-info">
                                        Seamless access to exhibitor directories andsession information enhances networking andevent navigation.
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                   </div>
                </div>
        </div>
        <div
            className="section-full-height sect-howto back-blacks section" id="sect-howto">
              <h3 className="base-heading2 spec-howto-head">How it Works</h3>
            {
               listScreenShots.length > 0 && (
               <div className="grid grid-cols-3 gap-4 p-4">
                 {/* Column 1: Buttons */}
                 <div className="progress-container">
                     <div key={progressKey} className="progress-bar" />
                  </div>
                 <div className="howflex"> 
                  
                  <div className="space-y-2">
                    {listScreenShots.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveIndex(index);
                          setProgressKey(0);
                        }}
                        className={`btn-howto-gray ${
                          index === activeIndex
                            ? "btn-howto-active"
                            : ""
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
                 {/* Column 2: Description */}
                 <div className="howflex">
                   <p className="message-howto">
                     {listScreenShots[activeIndex]?.description}
                   </p>
                 </div>
 
                 {/* Column 3: Image */}
                 <div className="howflex">
                   <img
                     src={listScreenShots[activeIndex]?.path}
                     alt="Screenshot"
                     className="special-screen"
                   />
                 </div>
               </div>
               )
             }
        </div>
        <div
            className="section-full-height sect-download section"
            ref={(el) => (sectionsRef.current[2] = el)}
            id="sect-download"
            >
              <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="content-4 ">
                            <h1 className="base-heading3 textcolor-red">GET READY FOR THE FUTURE OF EVENTS</h1>
                            <div className="content-downloads">
                                <Link to="/" className="btn button-view">
                                    <span><FaWifi /></span>
                                    <span className="text-info-law">DOWNLOAD NOW</span>
                                </Link>

                                {(deviceType === 'android' || deviceType === 'desktop') && (
                                    <Link to="https://play.google.com/store/apps/details?id=co.cjmarketing.tsdevcut.tf.mevent3ts2025" className="btn button-view">
                                    <span><FaAndroid /></span>
                                    <span className="text-info-law">DOWNLOAD NOW</span>
                                    </Link>
                                )}

                                {(deviceType === 'ios' || deviceType === 'desktop') && (
                                    <Link to="https://apps.apple.com/us/app/mevent-expo/id6744694917" className="btn button-view">
                                    <span><FaAppleAlt /></span>
                                    <span className="text-info-law">DOWNLOAD NOW</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                         <img className="bottom-image fade-bottom first" src={imagelink8} />
                    </div>           
                </div>
              </div>
        </div>
    
        <div
          className="sect-contact back-over-part section"
          id="sect-contact"
           style={{ 
              backgroundImage: `url("${cjContact}")` 
            }}
            >
            <div className=" back-over-lay"
              >
                <div className="content-info-display text-center">
                       <h1 className="base-heading4 textcolor-red padsta1">THANK YOU</h1>
                       <h2 className="mgtop20 textcolor-white">GET IN TOUCH WITH US <br/>TO FIND OUT MORE.</h2>
                   
                       <div className="lay-contact">
                              <p className="web-section-contact"> 
                                <span className="website-view"><FaGlobe /> </span>
                                <a href="https://cjmarketing.co/" target="_blank" className="link-view-1">
                                 www.cjmarketing.co
                                </a>
                              </p>
                              <p className="phone-section-contact"> 
                                <span className="phone-view"><FaPhone /> </span>
                                <a href="tel:+27136654299" target="_blank" className="link-view-1">013 665 4299</a>
                              </p>
                              <p> 
                                <span className="phone-view"><FaMailBulk /> </span>
                                <a href="mailto:sales@cjmarketing.co" className="link-view-1">
                                  sales@cjmarketing.co
                                </a>
                              </p>
                      </div> 
                   

                </div>
            </div>
            
        </div>
        <div className="foot-block-outline">
          <div className="foot-block-content">
            &copy; Copyright {new Date().getFullYear()} | CJ Marketing | All Rights Reserved
          </div>
          <div className="foot-block-social">
                <ul className='social-foot'>
                  <li>
                      <Link 
                        to={"https://www.facebook.com/agencyCJMco"}
                        target="_blank"
                        className="link-foot"><FaFacebook /></Link>
                    </li>
                    <li>
                      <Link 
                        to={"https://www.instagram.com/cj_marketing.co/"}
                        target="_blank"
                        className="link-foot"><FaInstagram /></Link>
                    </li>
                </ul>
          </div>
        </div>  
    </div>
  )
}

export default Landing