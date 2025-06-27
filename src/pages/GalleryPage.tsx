import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Favorite as LikeIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  AutoAwesome as AIIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { UserArtwork, ColoringImage } from '../types';
import aiService from '../services/aiService';

const GalleryPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [artworks, setArtworks] = useState<UserArtwork[]>([]);
  const [coloringImages, setColoringImages] = useState<ColoringImage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState<UserArtwork | null>(null);
  const [showArtworkDialog, setShowArtworkDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGalleryData = async () => {
      try {
        // Load sample artworks (in a real app, this would fetch from API)
        const sampleArtworks: UserArtwork[] = [
          {
            id: '1',
            coloringImageId: '1',
            coloredImageUrl: 'https://via.placeholder.com/400x400/FFE5E5/FF6B9D?text=Colored+Cat',
            title: 'Rainbow Cat',
            description: 'A beautiful cat with rainbow colors!',
            colors: ['#FF6B9D', '#4ECDC4', '#FFE66D'],
            createdAt: new Date(),
            isPublic: true
          },
          {
            id: '2',
            coloringImageId: '2',
            coloredImageUrl: 'https://via.placeholder.com/400x400/E5F4FF/4ECDC4?text=Colored+Dragon',
            title: 'Magic Dragon',
            description: 'A magical dragon with sparkly colors!',
            colors: ['#4ECDC4', '#A8E6CF', '#FFD3B6'],
            createdAt: new Date(Date.now() - 86400000),
            isPublic: true
          },
          {
            id: '3',
            coloringImageId: '3',
            coloredImageUrl: 'https://via.placeholder.com/400x400/E5FFE5/4CAF50?text=Colored+Flower',
            title: 'Garden Flower',
            description: 'A beautiful flower from the garden!',
            colors: ['#4CAF50', '#8BC34A', '#CDDC39'],
            createdAt: new Date(Date.now() - 172800000),
            isPublic: true
          }
        ];

        const sampleColoringImages: ColoringImage[] = [
          {
            id: '1',
            title: 'Happy Cat',
            description: 'A cute cat waiting to be colored!',
            originalImageUrl: 'https://via.placeholder.com/400x400/FFE5E5/FF6B9D?text=Happy+Cat',
            outlineImageUrl: 'https://via.placeholder.com/400x400/FFFFFF/000000?text=Cat+Outline',
            category: 'animals',
            difficulty: 'easy',
            tags: ['cat', 'animals', 'cute'],
            createdAt: new Date(),
            isAI: true
          },
          {
            id: '2',
            title: 'Magic Dragon',
            description: 'A magical dragon for brave artists!',
            originalImageUrl: 'https://via.placeholder.com/400x400/E5F4FF/4ECDC4?text=Magic+Dragon',
            outlineImageUrl: 'https://via.placeholder.com/400x400/FFFFFF/000000?text=Dragon+Outline',
            category: 'fantasy',
            difficulty: 'medium',
            tags: ['dragon', 'fantasy', 'magic'],
            createdAt: new Date(),
            isAI: true
          },
          {
            id: '3',
            title: 'Beautiful Flower',
            description: 'A lovely flower from nature!',
            originalImageUrl: 'https://via.placeholder.com/400x400/E5FFE5/4CAF50?text=Beautiful+Flower',
            outlineImageUrl: 'https://via.placeholder.com/400x400/FFFFFF/000000?text=Flower+Outline',
            category: 'nature',
            difficulty: 'easy',
            tags: ['flower', 'nature', 'garden'],
            createdAt: new Date(),
            isAI: true
          }
        ];

        setArtworks(sampleArtworks);
        setColoringImages(sampleColoringImages);
      } catch (error) {
        console.error('Error loading gallery data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGalleryData();
  }, []);

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artwork.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           coloringImages.find(img => img.id === artwork.coloringImageId)?.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || 
                             coloringImages.find(img => img.id === artwork.coloringImageId)?.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleArtworkClick = (artwork: UserArtwork) => {
    setSelectedArtwork(artwork);
    setShowArtworkDialog(true);
  };

  const handleLike = (artworkId: string) => {
    // In a real app, this would update the like count in the database
    console.log('Liked artwork:', artworkId);
  };

  const handleShare = async (artwork: UserArtwork) => {
    try {
      await navigator.clipboard.writeText(artwork.coloredImageUrl);
      alert('Artwork link copied to clipboard! Share it with your friends!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard. Try downloading instead!');
    }
  };

  const handleDownload = (artwork: UserArtwork) => {
    const link = document.createElement('a');
    link.download = `${artwork.title}.png`;
    link.href = artwork.coloredImageUrl;
    link.click();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4">Loading amazing artwork... 🎨</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 3, textAlign: 'center' }}>
        Art Gallery 🖼️
      </Typography>
      
      <Typography variant="h5" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        Discover amazing artwork created by kids just like you! ✨
      </Typography>

      {/* Search and Filter */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search for artwork..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="animals">Animals</MenuItem>
                <MenuItem value="fantasy">Fantasy</MenuItem>
                <MenuItem value="nature">Nature</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={selectedDifficulty}
                label="Difficulty"
                onChange={(e) => setSelectedDifficulty(e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Artwork Grid */}
      {filteredArtworks.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            No artwork found! 😢
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search or filters
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
          >
            Clear Filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredArtworks.map((artwork) => {
            const originalImage = coloringImages.find(img => img.id === artwork.coloringImageId);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={artwork.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    }
                  }}
                  onClick={() => handleArtworkClick(artwork)}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={artwork.coloredImageUrl}
                    alt={artwork.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {artwork.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {artwork.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {originalImage && (
                        <Chip
                          label={originalImage.category}
                          size="small"
                          sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}
                        />
                      )}
                      {originalImage && (
                        <Chip
                          label={originalImage.difficulty}
                          size="small"
                          sx={{ backgroundColor: theme.palette.secondary.main, color: 'white' }}
                        />
                      )}
                      {originalImage?.isAI && (
                        <Chip
                          icon={<AIIcon />}
                          label="AI Generated"
                          size="small"
                          sx={{ backgroundColor: '#FFE66D', color: 'black' }}
                        />
                      )}
                    </Box>

                    {/* Color Palette */}
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                      {artwork.colors.slice(0, 5).map((color, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: color,
                            borderRadius: '50%',
                            border: '1px solid #ccc'
                          }}
                        />
                      ))}
                      {artwork.colors.length > 5 && (
                        <Typography variant="caption" color="text.secondary">
                          +{artwork.colors.length - 5} more
                        </Typography>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<LikeIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(artwork.id);
                        }}
                      >
                        Like
                      </Button>
                      <Button
                        size="small"
                        startIcon={<ShareIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(artwork);
                        }}
                      >
                        Share
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(artwork);
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Artwork Detail Dialog */}
      <Dialog
        open={showArtworkDialog}
        onClose={() => setShowArtworkDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedArtwork && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon sx={{ color: '#FFE66D' }} />
                {selectedArtwork.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <img
                    src={selectedArtwork.coloredImageUrl}
                    alt={selectedArtwork.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '8px'
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    About this artwork:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {selectedArtwork.description}
                  </Typography>
                  
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Colors used:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {selectedArtwork.colors.map((color, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 30,
                          height: 30,
                          backgroundColor: color,
                          borderRadius: '50%',
                          border: '2px solid #ccc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Box>
                    ))}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    Created on: {selectedArtwork.createdAt.toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowArtworkDialog(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleDownload(selectedArtwork);
                  setShowArtworkDialog(false);
                }}
              >
                Download
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  navigate(`/color/${selectedArtwork.coloringImageId}`);
                  setShowArtworkDialog(false);
                }}
              >
                Color This Too!
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Call to Action */}
      <Paper
        sx={{
          mt: 6,
          p: 4,
          background: 'linear-gradient(135deg, #FFE5E5 0%, #E5F4FF 100%)',
          borderRadius: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Ready to create your own masterpiece? 🎨
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Join the fun and share your colorful creations with the world!
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/color/new')}
            sx={{ fontSize: '1.1rem', py: 1.5, px: 3 }}
          >
            Start Coloring
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/upload')}
            sx={{ fontSize: '1.1rem', py: 1.5, px: 3 }}
          >
            Upload Drawing
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default GalleryPage; 