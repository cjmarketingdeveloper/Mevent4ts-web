import React, { useEffect, useState } from 'react'
import axios from 'axios';
import * as CONSTANTS from "./../CONSTANTS";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TopNavigation from '../Components/Widgets/TopNavigation';

function GallerySingle() {
     const {user}                                                            = useSelector((state) => state.auth);
     const [processing, setProcessing]                                       = useState(false);
     const [currentGallery, setCurrentGallery]                                = useState();
     const [galleryImages, setGalleryImages]                                  = useState([]);
     const params                                                            = useParams();


    useEffect(() => {
        getCurrentGalleryDetails();
    },[])
    
    useEffect(() => {
        if(currentGallery){
            getCurrentGalleryPictures();
        }
    },[currentGallery])

        const getCurrentGalleryDetails = async () => {

        try{

            setProcessing(true);
            const result = await axios.get(CONSTANTS.API_URL +"galleries/single/album-details/v1/"+ params.id, {
                headers: {
                    token: "Bearer "+ user.accessToken
                }
            });
            //console.log(result)
            setCurrentGallery(result.data);
            setProcessing(false);

        }catch(error){
            console.log(error);
            setProcessing(false);
        }
    }

    const getCurrentGalleryPictures = async () => {

        try{

            const result = await axios.get(CONSTANTS.API_URL +"galleries/pictures/list/v1/"+ currentGallery.code, {
                headers: {
                    token: "Bearer "+ user.accessToken
                }
            });

            setGalleryImages(result.data);
        
        }catch(error){
            console.log(error);
        }
    }
     
  return (
    <div>
        <div className="top-navbar">
            <TopNavigation title={"Gallery Detials"} />
        </div>
        <div className="layer-block">
            <div className="layer-content"> 
                    <div className="gallery-pictures-list">
                    {
                        galleryImages.length > 0 && (
                            <div className="scroll-image-list">                                                               
                                    {galleryImages.map((image, index) => (
                                    
                                        <img 
                                            key={index} // Or image.id if available
                                            src={image.pictureUrl} // Change 'url' to match your data structure
                                            alt={`Gallery item ${index}`} 
                                            loading="lazy"
                                            className="img-special"
                                        />
                                    ))}                                                             
                            </div>
                        )
                    }
                    </div>
            </div>
        </div>
    </div>
  )
}

export default GallerySingle