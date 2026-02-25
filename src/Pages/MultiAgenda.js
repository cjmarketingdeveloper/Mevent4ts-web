import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import * as CONSTANTS from "./../CONSTANTS";
import { toast } from 'react-toastify';
import Loading from '../Components/Others/Loading';
import { FaEnvelopeOpenText } from "react-icons/fa";

function MultiAgenda() {
    const params                                                    = useParams();

    const [agendaList, setAgendaList]                               = useState([]);
    const [processing, setProcessing]                               = useState(false);

    const [selectedDate, setSelectedDate]                        = useState(agendaList[0]?.date || "");
    const [selectedDay, setSelectedDay]                          = useState(null);

    const [downloadList, setDownloadList]                        = useState([]);
    const [person, setPerson]                                    = useState();

    useEffect(() => {
          getMyPersonDetails();
          getMyUserList();
    },[])

     // Update the default day whenever a new date is selected
     useEffect(() => {
        if(agendaList){
            const firstDay = agendaList.find((agenda) => agenda.date === selectedDate)?.agendas[0]?.day || null;
            setSelectedDay(firstDay);
        }
        
    }, [selectedDate, agendaList]);


    const getMyPersonDetails = async () => {
        try{

            const res = await axios.get("https://mevent-2-admin-c7b0d608277d.herokuapp.com/api/users/person/"+ params.id);
            console.log("getMyPersonDetails");
            console.log(res.data);
            setPerson(res.data);
        }catch(err){
            console.log(err);
        }
    }
    
    const getMyUserList = async () => {
        try{
            setProcessing(true);

            const res = await axios.get("https://mevent-2-admin-c7b0d608277d.herokuapp.com/api/agendas/user/multi-agenda/list/"+ params.id);
            //const res = await axios.get("http://localhost:1221/api/agendas/user/multi-agenda/list/"+ params.id);
            //console.log(res.data);
            setAgendaList(res.data.agendas);
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

    const nameString = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 1];   
    }
    const handleLinkFileDownload = async (fileURL) => {
        

        try {

            const response = await fetch(fileURL);
            const blob = await response.blob();
        
             // Extract filename from URL
            const filename = fileURL.split("/").pop().split("?")[0]; // Handles query params
            const file = new File([blob], filename, { type: blob.type });
        
            setProcessing(true);
                const formData = new FormData();
                    formData.append("email", person.email); // Change to actual recipient
                    formData.append("subject", "Mevent Your Attached File");
                    formData.append("message", "Please find the attached file.");
                    formData.append("attachment", file);
                
                    const res = await fetch("https://mevent-2-admin-c7b0d608277d.herokuapp.com/api/users/send-email/attach", {
                    method: "POST",
                    body: formData,
                });
            
                const result = await res.json();

                console.log(result);
                setProcessing(false);
            if (res.ok) {
                toast.success("Email has been sent to you with the attachment.")
                //console.log("Email sent successfully:", result);
            } else {
                toast.warning("Failed to send email")
                console.error("Failed to send email:", result);
            }
            setProcessing(false);
          } catch (error) {
            console.error("Error fetching or sending file:");
            console.log(error);

            setProcessing(false);
          }
    };

  return (
    <div>
        <div className="container">
            <div className="pd10">
                {
                    selectedDate.length === 0 && (<span>Please Select Date</span>)
                }
            </div>
           {
              agendaList.length > 0 && (
                <div className="agenda-box-container">
                     {/* Date Selector */}
                        <div className="date-selector">
                            {agendaList.map((agenda) => (
                                <button
                                    key={agenda.date}
                                    className={`date-button ${selectedDate === agenda.date ? "active" : ""}`}
                                    onClick={() => setSelectedDate(agenda.date)}
                                >
                                    {
                                        new Date(agenda.date).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                            })
                                    } - {
                                        new Date(agenda.end).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                            })
                                    } 
                                </button>
                            ))}
                        </div>

                        {/* Day Selector */}
                        <div className="day-selector stream-lane">
                            {agendaList
                                .find((agenda) => agenda.date === selectedDate)
                                ?.agendas.map((agendaDay) => (
                                    <button
                                        key={agendaDay.day}
                                        className={`day-button ${selectedDay === agendaDay.day ? "active" : ""}`}
                                        onClick={() => setSelectedDay(agendaDay.day)}
                                    >
                                        Day {agendaDay.day}
                                    </button>
                                ))}
                        </div>

                        {/* Agenda Content */}
                        <div className="agenda-content">
                            {agendaList
                                .find((agenda) => agenda.date === selectedDate)
                                ?.agendas.find((agendaDay) => agendaDay.day === selectedDay)
                                ?.content.map((item, index) => (
                                    <div key={index} className="agenda-item-box">
                                        <div className="agenda-inner">
                                            <h3>{item.title}</h3>
                                            <div className="downloads"></div>
                                            <p className="period-block">{item.startTime} - {item.endTime}</p>
                                            {
                                               
                                               item?.downloadableUrls.length  > 0  &&(
                                                <div className="download-view">
                                                    <div className="position-email-us">
                                                        <button 
                                                            className="btn btn-action btn-inferno" 
                                                            onClick={() => setDownloadList(item?.downloadableUrls)}>
                                                            <FaEnvelopeOpenText /> 
                                                        </button>
                                                        <span>Get the Content</span>
                                                    </div>
                                                    {
                                                        downloadList.length > 0 && (
                                                            <div className="download-modal">
                                                                <div className="download-modal-header">
                                                                    <h2>Email</h2>
                                                                    <button className="btn btn-closet-mod" onClick={() => setDownloadList([])}>X </button>
                                                                </div>
                                                                <div className="download-body">
                                                                    <ul className="nostyle">
                                                                    {
                                                                        downloadList.map((download, index) => {
                                                                                return <li key={index} className="download-lane">
                                                                                          <button
                                                                                            onClick={() => handleLinkFileDownload(download)}>
                                                                                                Send ({nameString(download)})
                                                                                            </button>
                                                                                       </li>
                                                                        })
                                                                    }
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                               )
                                            }
                                            <div className="agenda-event">
                                              {item.eventTitle}
                                              </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                </div>
              )
           }
        </div>
      
    </div>
  )
}

export default MultiAgenda