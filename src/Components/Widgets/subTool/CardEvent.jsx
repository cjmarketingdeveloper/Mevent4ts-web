import {motion, useTransform } from 'framer-motion';
import React from 'react'
import { Link } from 'react-router-dom';

function CardEvent({event, index, progress, range, targetScale }) {

  const getRandomDarkColor = () => {
    const r = Math.floor(Math.random() * 100); // Low values for darker shades
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const scale         = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="card-event-container">
        <motion.div 
            className="card-box area-event"                                   
            style={{scale, backgroundColor: getRandomDarkColor() , top: `calc(-10% + ${index * 60}px )`}}
            >
           <div className="insert-image"
              style={
                event.imageUrl && event.imageUrl.length > 5
                  ? { backgroundImage: `url(${event.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : {}
              }>
              <div className="event-card-overlay">
                    <div className="event-content-card">
                       <div className="border-event-cd">
                          <h1>{event.title}</h1>  
                            <div className="event-phase text-center">
                                <Link to={"/event-single/" + event._id} className="btn btn-mevent">VIEW NOW</Link>
                            </div>
                       </div>
                    </div>  
              </div>  
          </div> 
      </motion.div>
   </div>
  )
}

export default CardEvent