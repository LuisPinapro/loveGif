import React from 'react';
import '../styles/LoadingScreen.css';

export default function LoadingScreen() {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-content">
        {/* Animated Envelope */}
        <div className="loading-envelope">
          <div className="loading-flap"></div>
          <div className="loading-body"></div>
        </div>
        
        {/* Loading Text */}
        <h2 className="loading-title">Cargando tus cartitas...</h2>
        
        {/* Animated Dots */}
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
        
        {/* Floating Hearts */}
        <div className="floating-hearts">
          <span className="heart" style={{ animationDelay: '0s' }}>💌</span>
          <span className="heart" style={{ animationDelay: '0.6s' }}>💌</span>
          <span className="heart" style={{ animationDelay: '1.2s' }}>💌</span>
        </div>
      </div>
    </div>
  );
}
