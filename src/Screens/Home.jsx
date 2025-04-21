
import React from 'react';
import './Home.css';
import { Routes, Route } from 'react-router-dom';

import Navbar from '../Components/Navbar/Navbar';
import Fall from './Fall/Fall';
import Medical from './Medical/Medical';
import LandingPage from './Landing Page/LandingPage';
import Homecare from './HomeServices/Homecare';
import Activities from './TrackActivities/Activities';
import Notifications from '../Components/Navbar/Notifications';
import AiAssistant from '../Screens/chatbot/chatbot';
import Signup from '../Screens/HomeServices/Signup';
import Login from '../Screens/HomeServices/Login';

const Home = () => {

  return (
    <div>

      <div className="home-container">

        <Navbar />

        <div className="content-container">


          <div className="heading-tab">

            {/* <h1>"A commitment to care, a promise of dignity."</h1> */}

          </div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/fall" element={<Fall />} />
            <Route path="/medical" element={<Medical />} />
            <Route path="/services" element={<Homecare />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/chat" element={<AiAssistant />} /> {/* AI Assistant Route */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Home;