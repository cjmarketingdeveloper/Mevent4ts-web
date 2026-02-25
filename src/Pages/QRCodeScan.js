import React, { useEffect, useRef, useState } from 'react'
import TopNavigation from "./../Components/Widgets/TopNavigation";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { toast } from 'react-toastify';
import mevError from './../assets/mevent-error.png';
import mevCheck from './../assets/mevent-check.png';
import Loading from '../Components/Others/Loading';
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as CONSTANTS from "./../CONSTANTS";
import { Link, useNavigate } from 'react-router-dom';
import mevSuccess from './../assets/success-load.png';
import QRScanSuccess from '../Components/Diaologues/QRScanSuccess';

function QRCodeScan() {

  const {user}                                            = useSelector((state) => state.auth);
  
  const [scanBtnShow, setScanBtnShow]                     = useState(true);
  const [scanning, setScanning]                           = useState(true);
  const [loading, setLoading]                             = useState(false);
  const [responseData, setResponseData]                   = useState(null);

  const [titleDialogue, setTitleDialogue]                 = useState("");
  const [urlImage, setUrlImage]                           = useState();

  const videoRef                                          = useRef(null);
  
  const startScan = async () => {
   
    setScanBtnShow(false)
    setScanning(true);
    setResponseData(null);
    
    const codeReader = new BrowserMultiFormatReader();
    
    try {
      const videoElement = videoRef.current;
    
      const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoElement);
      
      if(result.text.length === 6){
        stopScan();
        
        // Stop the camera
        if (videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
        }   

        handleScannedData(result.text);
      }
      
    } catch (err) {
      console.log("QR scanning error:");
      console.log(err);
      toast.error("QR scanning failed. Try again.");
    }    
  };

  const handleScannedData = async (data) => {

    if (!/^\w{6}$/.test(data)) {
      toast.error("Invalid QR code!");
      setResponseData({ status: "error" });
      return;
    }

    setLoading(true);

    try {
      
      const voting = {
        "userid" : user._id,
        "votingCode" : data
      }

      const response = await axios.post(CONSTANTS.API_URL +"votes/creation", voting, {
              headers: {
                  token: "Bearer "+ user.accessToken
              }
          });
       
        if(response.status === 201){
          setTitleDialogue("Your scan was succesfull.");
          setUrlImage(mevSuccess);
        }else {
          setTitleDialogue("We had a slight issue, please try again later.");
          //toast.warning("We had a slight issue, please try again later.");
          setUrlImage(mevError);
        }

      setResponseData({ status: "success", data: response.data });
      setLoading(false);
    } catch (err) {
      if(err.status === 401){
        //toast.error(err.response.data);
        setTitleDialogue(err.response.data);
      }else if(err.status === 409){
        //toast.error(err.response.data);
        setTitleDialogue(err.response.data);
      }else {
        toast.error("Something went wrong, please try again later.")
      }
      setUrlImage(mevError);
      setResponseData({ status: "error" });
    } finally {
      setLoading(false);
    }
  };

  const stopScan = async () => {
    setScanBtnShow(true)
    setScanning(false);
    setResponseData(null);
  }

  const HandleRescan = () => {
      window.location.reload(true);
  }

  return (
    <div>
        <div className="top-navbar">
            <TopNavigation title={"QR Scanning"} />
        </div>
        <div className="layer-block">
           <div className="layer-content">
               
              <div className="pace-scan mgbot20">
                  {
                    scanBtnShow ? (
                        <button className="btn btn-mevent" onClick={startScan}>
                          SCAN
                        </button>
                      ) : 
                        (
                          <button className="btn btn-mevent" onClick={HandleRescan}>
                            STOP SCANNING
                          </button>
                        )
                  }
              </div>
              
              {
                scanning && (
                    <div className="scanning-area">
                      <video ref={videoRef} style={{ width: "100%" }} />
                    </div>
                  )                 
              }
              
              {loading && <Loading />}           

              {
                responseData && (
                  <QRScanSuccess 
                    title={titleDialogue}
                    urlString={urlImage}
                   />
                  )
                }
           </div>
        </div>
    </div>
  )
}
//Create a qr code scanner
//If a six character string is decoded from the qr code
//Then hide the scanner
//show the <div class="loading"></div> while you make post request. 
//Once the data returns hide the loading div and show the response div with complete image
//if the qr code returns anything except for a six digit number then toast invalid code and
//show the response div with error image

export default QRCodeScan