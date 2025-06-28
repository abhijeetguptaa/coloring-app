import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  GiElephant, GiTiger, GiPolarBear, GiFox, GiWolfHowl, GiDeer, GiPenguin,
  GiFlamingo, GiSittingDog, GiSwan, GiHummingbird,
  GiButterfly, GiBee, GiLadybug, GiAnt, GiDragonfly, GiCricket,
  GiUnicorn, GiMermaid, GiFairy, GiCrystalBall, GiCrown, GiCastle, GiMagicLamp,
  GiEagleEmblem, GiOwl, GiBirdTwitter
} from 'react-icons/gi';
import {
  IoCarOutline, IoAirplaneOutline, IoTrainOutline, IoBoatOutline,
  IoLeafOutline, IoSunnyOutline, IoMoonOutline, IoStarOutline, IoCloudOutline,
  IoFishOutline, IoHeartOutline, IoWaterOutline, IoFlameOutline
} from 'react-icons/io5';
import {
  MdOutlineDirectionsCar, MdOutlineFlight, MdOutlineTrain, MdOutlineDirectionsBoat,
  MdOutlinePedalBike, MdOutlinePark, MdOutlineWbSunny, MdOutlineNightlight,
  MdOutlineStar, MdOutlineCloud, MdOutlineWaterDrop, MdOutlineFavorite,
  MdOutlineLocalFireDepartment
} from 'react-icons/md';
import {
  TbCar, TbPlane, TbTrain, TbShip, TbBike, TbLeaf, TbSun, TbMoon,
  TbStar, TbCloud, TbHeart, TbDroplet, TbFlame
} from 'react-icons/tb';
import './App.css';

// Outlined Alphabet SVG React component
const AlphabetOutline = ({ letter, size = 600 }) => (
  <svg width={size} height={size} viewBox="0 0 600 600">
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="500"
      fontFamily="Arial, Helvetica, sans-serif"
      stroke="black"
      strokeWidth="16"
      fill="none"
    >
      {letter}
    </text>
  </svg>
);

