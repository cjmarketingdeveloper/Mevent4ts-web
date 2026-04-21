import React, { useEffect, useState } from 'react'
import TopNavigation from '../Components/Widgets/TopNavigation'
import { useSelector } from 'react-redux';
import * as CONSTANTS from "./../CONSTANTS";
import axios from 'axios';
import DgGalaTable from '../Components/Diaologues/DgGalaTable';
import './gala.css';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

function GalaBallScreen() {
    const {user}                                                        = useSelector((state) => state.auth);
    
    const [theGalaList, setTheGalaList]                                 = useState([]);
    const [updateCount, setUpdateCount]                                 = useState(0);
    const [selectedTable, setSelectedTable]                             = useState(null); // For the Screen 4 popup
    const [showModalGala, setShowModalGala]                             = useState(false); // For the Screen 4 popup    

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        getGallaList();
    },[updateCount])

    const getGallaList = async () => {
        try{
            const response = await axios.get(CONSTANTS.API_URL +"events/gala/collection/set/v2", {
                headers: {
                    token: "Bearer "+ user.accessToken
                }
            }); 
            
            setTheGalaList(response.data);                
        }catch(err){
            console.log(err);
        }      
    }

  return (
    <div>
        <div className="top-navbar">
            <TopNavigation title={"Gala Ball"} />
        </div>
        <div className="layer-block">
            <div className="layer-content"> 
                    {
                        showModalGala && (
                            <DgGalaTable 
                                user={user}
                                showModalGala={showModalGala}
                                setShowModalGala={setShowModalGala}
                                selectedTable={selectedTable}
                                setSelectedTable={setSelectedTable}
                                CONSTANTS={CONSTANTS}
                                setUpdateCount={setUpdateCount}
                                />
                        )
                    }

                    <div className="px-2">
                        <div className="scroll-indicator">
                            <div className="ic">
                                <FaAngleDoubleLeft />
                            </div>
                            <div className="ic-text">
                                Scroll left and right
                            </div>
                            <div className="ic">
                                <FaAngleDoubleRight />
                            </div>
                        </div>
                        
                      {
                        theGalaList.length > 0 && (
                            <div className="floor-plan-wrapper-area">
                                <div className="floor-plan-wrapper">
                                     <div className="flexme gap-2 text-[10px]">
                                        <div className="flexme items-center ml-4 mt-2"><span className="bx-space red-space"></span> <span className="xs-copy">Space</span></div>
                                        <div className="flexme items-center mt-2"><span className="bx-space gray-space"></span> <span className="xs-copy">No Space</span></div>
                                    </div>
                                <div className="stage-row">
                                    <div className="stage-area">
                                        <div className="screen-option">Screen</div>
                                        <div className="stage-option">Stage</div>
                                        <div className="screen-option">Screen</div>
                                    </div>
                                </div>
                                    
                                
                                {theGalaList.map((row, rowIndex) => (
                                    <div key={rowIndex} className={`table-row row-${rowIndex}`}>
                                    {row.map((table) => {
                                        // Logic to check if the table is full (10 seats and all have a userId)
                                        const isFull = table.seats?.length >= 10 && table.seats.every(seat => !!seat.userId);

                                        return (
                                        <div className="ax-table" key={table.tableNumber}>
                                            <button
                                            onClick={() => { 
                                                setSelectedTable(table); 
                                                setShowModalGala(true); 
                                            }}
                                            className={`table-dot border-0 
                                                ${isFull ? 'bg-secondary' : 'bg-danger'}`}
                                            >
                                            {table.tableNumber}
                                            </button>
                                        </div>
                                        );
                                    })}
                                    </div>
                                ))}
                                </div>
                            </div>
                        )
                      }
                    </div>
            </div>
        </div>
    </div>
  )
}

export default GalaBallScreen