import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Import CSS files with @import rules
import './styles/coloring.css';
import './App.css';

// Components
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ColoringPage from './pages/ColoringPage';
import GalleryPage from './pages/GalleryPage';
import UploadPage from './pages/UploadPage';

// Create a child-friendly theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B9D', // Pink
    },
    secondary: {
      main: '#4ECDC4', // Turquoise
    },
    background: {
      default: '#FFF8F0',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#FF6B9D',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#4ECDC4',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#FF6B9D',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: 'none',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          padding: '12px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/color/:id" element={<ColoringPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
