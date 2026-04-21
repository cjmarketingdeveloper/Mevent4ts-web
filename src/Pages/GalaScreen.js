import React, { useEffect, useState } from 'react'
import TopNavigation from '../Components/Widgets/TopNavigation'
import { useSelector } from 'react-redux';
import * as CONSTANTS from "./../CONSTANTS";
import axios from 'axios';
import DgGalaTable from '../Components/Diaologues/DgGalaTable';

function GalaScreen() {
        const {user}                                                        = useSelector((state) => state.auth);

        const [theGalaList, setTheGalaList]                                 = useState([]);
        const [updateCount, setUpdateCount]                                 = useState(0);
        const [selectedTable, setSelectedTable]                             = useState(null); // For the Screen 4 popup
        const [showModalGala, setShowModalGala]                             = useState(false); // For the Screen 4 popup    

        const [activeIndex, setActiveIndex] = useState(0);

        /////////===========================================================================
        const getGridStyles = (sectionId) => {
                if (sectionId === "L" || sectionId === "R") {
                    // Standard 4-column row-based layout for outer wings
                    return "grid-outer-wing";
                }
                // Column-based flow for middle sections to handle specific counts
                return "grid-inner-section";
            };

        // Helper for Card 2 and 3 specific breaks
        const getColumnBreak = (sectionId, index) => {
                if (sectionId === "LM") {
                    // Card 2: 5, 4, 4
                    if (index === 5) return "grid-column-2"; // Force 6th table to col 2
                    if (index === 9) return "grid-column-3"; // Force 10th table to col 3
                }
                if (sectionId === "RM") {
                    // Card 3: 4, 4, 5
                    if (index === 4) return "grid-column-2"; // Force 5th table to col 2
                    if (index === 8) return "grid-column-3"; // Force 9th table to col 3
                }
                return "";
            };
        /////////===========================================================================

        const handleScroll = (e) => {
            const scrollLeft = e.target.scrollLeft; // How far we've scrolled
            const itemWidth = e.target.offsetWidth; // The width of the visible area (the card)
            
            // Divide and round to the nearest whole number
            const newIndex = Math.round(scrollLeft / itemWidth);
            
            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
            }
        };

        useEffect(() => {
            getGallaList();
        },[updateCount])
    
        const getGallaList = async () => {
            try{
                const response = await axios.get(CONSTANTS.API_URL +"events/gala/collection/set/v1", {
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
                <TopNavigation title={"Gala"} />
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
                            <div className={`row-index-filter flex w-full h-12 ${
                                        activeIndex === 1 ? 'flex-end' : 'justify-start'
                                    }`}>
                                        {/* Only show if index is 1 or 2 */}
                                        {(activeIndex === 1 || activeIndex === 2) && (
                                            <div className="w-stage-indicate">
                                                Stage
                                            </div>
                                        )}
                                    </div>

                            {/* Horizontal Scrolling Container */}
                            <div
                                onScroll={handleScroll} 
                                className="horizontal-stable flex overflow-x-auto gap-3 py-4 no-scrollbar snap-x">
                                {theGalaList.map((section, index) => (
                                    <div 
                                        key={section._id} 
                                        className="area-card bg-white rounded-xl shadow-md p-4 snap-center border border-gray-200"
                                       >
                                        <div className="flex justify-between items-center mb-4 base-card-wide">
                                            <h3 className="text-xs font-bold text-gray-500 uppercase">
                                                TABLE: {section.tables[0].tableNumber} / {section.tables[section.tables.length - 1].tableNumber}
                                            </h3>
                                            <div className="flexme gap-2 text-[10px]">
                                                <div className="flexme items-center ml-4 mt-2"><span className="bx-space red-space"></span> <span className="xs-copy">Space</span></div>
                                                <div className="flexme items-center mt-2"><span className="bx-space gray-space"></span> <span className="xs-copy">No Space</span></div>
                                            </div>
                                        </div>

                                        {/* Dynamic Grid Layout */}
                                        <div className={`${getGridStyles(section._id)} part-${activeIndex} sect-type-${section._id} g-3`}>
                                            {section.tables.map((table, tIdx) => {
                                              
                                                //const isFull = false;
                                                const isFull = table.seats?.length >= 10 && table.seats.every(seat => !!seat.userId);
                                                const colIndex = (tIdx % 3) + 1;

                                                return (
                                                    <div className={`col-3 ${
                                                                tIdx % 2 === 0 ? 'mb-even' : 'mb-odd'} `}
                                                        key={table.tableNumber}>
                                                        <button
                                                            key={table.tableNumber}
                                                            onClick={() => { setSelectedTable(table); setShowModalGala(true); }}
                                                            className={`table-dot border-0 
                                                                
                                                                act-health-${activeIndex} 
                                                                cus-column-${colIndex} ${getColumnBreak(section._id, tIdx)} ${isFull ? 'bg-secondary' : 'bg-danger'}`}
                                                            >
                                                            {table.tableNumber}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs font-bold text-gray-400">
                                            (SECTION {section._id} {index + 1}/{theGalaList.length})
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Door Indicators */}
                            <div className="flex justify-around mt-2">
                                <div className="text-gray-400 text-center">Door</div>
                                <div className="text-gray-400 font-semibold uppercase text-sm"></div>
                            </div>
                        </div>

                      
                   
                </div>
            </div>
        </div>
    )
}

export default GalaScreen