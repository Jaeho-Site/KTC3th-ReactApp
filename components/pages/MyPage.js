import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useUserContext } from '../../contexts/UserContext';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Avatar, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from '@mui/material';
import { Person as PersonIcon, Email as EmailIcon, Stars as StarsIcon, PhotoCamera as PhotoCameraIcon, Edit as EditIcon, AddCard as AddCardIcon } from '@mui/icons-material';
import '../../styles/MyPage.css';
import { useTranslation } from 'react-i18next';

const commonTypographyStyles = {
  color: '#111727',
  fontFamily: 'Manjari, sans-serif'
};

const labelStyle = {
  ...commonTypographyStyles,
  fontSize: '0.875rem',
  fontWeight: '400',
  color: '#424A7E'
};

const valueStyle = {
  ...commonTypographyStyles,
  fontSize: '1rem',
  fontWeight: '500'
};

function MyPage() {
  const navigate = useNavigate(); 
  const theme = useTheme();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const { 
    user, 
    loading, 
    setError, 
    updateUserProfile,
    updateUsername
  } = useUserContext();
  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [profileImage, setProfileImage] = useState(user?.profileImage);
  const fileInputRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);
  const API_URL = 'https://ud8gipg1zd.execute-api.ap-northeast-2.amazonaws.com/prod/user';
  const PROFILE_API_URL = 'https://ud8gipg1zd.execute-api.ap-northeast-2.amazonaws.com/prod/user/profile-image';
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      navigate('/');
    }
  }, [authStatus, navigate]);

  const isMobile = window.innerWidth <= 768;

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file && !isUploading) {
      try {
        setIsUploading(true);
        setError(null);

        if (file.size > 5 * 1024 * 1024) {
          setError('File size should be less than 5MB');
          setIsUploading(false);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const imageData = reader.result;
            console.log('Starting image upload...');
            
            if (!user?.email) {
              throw new Error('User email not found');
            }

            const response = await fetch(PROFILE_API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                image: imageData
              })
            });

            console.log('Upload response status:', response.status);

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || 'Failed to upload image');
            }

            const data = await response.json();
            console.log('Upload successful:', data);
            
            if (data.imageUrl) {
              setProfileImage(data.imageUrl);
              await updateUserProfile(data.imageUrl);
              await fetchUserInfo();
            } else {
              throw new Error('No image URL received');
            }

          } catch (error) {
            console.error('Upload error:', error);
            setError(error.message || 'Failed to upload image');
          } finally {
            setIsUploading(false);
          }
        };

        reader.onerror = () => {
          console.error('FileReader error');
          setError('Failed to read image file');
          setIsUploading(false);
        };

        reader.readAsDataURL(file);

      } catch (error) {
        console.error('General error:', error);
        setError(error.message || 'Failed to process image');
        setIsUploading(false);
      }
    }
  };

  const handleUsernameChange = async () => {
    if (newUsername.trim()) {
      try {
        const response = await fetch(API_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            Username: newUsername.trim()
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update username');
        }

        const data = await response.json();
        setUserInfo(data);
        updateUsername(data.Username);
        setOpenDialog(false);
        setNewUsername('');
      } catch (error) {
        console.error('Error updating username:', error);
        setError('Failed to update username');
      }
    }
  };

  // DynamoDB에서 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    if (!user?.email) return;
    
    try {
      console.log('Fetching user info for email:', user.email);
      const response = await fetch(`${API_URL}?email=${user.email}`);
      console.log('API Response:', response);

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      setUserInfo(data);
      
      // UserContext의 user 정보 업데이트
      if (data.Username) {
        console.log('Updating username to:', data.Username);
        updateUsername(data.Username);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setError('Failed to load user information');
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchUserInfo();
    }
  }, [user?.email]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
  }

  return (
    <div className="my-page">
      <div className="main-container">
        <div className="outer-rectangle" />
        <div className="inner-rectangle">
          <div className="info-container left-container">
            <h2 className="title">{t('myPage.personalInfo')}</h2>
            <div className="avatar-container">
              <Avatar 
                className="custom-avatar"
                src={userInfo?.profileImage || profileImage}
              >
                {userInfo?.Username?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <IconButton 
                className="camera-icon"
                size="small"
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <CircularProgress size={20} />
                ) : (
                  <PhotoCameraIcon fontSize="small" />
                )}
              </IconButton>
            </div>
            <Grid container spacing={isMobile ? 1 : 2}>
              <Grid item xs={6}>
                <div className="square-info-item">
                  <div className="square-info-header">
                    <PersonIcon sx={{ color: '#424A7E', fontSize: 24, mr: 1 }} />
                    <Typography variant="subtitle2" sx={labelStyle}>{t('myPage.username')}</Typography>
                    <IconButton 
                      className="icon-button"
                      onClick={() => setOpenDialog(true)}
                    >
                      <EditIcon className="edit-icon" fontSize="small" />
                    </IconButton>
                  </div>
                  <div className="square-info-content">
                    <Typography variant="body1" sx={valueStyle}>
                      {userInfo?.Username || t('myPage.notSet')}
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="square-info-item">
                  <div className="square-info-header">
                    <StarsIcon sx={{ color: '#424A7E', fontSize: 24, mr: 1 }} />
                    <Typography variant="subtitle2" sx={labelStyle}>{t('myPage.lavinCoins')}</Typography>
                    <IconButton 
                      className="icon-button"
                      onClick={() => {/* 코인 충전 핸들러 */}}
                    >
                      <AddCardIcon className="edit-icon" fontSize="small" />
                    </IconButton>
                  </div>
                  <div className="square-info-content">
                    <Typography variant="body1" sx={valueStyle}>
                      {userInfo?.LavinCoins || 0}
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="rectangle-info-item">
                  <div className="icon-wrapper">
                    <EmailIcon sx={{ color: '#424A7E' }} />
                  </div>
                  <div className="info-content">
                    <Typography variant="subtitle2" sx={labelStyle}>{t('myPage.email')}</Typography>
                    <Typography variant="body1" sx={valueStyle}>{user?.email || 'Not set'}</Typography>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="info-container right-container">
            <h2 className="title">{t('myPage.accountStats')}</h2>
            <Grid container spacing={isMobile ? 1 : 2}>
              <Grid item xs={6}>
                <div className="square-info-item stats-item">
                  <Box>
                    <Typography variant="subtitle2" sx={labelStyle}>{t('myPage.accountStatus')}</Typography>
                    <Typography variant="body1" sx={valueStyle}>{t('myPage.active')}</Typography>
                  </Box>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="square-info-item stats-item">
                  <Box>
                    <Typography variant="subtitle2" sx={labelStyle}>{t('myPage.memberSince')}</Typography>
                    <Typography variant="body1" sx={valueStyle}>
                      {userInfo?.joinDate || '2024'}
                    </Typography>
                  </Box>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="square-info-item stats-item">
                  <Box>
                    <Typography variant="subtitle2" sx={labelStyle}>{t('myPage.lastLogin')}</Typography>
                    <Typography variant="body1" sx={valueStyle}>{t('myPage.today')}</Typography>
                  </Box>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="square-info-item stats-item">
                  <Box>
                    <Typography variant="subtitle2" sx={labelStyle}>{t('myPage.totalDesigns')}</Typography>
                    <Typography variant="body1" sx={valueStyle}>0</Typography>
                  </Box>
                </div>
              </Grid>
            </Grid>
            <div className="letter-box">
              <div className="letter-content">
                <div className="letter-greeting">{t('myPage.letter.greeting')}</div>
                <div className="letter-message">
                  {t('myPage.letter.message')}
                </div>
                <div className="letter-signature">{t('myPage.letter.signature')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          setNewUsername('');
        }}
      >
        <DialogTitle>{t('myPage.changeUsername')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('myPage.newUsername')}
            type="text"
            fullWidth
            variant="outlined"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            error={newUsername.trim().length === 0}
            helperText={newUsername.trim().length === 0 ? t('myPage.usernameEmpty') : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              setNewUsername('');
            }}
          >
            {t('myPage.cancel')}
          </Button>
          <Button 
            onClick={handleUsernameChange} 
            variant="contained"
            disabled={newUsername.trim().length === 0}
          >
            {t('myPage.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default React.memo(MyPage);


























































































































































































































