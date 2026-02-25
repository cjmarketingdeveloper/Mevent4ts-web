import React from 'react'
import { FaRegWindowClose, FaThumbsUp, FaThumbsDown, FaQrcode } from 'react-icons/fa';
import { motion } from "framer-motion";

function PushModal({myEventSponsors, setIsVisible, user}) {
  return (
    <motion.div 
        className="over-read"
        initial={{ opacity: 0, y: 100 }} // Start off-screen
        animate={{ opacity: 1, y: 0 }}   // Animate into view
        exit={{ opacity: 0, y: 100 }}    // Animate back out
        transition={{ duration: 0.5, ease: "easeInOut" }}>
         <div className="area-closing">
            <button className="closing-button" onClick={() => setIsVisible(false)}><FaRegWindowClose /></button>
         </div>
       <div className="fade-description">
           <p className="text-center">
            All succesful scans will be: <span className="space-success"><FaQrcode /></span>
           </p>
           <div className="list-my-sponsors">
                {
                    myEventSponsors.length > 0 && (
                        <ul className="view-sponsors-drop">
                            {
                              myEventSponsors.map((sponsor, index) => {
                                return <li key={index}>
                                            <div className="sp-voted-list-item">
                                                <div className="image-sp-voted-list">
                                                    <img src={sponsor.logo} className="sp-pot"/>
                                                </div>
                                                <div className="title-sp-voted-list">
                                                    <h3>{sponsor.title}</h3>
                                                </div>
                                                <div className="status-sp-voted-list">
                                                    {
                                                        sponsor.voted ? 
                                                         <span className="space-success">
                                                            <FaQrcode />
                                                         </span>
                                                           : 
                                                           <span className="space-fail">
                                                            <FaQrcode />
                                                            </span>
                                                    }
                                                </div>
                                            </div>        
                                        </li>
                              })  
                            }
                        </ul>
                    )
                }
           </div>
       </div>
    </motion.div>
  )
}

export default PushModal