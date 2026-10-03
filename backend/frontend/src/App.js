import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import PatientForm from './pages/PatientForm';
import SummaryInsights from './pages/SummaryInsights';
import ViewPatients from './pages/ViewPatients';

// Navigation component
const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          🏥 Smart Discharge System
        </div>
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Login
          </Link>
          <Link 
            to="/patient-form" 
            className={`nav-link ${location.pathname === '/patient-form' ? 'active' : ''}`}
          >
            New Patient
          </Link>
          <Link 
            to="/view-patients" 
            className={`nav-link ${location.pathname === '/view-patients' ? 'active' : ''}`}
          >
            All Patients
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-disclaimer">
        ⚠️ This system is developed for academic demonstration purposes only and not for real clinical use.
        <br />
        © 2026 Smart Discharge Summary Generator. All rights reserved.
      </p>
    </footer>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/patient-form" element={<PatientForm />} />
            <Route path="/summary" element={<SummaryInsights />} />
            <Route path="/view-patients" element={<ViewPatients />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
