import React, { useEffect, useRef, useState } from 'react'
import { stalls } from "./stalls";

function IndoorMap({ activeCategory, setActiveCategory }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStall, setSelectedStall] = useState(null);
  
  const searchRef = useRef(null);
  const filterRef = useRef(null);

  const getClassName = (stall) => {
    if (stall.type === "exit") return "exit";

    let classes = "stall";

    const matchesSearch =
      !searchQuery ||
      stall.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      !activeCategory || stall.type === activeCategory;
    
    if (matchesSearch && matchesCategory) {
      classes += " search-match";
    } else {
      classes += " muted";
    }

    if (selectedStall === stall.id) {
      classes += " selected";
    }

    return classes;
  };

  // Reset category when clicking outside search & filters
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeCategory &&
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setActiveCategory(null);
      }
    };

    // Use mousedown so it fires before input focus/selection
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeCategory, setActiveCategory]);

  return (
    <div className="landscape-wrapper">

      {/* RIGHT PANEL */}
      <div className="side-panel right-panel">
        <div className="panel-inner">
          <div className="title-group">
            <h1 className="header-title">Explore Map</h1>
            <h3 className="below-title">2026 Conference</h3>
          </div>

          <label className="search-container" ref={searchRef}>
            <input
              type="text"
              placeholder="Search supplier"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setActiveCategory(null)}
            />
            <i className="bi bi-search search-icon"></i>
          </label>
        </div>
      </div>

      {/* CENTER MAP */}
      <div className="map-container">
        <div className="map-inner">
          <svg
            viewBox="0 0 203 729"
            className="map-svg"
            preserveAspectRatio="xMidYMid meet"
          >
            {stalls
              .filter((item) => item.type !== "mask")
              .map((stall) => (
                <g
                  key={stall.id}
                  className={getClassName(stall)}
                  onClick={() =>
                    setSelectedStall((prev) =>
                      prev === stall.id ? null : stall.id
                    )
                  }
                >
                  <path d={stall.path} fill={stall.fill || "#480a0a"}   stroke={selectedStall === stall.id ? "#000000" : "none"}
  s                       trokeWidth={selectedStall === stall.id ? 2 : 0}/>
                  <title>{stall.name}</title>
                </g>
              ))}
          </svg>
        </div>
      </div>

      {/* LEFT PANEL */}
      <div className="side-panel left-panel">
        <div className="panel-inner" ref={filterRef}>

          <div
            className={`control-item ${activeCategory === "standard" ? "active" : ""}`}
            onClick={() =>
              setActiveCategory(prev => prev === "standard" ? null : "standard")
            }
          >
            <i className="bi bi-geo-alt-fill"></i>
            <p>Standard</p>
          </div>

          <div
            className={`control-item ${activeCategory === "premium" ? "active" : ""}`}
            onClick={() =>
              setActiveCategory(prev => prev === "premium" ? null : "premium")
            }
          >
            <i className="bi bi-shop"></i>
            <p>Premium</p>
          </div>

          <div
            className={`control-item ${activeCategory === "deco" ? "active" : ""}`}
            onClick={() =>
              setActiveCategory(prev => prev === "deco" ? null : "deco")
            }
          >
            <i className="bi bi-star-fill"></i>
            <p>Deco</p>
          </div>

          <div
            className={`control-item ${activeCategory === "service" ? "active" : ""}`}
            onClick={() =>
              setActiveCategory(prev => prev === "service" ? null : "service")
            }
          >
            <i className="bi bi-info-circle"></i>
            <p>Service</p>
          </div>

        </div>
      </div>
    </div>)
}

export default IndoorMap