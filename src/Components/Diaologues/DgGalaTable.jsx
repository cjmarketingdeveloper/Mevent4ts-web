import React, { useState } from 'react'
import axios from 'axios';
import Spinner from '../Others/Spinner';
import { toast } from 'react-toastify';

function DgGalaTable({user, showModalGala, setShowModalGala, selectedTable, setSelectedTable, CONSTANTS, setUpdateCount}) {
    const [loading, setLoading]                                 = useState(false);
    const [bookingDetails, setBookingDetails]                   = useState([]);
    const [activeSeatNumber, setActiveSeatNumber]               = useState(null);

    // Helper to get seat data or return empty object
    const getSeatData = (num) => {
        return selectedTable.seats.find(s => s.seatNumber === num) || { userId: "" };
    };

    const handleAddingYourSelf = () => {
        if (!activeSeatNumber) return; 
       
        const updateSeat = {
            tableId: selectedTable._id,
            seat: {
                seatNumber: activeSeatNumber,
                userId: user._id,
                name: user.name,
                surname: user.surname,
            }            
        }
        
        setBookingDetails(prevDetails => {
            // 1. Remove any existing entry for this specific user (so they only have one seat)
            const filteredDetails = prevDetails.filter(item => item.seat.userId !== user._id);
            
            // 2. Prepend the new selection to the start
            return [updateSeat, ...filteredDetails];
        });
    }

    const handleAddingYourSpouse = async () => {
        if (!activeSeatNumber) return; 
        try{

            //before adding the spouse check if the spouse is already in the bookingDetails and if so remove them to avoid duplicates
            const isAlreadySeated = bookingDetails.some((item) => item.seat.seatNumber === activeSeatNumber);
           
            if (isAlreadySeated) {
                // 2. If they exist, show the toast and do nothing else
                toast.warning("Seat already selected");
                return;
            } 
            setLoading(true);
            const response = await axios.get(CONSTANTS.API_URL +"users/spouse/info/details/" + user.spouseNumber, {
                headers: {
                    token: "Bearer "+ user.accessToken
                }
            });           
            
            const spouseData = response.data[0];
            setLoading(false);
                    const updateSeat = {
                        tableId: selectedTable._id,
                        seat: {
                            seatNumber: activeSeatNumber,
                            userId: spouseData._id,
                            name: spouseData.name,
                            surname: spouseData.surname,
                        }            
                    }
                
                setBookingDetails(prev => [...prev, updateSeat]);                             
        }catch(err){
            setLoading(false);
            console.log(err);
        }
    }

    const handleBooking = async () => {   
        try{

             const response = await axios.put(CONSTANTS.API_URL +"events/set/gala/booking/v2" , bookingDetails, {
                headers: {
                        token: "Bearer "+ user.accessToken
                    }
                });   
            
                toast.success(response.data.message);
                setUpdateCount(prev => prev + 1); 
        }catch(err){
            console.log(err);
            ///////////////////////////////
            if (err.response) {
                const status = err.response.status;
                const serverMessage = err.response.data.message;

                if (status === 409) {
                    toast.warning(serverMessage || "Seat already selected");
                }else {
                    toast.error(serverMessage || "An unexpected error occurred.");
                }
            }else {
                toast.error("Booking failed. Please try again.");
            }            
            ///////////////////////////////
        }
    }

    if(loading){
        return(<Spinner /> );
    }
    
  return (
    <div className="overlay-area" onClick={() => {
                setShowModalGala(false);
                setSelectedTable(null);
            }
        }>
        <div className="rect-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="gala-table-content">
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                    <h2 className="text-lg font-bold mb-2">Table {selectedTable.tableNumber}</h2>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td className="font-bold">Section {selectedTable.section}</td>
                                <td>{
                                        bookingDetails.length >0 && (<div><strong>({bookingDetails[0].seat.seatNumber})</strong> {bookingDetails[0].seat.name}</div>)
                                    }</td>
                                <td>{
                                        bookingDetails.length >1 && (<div><strong>({bookingDetails[1].seat.seatNumber})</strong> {bookingDetails[1].seat.name}</div>)
                                    }</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    {/* Logic to add user to the 10 spots */}
                    <div className="space-y-2 mb-6">
                       {/* Horizontal Scrollable Container */}
                        <div className="horiscroll pb-4 bg-white p-3 rounded-md">
                                {[...Array(10)].map((_, i) => {
                                const seatNumber = i + 1;
                                const seat = getSeatData(seatNumber);
                                const isEmpty = !seat.userId;

                                return (
                                    <button
                                    key={seatNumber}
                                    onClick={() => setActiveSeatNumber(seatNumber)}
                                    className={`
                                        btn flex-shrink-0 px-6 py-3 border rounded transition-all
                                        ${isEmpty ? 'bg-light text-dark' : 'bg-success text-white'}
                                        ${activeSeatNumber === seatNumber ? 'btn-activate ring-2 ring-primary shadow-lg' : ''}
                                    `}
                                    >
                                    <div className="text-[10px] uppercase block">Seat {seatNumber}</div>
                                        <div className="font-bold">
                                            {isEmpty ? "Empty" : `${seat.name} ${seat.surname}`}
                                        </div>
                                    </button>
                                );
                                })
                            }
                        </div>
                    </div>

                    <div className="mt-4 p-5 border-top text-center">
                        {activeSeatNumber ? (
                        <>
                            {getSeatData(activeSeatNumber).userId ? (
                            <div>
                                <h5 className="font-bold">User Details</h5>
                                <p>Name: {getSeatData(activeSeatNumber).name} {getSeatData(activeSeatNumber).surname}</p>
                            </div>
                            ) : (
                            <div>
                                <p className="mb-2">This seat is currently available.</p>
                                <p className="text-muted small mb-3">In order to book this seat, please click the book now button.</p>
                                
                                {user.spouseNumber.length > 0 ? (
                                    <div className="info-box">
                                       <p className="text-danger small mb-3">Note: You have a spouse account linked. Please book a seat for your spouse as well.</p>
                                        
                                        {
                                            bookingDetails.length === 2 ? 
                                                 (<button className="btn btn-primary px-5" onClick={() => handleBooking()}>Book Now</button>)
                                                : <div className="add-buttons">
                                                        <button className="btn btn-primary px-5" onClick={() => handleAddingYourSelf()}>Add Yourself</button>
                                                        <button className="btn btn-primary px-5 mt-2" onClick={() => handleAddingYourSpouse()}>
                                                            Add Spouse
                                                        </button>
                                                    </div>
                                        }
                                        
                                    </div>
                                ) : (
                                    <div className="info-box">
                                        {
                                            bookingDetails.length === 0 ?
                                                (<button className="btn btn-primary px-5" onClick={() => handleAddingYourSelf()}>Add Yourself</button>
                                                ) : (
                                                    <button className="btn btn-primary px-5" onClick={() => handleBooking()}>Book Now</button>
                                                )
                                        }
                                        
                                    </div>
                                ) }
                                
                            </div>
                            )}
                        </>
                        ) : (
                        <p className="text-muted">Please select a seat to see details</p>
                        )}
                    </div>



                </div>
            </div>
        </div>
    </div>
  )
}

export default DgGalaTable