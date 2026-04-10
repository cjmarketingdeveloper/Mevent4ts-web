import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import TopNavigation from '../Components/Widgets/TopNavigation';
import BottomBar from '../Components/Widgets/BottomBar';
import { FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import axios from 'axios';
import * as CONSTANTS from "./../CONSTANTS";
import SpouseDetails from '../Components/Widgets/SpouseDetails';
import { Link } from 'react-router-dom';

function ProfileScreen() {
    const {user}                                                        = useSelector((state) => state.auth);

    const [dietary, setDietary]                                         = useState(null);

    useEffect(() => {
        collectDietaryData();
    },[]);

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

  return (
    <div>
        <div className="top-navbar">
            <TopNavigation title={"Profile"} />
        </div>
        <div className="layer-block">
           <div className="layer-content">         
                <div className="icon-photo">
                    <FaUser />
                </div>
                <div className="text-center mt-2 mb-2">
                     <h3 >{user.name} {user.surname}</h3>
                     <div>
                        {user.profession}
                     </div>
                </div>

                <div className="text-center mt-5 mb-5">
                     <div>
                        <span><FaPhone /> </span><span >{user.phonenumber}</span>
                     </div>
                     <div>
                        <span><FaEnvelope /> </span><span >{user.email}</span>
                     </div>
                     <Link to={"/rsvp"} className="btn btn-mevent mt-2">Edit Profile</Link>
                </div>
                <div className="p-3">
                    
                    <div className="card card-bl-grad">
                        <div className="card-body">
                            <h4 className="text-center">My Dietary Requirements</h4>
                            <div className="short-line-bottom"></div>
                            <div className="dietary-block text-center mt-3">
                                {
                                    dietary && (
                                        <div className="dietary-block-info">
                                            
                                            {
                                                dietary.badge.length > 1 && <img src={dietary.badge} className="img-badge" />
                                            }
                                           <div className="diet-title">
                                                {dietary.title}
                                            </div> 
                                        </div>
                                    )
                                }
                            </div>
                            <div className="mt-2 mb-5 text-center">
                                <Link to={"/rsvp"} className="btn btn-mevent ">Change Dietary Requirements</Link>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    user.spouseNumber.length === 10 && <SpouseDetails 
                        spouseNumber={user.spouseNumber}
                        CONSTANTS={CONSTANTS} />
                }
                 {//JSON.stringify(user.events)
                 }
           </div>
        </div>
        <BottomBar />
        <br/><br/>
    </div>
  )
}

export default ProfileScreen