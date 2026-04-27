import React, { useState } from 'react'

function HowToVideos() {
    const videoListing = [
        {
            "title" : "Home Screen",
            "description" : "We recommend that you store mevent on your home screen.",
            "videoUrl" : "https://admin.mevent.co.za/assess/videos/meventHomeScreen.mp4"
        },
        {
            "title" : "Scanning",
            "description" : "In order to execute scanning, please go through the video.",
            "videoUrl" : "https://admin.mevent.co.za/assess/videos/mevent01Scanning.mp4"
        },
        {
            "title" : "Agenda",
            "description" : "To review your agenda, please go through the video.",
            "videoUrl" : "https://admin.mevent.co.za/assess/videos/mevent02Agenda.mp4"
        },
        {
            "title" : "Gala",
            "description" : "This would be the process to review and book yourself for the gala.",
            "videoUrl" : "https://admin.mevent.co.za/assess/videos/mevent06Gala.mp4"
        },
        {
            "title" : "Floor Plan",
            "description" : "To see the floor plan of the exhibit.",
            "videoUrl" : "https://admin.mevent.co.za/assess/videos/mevent04-FloorPlan.mp4"
        },
    ];
    
    const [showModal, setShowModal]                             = useState(false);
    const [activeVideo, setActiveVideo]                         = useState(null);

    const openVideo = (video) => {
        setActiveVideo(video);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setActiveVideo(null);
    };

  return (
    <div className="mt-5">
        <div className="p-3">
            <h2 className="mb-4 text-center">How-To Tutorials</h2>
    
            {/* Video Grid */}
            <div className="row">
                {videoListing.map((item, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card h-100 video-card-vv1" onClick={() => openVideo(item)}>
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title colorred">{item.title}</h5>
                                <p className="card-text text-muted">{item.description}</p>
                                <button className="btn btn-outline-primary mt-auto">
                                    Watch Video
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Video Modal */}
            {showModal && (
                <div className="custom-modal-overlay-vv1" onClick={closeModal}>
                    <div className="custom-modal-content-vv1" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-vv1 border-0">
                            <h5 className="modal-title">{activeVideo?.title}</h5>
                            <button type="button" className="btn-close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body p-0">
                            <video width="100%" controls autoPlay>
                                <source src={activeVideo?.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default HowToVideos