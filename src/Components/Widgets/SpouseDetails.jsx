import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaUserFriends, FaPhoneSquare, FaNewspaper } from "react-icons/fa";
import imageLove from './../../assets/love-icon.png';
function SpouseDetails({spouseNumber, CONSTANTS}) {


    const [spouseDetails, setSpouseDetails]                             = useState(null);

    useEffect(() => {
        if(spouseNumber){
            collectSpouseDetails();
        }        
    },[])

    const collectSpouseDetails = async () => {
        try{

            const response = await axios.get(CONSTANTS.API_URL +"users/person/phonenumber/" + spouseNumber);
            
            if(response.status === 200){
                setSpouseDetails(response.data);
            }
        }catch(err){
            console.log(err);
        }
    }
  return (
    <div className="p-2 row-component">
        <div className="section-pad-item">
        {
            spouseDetails && <div className="card card-bl-grad">
                            <div className="card-body">
                                <h4>Spouse Details</h4>
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td className="title-icon-hom">
                                                <FaUserFriends />
                                            </td>
                                            <td>
                                                <strong>Name:</strong><br/>
                                                {spouseDetails.name} {spouseDetails.surname}</td>
                                        </tr>
                                        <tr>
                                            <td className="title-icon-hom"><FaPhoneSquare /></td>
                                            <td><strong>Phone:</strong><br/>
                                                {spouseDetails.phonenumber}</td>
                                        </tr>
                                        <tr>
                                            <td className="title-icon-hom"><FaNewspaper /> </td>
                                            <td><strong>Profession:</strong><br/>
                                                {spouseDetails.profession}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <img src={imageLove} className="magic-back" />
                            </div>                    
                         </div>
             }
        </div>
      
    </div>
  )
}

export default SpouseDetails