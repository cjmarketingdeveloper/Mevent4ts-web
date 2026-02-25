import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as CONSTANTS from "./../CONSTANTS";
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaAngleLeft, FaCheckCircle, FaHourglassEnd, FaHourglassStart } from 'react-icons/fa';
import MySponsors from '../Components/Widgets/MySponsors';
import BannerSlideshow from '../Components/Widgets/BannerSlideshow';

function EventDetails() {
    const {user}                                                      = useSelector((state) => state.auth);

    const [activeDay, setActiveDay]                                   = useState(1);
    const params                                                      = useParams();

    const navigate                                                    = useNavigate();
    const [eventItem, setEventItem]                                   = useState(null);

    const [eventCode, setEventCode]                                   = useState("");
    const [eventColor, setEventColor]                                 = useState("#ce2030");

    const [listCurrentAgendas, setListCurrentAgendas]                 = useState(null);

    const [loadAgenda, setLoadAgenda]                                 = useState(false);

    const currentTime                                                 = new Date(); // Current time

    useEffect(() => {
      getMyEvent();
    },[])

    useEffect(() => {
        if(eventCode.length === 5){
            collectAggendas();
        }
    },[eventCode])

    const getMyEvent = async () => {
        try{
            const res = await axios.get(CONSTANTS.API_URL +"events/details/"+ params.id, {
                headers: {
                    token: "Bearer "+ user.accessToken
                }
            });
            console.log("Bruno fernadesh");
            setEventItem(res.data);
            console.log(res.data);
            setEventCode(res.data.eventCode);
        }catch(error){
            console.log(error);
        }
    }

    const collectAggendas = async () => {
        try{
         setLoadAgenda(true);
         let config = {
           method: 'put',
           maxBodyLength: Infinity,
           url: CONSTANTS.API_URL +"agendas/event/" + eventCode,
           headers: { 
             token: "Bearer "+ user.accessToken
           }
         };
   
         const agRep = await axios.request(config);

          setLoadAgenda(false);
          setListCurrentAgendas(agRep.data);
          
        }catch(error){
         console.log(error);
         setLoadAgenda(false);
        }
    }

    function parseTimeString(timeString) { 
        const [hours, minutes] = timeString.split(":").map(Number); // Extract hours and minutes 
        const time = new Date(); time.setHours(hours, minutes, 0, 0); // Set hours and minutes, reset seconds and milliseconds 
        return time; 
    }

    const shouldApplyAssessment = (current, action, activeDays) => {
        const checkDate = new Date(action);
        
        // Check if actionDay matches today's date
        if (
          current.getUTCFullYear() === checkDate.getUTCFullYear() &&
          current.getUTCMonth() === checkDate.getUTCMonth() &&
          current.getUTCDate() === checkDate.getUTCDate()
        ) {
          return true;
        }
      
        // If activeDay > 1, check the incremented date
        if (activeDays > 1) {
          checkDate.setUTCDate(checkDate.getUTCDate() + activeDays);
          return (
            current.getUTCFullYear() === checkDate.getUTCFullYear() &&
            current.getUTCMonth() === checkDate.getUTCMonth() &&
            current.getUTCDate() === checkDate.getUTCDate()
          );
        }
      
        return false;
    };
    
  return (
    <div>
        <div className="single-display">
            <div className="md-layer-cover">
                <div className="image-cover" 
                        style={
                            eventItem &&
                            eventItem.imageUrl && 
                            eventItem.imageUrl.length > 5
                              ? { backgroundImage: `url(${eventItem.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                              : {}
                          }>
                    
                    <button className="btn-position-return" onClick={() => navigate(-1)}>
                       <FaAngleLeft />
                    </button>
                </div>
            </div>
            <div className="outer-block">
                    {
                        eventItem && (
                            <div className="single-out">
                                <div className="lbl-view">EVENT</div>
                                <h2>{eventItem.title}</h2>
                                <div className="detail-expression">
                                    <div className="date-diplay-eve">
                                        <span className="icon-blocka">
                                          <FaHourglassStart />
                                        </span>
                                        <span>
                                        {
                                            new Date(eventItem.eventDate).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })
                                        }
                                        </span>
                                        <span> {eventItem.eventTime}</span> 
                                    </div>
                                    <div className="date-diplay-eve">
                                        <span className="icon-blocka">
                                          <FaHourglassEnd />
                                        </span>
                                        <span>
                                        {
                                            new Date(eventItem.endDate).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })
                                        }
                                        </span>                                        
                                    </div>

                                    <MySponsors 
                                        eventCode={eventItem.eventCode} 
                                        user={user} />

                                    {
                                        eventItem &&
                                        eventItem.mapUrl.length > 5 && (
                                            <div className="mgtop10">
                                                <Link 
                                                    to={eventItem.mapUrl}
                                                    className="btn btn-mevent"
                                                    target="_blank"
                                                    >
                                                    Download Map
                                                </Link>
                                            </div>
                                        )
                                    }              
                                           
                                    {
                                        eventItem && 
                                        eventItem?.banners.length > 0  &&(
                                            <BannerSlideshow eventItem={eventItem} />
                                        )
                                    }
                                    <div className="eve-descr">
                                        About Event
                                    </div>
                                    <div className="descr-diplay-eve">
                                        {eventItem.description}
                                    </div>
                                    <div className="eve-descr">
                                       Agendas
                                    </div>
                                    <div className="agenda-listing-eve">
                                    {
                                            listCurrentAgendas && (
                                                <div className="row-agenda">
                                                {/* Horizontal Buttons */}
                                                <div className="agenda-buttons">
                                                    {listCurrentAgendas.map((agenda) => (
                                                    <button
                                                        key={agenda.day}
                                                        className={activeDay === agenda.day ? "lay-item active" : "lay-item"}
                                                        onClick={() => setActiveDay(agenda.day)}
                                                    >
                                                        Day {agenda.day}
                                                    </button>
                                                    ))}
                                                </div>

                                                {/* Agenda List */}
                                                <div className="agenda-content">
                                                    {
                                                    listCurrentAgendas
                                                        .find((agenda) => agenda.day === activeDay)
                                                        ?.info.map((item, index) => {
                                                            const startTime = parseTimeString(item.startTime);
                                                            const endTime = parseTimeString(item.endTime);

                                                            //Check for today is valid                                                            
                                                            let statusClass = "";
                                                            let iconClass = "";

                                                            if(shouldApplyAssessment(currentTime, item.agendaDate, activeDay)){
                                                                statusClass = "phase-on";

                                                                 //Filter agendas for display for passed and current agenda
                                                                if (currentTime > endTime) {
                                                                    statusClass = "crossed-agenda"; // Line-through effect
                                                                    iconClass = "passed-agenda"; // Passed event
                                                                } else if (currentTime < startTime) {
                                                                    statusClass = "prior-view"; // Future event
                                                                }                                                                
                                                            }

                                                                return (
                                                                <div key={index} className={`agenda-item ag-gray ${statusClass}`}>
                                                                    <div className="content-setup ">
                                                                        <div className="agenda-name">{item.title}</div>
                                                                            <div className={`icon-view ${iconClass}`}>
                                                                                <FaCheckCircle />
                                                                            </div>
                                                                        </div>
                                                                        <div className="date-showcase">
                                                                            <span> {item.startTime}</span> - 
                                                                            <span> {item.endTime}</span>
                                                                        </div>
                                                                </div>
                                                                );
                                                            })
                                                    }
                                                </div>
                                            </div>
                                            )
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                        )
                    }                                    
            </div>
        </div>        
    </div>
  )
}

export default EventDetails