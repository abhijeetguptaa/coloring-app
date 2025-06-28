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

  // Generate alphabet outline components
  const alphabetComponents = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => {
      const letter = String.fromCharCode(65 + i);
      return (props) => <AlphabetOutline letter={letter} {...props} />;
    });
  }, []);

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
          outlines.map((IconComponent, index) => (
            <div key={index} className="outline-page">
              <div className="page-header">
                <h2>Cartoon Coloring Outline</h2>
                <p>Page {index + 1} of {selectedPages}</p>
              </div>
              <div className="image-container">
                <div style={{ width: '600px', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComponent
                    size={600}
                    style={{
                      color: 'black',
                      stroke: 'black',
                      strokeWidth: '2px',
                      fill: 'none'
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
