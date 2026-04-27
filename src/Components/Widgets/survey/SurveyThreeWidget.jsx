import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../../Others/Loading';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux'; 


function SurveyThreeWidget({user, CONSTANTS}) {
     const [loading, setLoading]                         = useState(false);

    if (loading) return <Loading />;
  return (
    <div className="survey-lane">
       SurveyThreeWidget

        questions
    </div>
  )
}

export default SurveyThreeWidget