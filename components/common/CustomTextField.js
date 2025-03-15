// src/components/common/CustomTextField.js
import React from 'react';
import { TextField, Typography, Box } from '@mui/material';
import '../../styles/CustomTextField.css';

const CustomTextField = ({ label, type = 'text', placeholder, value, onChange, theme }) => {
  return (
    <Box className="custom-textfield" sx={{ marginBottom: theme.spacing(2) }}>
      <Typography 
        component="label" 
        className="custom-textfield-label" 
        sx={{ 
          color: theme.palette.text.primary,
          marginRight: theme.spacing(2),
          marginBottom: theme.spacing(1),
          display: 'block'
        }}
      >
        {label}
      </Typography>
      <TextField
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        fullWidth
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.background.paper,
            '& fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.light,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.dark,
            },
          },
          '& .MuiInputBase-input': {
            color: theme.palette.text.primary,
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
          },
        }}
        InputProps={{
          className: 'custom-textfield-input',
        }}
      />
    </Box>
  );
};

export default CustomTextField;