import React, { useState } from 'react'
import TiltGate from '../Components/Widgets/map/TiltGate';
import IndoorMap from '../Components/Widgets/map/IndoorMap';
import "../Components/Widgets/map/style.css";

function MapScreen() {
    
     const [activeCategory, setActiveCategory]              = useState(null);
     const [userLocation, setUserLocation]                  = useState(null);
     const [searchTerm, setSearchTerm]                      = useState("");
     
  return (
    <TiltGate>
      <IndoorMap 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
    </TiltGate>
  );
}

export default MapScreen