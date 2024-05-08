import React from 'react';
import Button from '@mui/material/Button';
import './style.css'

const RainbowButton: React.FC = () => {
  const rainbowButtonStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
    marginTop: '8px',
    padding: '18px 70px',
    cursor: 'pointer',
    background: 'linear-gradient(45deg, #ff6b6b, #ffa07a, #ffd700, #98fb98, #87ceeb, #8a2be2, #87ceeb, #98fb98, #ffd700, #ffa07a, #ff6b6b)',
    backgroundSize: '400% 400%',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    fontWeight: 'bold',
    fontSize: '20px',
    transition: 'border 0.3s ease',
    animation: 'scrollGradient 5s linear infinite',
    boxShadow: '0 0 0 3px transparent, inset 0 0 0 3px transparent',
    border: '3px solid transparent',
  };

  return (
    <button className="btn-hover color-2">
        BUY NOW
    </button>
  );
};

export default RainbowButton;
