import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MaskEditor from './MaskEditor';
import '../../styles/CustomDropZone.css';

const acceptedFileTypes = ['image/png', 'image/jpeg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CustomDropZone({ fileHandler, onEditorToggle, onDragStateChange }) {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditorActive, setIsEditorActive] = useState(false);
  const [isOver, setIsOver] = useState(false);
  const dragCounter = useRef(0);

  const fileInputRef = useRef(null);
  const dropzoneRef = useRef(null);

  const theme = useTheme();
  const { t } = useTranslation();

  const validateFile = useCallback((file) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(t('customDropZone.fileSizeError'));
    }
    if (!acceptedFileTypes.includes(file.type)) {
      throw new Error(t('customDropZone.fileTypeError'));
    }
  }, [t]);

  const handleFileChange = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      setError('');
      validateFile(selectedFile);

      setFile(selectedFile);
      setFilename(selectedFile.name);
      
      const objectUrl = URL.createObjectURL(selectedFile);
      setFileUrl(objectUrl);
      
      fileHandler(selectedFile);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [fileHandler, validateFile]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setIsOver(true);
      if (onDragStateChange) onDragStateChange(true);
    }
  }, [onDragStateChange]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsOver(false);
      if (onDragStateChange) onDragStateChange(false);
    }
  }, [onDragStateChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    dragCounter.current = 0;
    if (onDragStateChange) onDragStateChange(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange, onDragStateChange]);

  const handleBrowseClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };

  const handleEditMask = (e) => {
    e.stopPropagation();
    setIsEditorActive(true);
    if (onEditorToggle) onEditorToggle(true);
  };

  const handleCloseEditor = () => {
    setIsEditorActive(false);
    if (onEditorToggle) onEditorToggle(false);
  };

  useEffect(() => {
    return () => {
      dragCounter.current = 0;
    };
  }, []);

  return (
    <Box 
      className={`custom-dropzone-container ${isOver ? 'dragging' : ''}`}
      ref={dropzoneRef} 
      sx={{ width: '100%', maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Box
        className="custom-dropzone"
        onClick={handleBrowseClick}
        sx={{
          padding: theme.spacing(2.5),
          textAlign: 'center',
          cursor: 'pointer',
          minHeight: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          '&:hover': {
            borderColor: theme.palette.primary.dark,
          },
        }}
      >
        {isLoading ? (
          <Box sx={{ width: 40, height: 40 }}>
            <Typography>{t('customDropZone.loading')}</Typography>
          </Box>
        ) : file ? (
          <Box className="uploaded-image-container" sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={fileUrl} alt={filename} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            <Box className="image-controls" sx={{ position: 'absolute', bottom: 10, right: 10 }}>
              <Button onClick={handleEditMask} sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, '&:hover': { backgroundColor: theme.palette.primary.dark } }}>
                {t('customDropZone.editMask')}
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography>{t('customDropZone.dragOrClick')}</Typography>
        )}
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={acceptedFileTypes.join(',')}
        style={{ display: 'none' }}
      />
      <Typography sx={{ color: theme.palette.text.secondary, mt: 1 }}>{filename}</Typography>
      {error && <Typography sx={{ color: theme.palette.error.main, mt: 1 }}>{error}</Typography>}
      {file && isEditorActive && (
        <MaskEditor
          imageUrl={fileUrl}
          onClose={handleCloseEditor}
          containerRef={dropzoneRef}
        />
      )}
    </Box>
  );
}