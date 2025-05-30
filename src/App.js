import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public Components
import StartPage from './StartPage';
import Signup from './Signup';
import LoginUser from './Loginuser';
import AdminLogin from './AdminLogin';
import Home from './Home';
import EventList from './EventList';
import ServicePackageList from './ServicePackageList';
import FinalPage from './FinalPage';

// Admin Components
import AdminHome from './AdminHome';
import ViewUsers from './ViewUsers';
import AddEventService from './AddEventService';
import AddEventPackage from './AddEventPackage';
import EventHistory from './EventHistory';
import ViewEventService from './ViewEventService';
import ViewEventPackages from './ViewEventPackages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<StartPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginUser />} />
        <Route path="/home" element={<Home />} />
        <Route path="/event-list" element={<EventList />} />
        <Route path="/service-packages" element={<ServicePackageList />} />
        <Route path="/final-page" element={<FinalPage />} />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/view-users" element={<ViewUsers />} />
        <Route path="/admin/add-event-service" element={<AddEventService />} />
        <Route path="/admin/add-event-package" element={<AddEventPackage />} />
        <Route path="/admin/event-history" element={<EventHistory />} />
        <Route path="/admin/view-event" element={<ViewEventService />} />
        <Route path="/admin/view-event-packages" element={<ViewEventPackages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
