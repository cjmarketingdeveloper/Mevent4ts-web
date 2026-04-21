import React, { useEffect, useState } from 'react'
import { 
  FaClinicMedical, FaFax, FaCoins, FaBullhorn, 
  FaHandsHelping, FaPeopleCarry,  
  FaPlusCircle, FaCommentDots
} from 'react-icons/fa';
import Loading from '../Others/Loading';
import axios from 'axios';

function DlgHappinesFactorClinic({user, showModalHappinessClinic, setShowModalHappinessClinic}) {
        const [loading, setLoading]                         = useState(false);
        const [step, setStep]                                = useState(1);

        const steps = [
            { id: 1, label: 'Background', icon: <FaClinicMedical /> },
            { id: 2, label: 'Operational', icon: <FaFax /> },
            { id: 3, label: 'LocalLed', icon: <FaCoins /> },
            { id: 4, label: 'Communication', icon: <FaBullhorn /> },
            { id: 5, label: 'Team', icon: <FaHandsHelping /> },
            { id: 6, label: 'Experience', icon: <FaPeopleCarry /> },
            { id: 7, label: 'Finalize', icon: <FaCommentDots /> },
        ];
    
        const currentIcon = steps.find(s => s.id === step)?.icon;
        
    return (
        <div className="overlay-area" onClick={() => setShowModalHappiness(false)}>
            <div className="rect-modal-card" onClick={(e) => e.stopPropagation()}>
                DlgHappinesFactorClinic
            </div>        
        </div>
  )
}

export default DlgHappinesFactorClinic