import React from 'react'
import TopNavigation from '../Components/Widgets/TopNavigation'
import { useSelector } from 'react-redux';
import FranchiseeRsvp from '../Components/Widgets/rsvp/FranchiseeRsvp';
import PotentialRsvp from '../Components/Widgets/rsvp/PotentialRsvp';
import ClinicRsvp from '../Components/Widgets/rsvp/ClinicRsvp';
import VipRsvp from '../Components/Widgets/rsvp/VipRsvp';
import TradeshowRsvp from '../Components/Widgets/rsvp/TradeshowRsvp';
import * as CONSTANTS from "./../CONSTANTS";

function RSVPScreen() {
      const {user}                                                        = useSelector((state) => state.auth);


  return (
    <div>
        <div className="top-navbar">
            <TopNavigation title={"RSVP"} />
        </div>
        <div className="layer-block">
           <div className="layer-content mb-5">  
            {
                user.profile.profileName == "Franchisee" && (
                    <FranchiseeRsvp user={user} CONSTANTS={CONSTANTS} />
                )
            }
            {
                user.profile.profileName == "Potential" && (
                    <PotentialRsvp user={user} CONSTANTS={CONSTANTS} />
                )
            }
            {
                user.profile.profileName == "Clinic" && (
                    <ClinicRsvp user={user} CONSTANTS={CONSTANTS} />
                )
            }
            {
                user.profile.profileName == "VIP" && (
                    <VipRsvp user={user} CONSTANTS={CONSTANTS} />
                )
            }
            {
                user.profile.profileName == "Tradeshow" && (
                    <TradeshowRsvp user={user} CONSTANTS={CONSTANTS} />
                )
            }
           </div>
           <br/>
        </div>
    </div>
  )
}

export default RSVPScreen