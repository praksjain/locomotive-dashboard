import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { WebSocketService } from '../services/WebSocketService';
import { EnhancedSoundService } from '../services/EnhancedSoundService';
import { updateSimulation } from '../store/simulationSlice';
import ControllerModule from './ControllerModule';
import '../styles/TrainCabin.css';
import '../styles/ControllerModule.css';

const TrainCabin: React.FC = () => {
    const dispatch = useDispatch();
    const { engineStatus, throttlePosition, speed, brakePressure, fuelLevel, engineTemp, oilPressure, cabinTemp, fanSpeed, signal } = 
        useSelector((state: RootState) => state.simulation);
    const wsRef = useRef<WebSocketService>();
    const [isDragging, setIsDragging] = useState(false);
    const throttleRef = useRef<HTMLDivElement>(null);
    const [trackOffset, setTrackOffset] = useState(0);
    const [prevSpeed, setPrevSpeed] = useState(0);
    const [lightsOn, setLightsOn] = useState(false);
    const [wipersOn, setWipersOn] = useState(false);
    const [hornActive, setHornActive] = useState(false);
    const [engineStarting, setEngineStarting] = useState(false);
    const [headlightsOn, setHeadlightsOn] = useState(false);
    const [doorLocked, setDoorLocked] = useState(true);
    const [radioOn, setRadioOn] = useState(false);
    const [parkingBrakeOn, setParkingBrakeOn] = useState(true);
    const [autoModeOn, setAutoModeOn] = useState(false);
    const [pantographUp, setPantographUp] = useState(false);
    const [compressorOn, setCompressorOn] = useState(false);
    const [sandingOn, setSandingOn] = useState(false);
    const [couplerEngaged, setCouplerEngaged] = useState(false);
    const [auxiliaryPowerOn, setAuxiliaryPowerOn] = useState(false);
    const [brakeLightOn, setBrakeLightOn] = useState(false);
    const [cabinLightsOn, setCabinLightsOn] = useState(true);
    const [ventilationOn, setVentilationOn] = useState(false);
    const [defrostOn, setDefrostOn] = useState(false);
    const [batteryIsolated, setBatteryIsolated] = useState(false);
    const [reverserPosition, setReverserPosition] = useState('neutral');
    const [fanActive, setFanActive] = useState(false);

    useEffect(() => {
        console.log('Initializing WebSocket service...');
        wsRef.current = new WebSocketService(dispatch);
        wsRef.current.connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
            }
        };
    }, [dispatch]);

    useEffect(() => {
        let animationFrame: number;
        const animateTrack = () => {
            setTrackOffset(prev => (prev + speed * 0.1) % 100);
            animationFrame = requestAnimationFrame(animateTrack);
        };
        animationFrame = requestAnimationFrame(animateTrack);
        return () => cancelAnimationFrame(animationFrame);
    }, [speed]);

    // Update prevSpeed for acceleration calculation
    useEffect(() => {
        const timer = setTimeout(() => {
            setPrevSpeed(speed);
        }, 1000);
        return () => clearTimeout(timer);
    }, [speed]);

    const handleEngineToggle = () => {
        if (!wsRef.current) return;
        
        if (engineStatus === 'off') {
            // Starting sequence
            setEngineStarting(true);
            wsRef.current.sendUpdate({ engine_status: 'starting' });
            
            // Simulate engine startup sequence
            setTimeout(() => {
                wsRef.current?.sendUpdate({
                    engine_status: 'on',
                    throttle_position: 0,
                    brake_pressure: 100
                });
                setEngineStarting(false);
            }, 3000);
        } else {
            // Immediate shutdown
            wsRef.current.sendUpdate({
                engine_status: 'off',
                throttle_position: 0,
                brake_pressure: 100
            });
        }
    };

    const handleThrottleMove = useCallback((clientY: number) => {
        if (!throttleRef.current || engineStatus === 'off') return;
        
        const rect = throttleRef.current.getBoundingClientRect();
        const height = rect.height - 50; // Adjust for handle height
        const relativeY = Math.max(0, Math.min(height, clientY - rect.top));
        const percentage = Math.round(((height - relativeY) / height) * 100);
        
        wsRef.current?.sendUpdate({ throttle_position: percentage });
    }, [engineStatus]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (engineStatus === 'off') return;
        setIsDragging(true);
        handleThrottleMove(e.clientY);
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        handleThrottleMove(e.clientY);
    }, [isDragging, handleThrottleMove]);

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('mousemove', handleMouseMove as any);
        }
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove as any);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const handleEmergencyStop = () => {
        wsRef.current?.sendUpdate({
            throttle_position: 0,
            brake_pressure: 100,
            engine_status: 'off'
        });
    };

    // Add a useEffect to log signal changes
    useEffect(() => {
        console.log(`Signal state updated in Redux: ${signal}`);
    }, [signal]);

    const handleSignalChange = (newSignal: string) => {
        console.log(`Changing signal to: ${newSignal}`);
        
        // Send update to backend - the WebSocketService will update Redux
        if (wsRef.current) {
            console.log(`WebSocket reference exists, sending signal: ${newSignal}`);
            wsRef.current.sendUpdate({ signal: newSignal });
        } else {
            console.error('WebSocket reference is null or undefined');
        }
        
        // Force update the local state for immediate UI feedback
        document.getElementById('red-signal-light')?.classList.remove('active');
        document.getElementById('yellow-signal-light')?.classList.remove('active');
        document.getElementById('green-signal-light')?.classList.remove('active');
        
        // Activate the selected signal light
        document.getElementById(`${newSignal}-signal-light`)?.classList.add('active');
        
        // Update the signal value text
        const signalValueElement = document.querySelector('.signal-value');
        if (signalValueElement) {
            signalValueElement.textContent = newSignal.toUpperCase();
        }
    };

    const handleDoorToggle = () => {
        setDoorLocked(!doorLocked);
    };

    const handleLightsToggle = () => {
        const newState = !headlightsOn;
        setHeadlightsOn(newState);
        console.log(`Toggling headlights to: ${newState ? 'ON' : 'OFF'}`);
        // You can add WebSocket update here if needed
        // wsRef.current?.sendUpdate({ headlights: newState });
    };

    const handleHornActivate = () => {
        setHornActive(true);
        console.log('Horn activated');
        // You can add WebSocket update here if needed
        // wsRef.current?.sendUpdate({ horn: true });
        
        setTimeout(() => {
            setHornActive(false);
            console.log('Horn deactivated');
            // wsRef.current?.sendUpdate({ horn: false });
        }, 1000);
    };

    const handleDirectionChange = (direction: string) => {
        setReverserPosition(direction);
    };

    // Add useEffect hooks to log state changes for debugging
    useEffect(() => {
        console.log(`Headlights state: ${headlightsOn ? 'ON' : 'OFF'}`);
    }, [headlightsOn]);

    useEffect(() => {
        console.log(`Cabin lights state: ${cabinLightsOn ? 'ON' : 'OFF'}`);
    }, [cabinLightsOn]);

    useEffect(() => {
        console.log(`Ventilation state: ${ventilationOn ? 'ON' : 'OFF'}`);
    }, [ventilationOn]);

    useEffect(() => {
        console.log(`Defrost state: ${defrostOn ? 'ON' : 'OFF'}`);
    }, [defrostOn]);

    useEffect(() => {
        console.log(`Horn active: ${hornActive ? 'YES' : 'NO'}`);
    }, [hornActive]);

    return (
        <div className="locomotive-dashboard">
            {/* Left Panel - Speedometer and Start/Stop */}
            <div className="left-panel">
                {/* Speedometer */}
                <div className="speedometer">
                    <div className="speed-value">{speed.toFixed(1)}</div>
                    <div className="speed-unit">km/h</div>
                </div>
                
                {/* Start/Stop Button */}
                <div className="start-stop-container">
                    <button 
                        className={`start-stop-button ${engineStatus !== 'off' ? 'active' : ''}`}
                        onClick={handleEngineToggle}
                        disabled={engineStarting}
                    >
                        {engineStatus === 'off' ? 'START ENGINE' : 
                         engineStarting ? 'STARTING...' : 'STOP ENGINE'}
                    </button>
                </div>

                {/* Additional Meters */}
                <div className="left-panel-meters">
                    {/* Power Output Meter */}
                    <div className="meter-container">
                        <div className="meter-label">POWER OUTPUT</div>
                        <div className="meter-visual">
                            <div 
                                className="meter-fill" 
                                style={{ width: `${throttlePosition}%` }}
                            ></div>
                        </div>
                        <div className="meter-value">{throttlePosition}%</div>
                    </div>

                    {/* Traction Meter */}
                    <div className="meter-container">
                        <div className="meter-label">TRACTION</div>
                        <div className="meter-visual">
                            <div 
                                className="meter-fill traction-fill" 
                                style={{ width: `${Math.min(100, speed * 2)}%` }}
                            ></div>
                        </div>
                        <div className="meter-value">{Math.min(100, Math.round(speed * 2))}%</div>
                    </div>

                    {/* Brake Pressure Meter */}
                    <div className="meter-container">
                        <div className="meter-label">BRAKE PRESSURE</div>
                        <div className="meter-visual">
                            <div 
                                className="meter-fill brake-fill" 
                                style={{ width: `${brakePressure}%` }}
                            ></div>
                        </div>
                        <div className="meter-value">{brakePressure}%</div>
                    </div>
                </div>

                {/* Train Protection Module */}
                <div className="module-container">
                    <div className="module-title">Train Protection Module</div>
                    <div className="module-content">
                        <button 
                            className={`circular-button emergency-color ${parkingBrakeOn ? 'active' : ''}`}
                            onClick={() => setParkingBrakeOn(!parkingBrakeOn)}
                        >
                            <div className="button-icon">⚠</div>
                        </button>
                        <button className="circular-button neutral-color">
                            <div className="button-icon">⏱</div>
                        </button>
                        <button className="circular-button warning-color">
                            <div className="button-icon">⚡</div>
                        </button>
                    </div>
                    <div className="emergency-button-large">
                        <button 
                            className="emergency-stop-large"
                            onClick={handleEmergencyStop}
                        ></button>
                    </div>
                </div>
            </div>
            
            {/* Center Panel - Main Gauges */}
            <div className="center-panel">
                <div className="gauge-container">
                    {/* Acceleration Gauge */}
                    <div className="gauge acceleration-gauge">
                        <div className="gauge-title">ACCELERATION</div>
                        <div className="gauge-display">
                            <div className="gauge-needle" style={{ 
                                transform: `rotate(${Math.min(Math.max((speed - prevSpeed) * 10, -90), 90)}deg)` 
                            }}></div>
                            <div className="gauge-value">{(speed - prevSpeed).toFixed(1)} m/s²</div>
                        </div>
                    </div>
                    
                    {/* Locomotive Speed Gauge */}
                    <div className="gauge speed-gauge">
                        <div className="gauge-title">LOCOMOTIVE SPEED</div>
                        <div className="gauge-display">
                            <div className="gauge-needle" style={{ 
                                transform: `rotate(${(speed / 200) * 180 - 90}deg)` 
                            }}></div>
                            <div className="gauge-value">{speed.toFixed(1)} km/h</div>
                        </div>
                    </div>
                    
                    {/* Power Efficiency Gauge */}
                    <div className="gauge efficiency-gauge">
                        <div className="gauge-title">POWER EFFICIENCY</div>
                        <div className="gauge-display">
                            <div className="gauge-needle" style={{ 
                                transform: `rotate(${Math.min(90, Math.max(-90, (throttlePosition - 50) * 1.8))}deg)` 
                            }}></div>
                            <div className="gauge-value">{throttlePosition}%</div>
                        </div>
                    </div>
                    
                    {/* Signal Box */}
                    <div className="gauge signal-box">
                        <div className="gauge-title">SIGNAL STATUS</div>
                        <div className="gauge-display signal-display">
                            <div className="signal-lights">
                                <div 
                                    className={`signal-light red ${signal === 'red' ? 'active' : ''}`}
                                    id="red-signal-light"
                                ></div>
                                <div 
                                    className={`signal-light yellow ${signal === 'yellow' ? 'active' : ''}`}
                                    id="yellow-signal-light"
                                ></div>
                                <div 
                                    className={`signal-light green ${signal === 'green' ? 'active' : ''}`}
                                    id="green-signal-light"
                                ></div>
                            </div>
                            <div className="gauge-value signal-value">{signal ? signal.toUpperCase() : 'UNKNOWN'}</div>
                        </div>
                    </div>
                </div>
                
                {/* Signal Control Buttons */}
                <div className="control-buttons-container">
                    <button 
                        className="control-button red-button"
                        onClick={() => handleSignalChange('red')}
                    >
                        RED SIGNAL
                    </button>
                    <button 
                        className="control-button yellow-button"
                        onClick={() => handleSignalChange('yellow')}
                    >
                        YELLOW SIGNAL
                    </button>
                    <button 
                        className="control-button green-button"
                        onClick={() => handleSignalChange('green')}
                    >
                        GREEN SIGNAL
                    </button>
                </div>

                {/* Speed Module */}
                <div className="module-container wide-module">
                    <div className="module-title">Speed Module</div>
                    <div className="module-content speed-module">
                        <div className="speed-slider-container">
                            <div className="speed-slider">
                                <div className="slider-track">
                                    <div className="slider-handle" style={{ bottom: `${throttlePosition}%` }}></div>
                                </div>
                                <div className="slider-label">V</div>
                            </div>
                            <div className="speed-slider">
                                <div className="slider-track">
                                    <div className="slider-handle" style={{ bottom: `${throttlePosition * 0.8}%` }}></div>
                                </div>
                                <div className="slider-label">T</div>
                            </div>
                            <div className="speed-slider">
                                <div className="slider-track brake-track">
                                    <div className="slider-handle" style={{ bottom: `${brakePressure}%` }}></div>
                                </div>
                                <div className="slider-label">B</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Door and Controller Modules */}
                <div className="modules-row">
                    {/* Door Module */}
                    <div className="module-container">
                        <div className="module-title">Door Module</div>
                        <div className="module-content">
                            <button 
                                className={`circular-button ${doorLocked ? 'warning-color' : 'success-color'}`}
                                onClick={handleDoorToggle}
                            >
                                <div className="button-icon">
                                    {doorLocked ? '🔒' : '🔓'}
                                </div>
                            </button>
                            <button className="circular-button danger-color">
                                <div className="button-icon">⚠</div>
                            </button>
                            <button className="circular-button neutral-color">
                                <div className="button-icon">→</div>
                            </button>
                        </div>
                    </div>

                    {/* Controller Module */}
                    <ControllerModule 
                        throttlePosition={throttlePosition}
                        headlightsOn={headlightsOn}
                        cabinLightsOn={cabinLightsOn}
                        ventilationOn={ventilationOn}
                        defrostOn={defrostOn}
                        hornActive={hornActive}
                        fanActive={fanActive}
                        onToggleHeadlights={handleLightsToggle}
                        onToggleCabinLights={() => setCabinLightsOn(!cabinLightsOn)}
                        onToggleVentilation={() => setVentilationOn(!ventilationOn)}
                        onToggleDefrost={() => setDefrostOn(!defrostOn)}
                        onActivateHorn={handleHornActivate}
                        onToggleFan={() => setFanActive(!fanActive)}
                    />
                </div>
            </div>
            
            {/* Right Panel - Controls */}
            <div className="right-panel">
                {/* Direction Module */}
                <div className="module-container">
                    <div className="module-title">Direction Module</div>
                    <div className="module-content direction-module">
                        <button 
                            className={`circular-button large-button ${reverserPosition === 'forward' ? 'active' : ''}`}
                            onClick={() => handleDirectionChange('forward')}
                        >
                            <div className="button-icon">⬆️</div>
                        </button>
                        <button 
                            className={`circular-button large-button ${reverserPosition === 'neutral' ? 'active' : ''}`}
                            onClick={() => handleDirectionChange('neutral')}
                        >
                            <div className="button-icon">⏹️</div>
                        </button>
                        <button 
                            className={`circular-button large-button ${reverserPosition === 'reverse' ? 'active' : ''}`}
                            onClick={() => handleDirectionChange('reverse')}
                        >
                            <div className="button-icon">⬇️</div>
                        </button>
                    </div>
                </div>

                {/* Throttle Control */}
                <div className="throttle-control">
                    <div className="throttle-label">THROTTLE</div>
                    <div 
                        className="throttle-track"
                        ref={throttleRef}
                        onMouseDown={handleMouseDown}
                    >
                        <div className="throttle-fill" style={{ height: `${throttlePosition}%` }}></div>
                        <div 
                            className="throttle-handle" 
                            style={{ bottom: `calc(${throttlePosition}% - 15px)` }}
                        ></div>
                    </div>
                    <div className="throttle-value">{throttlePosition}%</div>
                </div>
                
                {/* Emergency Stop Button */}
                <button 
                    className="emergency-button"
                    onClick={handleEmergencyStop}
                >
                    EMERGENCY STOP
                </button>

                {/* Startup Module */}
                <div className="module-container">
                    <div className="module-title">Startup Module</div>
                    <div className="module-content">
                        <button 
                            className={`circular-button large-button ${engineStatus !== 'off' ? 'active' : ''}`}
                            onClick={handleEngineToggle}
                        >
                            <div className="button-icon">⚡</div>
                        </button>
                        <div className="startup-controls">
                            <div className="startup-indicator">
                                <div className={`indicator-light ${engineStatus !== 'off' ? 'active' : ''}`}></div>
                                <div className="indicator-label">1</div>
                            </div>
                            <div className="startup-indicator">
                                <div className={`indicator-light ${engineStatus !== 'off' && throttlePosition > 0 ? 'active' : ''}`}></div>
                                <div className="indicator-label">0</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainCabin;