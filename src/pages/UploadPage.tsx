import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Alert,
  Chip,
  useTheme
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  AutoAwesome as AIIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { UploadedImage } from '../types';
import aiService from '../services/aiService';

const UploadPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file! 📸');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large! Please select an image smaller than 10MB. 📏');
      return;
    }

    setProcessing(true);

    try {
      const processedImage = await aiService.generateOutline(file);
      setUploadedImages(prev => [processedImage, ...prev]);
      
      // Auto-navigate to coloring page after successful processing
      setTimeout(() => {
        navigate(`/color/${processedImage.id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again! 😢');
    } finally {
      setProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckIcon sx={{ color: 'green' }} />;
      case 'processing':
        return <AIIcon sx={{ color: 'orange' }} />;
      case 'failed':
        return <ErrorIcon sx={{ color: 'red' }} />;
      default:
        return <ImageIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 3, textAlign: 'center' }}>
        Upload Your Drawing! 🎨
      </Typography>
      
      <Typography variant="h5" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Turn your artwork into a magical coloring page with AI! ✨
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Upload Area */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              border: dragActive ? '3px dashed #FF6B9D' : '3px dashed #ccc',
              backgroundColor: dragActive ? '#FFF8F0' : 'white',
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#FF6B9D',
                backgroundColor: '#FFF8F0'
              }
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              style={{ display: 'none' }}
            />
            
            <UploadIcon sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }} />
            
            <Typography variant="h5" sx={{ mb: 2 }}>
              Drop your drawing here
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              or click to browse files
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<UploadIcon />}
              sx={{
                fontSize: '1.1rem',
                py: 1.5,
                px: 3,
                borderRadius: 25
              }}
            >
              Choose File
            </Button>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Supported formats: JPG, PNG, GIF
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maximum size: 10MB
              </Typography>
            </Box>
          </Paper>

          {/* Processing Status */}
          {processing && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AIIcon sx={{ mr: 1, color: 'orange' }} />
                <Typography variant="h6">
                  AI is processing your drawing...
                </Typography>
              </Box>
              <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Converting your artwork into a beautiful coloring template! 🎨
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Instructions */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
          <Paper sx={{ p: 4, height: 'fit-content' }}>
            <Typography variant="h4" sx={{ mb: 3, color: theme.palette.primary.main }}>
              How it works! 🤔
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 30, 
                  height: 30, 
                  borderRadius: '50%', 
                  backgroundColor: theme.palette.primary.main, 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>
                  1
                </Box>
                Upload your drawing
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ ml: 6 }}>
                Take a photo of your artwork or upload a digital drawing
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 30, 
                  height: 30, 
                  borderRadius: '50%', 
                  backgroundColor: theme.palette.secondary.main, 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>
                  2
                </Box>
                AI magic happens! ✨
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ ml: 6 }}>
                Our AI automatically creates a clean outline version for coloring
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 30, 
                  height: 30, 
                  borderRadius: '50%', 
                  backgroundColor: '#FFE66D', 
                  color: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>
                  3
                </Box>
                Start coloring! 🎨
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ ml: 6 }}>
                Use our digital tools to bring your creation to life with colors
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Tip:</strong> For best results, use clear, well-lit photos of your drawings!
              </Typography>
            </Alert>
          </Paper>
        </Box>
      </Box>

      {/* Recent Uploads */}
      {uploadedImages.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" sx={{ mb: 3, textAlign: 'center' }}>
            Your Recent Uploads 📸
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {uploadedImages.map((image) => (
              <Box key={image.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' } }}>
                <Card
                  sx={{
                    cursor: image.status === 'completed' ? 'pointer' : 'default',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': image.status === 'completed' ? {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    } : {}
                  }}
                  onClick={() => {
                    if (image.status === 'completed') {
                      navigate(`/color/${image.id}`);
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={image.outlineUrl}
                    alt="Uploaded drawing"
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getStatusIcon(image.status)}
                      <Chip
                        label={image.status}
                        color={getStatusColor(image.status) as any}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    
                    {image.status === 'completed' && (
                      <Typography variant="body2" color="text.secondary">
                        Click to start coloring! 🎨
                      </Typography>
                    )}
                    
                    {image.status === 'processing' && (
                      <Typography variant="body2" color="text.secondary">
                        AI is working on your drawing... ⏳
                      </Typography>
                    )}
                    
                    {image.status === 'failed' && (
                      <Typography variant="body2" color="error">
                        {image.error || 'Processing failed. Try again!'}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Tips Section */}
      <Paper
        sx={{
          mt: 6,
          p: 4,
          background: 'linear-gradient(135deg, #E5FFE5 0%, #FFF8E5 100%)',
          borderRadius: 4
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          Pro Tips! 💡
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1, color: theme.palette.primary.main }}>
                📱 Good Lighting
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Take photos in bright, natural light for the best results!
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1, color: theme.palette.secondary.main }}>
                🖼️ Clear Background
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use a plain background so AI can focus on your drawing!
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#FFE66D' }}>
                ✏️ Bold Lines
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drawings with clear, dark lines work best for coloring!
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default UploadPage; 