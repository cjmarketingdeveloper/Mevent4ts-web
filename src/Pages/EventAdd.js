import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../Components/Others/Spinner';
import axios from 'axios';
import * as CONSTANTS from "./../CONSTANTS";
import { toast } from 'react-toastify';
import { setUser } from "../reduxAuth/authSlice"; 
import TopNavigation from '../Components/Widgets/TopNavigation';

function EventAdd() {

    const dispatch                                                      = useDispatch();
    
    const {user}                                                        = useSelector((state) => state.auth);

    const [isLoading, setIsLoading]                                     = useState(false);

    const [eventCode, setEventCode]                                     = useState("");

    const activateEventAccount = async (e) => {
        e.preventDefault();
    
        if(eventCode.length === 5){
          setIsLoading(true);
          try{
    
            const userActivate = {
              "id" : user._id,
              "code" : eventCode 
            }
    
            const response = await axios.put(CONSTANTS.API_URL +"users/activate", userActivate, {
                  headers: {
                      token: "Bearer "+ user.accessToken
                  }
              });
    
            setIsLoading(false);
            
            if (response.status === 200) {
                dispatch(setUser(response.data)); // Update Redux store
                localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(response.data));
                toast.success("User has been updated with event. Thank you.");
            }else {
              toast.warning("Activation had an issue, please try again.");
            }
    
          }catch(err){
      
              if(err.status === 401){
                toast.error(err.response.data);                
              }else {
                toast.error("Something went wrong, please try again later.");
              }

            setIsLoading(false);
          }

        }else {
          toast.warning("Event Code should be 5 characters only.")
        }
    }

    if (isLoading) {
         return  <Spinner />
    }
    
  return (
    <div>
      <div className="top-navbar">
            <TopNavigation title={"Find Event"} />
        </div>
        <div className="layer-block">
           <div className="layer-content">
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
            </div>
        </div>
    </div>
  )
}

export default EventAdd