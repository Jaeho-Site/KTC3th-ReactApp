import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider } from '@mui/material';
import '../../styles/CustomImageBar.css';

function CustomImageBar({ title, description, image1, image2, isDarkMode }) {
  const [comparePosition, setComparePosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleCompareChange = (event, newValue) => {
    setComparePosition(newValue);
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    handleMouseMove(event);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const container = event.currentTarget;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const newPosition = (x / rect.width) * 100;
      setComparePosition(Math.max(0, Math.min(100, newPosition)));
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalMouseMove = (event) => {
      if (isDragging) {
        const container = document.querySelector('.image-compare-container');
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const newPosition = (x / rect.width) * 100;
          setComparePosition(Math.max(0, Math.min(100, newPosition)));
        }
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging]);

  const darkModeStyle = isDarkMode ? {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#ffffff'
  } : {};

  return (
    <Box className="custom-image-bar-container">
      <Box className="custom-image-bar-content" style={darkModeStyle}>
        <Box className="custom-image-bar-text">
          <Typography variant="h3" className="custom-image-bar-title" style={darkModeStyle}>
            {title}
          </Typography>
          <Box className="custom-image-bar-description-slider-container">
            <Slider
              className="compare-control-slider"
              orientation="horizontal"
              value={comparePosition}
              onChange={handleCompareChange}
              aria-labelledby="compare-slider"
            />
            <Typography variant="body1" className="custom-image-bar-description" style={darkModeStyle}>
              {description}
            </Typography>
          </Box>
        </Box>
        <Box 
          className="custom-image-bar-image-container"
          onMouseDown={handleMouseDown}
        >
          <Box className="image-compare-container">
            <img src={image1} alt="Image 1" className="compare-image" />
            <img 
              src={image2} 
              alt="Image 2" 
              className="compare-image compare-image-overlay"
              style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
            />
            <Box 
              className="compare-slider"
              style={{ left: `${comparePosition}%` }}
            >
              <Box className="compare-slider-line"></Box>
              <Box className="compare-slider-button"></Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CustomImageBar;
