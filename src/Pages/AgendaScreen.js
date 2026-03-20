import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import TopNavigation from '../Components/Widgets/TopNavigation';
import axios from 'axios';
import * as CONSTANTS from "./../CONSTANTS";
import BottomBar from '../Components/Widgets/BottomBar';

function AgendaScreen() {
    
    const {user}                                                        = useSelector((state) => state.auth);

    const [selectedEventIndex, setSelectedEventIndex]                   = useState(0);
    const [agendaListing, setAgendaListing]                             = useState([]);

    const [loading, setLoading]                                         = useState(true);

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

            setAgendaListing(response.data); 
            setLoading(false);                         
        }catch(err){
            console.log(err);
            setLoading(false);
        }
    }

    if (loading) return <div className="p-10 text-center">Loading Agendas...</div>;
    if (agendaListing.length === 0) return <div className="p-10 text-center">No events found.</div>;

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
                <div className="flex overflow-x-auto space-x-2 pb-4 scrollbar-hide pt-3 mb-2" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
                    {agendaListing.map((event, index) => (
                        <button
                            key={event.eventCode}
                            onClick={() => setSelectedEventIndex(index)}
                            className={`px-6 py-2 text-sm font-medium transition-all me-1 ${
                                selectedEventIndex === index 
                                ? "btn-mev-active text-white" 
                                : "btn-unactive"
                            }`}
                        >
                            {event.eventCode} - {event.eventTitle}
                        </button>
                    ))}
                </div>

                {/* 2. AGENDA CARDS FOR SELECTED EVENT */}
                <div className="mt-6 space-y-4 mb-6">
                    {
                        activeEvent?.agendas?.map((item, idx) => (
                            <AgendaCard key={idx} agenda={item} />
                        ))
                    }
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
           {agenda.agendaGrade && <div><span className="font-semibold text-gray-400">GRADE:</span> {agenda.agendaGrade}</div>}
        </div>
      )}
    </div>
  );
};
export default AgendaScreen