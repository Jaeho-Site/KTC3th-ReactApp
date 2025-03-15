// src/components/common/CustomSlider.js
import React from 'react';
import { Slider, Typography, Box } from '@mui/material';
import '../../styles/CustomSlider.css';

const CustomSlider = ({ label, min, max, step, value, onChange, theme }) => {
  return (
    <Box className="custom-slider" sx={{ marginBottom: theme.spacing(2) }}>
      <Box className="slider-header" sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing(1) }}>
        <Typography component="label" sx={{ color: theme.palette.text.primary }}>
          {label}
        </Typography>
        <Typography className="slider-value" sx={{ 
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
          padding: theme.spacing(0.5, 1),
          borderRadius: theme.shape.borderRadius,
        }}>
          {value}
        </Typography>
      </Box>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e, newValue) => onChange(newValue)}
        sx={{
          color: theme.palette.primary.main,
          '& .MuiSlider-thumb': {
            backgroundColor: theme.palette.primary.main,
          },
          '& .MuiSlider-track': {
            backgroundColor: theme.palette.primary.main,
          },
          '& .MuiSlider-rail': {
            backgroundColor: theme.palette.primary.light,
          },
        }}
      />
    </Box>
  );
};

export default CustomSlider;