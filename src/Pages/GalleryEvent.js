import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as CONSTANTS from "../CONSTANTS";
import { Link } from 'react-router-dom';
import TopNavigation from '../Components/Widgets/TopNavigation';
import Spinner from '../Components/Others/Spinner';

function GalleryEvent() {
    const {user}                                                      = useSelector((state) => state.auth);

    const [processing, setProcessing]                                   = useState(false);    
    const [galleryList, setGalleryList]                                 = useState([]);
    
    useEffect(() => {
        getGalleriesList();
    },[])
    
    const getGalleriesList = async () => {
        try{
            setProcessing(true);
            const response = await axios.get(CONSTANTS.API_URL +"galleries/list/albums/v1", {
                headers: {
                    token: "Bearer "+ user.accessToken
                }
            }); 
           
            setGalleryList(response.data);
            setProcessing(false);
        }catch(err){
            console.log(err);
            setProcessing(false);
        }      
    }

  return (
     <div>
        <div className="top-navbar">
            <TopNavigation title={"Gallery"} />
        </div>
        <div className="layer-block">
           <div className="layer-content"> 
                <div className="row">
                    {
                        galleryList.length > 0 ? (
                            galleryList.map((gallery) => (
                                <div className="col-ms-4 mb-3" key={gallery._id}>           
                                    <Link to={"/gallery/" + gallery._id} className="text-decoration-none">
                                        <div className="card h-100">
                                            <div className="card-body"> 
                                                <h5 className="card-title">{gallery.title}</h5>
                                                <p className="card-text">{gallery.bio}</p>
                                            </div>      
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>              
                                <p className="text-muted">No galleries found.</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default GalleryEvent