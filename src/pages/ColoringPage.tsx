import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Slider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  useTheme
} from '@mui/material';
import {
  Brush as BrushIcon,
  FormatPaint as FillIcon,
  AutoFixHigh as EraserIcon,
  Save as SaveIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Palette as PaletteIcon,
  AutoAwesome as AIIcon,
  Book as BookIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, Image as FabricImage, PencilBrush } from 'fabric';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ColoringImage, AIStory } from '../types';
import aiService from '../services/aiService';

const ColoringPage: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  
  const [coloringImage, setColoringImage] = useState<ColoringImage | null>(null);
  const [currentTool, setCurrentTool] = useState<'brush' | 'fill' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState(10);
  const [selectedColor, setSelectedColor] = useState('#FF6B9D');
  const [showStoryDialog, setShowStoryDialog] = useState(false);
  const [aiStory, setAiStory] = useState<AIStory | null>(null);
  const [artworkTitle, setArtworkTitle] = useState('');
  const [loading, setLoading] = useState(true);

  const colorPalette = [
    '#FF6B9D', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181',
    '#A8E6CF', '#DCEDC8', '#FFD3B6', '#FFAAA5', '#FF8B94',
    '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FF9800',
    '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#00BCD4'
  ];

  useEffect(() => {
    const loadColoringImage = async () => {
      try {
        if (id === 'new') {
          // Generate a new AI image
          const newImage = await aiService.generateColoringImage('Happy Cat', 'animals');
          setColoringImage(newImage);
        } else {
          // Load existing image (in a real app, this would fetch from API)
          const mockImage: ColoringImage = {
            id: id || '1',
            title: 'Happy Cat',
            description: 'A cute cat waiting to be colored!',
            originalImageUrl: 'https://via.placeholder.com/600x600/FFE5E5/FF6B9D?text=Happy+Cat',
            outlineImageUrl: 'https://via.placeholder.com/600x600/FFFFFF/000000?text=Cat+Outline',
            category: 'animals',
            difficulty: 'easy',
            tags: ['cat', 'animals', 'cute'],
            createdAt: new Date(),
            isAI: true
          };
          setColoringImage(mockImage);
        }
      } catch (error) {
        console.error('Error loading coloring image:', error);
      } finally {
        setLoading(false);
      }
    };

    loadColoringImage();
  }, [id]);

  useEffect(() => {
    if (coloringImage && canvasRef.current) {
      initializeCanvas();
    }
  }, [coloringImage]);

  const initializeCanvas = () => {
    if (!canvasRef.current || !coloringImage) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: '#ffffff'
    });

    fabricCanvasRef.current = canvas;

    // Load the outline image
    FabricImage.fromURL(coloringImage.outlineImageUrl, { crossOrigin: 'anonymous' }).then((img: any) => {
      img.scaleToWidth(600);
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false
      });
      canvas.add(img);
      canvas.renderAll();
    });

    // Set up drawing mode
    canvas.isDrawingMode = true;
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = brushSize;
      canvas.freeDrawingBrush.color = selectedColor;
    }
  };

  const handleToolChange = (tool: 'brush' | 'fill' | 'eraser') => {
    setCurrentTool(tool);
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      canvas.isDrawingMode = tool === 'brush' || tool === 'eraser';
      
      if (tool === 'brush') {
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = brushSize;
          canvas.freeDrawingBrush.color = selectedColor;
        }
      } else if (tool === 'eraser') {
        canvas.freeDrawingBrush = new PencilBrush(canvas);
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.width = brushSize;
          canvas.freeDrawingBrush.color = '#ffffff';
        }
      }
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (fabricCanvasRef.current && currentTool === 'brush' && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = color;
    }
  };

  const handleBrushSizeChange = (event: Event, newValue: number | number[]) => {
    const size = newValue as number;
    setBrushSize(size);
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.width = size;
    }
  };

  const handleUndo = () => {
    if (fabricCanvasRef.current) {
      // Fabric.js doesn't have built-in undo/redo, so we'll implement a simple version
      const objects = fabricCanvasRef.current.getObjects();
      if (objects.length > 1) {
        fabricCanvasRef.current.remove(objects[objects.length - 1]);
        fabricCanvasRef.current.renderAll();
      }
    }
  };

  const handleRedo = () => {
    // For now, we'll just show a message since implementing redo requires more complex state management
    alert('Redo functionality coming soon!');
  };

  const handleSave = () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1
      });
      
      const link = document.createElement('a');
      link.download = `coloring-${coloringImage?.title || 'artwork'}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  const handleShare = async () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1
      });
      
      try {
        await navigator.clipboard.writeText(dataURL);
        alert('Artwork copied to clipboard! Share it with your friends!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        alert('Failed to copy to clipboard. Try saving instead!');
      }
    }
  };

  const handleExportPDF = async () => {
    if (fabricCanvasRef.current) {
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1
      });
      
      const pdf = new jsPDF();
      const img = new Image();
      img.src = dataURL;
      
      img.onload = () => {
        const canvasWidth = 600;
        const canvasHeight = 600;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvasHeight * pdfWidth) / canvasWidth;
        
        pdf.addImage(dataURL, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`coloring-${coloringImage?.title || 'artwork'}.pdf`);
      };
    }
  };

  const handleGenerateStory = async () => {
    if (!coloringImage) return;
    
    try {
      const story = await aiService.generateStory(
        coloringImage.id,
        [selectedColor],
        coloringImage.category
      );
      setAiStory(story);
      setShowStoryDialog(true);
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Try again!');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4">Loading your coloring page... 🎨</Typography>
      </Container>
    );
  }

  if (!coloringImage) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4">Image not found! 😢</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Go back home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" sx={{ mb: 3, textAlign: 'center' }}>
        {coloringImage.title} 🎨
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Tools Panel */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 25%' } }}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Tools 🛠️
            </Typography>
            
            {/* Tool Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Choose your tool:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Tooltip title="Brush">
                  <IconButton
                    onClick={() => handleToolChange('brush')}
                    sx={{
                      backgroundColor: currentTool === 'brush' ? theme.palette.primary.main : 'transparent',
                      color: currentTool === 'brush' ? 'white' : 'inherit'
                    }}
                  >
                    <BrushIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Fill">
                  <IconButton
                    onClick={() => handleToolChange('fill')}
                    sx={{
                      backgroundColor: currentTool === 'fill' ? theme.palette.primary.main : 'transparent',
                      color: currentTool === 'fill' ? 'white' : 'inherit'
                    }}
                  >
                    <FillIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Eraser">
                  <IconButton
                    onClick={() => handleToolChange('eraser')}
                    sx={{
                      backgroundColor: currentTool === 'eraser' ? theme.palette.primary.main : 'transparent',
                      color: currentTool === 'eraser' ? 'white' : 'inherit'
                    }}
                  >
                    <EraserIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Brush Size */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Brush size: {brushSize}px
              </Typography>
              <Slider
                value={brushSize}
                onChange={handleBrushSizeChange}
                min={1}
                max={50}
                valueLabelDisplay="auto"
                sx={{ color: theme.palette.primary.main }}
              />
            </Box>

            {/* Color Palette */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Choose your colors:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {colorPalette.map((color) => (
                  <Box
                    key={color}
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: color,
                      borderRadius: '50%',
                      cursor: 'pointer',
                      border: selectedColor === color ? '3px solid #333' : '2px solid #ccc',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<UndoIcon />}
                onClick={handleUndo}
                fullWidth
              >
                Undo
              </Button>
              <Button
                variant="outlined"
                startIcon={<RedoIcon />}
                onClick={handleRedo}
                fullWidth
              >
                Redo
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                fullWidth
              >
                Save
              </Button>
              <Button
                variant="contained"
                startIcon={<ShareIcon />}
                onClick={handleShare}
                fullWidth
              >
                Share
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportPDF}
                fullWidth
              >
                Export PDF
              </Button>
              <Button
                variant="contained"
                startIcon={<AIIcon />}
                onClick={handleGenerateStory}
                fullWidth
                sx={{ backgroundColor: '#FFE66D', color: 'black' }}
              >
                Generate Story
              </Button>
            </Box>
          </Paper>
        </Box>

        {/* Canvas */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 75%' } }}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <canvas
                ref={canvasRef}
                style={{
                  border: '2px solid #ccc',
                  borderRadius: '8px',
                  cursor: 'crosshair'
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Use your mouse or finger to color! 🖱️👆
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Story Dialog */}
      <Dialog
        open={showStoryDialog}
        onClose={() => setShowStoryDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookIcon />
            Your AI-Generated Story
          </Box>
        </DialogTitle>
        <DialogContent>
          {aiStory && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, color: theme.palette.primary.main }}>
                {aiStory.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                {aiStory.content}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Characters: {aiStory.characters.join(', ')}
                </Typography>
                <Typography variant="subtitle2">
                  Theme: {aiStory.theme}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStoryDialog(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // Save story functionality
              setShowStoryDialog(false);
            }}
          >
            Save Story
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ColoringPage; 