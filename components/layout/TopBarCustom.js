// src/components/layout/TopBarCustom.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import logo from '../../assets/images/logo192.png';
import koFlag from '../../assets/images/ko-flag.png';
import enFlag from '../../assets/images/en-flag.png';
import esFlag from '../../assets/images/es-flag.png';
import '../../styles/TopBarCustom.css';

export default function TopBarCustom({ isAuthenticated, signOut, username }) {

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElLang, setAnchorElLang] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { themeMode, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleOpenLangMenu = (event) => {
    setAnchorElLang(event.currentTarget);
  };
  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };
  const handleNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    handleCloseLangMenu();
  };

  const pages = [

    { name: t('nav.home'), path: '/' },

    { name: t('nav.dashboard'), path: '/dashboard' },

    { name: t('nav.design'), path: '/design' },

    { name: t('nav.test'), path: '/test' },

    { name: t('nav.mypage'), path: '/mypage' },

  ];



  const languages = [

    { code: 'en', name: 'English', flag: enFlag },

    { code: 'es', name: 'Español', flag: esFlag },

    { code: 'ko', name: '한국어', flag: koFlag },

  ];



  const getCurrentFlag = () => {

    return languages.find(lang => lang.code === language)?.flag || enFlag;

  };



  const dropdownMenuItems = [

    ...pages,

    {

      name: isAuthenticated ? t('nav.signOut') : t('nav.signIn'),

      path: '/login',

      action: () => {

        if (isAuthenticated) {

          signOut();

        } else {

          handleNavigation('/login');

        }

        handleCloseNavMenu();

      }

    }

  ];



  return (

    <AppBar position="static" className="topbar" sx={{ width: '100%' }}>

      <Toolbar disableGutters sx={{ width: '100%', px: 2 }}>

        {/* Logo and brand name */}

        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>

          <img src={logo} alt="Logo" className="topbar-logo" />

          <Typography variant="h6" noWrap component="div" className="topbar-brand">

            LavinStudio

          </Typography>

        </Box>



        {/* Navigation buttons */}

        <Box sx={{ flexGrow: 1, display: 'flex' }}>

          {pages.map((page) => (

            <Button

              key={page.name}

              onClick={() => handleNavigation(page.path)}

              sx={{ my: 2, color: 'white', display: 'block' }}

            >

              {page.name}

            </Button>

          ))}

        </Box>



        {/* Theme toggle */}

        <Switch

          onChange={toggleTheme}

          checked={themeMode === 'dark'}

          className="topbar-theme-switch"

        />



        {/* Language selector */}

        <IconButton onClick={handleOpenLangMenu} className="topbar-language-button">

          <img src={getCurrentFlag()} alt="Language" className="topbar-language-flag" />

        </IconButton>

        <Menu

          id="language-menu"

          anchorEl={anchorElLang}

          open={Boolean(anchorElLang)}

          onClose={handleCloseLangMenu}

          className="topbar-menu"

        >

          {languages.map((lang) => (

            <MenuItem key={lang.code} onClick={() => handleLanguageChange(lang.code)} className="topbar-menu-item">

              <img src={lang.flag} alt={lang.name} style={{ width: '20px', marginRight: '10px' }} />

              {lang.name}

            </MenuItem>

          ))}

        </Menu>



        {/* Menu icon and dropdown */}

        <IconButton

          size="large"

          aria-label="account of current user"

          aria-controls="menu-appbar"

          aria-haspopup="true"

          onClick={handleOpenNavMenu}

          color="inherit"

        >

          <MenuIcon />

        </IconButton>

        <Menu

          id="menu-appbar"

          anchorEl={anchorElNav}

          anchorOrigin={{

            vertical: 'bottom',

            horizontal: 'right',

          }}

          keepMounted

          transformOrigin={{

            vertical: 'top',

            horizontal: 'right',

          }}

          open={Boolean(anchorElNav)}

          onClose={handleCloseNavMenu}

          sx={{

            display: 'block',

          }}

        >

          {dropdownMenuItems.map((item) => (

            <MenuItem

              key={item.name}

              onClick={item.action || (() => {

                handleNavigation(item.path);

                handleCloseNavMenu();

              })}

            >

              <Typography textAlign="center">{item.name}</Typography>

            </MenuItem>

          ))}

        </Menu>

      </Toolbar>

    </AppBar>

  );

}
