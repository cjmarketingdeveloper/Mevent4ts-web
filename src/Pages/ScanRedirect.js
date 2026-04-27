import React, { useEffect, useRef, useState } from 'react'
import Loading from '../Components/Others/Loading';
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as CONSTANTS from "./../CONSTANTS";
import { useParams } from 'react-router-dom';
import mevScan from './../assets/qrcode8739.png';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function ScanRedirect() {
    const {user}                                            = useSelector((state) => state.auth);
    const params                                            = useParams();
    const [scanning, setScanning]                           = useState(true);
    const [loading, setLoading]                             = useState(false);
    const navigate                                          = useNavigate();

    useEffect(() => {

       if(user && params.id){
            processScanIfLoggedin();
       }       
    },[])
   

    const processScanIfLoggedin = async () => {
        try{

            setLoading(true);
            const voting = {
                "userid" : user._id,
                "votingCode" : params.id
            }

            const response = await axios.post(CONSTANTS.API_URL +"votes/creation", voting, {
                    headers: {
                        token: "Bearer "+ user.accessToken
                    }
                });
            
            if(response.status === 201){
                toast.success("Scan was successful.");
                setLoading(false);
                navigate('/');
            }

        }catch(err){
            /*
            console.log(err);
            console.log("0000000000000000000000000");
            console.log(err.status);
            */
            setLoading(false);
            if(err.status){
                toast.warning("You have already scanned the QR Code");
                setTimeout(() => {
                     navigate('/');
                }, 4000);
            }else {
                toast.error("Something went wrong, please try again later.");
            }
            
        }
    }

  return (
    <div>
        <div className="layer-block">
           <div className="layer-content">
                <img src={mevScan} className="img-responsive" />
                {
                    (!user | !params.id) ?
                    <div className="text-center mt-3">
                       <h2>You are not logged in</h2>
                       <p>Please login and then scan using the mevent App, rather than the phone</p>
                       <Link
                            to={'/login'} 
                            className="btn btn-mevent mt-2">
                             Login
                       </Link>
                    </div>
                    :
                    <div className="">
                        {loading && <Loading />}  

                    </div>
                }
           </div>
        </div>
    </div>
  )
}

export default ScanRedirect