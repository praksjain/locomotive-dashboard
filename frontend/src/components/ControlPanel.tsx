import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ControlPanel: React.FC = () => {
    const {
        speed,
        engineStatus,
        throttlePosition,
        brakePressure,
        fuelLevel,
        signal,
        timeOfDay,
        weather
    } = useSelector((state: RootState) => state.simulation);
    
    return (
        <div className="control-panel" data-engine-status={engineStatus}>
            <div className="status-panel">
                <h2 className={`engine-status ${engineStatus}`}>
                    Engine: {engineStatus.toUpperCase()}
                    <span className="status-indicator"></span>
                </h2>
                <div className="speed-gauge">
                    <h2>Speed: {speed.toFixed(1)} km/h</h2>
                    <div className="gauge-visual">
                        <div 
                            className="gauge-fill" 
                            style={{ 
                                width: `${(speed / 120) * 100}%`,
                                backgroundColor: speed > 80 ? '#e74c3c' : 
                                               speed > 40 ? '#f1c40f' : '#2ecc71'
                            }} 
                        />
                    </div>
                </div>
            </div>
            
            <div className="indicators">
                <div className="indicator">
                    <label>Throttle</label>
                    <div className="gauge-visual">
                        <div className="gauge-fill" style={{ width: `${throttlePosition}%` }} />
                    </div>
                </div>
                <div className="indicator">
                    <label>Fuel</label>
                    <div className="gauge-visual">
                        <div className="gauge-fill" style={{ width: `${fuelLevel}%` }} />
                    </div>
                </div>
                <div className="indicator">
                    <label>Brake Pressure</label>
                    <div className="gauge-visual">
                        <div className="gauge-fill" style={{ width: `${brakePressure}%` }} />
                    </div>
                </div>
            </div>

            <div className="signal-indicator" style={{ color: signal }}>
                Signal: {signal.toUpperCase()}
            </div>
            
            <div className="environment-info">
                <div className="time-display">
                    <label>Time:</label>
                    <span>{timeOfDay.toString().padStart(2, '0')}:00</span>
                </div>
                <div className="weather-display">
                    <label>Weather:</label>
                    <span>{weather.toUpperCase()}</span>
                </div>
            </div>
            
            <div className="controls-info">
                <h3>Controls:</h3>
                <ul>
                    <li>E - Start/Stop Engine</li>
                    <li>↑ - Increase Throttle</li>
                    <li>↓ - Decrease Throttle</li>
                    <li>H - Horn</li>
                    <li>B - Bell</li>
                    <li>D - Door</li>
                    <li>T - Time of Day</li>
                    <li>W - Weather</li>
                </ul>
            </div>

            <div className="additional-controls">
                <h3>Environment Controls:</h3>
                <ul>
                    <li>T - Change Time of Day</li>
                    <li>W - Change Weather</li>
                </ul>
            </div>
        </div>
    );
};

export default ControlPanel; 