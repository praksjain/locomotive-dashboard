import React from 'react';
import '../styles/CompressorButton.css';

interface CompressorButtonProps {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}

const CompressorButton: React.FC<CompressorButtonProps> = ({
  label,
  icon,
  isActive,
  onClick
}) => {
  return (
    <button 
      className={`compressor-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="compressor-button-content">
        <div className="compressor-icon">{icon}</div>
        <div className="compressor-label">{label}</div>
      </div>
    </button>
  );
};

export default CompressorButton; 