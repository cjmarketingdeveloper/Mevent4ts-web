import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import * as CONSTANTS from "./../CONSTANTS";
import TopNavigation from '../Components/Widgets/TopNavigation'
import SurveyOneWidget from '../Components/Widgets/survey/SurveyOneWidget';
import SurveyTwoWidget from '../Components/Widgets/survey/SurveyTwoWidget';
import SurveyThreeWidget from '../Components/Widgets/survey/SurveyThreeWidget';

function SurveyScreen() {
      const {user}                                                    = useSelector((state) => state.auth);
      const [surveyData, setSurveyData]                                     = useState(null);
      const [processing, setProcessing]                                     = useState(false);

      useEffect(() => {
          collectSurveyData();
      },[])
  
      const collectSurveyData = async () => {
          try{
              setProcessing(true);
              const response = await axios.get(CONSTANTS.API_URL +"settings/survey/collection/v1"); 
  
                  if(response.data){
                      console.log(response.data);
                      setSurveyData(response.data);
                  }
                  setProcessing(false);
          }catch(err){
              console.log(err);
          }
      }

      
  return (
    <div>
            <div className="top-navbar">
                <TopNavigation title={"Survey"} />
            </div>
            <div className="layer-block">
                <div className="layer-content mb-5">
                    <p className="text-center">
                        We'd love to hear your honest thoughts as we prepare for this year's conference. Please complete the short survey it will take less than 5 minutes.
                        Your feedback will help us better understand your experience and will help shape this year's TLC conference topics so that we focus on what matters most for you.
                    </p>  
                    {
                      surveyData !== null && <div className="survey-display">
                                      {
                                        surveyData.surveyOne && <SurveyOneWidget user={user} CONSTANTS={CONSTANTS} />
                                      }    
                                      {
                                        surveyData.surveyTwo && <SurveyTwoWidget user={user} CONSTANTS={CONSTANTS}/>
                                      }    
                                      {
                                        surveyData.surveyThree && <SurveyThreeWidget user={user} CONSTANTS={CONSTANTS}/>
                                      }    
                                  </div>
                    }
                </div>
           </div>
    </div>
  )
}

export default SurveyScreen