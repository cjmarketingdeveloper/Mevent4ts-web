import axios from 'axios';
import React, { useEffect, useState } from 'react'

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
    <div className="p-2">
      {
        spouseDetails && <div className="card card-bl-grad">
                            <div className="card-body">
                                <h4>Spouse Details</h4>
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>Name</td>
                                            <td>{spouseDetails.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Surname</td>
                                            <td>{spouseDetails.surname}</td>
                                        </tr>
                                        <tr>
                                            <td>Phone</td>
                                            <td>{spouseDetails.phonenumber}</td>
                                        </tr>
                                        <tr>
                                            <td>Profession</td>
                                            <td>{spouseDetails.profession}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>                    
                         </div>
      }
    </div>
  )
}

export default SpouseDetails