import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Persons from './Persons';
import Houses from './Houses';
import Families from './Families';
import Neighborhoods from './Neighborhoods';
import Needs from './Needs';
import './App.css'; // Importing the CSS file for styling

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Links */}
        <nav className="navbar">
          <ul className="nav-list">
            <li className="nav-item"><Link to="/persons">الأفراد</Link></li>
            <li className="nav-item"><Link to="/houses">البيوت</Link></li>
            <li className="nav-item"><Link to="/families">العائلات</Link></li>
            <li className="nav-item"><Link to="/neighborhoods">الأحياء</Link></li>
            <li className="nav-item"><Link to="/needs">الاحتياجات</Link></li>
          </ul>
        </nav>

        {/* Define Routes */}
        <div className="content">
          <Routes>
            <Route path="/persons" element={<Persons />} />
            <Route path="/houses" element={<Houses />} />
            <Route path="/families" element={<Families />} />
            <Route path="/neighborhoods" element={<Neighborhoods />} />
            <Route path="/needs" element={<Needs />} />

            {/* Default Route */}
            <Route path="/" element={
              <div className="welcome">
                
                <h1>اختر قسمًا من القائمة للتنقل.</h1>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
