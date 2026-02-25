import React, { useEffect, useRef } from 'react'
import {  useScroll } from 'framer-motion';
import CardEvent from './subTool/CardEvent';
import Lenis from '@studio-freight/lenis'

function EventMultiple({eventContent, user}) {
  
    const containerEventsRef                                            = useRef(null);
  
    const { scrollYProgress }                                           = useScroll({
      target: containerEventsRef,
      offset: ['start', 'start', 'end', 'end']
    });
    
    useEffect(() => {
      const lenis = new Lenis();

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      
      requestAnimationFrame(raf);
    },[])
    
//range is for when to start scaling
  return (
    <div className="event-lane">
         {
          eventContent.length > 0 && (
            <div className="event-container" ref={containerEventsRef}>
              {
                eventContent.map((event, index) => {
                  const targetScale = 1 - ((eventContent.length - index) * 0.15);
                  return <CardEvent  
                              key={index}
                              event={event} 
                              index={index} 
                              progress={scrollYProgress}
                              range={[index * 0.25, 1]} 
                              targetScale={targetScale}/>
                })
              }
            </div>
          )
         }
    </div>
  )
}

export default EventMultiple