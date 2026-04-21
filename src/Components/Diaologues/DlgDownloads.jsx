import React, { useEffect, useState } from 'react'
import Loading from '../Others/Loading';
import downloadImage from '../../assets/download_g.png';
import axios from 'axios';
import { Link, Links } from 'react-router-dom';

function DlgDownloads({setShowModalDownloads, user, CONSTANTS}) {
    const [downloadList, setDownloadList]               = useState([]);
    const [processing, setProcessing]                   = useState(false);

    useEffect(() => {
        getListDownloads();
    },[])

    
    const getListDownloads = async () => {
        try{

            setProcessing(true);
            const result = await axios.get(CONSTANTS.API_URL +"settings/downloads/event/floors/" + user._id );
            
            if(result.data.length > 0){
                setDownloadList(result.data)
            }
            
        }catch(err){
            console.log(err);
        }finally{
            setProcessing(false);
        }
    }

  return (
     <div className="overlay-area" onClick={() => {
                setShowModalDownloads(false);
                setDownloadList([]);
            }
        }>
        <div className="rect-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="gala-table-content">
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                   <div className="text-center">
                     <img src={downloadImage} className="img-down-center" />  
                   </div>
                    <h2 className="text-lg font-bold mb-2"></h2>
                    {
                        processing && (<Loading />)
                    }      
                    

                    {
                        downloadList.length > 0 && (
                            <div className="content-downloads">
                                {
                                    downloadList.map((download, index) => {
                                        return <div className="card" key={index}>
                                                    <div className="card-body">
                                                        <a 
                                                            href={download.url}
                                                            target='_blank'
                                                            download
                                                            className="btn btn-mevent btn-download-min">
                                                          ({index + 1}) - {download.eventCode} Floor Plan
                                                        </a>
                                                    </div>        
                                                </div>
                                    })
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default DlgDownloads