import React from 'react';
import TopNavigation from "../Widgets/TopNavigation";
import { Link } from 'react-router-dom';


function QRScanSuccess({title, urlString}) {

    const HandleRescan = () => {
        window.location.reload(true);
    }

  return (
    <div className="modal-dialogue-top full-height-scan">
        <div className="modal-content">
            <div className="modal-body-update ">

                <div className="layer-content">
                        <h2 className="text-center">{title}</h2>
                    <div className="respone-area text-center">
                        <img src={urlString} className="img-responsive" />
                    </div>

                    <Link to="/" className="btn btn-mevent mgtop10">
                       Home
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default QRScanSuccess