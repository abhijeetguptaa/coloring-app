import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FaCat, FaDog, FaHorse, FaPaw, FaCar, FaPlane, FaTrain, FaShip, 
  FaMotorcycle, FaBicycle, FaTree, FaSun, 
  FaMoon, FaStar, FaCloud, FaRainbow, FaMountain, FaFish, 
  FaDragon, FaHeart, FaStarOfLife,
  FaLeaf, FaSeedling, FaCloudRain, FaSnowflake, FaFire, FaWater
} from 'react-icons/fa';
import { 
  GiElephant, GiTiger, GiPolarBear, GiFox, GiWolfHowl, GiDeer, GiPenguin,
  GiFlamingo, GiSittingDog, GiSwan, GiHummingbird, GiBus,
  GiTruck, GiHelicopter, GiRocket,
  GiSubmarine, GiLadybug, GiAnt,
  GiDragonfly, GiCricket, GiButterfly, GiBee, GiUnicorn,
  GiMermaid, GiFairy, GiCrystalBall, GiFlowerEmblem, GiCrown, GiMagicLamp,
  GiForest, GiDesert, GiVolcano, GiWaterfall, GiCastle, GiEagleEmblem, GiOwl, GiBirdTwitter
} from 'react-icons/gi';
import './App.css';

function App() {
  const [outlines, setOutlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPages, setSelectedPages] = useState(5);

  // Collection of React Icons for different categories - wrapped in useMemo to prevent recreation
  const iconComponents = useMemo(() => [
    // Animals
    FaCat, FaDog, GiElephant, FaPaw, GiTiger, GiPolarBear, FaHorse, GiFox, GiWolfHowl, GiDeer,
    // Birds
    GiEagleEmblem, GiOwl, GiBirdTwitter, GiPenguin, GiFlamingo, GiSittingDog, GiSwan, GiHummingbird,
    // Transports
    FaCar, FaPlane, FaTrain, FaShip, GiBus, GiTruck, FaMotorcycle, FaBicycle, GiHelicopter, GiRocket, GiSubmarine,
    // Insects
    GiButterfly, GiBee, GiLadybug, GiAnt, GiDragonfly, GiCricket,
    // Fantasy
    FaDragon, GiUnicorn, GiMermaid, GiFairy, GiCrystalBall, GiCrown, GiCastle, GiMagicLamp,
    // Nature
    FaTree, GiFlowerEmblem, FaSun, FaMoon, FaStar, FaCloud, FaRainbow, FaMountain, FaFish, FaLeaf, FaSeedling, FaCloudRain, FaSnowflake, FaFire, FaWater, GiForest, GiDesert, GiVolcano, GiWaterfall, FaStarOfLife, FaHeart
  ], []);

  const generateOutlines = useCallback(() => {
    setLoading(true);
    
    // Function to get random icons
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
          <label htmlFor="pageCount">Number of Pages:</label>
          <select 
            id="pageCount" 
            value={selectedPages} 
            onChange={(e) => setSelectedPages(parseInt(e.target.value))}
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
          outlines.map((IconComponent, index) => (
            <div key={index} className="outline-page">
              <div className="page-header">
                <h2>Cartoon Coloring Outline</h2>
                <p>Page {index + 1} of {selectedPages}</p>
              </div>
              
              <div className="image-container">
                <div style={{ width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComponent 
                    size={200} 
                    style={{ 
                      color: 'black'
                    }} 
                  />
                </div>
              </div>
              
              <div className="page-footer">
                <p>Name: _________________________</p>
                <p>Date: _________________________</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
