import React, { useEffect } from 'react';
import * as CONSTANTS from "../../CONSTANTS";
import { Link } from 'react-router-dom';

function EventSingle({user, eventContent}) {
    
    const returnDateMonthFromDate = (eventContent) => {
        const eventDate = new Date(eventContent);
       return eventDate.toLocaleString("en-US", { month: "short" });
    }

    const returnDateDayFromDate = (eventContent) => {
        const eventDate = new Date(eventContent);
       return eventDate.getDate(); 
    }
  return (
    <div>
        {
            eventContent && 
            eventContent !== null && (
                <div className="single-event">
                    <div className="relic-row-head">
                        <div className="dt-parts">
                            <div className="date-block opening-date"
                                style={{
                                    border:"2px solid" + eventContent.colorCode,
                                    color: "white",
                                }}>
                                <div className="dt-month"
                                    style={{
                                        backgroundColor:eventContent.colorCode,
                                        padding: "4px",
                                        color: "white",
                                    }}>
                                        {returnDateMonthFromDate(eventContent.eventDate)}</div>
                                <div className="dt-day"
                                    style={{
                                        textAlign:"center",
                                        color: eventContent.colorCode,
                                    }}>{returnDateDayFromDate(eventContent.eventDate)}</div>
                            </div>
                        </div>
                        <div className="imag-title">
                            <div className="image-feature">
                                {
                                    eventContent.imageUrl && eventContent.imageUrl.length > 5
                                    ? 
                                        <img 
                                            src={eventContent.imageUrl} 
                                            className="image-ft" />
                                    :
                                    <img 
                                        src={CONSTANTS.DEFAULT_BANNER} 
                                        className="image-ft" />
                                }
                                
                            </div>
                            <div className="head-event he2">
                                <h3>{eventContent.title}</h3>
                            </div>
                        </div>        
                    </div>
                    <div className="relic-row-body">
                        
                        <div className="date-content">
                            <span className="dtct-label">START</span> - 
                            <span className="eve-time"> {eventContent.eventTime}</span>                            
                        </div>
                        <div className="color-code"
                            style={{
                                backgroundColor:eventContent.colorCode
                            }}>
                            {eventContent.eventCode}
                        </div>
                        <div className="date-content">
                            <span className="dtct-label">END</span> - 
                            <span className="eve-time"> {eventContent.endTime}</span>                            
                        </div>
                    </div>
                    <div className="desc-content-inn">
                        {eventContent.description}                       
                    </div>
                    <div className="event-phase-single">
                        
                        <Link to={"/event-single/" + eventContent._id} className="btn btn-mevent">VIEW NOW</Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default EventSingle