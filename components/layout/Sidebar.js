// Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../common/CustomButton';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <CustomButton
              onClick={() => navigate('/dashboard')}
              variant="secondary"
              className="sidebar-button"
            >
              Dashboard
            </CustomButton>
          </li>
          <li>
            <CustomButton
              onClick={() => navigate('/hairchange')}
              variant="secondary"
              className="sidebar-button"
            >
              Hair Change
            </CustomButton>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <CustomButton
          onClick={() => {/* Add logout functionality */}}
          variant="secondary"
          className="sidebar-button"
        >
          Logout
        </CustomButton>
      </div>
    </div>
  );
};

export default Sidebar;