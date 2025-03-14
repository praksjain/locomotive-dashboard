import React, { useState } from 'react';
import CompressorButton from './CompressorButton';
import '../styles/ControllerModule.css';
import '../styles/CompressorButton.css';

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

    // Icons for each button
    const getIcon = (type: string) => {
        switch (type) {
            case 'cabin':
                return '💡';
            case 'vent':
                return '🌀';
            case 'lights':
                return '🔦';
            case 'horn':
                return '📢';
            case 'defrost':
                return '❄️';
            case 'fan':
                return '🌬️';
            default:
                return '';
        }
    };

    return (
        <div className="module-container">
            <div className="module-title">CONTROLLER MODULE</div>
            <div className="module-content controller-module">
                <div className="controller-row">
                    <CompressorButton 
                        label="CABIN"
                        icon={getIcon('cabin')}
                        isActive={cabinLightsOn}
                        onClick={onToggleCabinLights}
                    />
                    <CompressorButton 
                        label="VENT"
                        icon={getIcon('vent')}
                        isActive={ventilationOn}
                        onClick={onToggleVentilation}
                    />
                </div>
                <div className="controller-row">
                    <div className="controller-labels">
                        <div className="controller-label">{throttlePosition > 0 ? throttlePosition : 0}</div>
                    </div>
                    <CompressorButton 
                        label="LIGHTS"
                        icon={getIcon('lights')}
                        isActive={headlightsOn}
                        onClick={onToggleHeadlights}
                    />
                </div>
                <div className="controller-row">
                    <CompressorButton 
                        label="HORN"
                        icon={getIcon('horn')}
                        isActive={hornActive}
                        onClick={onActivateHorn}
                    />
                    <CompressorButton 
                        label="DEFROST"
                        icon={getIcon('defrost')}
                        isActive={defrostOn}
                        onClick={onToggleDefrost}
                    />
                </div>
                <div className="controller-row">
                    <CompressorButton 
                        label="FAN"
                        icon={getIcon('fan')}
                        isActive={fanActive}
                        onClick={handleFanToggle}
                    />
                </div>
            </div>
        </div>
    );
};

export default ControllerModule; 