import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';

const Header = ({ toggleTheme, toggleLanguage }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Logo
        </Typography>
        <Button color="inherit">{t('header.home')}</Button>
        <Button color="inherit">{t('header.about')}</Button>
        <Button color="inherit">{t('header.services')}</Button>
        <Button color="inherit">{t('header.contact')}</Button>
        <IconButton onClick={toggleTheme} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <IconButton onClick={toggleLanguage} color="inherit">
          <LanguageIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;