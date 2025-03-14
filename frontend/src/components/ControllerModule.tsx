import React, { useState } from 'react';
import '../styles/ControllerModule.css';

interface ControllerModuleProps {
    throttlePosition: number;
    headlightsOn: boolean;
    cabinLightsOn: boolean;
    ventilationOn: boolean;
    defrostOn: boolean;
    hornActive: boolean;
    fanActive?: boolean;
    onToggleHeadlights: () => void;
    onToggleCabinLights: () => void;
    onToggleVentilation: () => void;
    onToggleDefrost: () => void;
    onActivateHorn: () => void;
    onToggleFan?: () => void;
}

const ControllerModule: React.FC<ControllerModuleProps> = ({
    throttlePosition,
    headlightsOn,
    cabinLightsOn,
    ventilationOn,
    defrostOn,
    hornActive,
    fanActive: externalFanActive,
    onToggleHeadlights,
    onToggleCabinLights,
    onToggleVentilation,
    onToggleDefrost,
    onActivateHorn,
    onToggleFan
}) => {
    const [internalFanActive, setInternalFanActive] = useState(false);
    
    const fanActive = externalFanActive !== undefined ? externalFanActive : internalFanActive;

    const handleFanToggle = () => {
        if (onToggleFan) {
            onToggleFan();
        } else {
            setInternalFanActive(!internalFanActive);
        }
    };

    return (
        <div className="module-container">
            <div className="module-title">CONTROLLER MODULE</div>
            <div className="module-content controller-module">
                <div className="controller-row">
                    <button 
                        className={`controller-button dark-button ${cabinLightsOn ? 'active' : ''}`}
                        onClick={onToggleCabinLights}
                    >
                        <span className="button-text">CABIN</span>
                    </button>
                    <button 
                        className={`controller-button light-button ${ventilationOn ? 'active' : ''}`}
                        onClick={onToggleVentilation}
                    >
                        <span className="button-text">VENT</span>
                    </button>
                </div>
                <div className="controller-row">
                    <div className="controller-labels">
                        <div className="controller-label">{throttlePosition > 0 ? throttlePosition : 0}</div>
                    </div>
                    <button 
                        className={`controller-button light-button ${headlightsOn ? 'active' : ''}`}
                        onClick={onToggleHeadlights}
                    >
                        <span className="button-text">LIGHTS</span>
                    </button>
                </div>
                <div className="controller-row">
                    <button 
                        className={`controller-button light-button ${hornActive ? 'active' : ''}`}
                        onClick={onActivateHorn}
                    >
                        <span className="button-text">HORN</span>
                    </button>
                    <button 
                        className={`controller-button light-button ${defrostOn ? 'active' : ''}`}
                        onClick={onToggleDefrost}
                    >
                        <span className="button-text">DEFROST</span>
                    </button>
                </div>
                <div className="controller-row">
                    <button 
                        className={`controller-button light-button ${fanActive ? 'active' : ''}`}
                        onClick={handleFanToggle}
                    >
                        <div className="fan-container">
                            <div className={`fan ${fanActive ? 'spinning' : ''}`}>
                                <div className="fan-blade blade-1"></div>
                                <div className="fan-blade blade-2"></div>
                                <div className="fan-blade blade-3"></div>
                                <div className="fan-blade blade-4"></div>
                                <div className="fan-center"></div>
                            </div>
                        </div>
                        <span className="button-text">FAN</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ControllerModule; 