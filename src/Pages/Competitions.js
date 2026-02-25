import React, { useEffect, useState } from 'react'
import TopNavigation from '../Components/Widgets/TopNavigation'
import axios from 'axios';
import * as CONSTANTS from "./../CONSTANTS";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Loading from '../Components/Others/Loading';
import { Parser } from "html-to-react";

function Competitions() {
    const params                                                    = useParams();

    const [competitionList, setCompetitionList]                               = useState([]);
    const [processing, setProcessing]                                         = useState(false);

    const [selectedItem, setSelectedItem]                                     = useState(null);

    const htmlParser                                                          = new Parser();

    useEffect(() => {
            getMyUserList();
    },[])

    const getMyUserList = async () => {
            try{
                setProcessing(true);

                const res = await axios.get("https://mevent-2-admin-c7b0d608277d.herokuapp.com/api/competitions/user/list/"+ params.id);
               
                setCompetitionList(res.data.compete);
                setProcessing(false);
            }catch(error){
                console.log(error);
                setProcessing(false);
            }
    }

    if(processing) {
        return  <div className="abis-paul-center">
                <Loading />
         </div>
    }

  return (
    <div>
        <div className="container">
            <div className="layer-content">
            {
                competitionList &&
                competitionList.length > 0 && (
                    <div className="list-items list-of-competition">
                        {
                            competitionList.map((item, index) => (
                                <div 
                                    className="item competition-item-ls" 
                                    key={index}
                                    onClick={() => setSelectedItem(item)}
                                    >
                                            <div className="comp-item-flexor" >
                                                <div className="image-item competition-image">                                               
                                                    {
                                                            item?.prizeImage && (
                                                                <img src={item?.prizeImage} className="pace-view-image" />
                                                            )
                                                    } 
                                                </div>
                                                <div className="competition-content">
                                                    <h3>{item.name}</h3>
                                                    <div className="short-descr">{htmlParser.parse(item.description)}</div>
                                                    <div className="winning-pass">
                                                        
                                                        {
                                                            item.winner?.name ? (
                                                                <>
                                                                <span className="light-gray">Winner:</span>
                                                                <span className="strong-win">{item.winner?.name} {item.winner?.surname} </span>
                                                                </>
                                                            )
                                                            :
                                                            <div className="no-winner">
                                                                Still Running
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>  
                                        
                                </div>
                            )
                            )
                        }
                    </div>
                )
            }

            {
                competitionList.length === 0 && (
                    <h2>No Competitions</h2>
                )
            }

            {
                selectedItem && (
                    <div className="popup-overlay" onClick={() => setSelectedItem(null)}>
                            <div
                            className="popup-content"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                            >
                            <button className="close-btn-mod" onClick={() => setSelectedItem(null)}>×</button>
                            <img src={selectedItem?.prizeImage} alt="Prize" className="popup-image" />
                            <h2>{selectedItem.name}</h2>
                            <p>{htmlParser.parse(selectedItem.description)}</p>
                            {selectedItem.winner?.name && (
                                <div className="winner-info">
                                Winner: {selectedItem.winner.name} {selectedItem.winner.surname}
                                </div>
                            )}
                            </div>
                        </div>
                    )
            }
            </div>
        </div>
    </div>
  )
}

export default Competitions