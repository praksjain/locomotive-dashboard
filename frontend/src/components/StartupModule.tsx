import React, { useState, useEffect } from 'react';
import '../styles/DirectionStartupModules.css';

interface StartupModuleProps {
    engineStatus: 'on' | 'off';
    onEngineToggle: () => void;
}

const StartupModule: React.FC<StartupModuleProps> = ({ engineStatus, onEngineToggle }) => {
    const [rotationPosition, setRotationPosition] = useState(engineStatus === 'on' ? 180 : 0);
    
    // Update rotation when engine status changes from outside
    useEffect(() => {
        setRotationPosition(engineStatus === 'on' ? 180 : 0);
    }, [engineStatus]);
    
    return (
        <div className="module-container">
            <div className="module-title">Startup Module</div>
            <div className="startup-module">
                <div 
                    className={`startup-knob ${engineStatus === 'on' ? 'on' : ''}`}
                    onClick={onEngineToggle}
                >
                    <div 
                        className="startup-indicator"
                        style={{ transform: `translate(-50%, -100%) rotate(${rotationPosition}deg)` }}
                    />
                </div>
                
                <div 
                    className={`startup-power ${engineStatus === 'on' ? 'on' : ''}`}
                    onClick={onEngineToggle}
                >
                    <div className="indicator-light" />
                    <svg className="power-icon" viewBox="0 0 24 24">
                        <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default StartupModule; 