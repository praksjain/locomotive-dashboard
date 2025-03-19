import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { WebSocketService } from '../services/WebSocketService';
import { EnhancedSoundService } from '../services/EnhancedSoundService';
import { updateSimulation } from '../store/simulationSlice';
import ControllerModule from './ControllerModule';
import CentralUnitModule from './CentralUnitModule';
import CompressorButton from './CompressorButton';
import DirectionModule from './DirectionModule';
import StartupModule from './StartupModule';
import '../styles/TrainCabin.css';
import '../styles/ControllerModule.css';
import '../styles/CentralUnitModule.css';
import '../styles/CompressorButton.css';
import '../styles/DirectionStartupModules.css';

// Add a Tooltip component
const Tooltip = ({ text, x, y }: { text: string, x: number, y: number }) => (
    <div className="tooltip" style={{ left: `${x + 15}px`, top: `${y + 15}px` }}>
        {text}
    </div>
);

// Add a Notification component
const Notification = ({ message, type, onClose }: { message: string, type: 'success' | 'warning' | 'error' | 'info', onClose: () => void }) => (
    <div className={`notification ${type}`}>
        <span>{message}</span>
        <button onClick={onClose}>×</button>
    </div>
);

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
    const [cabinLightsOn, setCabinLightsOn] = useState(false);
    const [ventilationOn, setVentilationOn] = useState(false);
    const [defrostOn, setDefrostOn] = useState(false);
    const [batteryIsolated, setBatteryIsolated] = useState(false);
    const [reverserPosition, setReverserPosition] = useState('neutral');
    const [fanActive, setFanActive] = useState(false);
    const [centralUnitOpen, setCentralUnitOpen] = useState(false);
    const [wiperActive, setWiperActive] = useState(false);
    const [radioActive, setRadioActive] = useState(false);
    const [heaterActive, setHeaterActive] = useState(false);
    const [airCondActive, setAirCondActive] = useState(false);
    const [nightModeActive, setNightModeActive] = useState(false);
    const [autoSignalActive, setAutoSignalActive] = useState(false);
    
    // Add notification state
    const [notifications, setNotifications] = useState<Array<{id: number, message: string, type: 'success' | 'warning' | 'error' | 'info'}>>([]);
    const [nextNotificationId, setNextNotificationId] = useState(1);
    
    // Update tooltip state to include position
    const [tooltip, setTooltip] = useState<{text: string, visible: boolean, x: number, y: number}>({
        text: '', 
        visible: false,
        x: 0,
        y: 0
    });
    
    // Function to show a notification
    const showNotification = (message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
        const id = nextNotificationId;
        setNotifications(prev => [...prev, {id, message, type}]);
        setNextNotificationId(prev => prev + 1);
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            dismissNotification(id);
        }, 3000);
    };
    
    // Function to dismiss a notification
    const dismissNotification = (id: number) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };
    
    // Function to show tooltip with position
    const showTooltip = (text: string, event: React.MouseEvent) => {
        setTooltip({
            text, 
            visible: true,
            x: event.clientX,
            y: event.clientY
        });
    };
    
    // Function to hide tooltip
    const hideTooltip = () => {
        setTooltip({...tooltip, visible: false});
    };
    
    // Function to update tooltip position on mouse move
    const updateTooltipPosition = (event: React.MouseEvent) => {
        if (tooltip.visible) {
            setTooltip({
                ...tooltip,
                x: event.clientX,
                y: event.clientY
            });
        }
    };

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

    const toggleEngine = () => {
        const newStatus = engineStatus === 'off' ? 'on' : 'off';
        console.log(`Engine toggled to: ${newStatus}`);
        
        // Add sound effect
        try {
            const sound = newStatus === 'on' ? 
                new Audio('/sounds/engine-start.mp3') : 
                new Audio('/sounds/engine-stop.mp3');
            sound.volume = 0.5;
            sound.play().catch(e => console.log('Audio play failed:', e));
        } catch (e) {
            console.log('Audio creation failed:', e);
        }
        
        // Dispatch to Redux store
        dispatch(updateSimulation({ 
            engineStatus: newStatus,
            throttlePosition: newStatus === 'off' ? 0 : throttlePosition
        }));
        
        // Also update WebSocket if available
        if (wsRef.current) {
            console.log('Sending engine status update via WebSocket');
            wsRef.current.sendUpdate({ 
                engine_status: newStatus,
                throttle_position: newStatus === 'off' ? 0 : throttlePosition
            });
        } else {
            console.warn('WebSocket not available for engine toggle');
        }
        
        if (newStatus === 'off') {
            console.log('Throttle reset to 0');
            showNotification('Engine stopped', 'info');
        } else {
            showNotification('Engine started', 'success');
        }
    };

    const handleThrottleMove = useCallback((clientY: number) => {
        if (!throttleRef.current || engineStatus === 'off') return;
        
        const rect = throttleRef.current.getBoundingClientRect();
        const height = rect.height - 25; // Adjust for handle height
        const relativeY = Math.max(0, Math.min(height, clientY - rect.top));
        const percentage = Math.round(((height - relativeY) / height) * 100);
        
        // Get the throttle handle and fill elements
        const throttleHandle = document.querySelector('.throttle-handle') as HTMLElement;
        const throttleFill = document.querySelector('.throttle-fill') as HTMLElement;
        
        if (throttleHandle && throttleFill) {
            // Apply smooth transitions
            throttleHandle.style.transition = 'bottom 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            throttleFill.style.transition = 'height 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            // Update visual elements immediately for responsive feel
            throttleHandle.style.bottom = `calc(${percentage}% - 12px)`;
            throttleFill.style.height = `${percentage}%`;
        }
        
        // Update Redux store
        dispatch(updateSimulation({ throttlePosition: percentage }));
        
        // Send update to WebSocket
        wsRef.current?.sendUpdate({ throttle_position: percentage });
        
        console.log(`Throttle position: ${percentage}%`);
    }, [engineStatus, dispatch]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (engineStatus === 'off') {
            console.log('Cannot adjust throttle while engine is off');
            return;
        }
        setIsDragging(true);
        handleThrottleMove(e.clientY);
        
        // Add throttle sound effect
        try {
            const sound = new Audio('/sounds/throttle-click.mp3');
            sound.volume = 0.2;
            sound.play().catch(e => console.log('Audio play failed:', e));
        } catch (e) {
            console.log('Audio creation failed:', e);
        }
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        handleThrottleMove(e.clientY);
    }, [isDragging, handleThrottleMove]);

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            
            // Add throttle release sound effect
            try {
                const sound = new Audio('/sounds/throttle-release.mp3');
                sound.volume = 0.2;
                sound.play().catch(e => console.log('Audio play failed:', e));
            } catch (e) {
                console.log('Audio creation failed:', e);
            }
        }
    }, [isDragging]);

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
        if (engineStatus === 'on') {
            dispatch(updateSimulation({ engineStatus: 'off', throttlePosition: 0, speed: 0 }));
            wsRef.current?.sendUpdate({ engine_status: 'off', throttle_position: 0 });
            showNotification('EMERGENCY STOP ACTIVATED', 'warning');
        } else {
            showNotification('Engine is already off', 'info');
        }
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
            showNotification(`Signal changed to ${newSignal.toUpperCase()}`, 'success');
        } else {
            console.error('WebSocket reference is null or undefined');
            showNotification('Failed to change signal - WebSocket not connected', 'error');
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
        const newDoorState = !doorLocked;
        dispatch(updateSimulation({ doorsLocked: newDoorState }));
        wsRef.current?.sendUpdate({ doors_locked: newDoorState });
        console.log(`Door ${doorLocked ? 'unlocked' : 'locked'}`);
    };

    const handleLightsToggle = () => {
        const newState = !headlightsOn;
        dispatch(updateSimulation({ headlights: newState }));
        wsRef.current?.sendUpdate({ headlights: newState });
        console.log(`Toggling headlights to: ${newState ? 'ON' : 'OFF'}`);
    };

    const handleHornActivate = () => {
        dispatch(updateSimulation({ horn: true }));
        wsRef.current?.sendUpdate({ horn: true });
        console.log('Horn activated');
        
        setTimeout(() => {
            dispatch(updateSimulation({ horn: false }));
            wsRef.current?.sendUpdate({ horn: false });
            console.log('Horn deactivated');
        }, 1000);
    };

    const handleDirectionChange = (direction: 'forward' | 'neutral' | 'reverse') => {
        if (engineStatus === 'off') {
            console.log('Cannot change direction while engine is off');
            showNotification('Cannot change direction while engine is off', 'warning');
            return;
        }
        setReverserPosition(direction);
        wsRef.current?.sendUpdate({ reverser_position: direction });
        showNotification(`Direction changed to ${direction}`, 'success');
        console.log(`Direction changed to: ${direction}`);
    };

    const handleCabinLightsToggle = () => {
        const newState = !cabinLightsOn;
        dispatch(updateSimulation({ cabinLights: newState }));
        wsRef.current?.sendUpdate({ cabin_lights: newState });
        console.log(`Cabin lights ${newState ? 'ON' : 'OFF'}`);
    };

    const handleVentilationToggle = () => {
        const newState = !ventilationOn;
        setVentilationOn(newState);
        wsRef.current?.sendUpdate({ ventilation: newState });
        console.log(`Ventilation ${newState ? 'ON' : 'OFF'}`);
    };

    const handleDefrostToggle = () => {
        const newState = !defrostOn;
        setDefrostOn(newState);
        wsRef.current?.sendUpdate({ defrost: newState });
        console.log(`Defrost ${newState ? 'ON' : 'OFF'}`);
    };

    const handleFanToggle = () => {
        const newState = !fanActive;
        setFanActive(newState);
        wsRef.current?.sendUpdate({ fan: newState });
        console.log(`Fan ${newState ? 'ON' : 'OFF'}`);
    };

    // Add handlers for new controls
    const handleWiperToggle = () => {
        const newState = !wiperActive;
        setWiperActive(newState);
        wsRef.current?.sendUpdate({ wiper: newState });
        console.log(`Wiper ${newState ? 'ON' : 'OFF'}`);
    };

    const handleRadioToggle = () => {
        const newState = !radioActive;
        setRadioActive(newState);
        wsRef.current?.sendUpdate({ radio: newState });
        console.log(`Radio ${newState ? 'ON' : 'OFF'}`);
    };

    const handleHeaterToggle = () => {
        const newState = !heaterActive;
        setHeaterActive(newState);
        wsRef.current?.sendUpdate({ heater: newState });
        console.log(`Heater ${newState ? 'ON' : 'OFF'}`);
    };

    const handleAirCondToggle = () => {
        const newState = !airCondActive;
        setAirCondActive(newState);
        wsRef.current?.sendUpdate({ air_cond: newState });
        console.log(`Air Conditioning ${newState ? 'ON' : 'OFF'}`);
    };

    const handleNightModeToggle = () => {
        const newState = !nightModeActive;
        setNightModeActive(newState);
        wsRef.current?.sendUpdate({ night_mode: newState });
        showNotification(`Night Mode ${newState ? 'Activated' : 'Deactivated'}`, 'success');
        console.log(`Night Mode ${newState ? 'ON' : 'OFF'}`);
    };

    const handleAutoSignalToggle = () => {
        const newState = !autoSignalActive;
        setAutoSignalActive(newState);
        wsRef.current?.sendUpdate({ auto_signal: newState });
        console.log(`Auto Signal ${newState ? 'ON' : 'OFF'}`);
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
        <div className={`locomotive-dashboard ${engineStatus === 'off' ? 'engine-off' : ''} ${nightModeActive ? 'night-mode' : ''}`}>
            {/* Windshield View */}
            <div className="windshield-view">
                <div className="track"></div>
                <div className="platform"></div>
                <div className="platform platform-right"></div>
                <div className="yellow-line"></div>
                <div className="yellow-line yellow-line-right"></div>
                <div className="windshield-frame"></div>
            </div>
            
            {/* Control Panel */}
            <div className="control-panel">
                {/* Left Controls */}
                <div className="left-controls">
                    {/* Speedometer */}
                    <div className="circular-gauge">
                        <div className="gauge-inner">
                            <div className="gauge-title">SPEED</div>
                            <div className="gauge-value">{speed.toFixed(1)}</div>
                            <div className="gauge-unit">km/h</div>
                        </div>
                    </div>
                    
                    {/* Train Protection Module */}
                    <div className="module">
                        <div className="module-title">Train Protection Module</div>
                        <div className="module-content">
                            <button 
                                className={`control-button ${parkingBrakeOn ? 'active' : ''}`}
                                onClick={() => setParkingBrakeOn(!parkingBrakeOn)}
                            >
                                BRAKE ⚠
                            </button>
                            <button className="control-button">
                                TIMER ⏱
                            </button>
                            <button className="control-button">
                                POWER ⚡
                            </button>
                            <button 
                                className="emergency-stop-button"
                                onClick={handleEmergencyStop}
                                title="Emergency Stop"
                            >
                                <svg viewBox="0 0 24 24" className="emergency-stop-icon">
                                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Central Unit Module */}
                    <div className="module">
                        <div className="module-title">Central Unit</div>
                        <div className="module-content">
                            <button 
                                className={`control-button ${centralUnitOpen ? 'active' : ''}`}
                                onClick={() => setCentralUnitOpen(true)}
                            >
                                PANEL 🔌
                            </button>
                            <button className="control-button">
                                CONFIG ⚙️
                            </button>
                            <button className="control-button">
                                STATS 📊
                            </button>
                        </div>
                    </div>
                    
                    {/* Signal Control Buttons - Moved below Central Unit */}
                    <div className="module">
                        <div className="module-title">Signal Control</div>
                        <div className="module-content">
                            <button 
                                className={`control-button ${signal === 'red' ? 'active' : ''}`}
                                onClick={() => handleSignalChange('red')}
                                style={{ background: '#e74c3c' }}
                                onMouseEnter={(e) => showTooltip('Set signal to RED - Stop train', e)}
                                onMouseLeave={hideTooltip}
                            >
                                RED
                            </button>
                            <button 
                                className={`control-button ${signal === 'yellow' ? 'active' : ''}`}
                                onClick={() => handleSignalChange('yellow')}
                                style={{ background: '#f39c12' }}
                                onMouseEnter={(e) => showTooltip('Set signal to YELLOW - Proceed with caution', e)}
                                onMouseLeave={hideTooltip}
                            >
                                YELLOW
                            </button>
                            <button 
                                className={`control-button ${signal === 'green' ? 'active' : ''}`}
                                onClick={() => handleSignalChange('green')}
                                style={{ background: '#2ecc71' }}
                                onMouseEnter={(e) => showTooltip('Set signal to GREEN - Proceed normally', e)}
                                onMouseLeave={hideTooltip}
                            >
                                GREEN
                            </button>
                            <button 
                                className={`control-button ${autoSignalActive ? 'active' : ''}`}
                                onClick={handleAutoSignalToggle}
                                onMouseEnter={(e) => showTooltip('Toggle automatic signal control', e)}
                                onMouseLeave={hideTooltip}
                            >
                                AUTO 🔄
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Center Controls */}
                <div className="center-controls">
                    {/* Gauges Row */}
                    <div className="gauges-row">
                        {/* Acceleration Gauge */}
                        <div className="circular-gauge">
                            <div className="gauge-inner">
                                <div className="gauge-title">ACCELERATION</div>
                                <div className="gauge-value">{(speed - prevSpeed).toFixed(1)}</div>
                                <div className="gauge-unit">m/s²</div>
                            </div>
                        </div>
                        
                        {/* Power Efficiency Gauge */}
                        <div className="circular-gauge">
                            <div className="gauge-inner">
                                <div className="gauge-title">POWER</div>
                                <div className="gauge-value">{throttlePosition}</div>
                                <div className="gauge-unit">%</div>
                            </div>
                        </div>
                        
                        {/* Signal Status */}
                        <div className="circular-gauge">
                            <div className="gauge-inner">
                                <div className="gauge-title">SIGNAL</div>
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
                                <div className="gauge-value">{signal ? signal.toUpperCase() : 'UNKNOWN'}</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Door and Controller Modules */}
                    <div className="modules-container">
                        {/* Door Module */}
                        <div className="module">
                            <div className="module-title">Door Module</div>
                            <div className="module-content">
                                <button 
                                    className={`control-button ${!doorLocked ? 'active' : ''}`}
                                    onClick={handleDoorToggle}
                                >
                                    {doorLocked ? "LOCKED 🔒" : "UNLOCKED 🔓"}
                                </button>
                                <button className="control-button">
                                    WARNING ⚠
                                </button>
                                <button className="control-button">
                                    OPEN 🚪
                                </button>
                            </div>
                        </div>

                        {/* Controller Module */}
                        <div className="module">
                            <div className="module-title">Controller Module</div>
                            <div className="module-content">
                                <button 
                                    className={`control-button ${cabinLightsOn ? 'active' : ''}`}
                                    onClick={handleCabinLightsToggle}
                                    onMouseEnter={(e) => showTooltip('Toggle cabin interior lights', e)}
                                    onMouseLeave={hideTooltip}
                                >
                                    CABIN 💡
                                </button>
                                <button 
                                    className={`control-button ${ventilationOn ? 'active' : ''}`}
                                    onClick={handleVentilationToggle}
                                    onMouseEnter={(e) => showTooltip('Toggle ventilation system', e)}
                                    onMouseLeave={hideTooltip}
                                >
                                    VENT 🌀
                                </button>
                                <button 
                                    className={`control-button ${headlightsOn ? 'active' : ''}`}
                                    onClick={handleLightsToggle}
                                    onMouseEnter={(e) => showTooltip('Toggle exterior headlights', e)}
                                    onMouseLeave={hideTooltip}
                                >
                                    LIGHTS 🔦
                                </button>
                                <button 
                                    className={`control-button ${hornActive ? 'active' : ''}`}
                                    onClick={handleHornActivate}
                                    onMouseEnter={(e) => showTooltip('Sound the horn', e)}
                                    onMouseLeave={hideTooltip}
                                >
                                    HORN 📢
                                </button>
                                <button 
                                    className={`control-button ${defrostOn ? 'active' : ''}`}
                                    onClick={handleDefrostToggle}
                                    onMouseEnter={(e) => showTooltip('Toggle window defrost system', e)}
                                    onMouseLeave={hideTooltip}
                                >
                                    DEFROST ❄️
                                </button>
                                <button 
                                    className={`control-button ${fanActive ? 'active' : ''}`}
                                    onClick={handleFanToggle}
                                    onMouseEnter={(e) => showTooltip('Toggle cooling fan', e)}
                                    onMouseLeave={hideTooltip}
                                >
                                    FAN 🌬️
                                </button>
                                <button 
                                    className={`control-button ${wiperActive ? 'active' : ''}`}
                                    onClick={handleWiperToggle}
                                    onMouseEnter={(e) => showTooltip('Toggle windshield wipers', e)}
                                    onMouseLeave={hideTooltip}
                                >
                                    WIPER 🌧️
                                </button>
                                <button 
                                    className={`control-button ${radioActive ? 'active' : ''}`}
                                    onClick={handleRadioToggle}
                                    onMouseEnter={(e) => showTooltip('Toggle radio communication', e)}
                                    onMouseLeave={hideTooltip}
                                >
                                    RADIO 📻
                                </button>
                                <button 
                                    className={`control-button ${heaterActive ? 'active' : ''}`}
                                    onClick={handleHeaterToggle}
                                    onMouseEnter={(e) => showTooltip('Toggle cabin heating system', e)}
                                    onMouseLeave={hideTooltip}
                                >
                                    HEATER 🔥
                                </button>
                                <button 
                                    className={`control-button ${airCondActive ? 'active' : ''}`}
                                    onClick={handleAirCondToggle}
                                    onMouseEnter={(e) => showTooltip('Toggle air conditioning', e)}
                                    onMouseLeave={hideTooltip}
                                >
                                    A/C ❄️
                                </button>
                                <button 
                                    className={`control-button ${nightModeActive ? 'active' : ''}`}
                                    onClick={handleNightModeToggle}
                                    onMouseEnter={(e) => showTooltip('Toggle night mode for reduced brightness', e)}
                                    onMouseLeave={hideTooltip}
                                >
                                    NIGHT 🌙
                                </button>
                            </div>
                        </div>

                        {/* Speed Module */}
                        <div className="module speed-module">
                            <div className="module-title">Speed Module</div>
                            <div className="module-content">
                                <div className="throttle-control">
                                    <div 
                                        className="throttle-track"
                                        ref={throttleRef}
                                        onMouseDown={handleMouseDown}
                                    >
                                        <div className="throttle-fill" style={{ height: `${throttlePosition}%` }}></div>
                                        <div 
                                            className="throttle-handle" 
                                            style={{ bottom: `calc(${throttlePosition}% - 12px)` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Controls */}
                <div className="right-controls">
                    {/* Direction Module */}
                    <DirectionModule 
                        position={reverserPosition as 'forward' | 'neutral' | 'reverse'}
                        onChange={handleDirectionChange}
                        engineStatus={engineStatus}
                    />
                    
                    {/* Startup Module */}
                    <StartupModule 
                        engineStatus={engineStatus}
                        onEngineToggle={toggleEngine}
                    />
                </div>
            </div>

            {/* Central Unit Module Popup */}
            <CentralUnitModule 
                isOpen={centralUnitOpen} 
                onClose={() => setCentralUnitOpen(false)} 
            />
            
            {/* Tooltip */}
            {tooltip.visible && <Tooltip text={tooltip.text} x={tooltip.x} y={tooltip.y} />}
            
            {/* Notifications */}
            <div className="notifications-container">
                {notifications.map(notification => (
                    <Notification 
                        key={notification.id}
                        message={notification.message}
                        type={notification.type}
                        onClose={() => dismissNotification(notification.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TrainCabin;