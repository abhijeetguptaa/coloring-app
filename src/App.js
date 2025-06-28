import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [outlines, setOutlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPages, setSelectedPages] = useState(5);

  const freeIconSources = [
    'https://img.icons8.com/ios/512/cat.png',
    'https://img.icons8.com/ios/512/dog.png',
    'https://img.icons8.com/ios/512/elephant.png',
    'https://img.icons8.com/ios/512/lion.png',
    'https://img.icons8.com/ios/512/car.png',
    'https://img.icons8.com/ios/512/airplane.png',
    'https://img.icons8.com/ios/512/train.png',
    'https://img.icons8.com/ios/512/boat.png',
    'https://img.icons8.com/ios/512/eagle.png',
    'https://img.icons8.com/ios/512/owl.png',
    'https://img.icons8.com/ios/512/butterfly.png',
    'https://img.icons8.com/ios/512/bee.png',
    'https://img.icons8.com/ios/512/tree.png',
    'https://img.icons8.com/ios/512/flower.png',
    'https://img.icons8.com/ios/512/sun.png',
    'https://img.icons8.com/ios/512/moon.png',
    'https://img.icons8.com/ios/512/star.png',
    'https://img.icons8.com/ios/512/cloud.png',
    'https://img.icons8.com/ios/512/rainbow.png',
    'https://img.icons8.com/ios/512/mountain.png',
  ];

  const getRandomImages = (count) => {
    // Create enough images by repeating the shuffled array if needed
    const shuffled = [...freeIconSources].sort(() => 0.5 - Math.random());
    const result = [];
    
    for (let i = 0; i < count; i++) {
      result.push(shuffled[i % shuffled.length]);
    }
    
    return result;
  };

  const generateOutlines = () => {
    setLoading(true);
    const newOutlines = getRandomImages(selectedPages);
    setOutlines(newOutlines);
    setLoading(false);
  };

  const printMultiplePages = () => {
    // Generate fresh images for printing to ensure each page has a different image
    const imagesForPrint = getRandomImages(selectedPages);
    
    const printWindow = window.open('', '_blank');
    let printContent = `
      <html>
        <head>
          <title>Coloring Pages</title>
          <style>
            @page { size: A4; margin: 1cm; }
            body { margin: 0; padding: 0; background: white; }
            .page { page-break-after: always; padding: 20px; }
            .page:last-child { page-break-after: auto; }
            .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .image-container { text-align: center; min-height: 600px; display: flex; align-items: center; justify-content: center; }
            .footer { border-top: 1px solid #000; padding-top: 15px; margin-top: 20px; }
          </style>
        </head>
        <body>
    `;

    for (let i = 0; i < selectedPages; i++) {
      const imageUrl = imagesForPrint[i];
      printContent += `
        <div class="page">
          <div class="header">
            <h2>Cartoon Coloring Outline</h2>
            <p>Page ${i + 1} of ${selectedPages}</p>
          </div>
          <div class="image-container">
            <img src="${imageUrl}" style="max-width: 100%; max-height: 600px; object-fit: contain;" alt="Coloring outline ${i + 1}">
          </div>
          <div class="footer">
            <p>Name: _________________________</p>
            <p>Date: _________________________</p>
          </div>
        </div>
      `;
    }

    printContent += '</body></html>';
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  useEffect(() => {
    generateOutlines();
  }, [selectedPages]);

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
          <button onClick={printMultiplePages} className="print-btn">
            Print {selectedPages} Page{selectedPages > 1 ? 's' : ''} as PDF
          </button>
        </div>
      </div>
      
      <div className="pages-container">
        {loading ? (
          <div className="loading">Loading images...</div>
        ) : (
          outlines.map((imageUrl, index) => (
            <div key={index} className="outline-page">
              <div className="page-header">
                <h2>Cartoon Coloring Outline</h2>
                <p>Page {index + 1} of {selectedPages}</p>
              </div>
              
              <div className="image-container">
                <img 
                  src={imageUrl} 
                  alt={`Cartoon outline ${index + 1}`}
                  className="outline-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="image-placeholder" style={{ display: 'none' }}>
                  <p>Image not available</p>
                  <p>Please check your internet connection</p>
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
