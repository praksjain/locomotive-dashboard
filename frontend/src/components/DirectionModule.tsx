import React from 'react';
import '../styles/DirectionStartupModules.css';

interface DirectionModuleProps {
    position: 'forward' | 'neutral' | 'reverse';
    onChange: (position: 'forward' | 'neutral' | 'reverse') => void;
    engineStatus: 'on' | 'off';
}

const DirectionModule: React.FC<DirectionModuleProps> = ({ position, onChange, engineStatus }) => {
    const handleDirectionChange = (newPosition: 'forward' | 'neutral' | 'reverse') => {
        if (engineStatus === 'off') {
            console.log('Cannot change direction while engine is off');
            return;
        }
        onChange(newPosition);
    };

    return (
        <div className="module-container">
            <div className="module-title">Direction Module</div>
            <div className="direction-module">
                <button 
                    className={`direction-button ${position === 'forward' ? 'active' : ''}`}
                    onClick={() => handleDirectionChange('forward')}
                    title="Forward"
                >
                    <svg className="direction-icon" viewBox="0 0 24 24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                    </svg>
                </button>
                
                <button 
                    className={`direction-button ${position === 'neutral' ? 'active' : ''}`}
                    onClick={() => handleDirectionChange('neutral')}
                    title="Neutral"
                >
                    <svg className="direction-icon" viewBox="0 0 24 24">
                        <path d="M8 11h8v2H8z" />
                    </svg>
                </button>
                
                <button 
                    className={`direction-button ${position === 'reverse' ? 'active' : ''}`}
                    onClick={() => handleDirectionChange('reverse')}
                    title="Reverse"
                >
                    <svg className="direction-icon" viewBox="0 0 24 24">
                        <path d="M12 4l1.41 1.41L7.83 11H20v2H7.83l5.58 5.59L12 20l-8-8 8-8z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default DirectionModule; 