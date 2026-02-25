//import logo from './logo.svg';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthScreens from "./Pages/AuthScreens";
import AuthLoginScreen from "./Pages/AuthLoginScreen";
import AuthRegisterScreen from "./Pages/AuthRegisterScreen";
import HomeScreen from "./Pages/HomeScreen";
import Settings from "./Pages/Settings";
//import EventAdd from "./Pages/EventAdd";
import AuthForgotScreen from "./Pages/AuthForgotScreen";
import Competitions from "./Pages/Competitions";
import QRCode from "./Pages/QRCode";
import QRCodeScan from "./Pages/QRCodeScan";
import QRCodeInput from "./Pages/QRCodeInput";
import EventDetails from "./Pages/EventDetails";
import CompetitionScreen from "./Pages/CompetitionScreen";
import SponsorsList from "./Pages/SponsorsList";
import MultiAgendaWeb from "./Pages/MultiAgendaWeb";
import Landing from "./Pages/Landing";
import MultiAgenda from "./Pages/MultiAgenda";

function App() {
  
  return (
    <>
    <Router>
      <div className="main-outer-container">
        <Routes>
          <Route path="/login" element={<AuthLoginScreen />}/> 
          <Route path="/register" element={<AuthRegisterScreen />}/>
          <Route path="/forgot-password" element={<AuthForgotScreen />}/>  
          <Route path="/competitions/:id" element={<Competitions />} />
          <Route path="/home" element={<Landing />} />
          <Route path="/mulit-agenda/:id" element={<MultiAgenda/>} /> 
          <Route element={<AuthScreens />}>                       
                <Route path="/" element={<HomeScreen/>}/> 
                <Route path="/event-single/:id" element={<EventDetails />} />
                <Route path="/competition-view" element={<CompetitionScreen />}/> 
                <Route path="/sponsors" element={<SponsorsList />}/> 
                <Route path="/qrcode" element={<QRCode />}/> 
                <Route path="/qrcode-scan" element={<QRCodeScan />}/> 
                <Route path="/qrcode-input" element={<QRCodeInput />}/> 
                <Route path="/mulit-agendas" element={<MultiAgendaWeb/>} /> 
                <Route path="/settings" element={<Settings />}/> 
            </Route>
        </Routes>
      </div>
    </Router>
    <ToastContainer />
  </>
  );
}

export default App;