function App() {
  const [outlines, setOutlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPages, setSelectedPages] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive icon sizes
  const getIconSize = () => {
    if (windowWidth <= 480) return 300; // Mobile
    if (windowWidth <= 768) return 400; // Tablet
    if (windowWidth <= 1200) return 500; // Small desktop
    return 600; // Large desktop
  };

  const getGuideIconSize = () => {
    if (windowWidth <= 480) return 30; // Mobile
    if (windowWidth <= 768) return 35; // Tablet
    return 42; // Desktop
  };

  const getGuideContainerSize = () => {
    if (windowWidth <= 480) return 80; // Mobile
    if (windowWidth <= 768) return 90; // Tablet
    return 105; // Desktop
  };

  const getGuideIconContainerSize = () => {
    if (windowWidth <= 480) return 40; // Mobile
    if (windowWidth <= 768) return 45; // Tablet
    return 56; // Desktop
  };

  const getGuidePosition = () => {
    if (windowWidth <= 480) return { top: '5px', right: '5px' }; // Mobile
    if (windowWidth <= 768) return { top: '10px', right: '10px' }; // Tablet
    return { top: '0px', right: '0px' }; // Desktop
  };

  // Generate alphabet outline components
  const alphabetComponents = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => {
      const letter = String.fromCharCode(65 + i);
      return (props) => <AlphabetOutline letter={letter} {...props} />;
    });
  }, []);

  // Function to get mixed colors based on category and icon type
  const getMixedColors = (category, iconIndex) => {
    const colorPalettes = {
      alphabets: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
      animals: ['#ff6600', '#ff0066', '#6600ff', '#00ff66', '#ff6600', '#0066ff'],
      birds: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
      transports: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
      insects: ['#ff6600', '#ff0066', '#6600ff', '#00ff66', '#ff6600', '#0066ff'],
      fantasy: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
      nature: ['#00ff00', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
    };
    
    const palette = colorPalettes[category] || colorPalettes.alphabets;
    return palette[iconIndex % palette.length];
  };

  // Category icon pools
  const iconPools = useMemo(() => ({
    alphabets: alphabetComponents,
    animals: [GiElephant, GiTiger, GiPolarBear, GiFox, GiWolfHowl, GiDeer],
    birds: [GiEagleEmblem, GiOwl, GiBirdTwitter, GiPenguin, GiFlamingo, GiSittingDog, GiSwan, GiHummingbird],
    transports: [IoCarOutline, IoAirplaneOutline, IoTrainOutline, IoBoatOutline, TbCar, TbPlane, TbTrain, TbShip, TbBike, MdOutlineDirectionsCar, MdOutlineFlight, MdOutlineTrain, MdOutlineDirectionsBoat, MdOutlinePedalBike],
    insects: [GiButterfly, GiBee, GiLadybug, GiAnt, GiDragonfly, GiCricket],
    fantasy: [GiUnicorn, GiMermaid, GiFairy, GiCrystalBall, GiCrown, GiCastle, GiMagicLamp],
    nature: [IoLeafOutline, TbLeaf, TbSun, TbMoon, TbStar, TbCloud, TbHeart, TbDroplet, TbFlame, IoSunnyOutline, IoMoonOutline, IoStarOutline, IoCloudOutline, IoFishOutline, IoHeartOutline, IoWaterOutline, IoFlameOutline, MdOutlinePark, MdOutlineWbSunny, MdOutlineNightlight, MdOutlineStar, MdOutlineCloud, MdOutlineWaterDrop, MdOutlineFavorite, MdOutlineLocalFireDepartment],
  }), [alphabetComponents]);

  // All icons
  const allIcons = useMemo(() => [
    ...iconPools.alphabets,
    ...iconPools.animals,
    ...iconPools.birds,
    ...iconPools.transports,
    ...iconPools.insects,
    ...iconPools.fantasy,
    ...iconPools.nature,
  ], [iconPools]);

  // Filtered icon pool based on category
  const iconComponents = useMemo(() => {
    if (selectedCategory === 'all') return allIcons;
    return iconPools[selectedCategory] || allIcons;
  }, [selectedCategory, allIcons, iconPools]);

  const generateOutlines = useCallback(() => {
    setLoading(true);
    const getRandomIcons = (count) => {
      const shuffled = [...iconComponents].sort(() => 0.5 - Math.random());
      const result = [];
      for (let i = 0; i < count; i++) {
        const IconComponent = shuffled[i % shuffled.length];
        result.push(IconComponent);
      }
      return result;
    };
    const newOutlines = getRandomIcons(selectedPages);
    setOutlines(newOutlines);
    setLoading(false);
  }, [selectedPages, iconComponents]);

  useEffect(() => {
    generateOutlines();
  }, [generateOutlines]);

  return (
    <div className="App">
      <div className="controls">
        <div className="print-controls">
          <label htmlFor="categorySelect">Category:</label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="category-select"
            style={{ marginRight: 16 }}
          >
            <option value="all">All</option>
            <option value="alphabets">Alphabets</option>
            <option value="animals">Animals</option>
            <option value="birds">Birds</option>
            <option value="transports">Transports</option>
            <option value="insects">Insects</option>
            <option value="fantasy">Fantasy</option>
            <option value="nature">Nature</option>
          </select>
          <label htmlFor="pageCount">Number of Pages:</label>
          <select
            id="pageCount"
            value={selectedPages}
            onChange={e => setSelectedPages(parseInt(e.target.value))}
            className="page-select"
          >
            <option value={5}>5 Page</option>
            <option value={10}>10 Pages</option>
            <option value={15}>15 Pages</option>
            <option value={20}>20 Pages</option>
            <option value={25}>25 Pages</option>
            <option value={30}>30 Pages</option>
            <option value={35}>35 Pages</option>
            <option value={40}>40 Pages</option>
            <option value={45}>45 Pages</option>
            <option value={50}>50 Pages</option>
          </select>
          <button className="print-btn" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </div>
      <div className="pages-container">
        {loading ? (
          <div className="loading">Loading icons...</div>
        ) : (
          outlines.map((IconComponent, index) => {
            const mixedColor = getMixedColors(selectedCategory, index);
            return (
              <div key={index} className="outline-page">
                <div className="image-container" style={{ position: 'relative' }}>
                  <div style={{ 
                    width: `${getIconSize()}px`, 
                    height: `${getIconSize()}px`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}>
                    {/* Main outline icon for coloring */}
                    <IconComponent
                      size={getIconSize()}
                      style={{
                        color: 'black',
                        stroke: 'black',
                        strokeWidth: '2px',
                        fill: 'none'
                      }}
                    />
                  </div>
                  {/* Filled colored guide in top right corner */}
                  <div style={{
                    position: 'absolute',
                    top: getGuidePosition().top,
                    right: getGuidePosition().right,
                    width: `${getGuideContainerSize()}px`,
                    height: `${getGuideContainerSize()}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    border: '5px solid #333',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    zIndex: 10,
                    boxSizing: 'border-box'
                  }}>
                    <div style={{ 
                      fontSize: windowWidth <= 480 ? '10px' : '12px', 
                      fontWeight: 'bold', 
                      marginBottom: '3px', 
                      color: '#333',
                      textAlign: 'center',
                      lineHeight: '1'
                    }}>
                      COLOR GUIDE
                    </div>
                    <div style={{
                      width: `${getGuideIconContainerSize()}px`,
                      height: `${getGuideIconContainerSize()}px`,
                      backgroundColor: mixedColor,
                      borderRadius: '8px',
                      border: '2px solid #333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <IconComponent
                        size={getGuideIconSize()}
                        style={{
                          color: 'white',
                          stroke: 'white',
                          strokeWidth: '2px',
                          fill: 'white'
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="page-footer">
                  <p>Name: _________________________</p>
                  <p>Date: _________________________</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;
