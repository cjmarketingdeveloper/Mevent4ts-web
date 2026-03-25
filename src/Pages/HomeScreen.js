import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import * as CONSTANTS from "./../CONSTANTS";
import { FaClipboard, FaHive, FaMap, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from '../Components/Others/Spinner';
//import { setUser } from "../reduxAuth/authSlice"; 
//import EventSingle from '../Components/Widgets/EventSingle';
//import EventMultiple from '../Components/Widgets/EventMultiple';
import { Link, Links } from 'react-router-dom';
import Loading from '../Components/Others/Loading';
import FranchiseeRsvp from '../Components/Widgets/rsvp/FranchiseeRsvp';
import PotentialRsvp from '../Components/Widgets/rsvp/PotentialRsvp';
import ClinicRsvp from '../Components/Widgets/rsvp/ClinicRsvp';
import VipRsvp from '../Components/Widgets/rsvp/VipRsvp';
import TradeshowRsvp from '../Components/Widgets/rsvp/TradeshowRsvp';
import logoHome from '../assets/logo.png';
import HomeSponsors from '../Components/Widgets/HomeSponsors';
import SpouseDetails from '../Components/Widgets/SpouseDetails';
import whiteFloor from './../assets/white-floor.jpg';
import NotificationFire from '../Components/Others/NotificationFire';


function HomeScreen() {

  const dispatch                                                      = useDispatch();

  const {user}                                                        = useSelector((state) => state.auth);

  const [isLoading, setIsLoading]                                     = useState(false);
  const [isLoadEvent, setIsLoadEvent]                                 = useState(false);
  const [eventCode, setEventCode]                                     = useState("");

  const [eventList, setEventList]                                     = useState([]);

  const [dietary, setDietary]                                         = useState(null);

  const [sponsorCount, setSponsorCount]                               = useState(0);
  const [sponsorScanned, setSponsorScanned]                           = useState(0);
 
  const progressPercentage = sponsorCount > 0 ? (sponsorScanned / sponsorCount) * 100 : 0;
  
  useEffect(() => {
      collectDietaryData();
  },[]);
        
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

  const collectDietaryData = async () => {
      try{

          const response = await axios.get(CONSTANTS.API_URL +"users/dietary/item/of-user/" + user.dietary);
         
          if(response.status === 200){
              setDietary(response.data);
          }
      }catch(err){
          console.log(err);
      }
  }

  if (isLoading) {
      return  <Spinner />
  }

  return (
    <div>
        <p className="text-center smal-g">
            { CONSTANTS.VERSION}
        </p>
                
        <div className="main-area-view row mb-10"> 
           <div className="p-3">
              <div className="card card-bl-grad">
                <div className="card-body">
                  <img src={logoHome} className="home-logo mt-4 ml-3" />
                  <div className="header-row">
                    
                    <div className="item-head">
                      <h2 className="line-one">Welcome <span className="colorred">{user.name}</span>, </h2>
                    </div>                
                  </div>
                  <div className="row mb-3">
                    <div className="w-50 p-2">
                        <div className="card-boxer">
                          <img src={whiteFloor} className="home-card map-road" />
                          <Link to={"/map"} className="btn btn-gray w-100 colorred">
                            
                              <span>View Map</span>
                          </Link>
                        </div>
                    </div>
                    <div className="w-50 p-2">
                        <div className="card-boxer">
                          {dietary?.badge && <img src={dietary.badge} className="home-card map-road" />} 
                          <Link to={"/profile"} className="btn btn-mevent w-100">                        
                              <span>Dietary</span>
                          </Link>
                        </div>
                        
                    </div>
                  </div>
                  <div className="d-flex">
                      <div className="data-supplier-one">
                        <FaClipboard />
                      </div>
                      <div className="data-supplier-two">
                        Supplier Discovery
                      </div>
                      <div className="data-supplier-three">
                        <span className="colorred">{sponsorScanned} </span>
                        <span className="">/{sponsorCount} </span>
                        <span className="gray">SCANNED</span>
                      </div>
                  </div>
                  <div className="mt-3 progress-box mb-3">
                    <div 
                        className="progress-bar" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                  </div>
                </div>
              </div>
            </div>   
           <div className="p-3">
             <Link className="btn btn-gradient d-flex" to={"/agendas"}>
               <div className="icon-item perc-banner1">
                    <div className="home-icon-item mt-3">
                      <FaHive />
                    </div>

               </div>
               <div className="content-title">
                  <h4>Current Agenda</h4>
                  Agenda Item title
               </div>
                <div className="content-log perc-banner1">
                  <div className="content-log--2">
                    <FaSignOutAlt />
                  </div>
               </div>
             </Link>
           </div>

            <div className="p-2">
              <HomeSponsors 
                eventCodes={user.events} 
                user={user} 
                CONSTANTS={CONSTANTS} 
                setSponsorCount={setSponsorCount}
                setSponsorScanned={setSponsorScanned}
              />
            </div>

           {
              user.spouseNumber.length === 10 && <div className="p-3">
                <SpouseDetails 
                spouseNumber={user.spouseNumber}
                CONSTANTS={CONSTANTS} />
              </div>
           }
         
          {/*<div className="line-two">Please check RSVP Details.</div>
            user.profile.profileName == "Franchisee" && (
              <FranchiseeRsvp user={user} CONSTANTS={CONSTANTS} />
            )
            */
          }
          {/*
            user.profile.profileName == "Potential" && (
              <PotentialRsvp user={user} CONSTANTS={CONSTANTS} />
            )
              */
          }
          {/*
            user.profile.profileName == "Clinic" && (
              <ClinicRsvp user={user} CONSTANTS={CONSTANTS} />
            )
            */
          }
          {/*
            user.profile.profileName == "VIP" && (
              <VipRsvp user={user} CONSTANTS={CONSTANTS} />
            )
              */
          }
          {/*
            user.profile.profileName == "Tradeshow" && (
              <TradeshowRsvp user={user} CONSTANTS={CONSTANTS} />
            )
         */ }
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
         <br/><br/><br/>
    </div>
  )
}

export default HomeScreen