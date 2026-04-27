import React, { useEffect, useState } from 'react'
import axios from 'axios';
import * as CONSTANTS from "../CONSTANTS";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import TopNavigation from '../Components/Widgets/TopNavigation';
import HowToVideos from '../Components/Widgets/HowToVideos';

function VideoHowToScreen() {
     const {user}                                                            = useSelector((state) => state.auth);
     const [processing, setProcessing]                                       = useState(false);
     
  return (
    <div>
        <div className="top-navbar">
            <TopNavigation title={"How To Videos"} />
        </div>
        <div className="layer-block">
            <div className="layer-content"> 
                
                <HowToVideos />
            </div>
        </div>
    </div>
  )
}

export default VideoHowToScreen