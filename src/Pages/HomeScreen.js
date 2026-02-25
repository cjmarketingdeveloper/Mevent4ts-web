import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as CONSTANTS from "./../CONSTANTS";
import { FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from '../Components/Others/Spinner';
//import { setUser } from "../reduxAuth/authSlice"; 
//import EventSingle from '../Components/Widgets/EventSingle';
//import EventMultiple from '../Components/Widgets/EventMultiple';
import { Link } from 'react-router-dom';
import Loading from '../Components/Others/Loading';
import FranchiseeRsvp from '../Components/Widgets/rsvp/FranchiseeRsvp';
import PotentialRsvp from '../Components/Widgets/rsvp/PotentialRsvp';
import ClinicRsvp from '../Components/Widgets/rsvp/ClinicRsvp';
import VipRsvp from '../Components/Widgets/rsvp/VipRsvp';
import TradeshowRsvp from '../Components/Widgets/rsvp/TradeshowRsvp';

function HomeScreen() {

  const dispatch                                                      = useDispatch();

  const {user}                                                        = useSelector((state) => state.auth);

  const [isLoading, setIsLoading]                                     = useState(false);
  const [isLoadEvent, setIsLoadEvent]                                 = useState(false);
  const [eventCode, setEventCode]                                     = useState("");

  const [eventList, setEventList]                                     = useState([]);

  useEffect(() => {
    getEventList();
  },[user])

  const getEventList = async () => {
      if(user.events.length > 0){
        //////////////////////
          try {
            
            const eventObject = {
              "eventCodes" : user.events
            }
         
            setIsLoadEvent(true);

          const eventData = await axios.put(CONSTANTS.API_URL +"events/list/specific", eventObject, {
                  headers: {
                      token: "Bearer "+ user.accessToken
                  }
              });
              setEventList(eventData.data);
              setIsLoadEvent(false);
        }catch(error){
            console.log(error);
            setIsLoadEvent(false);
        }
        //////////////////////
      }
  }


  if (isLoading) {
      return  <Spinner />
  }

  return (
    <div>
        
        <div className="header-row">
          <div className="item-head">
            <h2 className="line-one">Hi  <span className="colorred">{user.name}</span>, </h2>
            <div className="line-two">Please check RSVP Details.</div>
          </div>
          <div className="item-head prof-lane">
            {
              user.profilePic.length > 3 ?
              <div className="item-profile">
                <div className="profile-image home-prof">
                  <Link to={"/profile"} >
                     <img src={user.profilePic} className="fit-image" />
                  </Link>
                </div>
              </div>
              :
              <div className="item-profile">
                 <div className="profile-icon">
                    <Link to={"/profile"} className="colorred">
                       <FaUser />
                    </Link>
                 </div>
              </div>
            }
          </div>
        </div>
        <div className="main-area-view"> 
           <p className="text-center smal-g">
            { CONSTANTS.VERSION}
          </p>
          {
            user.profile.profileName == "Franchisee" && (
              <FranchiseeRsvp user={user} CONSTANTS={CONSTANTS} />
            )
          }
          {
            user.profile.profileName == "Potential" && (
              <PotentialRsvp user={user} CONSTANTS={CONSTANTS} />
            )
          }
          {
            user.profile.profileName == "Clinic" && (
              <ClinicRsvp user={user} CONSTANTS={CONSTANTS} />
            )
          }
          {
            user.profile.profileName == "VIP" && (
              <VipRsvp user={user} CONSTANTS={CONSTANTS} />
            )
          }
          {
            user.profile.profileName == "Tradeshow" && (
              <TradeshowRsvp user={user} CONSTANTS={CONSTANTS} />
            )
          }
        <br/><br/>
            {
            /*
              user.events.length > 0 ?
              <div className="event-show">
                {
                  isLoadEvent && (<div className="lane-loading"><Loading /></div>)
                }
                {
                  eventList &&
                  eventList.length > 0 && (
                    <>
                    {
                      user.events.length === 1 ? 
                           <EventSingle  
                              eventContent={eventList[0]}                        
                              user={user}
                             />
                        :
                           <div  className="event-main">
                              <EventMultiple 
                                eventContent={eventList} 
                                user={user}                         
                              />
                           </div>
                    }
                    </>
                  )
                }
              </div> 
              :
              <div className="add-event">
               
                <div className="add-event-base-form">
                <h2 className="add-event-title">Find Event</h2>
                  <form onSubmit={activateEventAccount}>
                    <div className="form-group">
                      <input 
                        type="text" 
                        className="form-control fr-phase-code" 
                        maxLength={5} 
                        onChange={(e)=> setEventCode(e.target.value)}
                        placeholder="Enter Code" />
                    </div>
                    <div className="form-group">
                      <button className="btn btn-mevent" >
                        Activate
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              */
            }
        </div>
    </div>
  )
}

export default HomeScreen