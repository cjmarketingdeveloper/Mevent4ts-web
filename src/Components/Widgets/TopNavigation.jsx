import React from 'react'
import { FaAngleLeft, FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

function TopNavigation({title}) {
  const navigate = useNavigate();

  return (
    <div className="flex-navigation">
        <div className="box-navigation-one">
          <button className="btn-return-nav" onClick={() => navigate(-1)}>
            <FaAngleLeft />
          </button>
        </div>
        <div className="box-navigation-two">
           {title}
        </div>
    </div>
  )
}

export default TopNavigation