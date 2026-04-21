import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import TopNavigation from '../Components/Widgets/TopNavigation';
import axios from 'axios';
import * as CONSTANTS from "./../CONSTANTS";
import { FaCloudDownloadAlt } from "react-icons/fa";
import BottomBar from '../Components/Widgets/BottomBar';

function AgendaScreen() {
    
    const {user}                                                        = useSelector((state) => state.auth);

    const [selectedEventIndex, setSelectedEventIndex]                   = useState(0);
    const [agendaListing, setAgendaListing]                             = useState([]);

    const [loading, setLoading]                                         = useState(true);

    const [selectedDate, setSelectedDate] = useState(null);

    // 1. Group agendas by date whenever the active event changes
    const groupedAgendas = useMemo(() => {
        const activeEvent = agendaListing[selectedEventIndex];
        if (!activeEvent || !activeEvent.agendas) return {};

        const groups = activeEvent.agendas.reduce((acc, agenda) => {
            const date = agenda.agendaDate; // Assuming format YYYY-MM-DD
            if (!acc[date]) acc[date] = [];
            acc[date].push(agenda);
            return acc;
        }, {});
        
        return groups;
    }, [agendaListing, selectedEventIndex]);

    const availableDates = Object.keys(groupedAgendas).sort();

    // 2. Logic to set the default date (Today or First Day)
    useEffect(() => {
        if (availableDates.length > 0) {
            const todayStr = new Date().toISOString().split('T')[0];
            if (availableDates.includes(todayStr)) {
                setSelectedDate(todayStr);
            } else {
                setSelectedDate(availableDates[0]);
            }
        }
    }, [groupedAgendas]);

    useEffect(() => {
        collectEventAgendas();
    },[])

    const collectEventAgendas = async () => {
        try{
            
            const contentAgendas = {
                "eventCodes": user.events
            }

          setLoading(true);
          const response = await axios.put(CONSTANTS.API_URL +"agendas/event/listing/v2", contentAgendas, {
                      headers: {
                          token: "Bearer "+ user.accessToken
                      }
                  });
            //console.log(response.data);

            setAgendaListing(response.data); 
            setLoading(false);                         
        }catch(err){
            console.log(err);
            setLoading(false);
        }
    }

    if (loading) return <div className="p-10 text-center">Loading Agendas...</div>;
    //if (agendaListing.length === 0) return <div className="p-10 text-center">No events found.</div>;

    // Access the current active event based on the index
    const activeEvent = agendaListing[selectedEventIndex];
    
  return (
    <div>
        <div className="top-navbar">
            <TopNavigation title={"Agenda"} />
        </div>
        <div className="layer-block">
           <div className="layer-content">         
              
                {/* 1. HORIZONTAL SCROLLABLE PILLS */}
                <div className="flex overflow-x-auto space-x-2 pb-4 no-scrollbar pt-3 mb-2" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
                    {agendaListing.map((event, index) => (
                        <button
                            key={event.eventCode}
                            onClick={() => setSelectedEventIndex(index)}
                            className={`text-sm font-medium transition-all me-2 b-days ${
                                selectedEventIndex === index 
                                ? "btn-mev-active text-white shadow" 
                                : "btn-unactive"
                            }`}
                        >
                            {event.eventCode} - {event.eventTitle}
                        </button>
                    ))}
                </div>

                {/* 2. AGENDA CARDS FOR SELECTED EVENT */}
                <div className="d-flex overflow-auto flex-nowrap pb-3 mb-2 no-scrollbar" style={{ gap: '8px' }}>
                    {availableDates.map((date) => {
                        const dateObj = new Date(date);
                        const isActive = selectedDate === date;
                        
                        return (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`btn flex-shrink-0 d-flex flex-column align-items-center py-2 px-3 rounded-4 transition-all ${
                                    isActive ? "b-active-date shadow" : "btn-light border text-muted"
                                }`}
                                style={{ minWidth: '70px' }}
                            >
                                <small className="fw-bold" style={{ fontSize: '0.65rem' }}>
                                    {dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                                </small>
                                <span className="fs-5 fw-bold">{dateObj.getDate()}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="mt-3">
                    {selectedDate && groupedAgendas[selectedDate] ? (
                        groupedAgendas[selectedDate].map((item, idx) => (
                            <AgendaCard key={idx} agenda={item} />
                        ))
                    ) : (
                        <div className="text-center p-5 text-muted">No agendas for this date.</div>
                    )}
                </div>
                <br/><br/><br/>
           </div>
        </div>
        <BottomBar />
    </div>
  )
}

// CHILD COMPONENT FOR INDIVIDUAL CARDS
const AgendaCard = ({ agenda }) => {
  const [showDetails, setShowDetails] = useState(false);

  const isPassed = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for fair comparison

    const agendaDate = new Date(agenda.agendaDate);
    agendaDate.setHours(0, 0, 0, 0);

    return agendaDate < today;
  };

  // 2. Determine the class name
  const statusClass = isPassed() ? "passed-day" : "normal-day";

  return (
    <div className={"bg-white border rounded-xl shadow-sm overflow-hidden mb-2 " + statusClass}>
      {/* ROW 1: Main Info */}
      <div className="p-4 flex justify-between items-center position-relative">
        <div>
          <h4 className="title-ag1 font-bold">{agenda.title}</h4>
          <p className="text-sm text-gray-500 font-mono">
            {agenda.startTime} - {agenda.endTime}
          </p>
          {
            agenda.downloadableUrls.length > 0 && <div className="ag-downld"><FaCloudDownloadAlt /></div>
            
          }
        </div>
        
        {/* Toggle Checkbox */}
        <div className="fl-right-boxer">
            <input 
              type="checkbox" 
              className="w-5 h-5 accent-blue-600 cursor-pointer"
              checked={showDetails}
              onChange={() => setShowDetails(!showDetails)}
            />
        </div>
      </div>

      {/* ROW 2: Expandable Details */}
      {showDetails && (
        <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100 grid grid-cols-2 gap-y-2 text-xs text-gray-600 bottom-footx">
           <div><span className="font-semibold text-gray-400">DAY:</span> {agenda.agendaDay}</div>
           <div><span className="font-semibold text-gray-400">DATE:</span> {new Date(agenda.agendaDate).toDateString()}</div>
            {/* DOWNLOADS SECTION */}
            {agenda.downloadableUrls && agenda.downloadableUrls.length > 0 && (
            <div className="mt-2 pt-2 border-top">
                <div className="fw-bold text-uppercase opacity-75 mb-2" style={{ fontSize: '10px' }}>
                Attachments
                </div>
                <div className="d-flex flex-wrap gap-2">
                {agenda.downloadableUrls.map((doc, dIdx) => (
                    <a
                    key={dIdx}
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm d-inline-flex align-items-center py-1 px-2 text-decoration-none"
                    style={{ fontSize: '15px', borderRadius: '6px' }}
                    >
                    {/* Bootstrap Icon (if you have them) or a simple symbol */}
                    <span className="me-3">📁</span> 
                    {`Download ${dIdx + 1}`}
                    </a>
                ))}
                </div>
            </div>
            )}
           

        </div>
      )}
    </div>
  );
};
export default AgendaScreen