import React, { useEffect, useState } from 'react';

const BannerSlideshow = ({ eventItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === eventItem.banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // change every 4 seconds

    return () => clearInterval(interval); // cleanup
  }, [eventItem.banners.length]);

  if (!eventItem || eventItem.banners.length === 0) return null;

  return (
    <div className="slides-container-event">
      {eventItem.banners.map((banner, index) => (
        <img
          key={index}
          src={banner}
          alt={`Slide ${index}`}
          className={`slide ${index === currentIndex ? 'active' : ''}`}
        />
      ))}
    </div>
  );
};

export default BannerSlideshow;
