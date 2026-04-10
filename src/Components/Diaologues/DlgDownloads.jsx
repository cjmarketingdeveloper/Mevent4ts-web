import React, { useState } from 'react'
import Loading from '../Others/Loading';
import downloadImage from '../../assets/download_g.png';
function DlgDownloads({setShowModalDownloads, user}) {
    const [downloadList, setDownloadList] = useState([]);
    

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
                    


                </div>
            </div>
        </div>
    </div>
  )
}

export default DlgDownloads