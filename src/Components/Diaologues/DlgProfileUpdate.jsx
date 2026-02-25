import React from 'react';
import { motion } from "framer-motion";
import { FaCamera, FaImage, FaTrash } from 'react-icons/fa';

function DlgProfileUpdate({handleGalleryUpload ,handleRemoveImage, handleCloseModal}) {

  return (
        <motion.div 
            className="bottom-sheet" 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <div className="modal-content">
                <div className="profile-image-update">
                    <div className="lane-one-intro-3">
                       <button className="button-uncover cancel-btn" onClick={handleCloseModal}>X</button>
                      <h4>Update Profile Picture</h4>
                      <button className="button-uncover " onClick={handleRemoveImage}><FaTrash /> </button>
                    </div>
                    <div className="action-row">
                      
                      <div className="block-action">
                        <div className="icon-worup">
                            <span onClick={handleGalleryUpload}><FaImage /></span>
                        </div>
                        <div className="text-center">
                            <button onClick={handleGalleryUpload} className="p-button-01"> Gallery</button>
                        </div>
                      </div>
                 
                    </div>
                    
                    
                </div>
            </div>
        </motion.div>
  )
}

export default DlgProfileUpdate