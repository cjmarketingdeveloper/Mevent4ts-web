import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import TopNavigation from '../Components/Widgets/TopNavigation';

function GalleryEvent() {
    const {user}                                                      = useSelector((state) => state.auth);


  return (
     <div>
        <div className="top-navbar">
            <TopNavigation title={"Gallery"} />
        </div>
        <div className="layer-block">
           <div className="layer-content"> 
            </div>
        </div>
    </div>
  )
}

export default GalleryEvent