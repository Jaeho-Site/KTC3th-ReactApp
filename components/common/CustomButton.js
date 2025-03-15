// src/components/common/CustomButton.js
import React from 'react';
import { Button } from '@mui/material';
import '../../styles/CustomButton.css';

const CustomButton = ({ children, onClick, variant = 'primary', type = 'button', disabled = false, theme }) => {
  const getButtonStyles = () => {
    const baseStyles = {
      fontWeight: 'bold',
      textTransform: 'uppercase',
      padding: theme.spacing(1, 2),
      borderRadius: theme.shape.borderRadius,
      transition: 'all 0.3s ease',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: theme.palette.primary.main,
          border: `2px solid ${theme.palette.primary.main}`,
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
        };
      default:
        return baseStyles;
    }
  };

  return (
    <Button 
      className={`custom-button ${variant}`} 
      onClick={onClick}
      type={type}
      disabled={disabled}
      sx={getButtonStyles()}
    >
      {children}
    </Button>
  );
};

export default CustomButton;