import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, IconButton, Slider } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import '../../styles/CustomCarousel.css';

function CustomCarousel({ title, mainText, subText, items, isDarkMode }) {
  const carouselRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(0);

  const darkModeStyle = isDarkMode ? {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#ffffff'
  } : {};

  const updateSliderValue = useCallback(() => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth - carouselRef.current.offsetWidth;
      const scrollPosition = carouselRef.current.scrollLeft;
      const newValue = (scrollPosition / scrollWidth) * 100;
      setSliderValue(newValue);
    }
  }, []);

  const handlePrev = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -carouselRef.current.offsetWidth / 2, behavior: 'smooth' });
      setTimeout(updateSliderValue, 500);
    }
  }, [updateSliderValue]);

  const handleNext = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.offsetWidth / 2, behavior: 'smooth' });
      setTimeout(updateSliderValue, 500);
    }
  }, [updateSliderValue]);

  const handleSliderChange = useCallback((_, newValue) => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth - carouselRef.current.offsetWidth;
      const scrollPosition = (newValue / 100) * scrollWidth;
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      setSliderValue(newValue);
    }
  }, []);

  useEffect(() => {
    const currentCarousel = carouselRef.current;
    if (currentCarousel) {
      currentCarousel.addEventListener('scroll', updateSliderValue);
      return () => {
        currentCarousel.removeEventListener('scroll', updateSliderValue);
      };
    }
  }, [updateSliderValue]);

  return (
    <Box className="carousel__slides" style={darkModeStyle}>
      <Box className="carousel__header">
        <Typography variant="h3" className="carousel__title" style={darkModeStyle}>
          {title}
        </Typography>
        <Box className="carousel__controls">
          <IconButton onClick={handlePrev}><ArrowBackIos /></IconButton>
          <IconButton onClick={handleNext}><ArrowForwardIos /></IconButton>
        </Box>
      </Box>
      <Box className="carousel__content">
        <Box className="carousel__text">
          <Typography variant="h4" className="carousel__main-text">
            {mainText.split('\n').join('\n\n')}
          </Typography>
          <Typography 
            variant="h5" 
            className="carousel__sub-text"
            sx={{ lineHeight: 2.2 }}
          >
            {subText.split('\n').join('\n\n')}
          </Typography>
        </Box>
        <Box className="carousel__items" ref={carouselRef}>
          {items.map((item, index) => (
            <Box key={index} className="carousel__item">
              <img src={item.image} alt={`Carousel item ${index + 1}`} />
              <Typography variant="body2" className="carousel__item-description">{item.description}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Slider
        className="carousel__slider"
        value={sliderValue}
        onChange={handleSliderChange}
        min={0}
        max={100}
        step={1}
      />
    </Box>
  );
}

export default React.memo(CustomCarousel);
