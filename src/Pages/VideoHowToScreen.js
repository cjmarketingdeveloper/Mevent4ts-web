import React from 'react'
//import { useSelector } from 'react-redux';
import TopNavigation from '../Components/Widgets/TopNavigation';
import HowToVideos from '../Components/Widgets/HowToVideos';

function VideoHowToScreen() {
         
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