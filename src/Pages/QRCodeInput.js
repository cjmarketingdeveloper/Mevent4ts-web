import React, { useState } from 'react'
import TopNavigation from "./../Components/Widgets/TopNavigation";
import * as CONSTANTS from "./../CONSTANTS";
import { toast } from 'react-toastify';
import mevLand from './../assets/mevent-input.png';
import mevCheck from './../assets/mevent-check.png'
import mevError from './../assets/mevent-error.png';
import Loading from '../Components/Others/Loading';
import { useSelector } from 'react-redux';
import axios from 'axios';

function QRCodeInput() {

  const {user}                                                        = useSelector((state) => state.auth);
  const [codeString, setCodeString]                                   = useState("");
  const [loading, setLoading]                                         = useState(false);

  const handleCodeVote = async (e) => {
    e.preventDefault();

      try{

        if(codeString.length === 6){
          setLoading(true);

              const votingObject = {
                  "userid" : user._id,
                  "votingCode" : codeString
                }
        
              const response = await axios.post(CONSTANTS.API_URL +"votes/creation", votingObject, {
                      headers: {
                          token: "Bearer "+ user.accessToken
                      }
                  });

              toast.success("Your scan was successful.");             
              setLoading(false);
        }else {
          toast.warning("Code length needs to six characters.");
        }
       
      }catch(err){
        console.log(err);
        if(err.status === 401){
          toast.error(err.response.data);
        }else if(err.status === 409){
          toast.error(err.response.data);
        }else {
          toast.error("Something went wrong, please try again later.")
        }
        setLoading(false);
      }
  }

  return (
    <div>
        <div className="top-navbar">
            <TopNavigation title={"QR Code Input"} />
        </div>
        
        <div className="layer-block">
           <div className="layer-content">
              <div className="text-center">
                  <img src={mevLand} className="image-dispay-v" />
              </div>
              
              <div className="land-item-form">

              {
                  loading ? <Loading />
                  :
                  <form onSubmit={handleCodeVote}>
                    <div className="form-group">
                      <h3>Enter your Session or Supplier Code</h3>
                      <input 
                        type="text"
                        className="form-control ses-code"
                        onChange={(e) => setCodeString(e.target.value)}
                        maxLength={6}
                        required
                        />
                    </div>
                    <div className="form-control">
                      <button className="btn btn-mevent">Submit</button>
                    </div>
                  </form>
              }
                  
              </div>
           </div>
        </div>
      </div>
  )
}

export default QRCodeInput