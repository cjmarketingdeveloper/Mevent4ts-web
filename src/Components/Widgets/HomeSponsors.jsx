import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaQrcode } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function HomeSponsors({eventCodes, user, CONSTANTS, setSponsorCount, setSponsorScanned}) {
    const [activeSponsor, setActiveSponsor]                         = useState("Unscanned");

    const [scannedList, setScannedList]                                 = useState([]);
    const [filteredUnScannedList, setFilteredUnScannedList]             = useState([]);
    const [unscannedList, setUnscannedList]                             = useState([]);

    const [searchQuery, setSearchQuery]                                 = useState("");

    useEffect(() => {
      if(eventCodes){
        collectAllSponsers();
      }
    },[eventCodes])

    const collectAllSponsers = async () => {
      try{
  
        const content = {
          eventcode: eventCodes, 
          userid: user._id
        }
        const listSponsors = await axios.put(CONSTANTS.API_URL +"sponsors/event/list/with-votes/v2", content, {
            headers: {
                token: "Bearer "+ user.accessToken
            }
          });

          const data = listSponsors.data;
          
          // Filter data based on the 'voted' boolean
          const scanned = data.filter(item => item.voted === true);
          const unscanned = data.filter(item => item.voted === false);

          setScannedList(scanned);
          setUnscannedList(unscanned);
          setFilteredUnScannedList(unscanned);

          /////////////////////
          setSponsorCount(data.length);
          setSponsorScanned(scanned.length);
      }catch(err){
        console.log(err);
      }
    }
    const handleSearch = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);
      
      const filtered = unscannedList.filter(sponsor => 
        sponsor.title.toLowerCase().includes(query) // Assumes sponsor has a 'name' property
      );
      setFilteredUnScannedList(filtered);
  };

  return (
    <div className="scan-box-container">        
        <div className="tab-controls flexme mb-3 mt-3">
            <button 
              className={`btn ${activeSponsor === "Unscanned" ? "active-btn-boost" : "btn-place-primary"}`}
              onClick={() => setActiveSponsor("Unscanned")}
            >
              Unscanned ({filteredUnScannedList.length})
            </button>
            <button 
              className={`btn ${activeSponsor === "Scanned" ? "active-btn-boost" : "btn-place-primary"} ms-2`}
              onClick={() => setActiveSponsor("Scanned")}
            >
              Scanned ({scannedList.length})
            </button>
        </div>

        {/* Unscanned Section */}
        {activeSponsor === "Unscanned" && (
        <div className="scan-container unscanned-sponsers">
          <div className="input-filter mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search Suppliers to scan..." 
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="sponsor-scan-list">
            {filteredUnScannedList.length > 0 ? (
              filteredUnScannedList.map((sponsor) => (
                <div key={sponsor._id} className="card mb-2">
                  <div className="card-body">
                    <div className="sponsor-item p-2 flexme">
                      <div className="wide30">
                        <img src={sponsor.logo} className="image-ft"/>
                      </div>
                      <div className="title-container-x1 wide30 p-2">
                        <h5>{sponsor.title}</h5>
                      </div>
                      <div className="scanning-park wide30 text-center">
                          <Link className="btn-qr-box" to={'/qrcode-scan'}>
                            <FaQrcode />
                          </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h3 className="text-center text-muted">No unscanned sponsors found.</h3>
            )}
          </div>
        </div>
        )}

        {/* Scanned Section */}
        {activeSponsor === "Scanned" && (
          <div className="scan-container scanned-sponsers">
            <div className="sponsor-scan-list">
              {scannedList.length > 0 ? (
                scannedList.map((sponsor) => (
                  <div key={sponsor._id} className="card mb-2">
                      <div className="card-body">
                        <div className="sponsor-item p-2 flexme">
                          <div className="wide30">
                            <img src={sponsor.logo} className="image-ft"/>
                          </div>
                          <div className="title-container-x1 wide30 p-2">
                            <h5>{sponsor.title}</h5>
                          </div>
                        </div>
                      </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">You haven't scanned any sponsors yet.</p>
              )}
            </div>
          </div>
        )}
    </div>
  )
}

export default HomeSponsors