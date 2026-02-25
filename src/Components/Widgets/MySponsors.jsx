import React, { useEffect, useState } from 'react'
import * as CONSTANTS from "../../CONSTANTS";
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import PushModal from './PushModal';
import { AnimatePresence } from 'framer-motion';

function MySponsors({eventCode, user}) {

    const [myEventSponsors, setMyEventSponsors]                             = useState([]);
    const [isVisible, setIsVisible]                                         = useState(false);

    useEffect(() => {
        getMyListOfSponsors();
    },[])

    const getMyListOfSponsors = async () => {
        try{
          
           const ramSponsor = {
                "userid" : user._id,
                "eventcode" : eventCode
           }
    
          const response = await axios.put(CONSTANTS.API_URL +"sponsors/event/list/with-votes" , ramSponsor, {
                headers: {
                    token: "Bearer "+ user.accessToken
                }
            });
    
            setMyEventSponsors(response.data);
        }catch(err){
          console.log(err);
        }
    }

  return (
    <div className="plein-sponsor">
       
            {
                myEventSponsors.length > 0 && (
                    <div className="sponsor-circles-short-list">
                            <ul className="circles-bay">
                                {
                                    myEventSponsors.map((sponsor, index) => {
                                        return <li key={index} className="cicle-item-box"> 
                                                    <img src={sponsor.logo} className="cicle-item-image"/>
                                                </li>
                                    })
                                }
                            </ul>
                         <button className="sponsor-view" onClick={() => setIsVisible(true)}>
                            <FaPlus />
                        </button>
                    </div>
                )
            }
     
        <AnimatePresence>
            {
                isVisible && (
                    <PushModal 
                        myEventSponsors={myEventSponsors}
                        setIsVisible={setIsVisible}
                        user={user}/>
                )
            }
        </AnimatePresence>      
    </div>
  )
}

export default MySponsors