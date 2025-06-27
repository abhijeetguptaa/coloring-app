import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Palette as PaletteIcon,
  CloudUpload as UploadIcon,
  AutoAwesome as AIIcon,
  Book as BookIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ColoringImage } from '../types';
import aiService from '../services/aiService';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [featuredImages, setFeaturedImages] = useState<ColoringImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedImages = async () => {
      try {
        const images = await Promise.all([
          aiService.generateColoringImage('Happy Cat', 'animals'),
          aiService.generateColoringImage('Magic Dragon', 'fantasy'),
          aiService.generateColoringImage('Beautiful Flower', 'nature')
        ]);
        setFeaturedImages(images);
      } catch (error) {
        console.error('Error loading featured images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedImages();
  }, []);

  const quickActions = [
    {
      title: 'Start Coloring',
      description: 'Choose from our collection of fun drawings',
      icon: <PaletteIcon sx={{ fontSize: 40 }} />,
      color: '#FF6B9D',
      path: '/color/new'
    },
    {
      title: 'Upload Your Drawing',
      description: 'Turn your artwork into a coloring page',
      icon: <UploadIcon sx={{ fontSize: 40 }} />,
      color: '#4ECDC4',
      path: '/upload'
    },
    {
      title: 'AI Generated',
      description: 'Create unique drawings with AI',
      icon: <AIIcon sx={{ fontSize: 40 }} />,
      color: '#FFE66D',
      path: '/color/new'
    },
    {
      title: 'View Gallery',
      description: 'See amazing artwork from other kids',
      icon: <BookIcon sx={{ fontSize: 40 }} />,
      color: '#95E1D3',
      path: '/gallery'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 6,
          p: 4,
          background: 'linear-gradient(135deg, #FFE5E5 0%, #E5F4FF 100%)',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Typography
          variant="h1"
          sx={{
            mb: 2,
            background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Welcome to AI Coloring Books! 🎨
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
          Create, color, and bring your imagination to life with AI-powered drawings!
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/color/new')}
          sx={{
            fontSize: '1.2rem',
            py: 2,
            px: 4,
            borderRadius: 30,
            background: 'linear-gradient(45deg, #FF6B9D, #4ECDC4)',
            '&:hover': {
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease-in-out'
            }
          }}
        >
          Start Coloring Now! ✨
        </Button>
      </Box>

      {/* Quick Actions */}
      <Typography variant="h2" sx={{ mb: 4, textAlign: 'center' }}>
        What would you like to do today?
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
        {quickActions.map((action, index) => (
          <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                }
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: 'white'
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Featured Images */}
      <Typography variant="h2" sx={{ mb: 4, textAlign: 'center' }}>
        Featured Drawings ⭐
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {featuredImages.map((image, index) => (
          <Box key={image.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(33.333% - 16px)' } }}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                }
              }}
              onClick={() => navigate(`/color/${image.id}`)}
            >
              <CardMedia
                component="img"
                height="250"
                image={image.originalImageUrl}
                alt={image.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  {image.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {image.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={image.category}
                    size="small"
                    sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}
                  />
                  <Chip
                    label={image.difficulty}
                    size="small"
                    sx={{ backgroundColor: theme.palette.secondary.main, color: 'white' }}
                  />
                  {image.isAI && (
                    <Chip
                      icon={<AIIcon />}
                      label="AI Generated"
                      size="small"
                      sx={{ backgroundColor: '#FFE66D', color: 'black' }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Fun Facts Section */}
      <Paper
        sx={{
          mt: 6,
          p: 4,
          background: 'linear-gradient(135deg, #E5FFE5 0%, #FFF8E5 100%)',
          borderRadius: 4
        }}
      >
        <Typography variant="h3" sx={{ mb: 3, textAlign: 'center' }}>
          Did you know? 🤔
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
            <Box sx={{ textAlign: 'center' }}>
              <StarIcon sx={{ fontSize: 60, color: '#FF6B9D', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Coloring helps you relax!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                It's like a fun meditation that makes your brain happy!
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
            <Box sx={{ textAlign: 'center' }}>
              <AIIcon sx={{ fontSize: 60, color: '#4ECDC4', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                AI creates unique drawings!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Every drawing is special and made just for you!
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.333%' } }}>
            <Box sx={{ textAlign: 'center' }}>
              <BookIcon sx={{ fontSize: 60, color: '#FFE66D', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Share your artwork!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Show your friends and family your amazing creations!
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default HomePage; 