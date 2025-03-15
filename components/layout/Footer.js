import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper', 
        py: 3,
        mt: 'auto'
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        {t('footer.copyright')}
      </Typography>
    </Box>
  );
};

export default Footer;