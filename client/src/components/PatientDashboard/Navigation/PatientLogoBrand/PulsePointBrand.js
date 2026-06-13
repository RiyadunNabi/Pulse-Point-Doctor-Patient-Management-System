import React from 'react';
import './PulsePointBrand.css';

const PulsePointBrand = ({ 
  className = "w-14 h-14", 
  showText = true, 
  variant = "patient" 
}) => {


  return (
    <div className="pulse-brand-container">
      <div className={`${className} pulse-logo-container`}>
        <svg viewBox="0 0 100 100" className="pulse-logo-svg">
          <defs>
            <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#pulseGradient)"
            className="pulse-circle"
          />

          <path
            d="M25 50 L35 50 L40 35 L45 65 L50 40 L55 60 L60 45 L65 50 L75 50"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ekg-line"
            strokeDasharray="100"
            strokeDashoffset="100"
          />

          <circle
            cx="50"
            cy="50"
            r="4"
            fill="white"
            className="heartbeat-dot"
          />
        </svg>
      </div>

      {showText && (
        <div className="pulse-text-container">
          <h1 className="pulse-title">
            <span className="animated-text"></span>
          </h1>
          <p className="pulse-subtitle">
            <span className="animated-subtext"></span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PulsePointBrand;