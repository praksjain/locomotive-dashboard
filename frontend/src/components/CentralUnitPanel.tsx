import React, { useState } from 'react';
import '../styles/CentralUnitPanel.css';

interface CentralUnitPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ControlSection {
    id: number;
    name: string;
    controls: {
        id: number;
        type: 'LED' | 'FAN' | 'SWITCH';
        color?: string;
        status: boolean;
    }[];
}

const CentralUnitPanel: React.FC<CentralUnitPanelProps> = ({ isOpen, onClose }) => {
    const [sections, setSections] = useState<ControlSection[]>([
        {
            id: 1,
            name: 'LED Control Section 1',
            controls: [
                { id: 1, type: 'LED', color: '#32CD32', status: false }, // Green LED
                { id: 2, type: 'LED', color: '#32CD32', status: false },
                { id: 3, type: 'LED', color: '#32CD32', status: false },
                { id: 4, type: 'SWITCH', status: false },
            ]
        },
        {
            id: 2,
            name: 'LED Control Section 2',
            controls: [
                { id: 5, type: 'LED', color: '#4169E1', status: false }, // Blue LED
                { id: 6, type: 'LED', color: '#4169E1', status: false },
                { id: 7, type: 'LED', color: '#4169E1', status: false },
                { id: 8, type: 'SWITCH', status: false },
            ]
        },
        {
            id: 3,
            name: 'Fan Control Section',
            controls: [
                { id: 9, type: 'FAN', status: false },
                { id: 10, type: 'FAN', status: false },
                { id: 11, type: 'FAN', status: false },
                { id: 12, type: 'SWITCH', status: false },
            ]
        },
        {
            id: 4,
            name: 'Mixed Control Section',
            controls: [
                { id: 13, type: 'LED', color: '#FFD700', status: false }, // Yellow LED
                { id: 14, type: 'FAN', status: false },
                { id: 15, type: 'LED', color: '#FF4500', status: false }, // Red LED
                { id: 16, type: 'SWITCH', status: false },
            ]
        }
    ]);

    if (!isOpen) return null;

    const handleControlToggle = (sectionId: number, controlId: number) => {
        setSections(prevSections => {
            return prevSections.map(section => {
                if (section.id === sectionId) {
                    if (controlId === section.controls.find(c => c.type === 'SWITCH')?.id) {
                        // If toggling the switch, toggle all controls in the section
                        const newStatus = !section.controls.find(c => c.type === 'SWITCH')?.status;
                        return {
                            ...section,
                            controls: section.controls.map(control => ({
                                ...control,
                                status: newStatus
                            }))
                        };
                    } else {
                        // Toggle individual control
                        return {
                            ...section,
                            controls: section.controls.map(control => 
                                control.id === controlId 
                                    ? { ...control, status: !control.status }
                                    : control
                            )
                        };
                    }
                }
                return section;
            });
        });
    };

    return (
        <div className="central-unit-overlay" onClick={onClose}>
            <div className="central-unit-panel" onClick={e => e.stopPropagation()}>
                <div className="panel-header">
                    <div className="siemens-logo">SIEMENS</div>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="panel-content">
                    {sections.map(section => (
                        <div key={section.id} className="control-section">
                            <div className="section-header">{section.name}</div>
                            <div className="controls-row">
                                {section.controls.map(control => (
                                    <div key={control.id} className="control-item">
                                        {control.type === 'LED' && (
                                            <div 
                                                className={`led-indicator ${control.status ? 'active' : ''}`}
                                                style={{ '--led-color': control.color } as any}
                                                onClick={() => handleControlToggle(section.id, control.id)}
                                            >
                                                <div className="led-light"></div>
                                                <span>LED {control.id}</span>
                                            </div>
                                        )}
                                        {control.type === 'FAN' && (
                                            <div 
                                                className={`fan-control ${control.status ? 'active' : ''}`}
                                                onClick={() => handleControlToggle(section.id, control.id)}
                                            >
                                                <div className="fan-icon">
                                                    <span className="fan-blade"></span>
                                                    <span className="fan-blade"></span>
                                                    <span className="fan-blade"></span>
                                                </div>
                                                <span>FAN {control.id}</span>
                                            </div>
                                        )}
                                        {control.type === 'SWITCH' && (
                                            <div 
                                                className={`section-switch ${control.status ? 'active' : ''}`}
                                                onClick={() => handleControlToggle(section.id, control.id)}
                                            >
                                                <div className="switch-track">
                                                    <div className="switch-handle"></div>
                                                </div>
                                                <span>ALL</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CentralUnitPanel; 