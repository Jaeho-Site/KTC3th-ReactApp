import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useUserContext } from '../../contexts/UserContext';
import { Box, Typography, Button, Slider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import carouselImage1 from '../../assets/images/c1.jpg';
import carouselImage2 from '../../assets/images/c2.jpg';
import carouselImage3 from '../../assets/images/c3.jpg';
import carouselImage4 from '../../assets/images/c4.jpg';
import p1 from '../../assets/images/p1.jpg';
import p2 from '../../assets/images/p2.jpg';
import p3 from '../../assets/images/p3.jpg';
import p4 from '../../assets/images/p4.jpg';
import '../../styles/TestPage.css';
import CustomCarousel from '../common/CustomCarousel';
import CarouselBlock from './LandingPage/CarouselBlock';
import carouselItemsData from './LandingPage/carouselItems.json';
import '@fontsource/pacifico';
import CustomImageBar from '../common/CustomImageBar';
import YouTube from 'react-youtube';

function TestPage() {
  const navigate = useNavigate(); 
  const { t } = useTranslation();
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const { user, loading, error } = useUserContext();
  const theme = useTheme(); // useTheme를 여기로 이동
  const videoRefs = useRef([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [landingCarouselItems, setLandingCarouselItems] = useState([]);
  const [comparePosition, setComparePosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const carouselItems = [
    { image: carouselImage1, description: t('testPage.carouselDescription1') },
    { image: carouselImage2, description: t('testPage.carouselDescription2') },
    { image: carouselImage3, description: t('testPage.carouselDescription3') },
    { image: carouselImage4, description: t('testPage.carouselDescription4') },
  ];
  const newCarouselItems = [
    { image: p1, description: t('testPage.newCarouselDescription1') },
    { image: p2, description: t('testPage.newCarouselDescription2') },
    { image: p3, description: t('testPage.newCarouselDescription3') },
    { image: p4, description: t('testPage.newCarouselDescription4') },
  ];
  const carouselRef = useRef(null);
  const newCarouselRef = useRef(null);

  const handlePrev = useRef(null);
  const handleNext = useRef(null);
  const handleSliderChange = useRef(null);

  const handleNewPrev = useRef(null);
  const handleNewNext = useRef(null);
  const handleNewSliderChange = useRef(null);

  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => setIsMounted(false);
  }, []);

  // handlePrev, handleNext, handleSliderChange를 useCallback으로 감싸기
  const handlePrevCallback = useCallback((ref) => {
    if (isMounted && ref.current) {
      ref.current();
    }
  }, [isMounted]);

  const handleNextCallback = useCallback((ref) => {
    if (isMounted && ref.current) {
      ref.current();
    }
  }, [isMounted]);

  const handleSliderChangeCallback = useCallback((ref, event, newValue) => {
    if (isMounted && ref.current) {
      ref.current(event, newValue);
    }
  }, [isMounted]);

  useEffect(() => {
    const importAll = (r) => {
      let images = {};
      r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
      return images;
    }
    
    const images = importAll(require.context('../../assets/images', false, /\.(png|jpe?g|svg)$/));

    const loadedItems = carouselItemsData.map(item => ({
      ...item,
      image: images[item.image.split('/').pop()]
    }));

    setLandingCarouselItems(loadedItems);
  }, []);

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

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      navigate('/');
    }
  }, [authStatus, navigate]);

  useEffect(() => {
    videoRefs.current.forEach(video => {
      if (video) {
        video.play().catch(error => {
          console.log("자동 재생 실패:", error);
        });
      }
    });
  }, []);

  if (loading || error || !user) {
    return null; // 로딩, 에러, 사용자 데이터 없음 상태 처리는 상위 컴포넌트에서 처리
  }

  // YouTube 비디오 ID 배열 수정
  const mainVideo = 'Wb1QUbFh2k8';
  const aiVideos = ['_9L8A57cM5c', '5IWRcPB4-JU', 'hZhcJlJ00Ug'];

  // 섹션 1의 YouTube 옵션
  const mainOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: mainVideo,
      mute: 1,
    },
  };

  // 섹션 2의 YouTube 옵션
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      loop: 1,
      mute: 1,
    },
  };

  const testPageStyle = {
    backgroundImage: `url(${theme.palette.background.testPageMain})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
  };

  const sectionStyle = {
    margin: '3rem 2rem',
    padding: '2rem',
  };

  const transparentSectionStyle = {
    padding: '0',
    backgroundColor: 'transparent',
  };

  const carouselSectionStyle = {
    ...sectionStyle,
    padding: '0',
  };

  const isDarkMode = theme.palette.mode === 'dark';

  const section1TextStyle = {
    color: isDarkMode ? '#ffffff' : '#000000',
  };

  const darkModeStyle = isDarkMode ? {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#ffffff'
  } : {};

  return (
    <Box className="test-page-container" sx={testPageStyle}>
      {/* 첫 번째 섹션 수정 */}
      <Box
        component="section"
        className="test-page-section"
        sx={{ 
          backgroundImage: `url(${theme.palette.background.testPageSection})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box className="test-page-content">
          <Box className="test-page-text-container">
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom 
              className="test-page-title"
              style={section1TextStyle}
            >
              {t('testPage.title')}
            </Typography>
            <Typography 
              variant="h5" 
              component="h5" 
              gutterBottom 
              className="test-page-subtitle"
              style={section1TextStyle}
            >
              {t('testPage.subtitle')}
            </Typography>
            <Typography 
              variant="h5" 
              component="h5" 
              gutterBottom 
              className="test-page-description"
              style={section1TextStyle}
            >
              {t('testPage.description')}
            </Typography>
            <Box className="test-page-button-container">
              <Button 
                variant="contained" 
                color="primary" 
                className="test-page-button test-page-button-primary"
              >
                {t('testPage.button1')}
              </Button>
              <Button 
                variant="outlined" 
                color="secondary" 
                className="test-page-button test-page-button-secondary"
              >
                {t('testPage.button2')}
              </Button>
            </Box>
          </Box>
        </Box>
        <Box className="test-page-video-container">
          <YouTube
            videoId={mainVideo}
            opts={mainOpts}
            className="test-page-video"
          />
        </Box>
      </Box>

      {/* 두 번째 섹션 수정 */}
      <Box component="section" className="test-page-section-2" style={{...testPageStyle, ...darkModeStyle}}>
        <Box className="video-box-container">
          {aiVideos.map((videoId, index) => (
            <Box key={index} className="video-box" style={darkModeStyle}>
              <YouTube
                videoId={videoId}
                opts={{...opts, playerVars: {...opts.playerVars, playlist: videoId}}}
                className="video-box-video"
              />
              <Box className="video-box-text-container">
                <Typography variant="body1" className="video-box-description" style={darkModeStyle}>
                  {t(`testPage.videoDescription${index + 1}`)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 세 번째 섹션: 수정된 NVIDIA 스타일 캐러셀 */}
      <Box component="section" className="test-page-section-3" style={{...carouselSectionStyle, ...darkModeStyle}}>
        <CustomCarousel
          title={t('testPage.carouselTitle')}
          mainText={t('testPage.carouselMainText')}
          subText={t('testPage.carouselSubText')}
          items={carouselItems}
          isDarkMode={isDarkMode}
        />
      </Box>

      {/* 새로운 섹션: 섹션 3과 동일한 형식의 캐러셀 */}
      <Box component="section" className="test-page-section-4" style={{...carouselSectionStyle, ...darkModeStyle}}>
        <CustomCarousel
          title={t('testPage.newCarouselTitle')}
          mainText={t('testPage.newCarouselMainText')}
          subText={t('testPage.newCarouselSubText')}
          items={newCarouselItems}
          isDarkMode={isDarkMode}
        />
      </Box>

      {/* 5번째 섹션: 이미지 비교 */}
      <Box component="section" className="test-page-section-5" style={{...transparentSectionStyle, marginTop: '1rem'}}>
        <CustomImageBar
          title={t('testPage.section5Title')}
          description={t('testPage.section5Description')}
          image1={carouselImage4}
          image2={carouselImage3}
          isDarkMode={isDarkMode}
        />
      </Box>

      {/* 여섯 번째 섹션: LandingPage의 Feature Carousel */}
      <Box component="section" className="test-page-section-6" style={sectionStyle}>
        <CarouselBlock items={landingCarouselItems} />
      </Box>
    </Box>
  );
}

export default React.memo(TestPage);