import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import * as CONSTANTS from "./../CONSTANTS";
import { toast } from 'react-toastify';
import axios from 'axios';
import TopNavigation from '../Components/Widgets/TopNavigation';
import { FaQrcode } from 'react-icons/fa';

function SponsorsList() {

    const {user}                                                    = useSelector((state) => state.auth);

    const [sponsors, setSponsors]                                   = useState([]);


    useEffect(() => {
        collectSponsorsList();
    },[])

    const collectSponsorsList = async () => {
        try{

            const content = {
                "userid" : user._id
            }
            const res = await axios.put(CONSTANTS.API_URL +"sponsors/event/list/with-votes/v2", content, {
                headers: {
                    token: "Bearer "+ user.accessToken
                }
            });

            //console.log(res.data);
            setSponsors(res.data);
        }catch(errorData){
            console.log(errorData);
        }
    }
  return (
    <div>
        <div className="top-navbar">
            <TopNavigation title={"My Scans"} />
        </div>
        <div className="layer-block">
           <div className="layer-content">
               {
                  sponsors &&
                  sponsors.length > 0 && (
                    <div className="list-items list-of-sponsors">
                        {
                            sponsors.map((item, index) => (
                                 <div className="item sponsor-item" key={index}>
                                            <div className={"flexme content-item scvote-" +  item.voted}>
                                                <div className="image-logo">
                                                    <div className="img-inner">
                                                        <img src={item.logo} className="img-responsive" />
                                                    </div>
                                                </div>
                                                <div className="content-title">
                                                    {item.title}
                                                </div>
                                                <div className="scan-expression" >
                                                    <FaQrcode />
                                                </div>
                                            </div>    
                                        </div>
                            ))
                        }
                    </div>
                  )
               }
            </div>
        </div>
    </div>
  )
}

export default SponsorsList