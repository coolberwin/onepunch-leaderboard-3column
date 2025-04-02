import React, { useEffect, useState } from 'react';

const imageUrls = [
  '/assets/banner.png',
  '/images/title-bg.png',
  '/images/counter-bg.png',
  // 添加其他图片资源
];

const AssetChecker = () => {
  const [status, setStatus] = useState({});

  useEffect(() => {
    const checkImages = async () => {
      const results = {};
      
      for (const url of imageUrls) {
        try {
          const img = new Image();
          img.src = url;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          results[url] = 'loaded';
        } catch (error) {
          results[url] = 'failed';
          console.error(`Failed to load ${url}`);
        }
      }
      
      setStatus(results);
    };
    
    checkImages();
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, background: 'rgba(0,0,0,0.7)', color: 'white', padding: 10, zIndex: 9999 }}>
      <h4>Asset Check</h4>
      <ul>
        {Object.entries(status).map(([url, result]) => (
          <li key={url}>
            {url}: <span style={{ color: result === 'loaded' ? 'green' : 'red' }}>{result}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetChecker;
