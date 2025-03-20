import React, { useState, useRef } from 'react';
import '../styles/CentralUnitPanel.css';

interface CentralUnitPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ControlItem {
    id: number;
    type: 'LED' | 'FAN' | 'SWITCH';
    color?: string;
    status: boolean;
}

interface ControlSection {
    id: number;
    name: string;
    controls: ControlItem[];
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
    
    const [availableControls, setAvailableControls] = useState<ControlItem[]>([
        { id: 101, type: 'LED', color: '#32CD32', status: false }, // Green LED
        { id: 102, type: 'LED', color: '#4169E1', status: false }, // Blue LED
        { id: 103, type: 'LED', color: '#FFD700', status: false }, // Yellow LED
        { id: 104, type: 'LED', color: '#FF4500', status: false }, // Red LED
        { id: 105, type: 'FAN', status: false },
    ]);
    
    const [isCreatingSection, setIsCreatingSection] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');
    const [draggedItem, setDraggedItem] = useState<{
        item: ControlItem | null,
        sourceSection: number | null,
        sourceIndex: number | null
    }>({
        item: null,
        sourceSection: null,
        sourceIndex: null
    });
    
    const [dropTarget, setDropTarget] = useState<{
        section: number | null,
        index: number | null
    }>({
        section: null,
        index: null
    });
    
    const [nextId, setNextId] = useState(200);
    const [isEditingSectionName, setIsEditingSectionName] = useState<number | null>(null);
    const [editSectionName, setEditSectionName] = useState('');
    const sectionNameInputRef = useRef<HTMLInputElement>(null);
    
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
    
    const handleDragStart = (
        item: ControlItem, 
        sourceSection: number | null, 
        sourceIndex: number
    ) => {
        setDraggedItem({
            item,
            sourceSection,
            sourceIndex
        });
    };
    
    const handleDragOver = (
        e: React.DragEvent, 
        targetSection: number | null, 
        targetIndex: number | null
    ) => {
        e.preventDefault();
        setDropTarget({
            section: targetSection,
            index: targetIndex
        });
    };
    
    const handleDrop = (e: React.DragEvent, targetSection: number | null, targetIndex: number | null) => {
        e.preventDefault();
        
        // Reset drop target highlights
        setDropTarget({
            section: null,
            index: null
        });
        
        if (!draggedItem.item) return;
        
        const { item, sourceSection, sourceIndex } = draggedItem;
        
        // Clone the item with a new ID to ensure uniqueness when added to section
        const clonedItem = {...item, id: nextId};
        setNextId(prev => prev + 1);
        
        if (sourceSection === null && targetSection !== null) {
            // Dragging from available controls to a section
            setSections(prevSections => {
                return prevSections.map(section => {
                    if (section.id === targetSection) {
                        const newControls = [...section.controls];
                        if (targetIndex !== null) {
                            newControls.splice(targetIndex, 0, clonedItem);
                        } else {
                            newControls.push(clonedItem);
                        }
                        return {
                            ...section,
                            controls: newControls
                        };
                    }
                    return section;
                });
            });
        } else if (sourceSection !== null && targetSection !== null) {
            // Moving between sections or within the same section
            setSections(prevSections => {
                // First remove from source
                let updatedSections = prevSections.map(section => {
                    if (section.id === sourceSection) {
                        return {
                            ...section,
                            controls: section.controls.filter((_, idx) => idx !== sourceIndex)
                        };
                    }
                    return section;
                });
                
                // Then add to target
                return updatedSections.map(section => {
                    if (section.id === targetSection) {
                        const newControls = [...section.controls];
                        if (targetIndex !== null) {
                            newControls.splice(targetIndex, 0, item);
                        } else {
                            newControls.push(item);
                        }
                        return {
                            ...section,
                            controls: newControls
                        };
                    }
                    return section;
                });
            });
        }
        
        // Reset dragged item
        setDraggedItem({
            item: null,
            sourceSection: null,
            sourceIndex: null
        });
    };
    
    const handleDeleteControl = (sectionId: number, controlId: number) => {
        setSections(prevSections => {
            return prevSections.map(section => {
                if (section.id === sectionId) {
                    return {
                        ...section,
                        controls: section.controls.filter(control => control.id !== controlId)
                    };
                }
                return section;
            });
        });
    };
    
    const handleDeleteSection = (sectionId: number) => {
        setSections(prevSections => prevSections.filter(section => section.id !== sectionId));
    };
    
    const handleAddSection = () => {
        if (newSectionName.trim()) {
            const newSection: ControlSection = {
                id: nextId,
                name: newSectionName,
                controls: []
            };
            setSections(prev => [...prev, newSection]);
            setNextId(prev => prev + 1);
            setNewSectionName('');
            setIsCreatingSection(false);
        }
    };
    
    const handleStartEditSectionName = (sectionId: number, currentName: string) => {
        setIsEditingSectionName(sectionId);
        setEditSectionName(currentName);
        setTimeout(() => {
            if (sectionNameInputRef.current) {
                sectionNameInputRef.current.focus();
            }
        }, 0);
    };
    
    const handleSaveSectionName = (sectionId: number) => {
        if (editSectionName.trim()) {
            setSections(prevSections => 
                prevSections.map(section => 
                    section.id === sectionId 
                        ? {...section, name: editSectionName} 
                        : section
                )
            );
        }
        setIsEditingSectionName(null);
    };
    
    const renderControlItem = (control: ControlItem, sectionId: number | null, index: number) => {
        const isDropTarget = dropTarget.section === sectionId && dropTarget.index === index;
        
        return (
            <div 
                key={control.id} 
                className={`control-item ${isDropTarget ? 'drop-target' : ''}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(control, sectionId, index)}
                onDragOver={(e) => handleDragOver(e, sectionId, index)}
                onDrop={(e) => handleDrop(e, sectionId, index)}
            >
                {control.type === 'LED' && (
                    <div 
                        className={`led-indicator ${control.status ? 'active' : ''}`}
                        style={{ '--led-color': control.color } as any}
                        onClick={() => sectionId !== null && handleControlToggle(sectionId, control.id)}
                    >
                        <div className="led-light"></div>
                        <span>LED {control.id}</span>
                        {sectionId !== null && (
                            <button 
                                className="delete-control" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteControl(sectionId, control.id);
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
                {control.type === 'FAN' && (
                    <div 
                        className={`fan-control ${control.status ? 'active' : ''}`}
                        onClick={() => sectionId !== null && handleControlToggle(sectionId, control.id)}
                    >
                        <div className="fan-icon">
                            <span className="fan-blade"></span>
                            <span className="fan-blade"></span>
                            <span className="fan-blade"></span>
                        </div>
                        <span>FAN {control.id}</span>
                        {sectionId !== null && (
                            <button 
                                className="delete-control" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteControl(sectionId, control.id);
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
                {control.type === 'SWITCH' && (
                    <div 
                        className={`section-switch ${control.status ? 'active' : ''}`}
                        onClick={() => sectionId !== null && handleControlToggle(sectionId, control.id)}
                    >
                        <div className="switch-track">
                            <div className="switch-handle"></div>
                        </div>
                        <span>ALL</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="central-unit-overlay" onClick={onClose}>
            <div className="central-unit-panel" onClick={e => e.stopPropagation()}>
                <div className="panel-header">
                    <div className="siemens-logo">SIEMENS</div>
                    <button className="editor-mode-toggle">
                        <span role="img" aria-label="Edit mode">🛠️ Edit Mode</span>
                    </button>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="panel-layout">
                    <div className="available-controls-panel">
                        <div className="section-header">Available Controls</div>
                        <div className="controls-palette">
                            {availableControls.map((control, index) => 
                                renderControlItem(control, null, index)
                            )}
                        </div>
                        <div className="editor-tools">
                            <button 
                                className="add-section-button"
                                onClick={() => setIsCreatingSection(true)}
                            >
                                + Add New Section
                            </button>
                            
                            {isCreatingSection && (
                                <div className="new-section-form">
                                    <input 
                                        type="text"
                                        value={newSectionName}
                                        onChange={(e) => setNewSectionName(e.target.value)}
                                        placeholder="Section Name"
                                        className="section-name-input"
                                    />
                                    <div className="form-buttons">
                                        <button onClick={handleAddSection}>Create</button>
                                        <button onClick={() => setIsCreatingSection(false)}>Cancel</button>
                                    </div>
                                </div>
                            )}
                            
                            <div className="editor-help">
                                <p>Drag items from here to add to your sections.</p>
                                <p>Drag between sections to reorganize.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="panel-content">
                        {sections.map(section => (
                            <div 
                                key={section.id} 
                                className="control-section"
                                onDragOver={(e) => handleDragOver(e, section.id, null)}
                                onDrop={(e) => handleDrop(e, section.id, null)}
                            >
                                <div className="section-header-container">
                                    {isEditingSectionName === section.id ? (
                                        <div className="section-edit-container">
                                            <input 
                                                ref={sectionNameInputRef}
                                                type="text"
                                                value={editSectionName}
                                                onChange={(e) => setEditSectionName(e.target.value)}
                                                className="section-name-input"
                                            />
                                            <button onClick={() => handleSaveSectionName(section.id)}>Save</button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="section-header">{section.name}</div>
                                            <div className="section-actions">
                                                <button 
                                                    className="edit-section-name"
                                                    onClick={() => handleStartEditSectionName(section.id, section.name)}
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    className="delete-section"
                                                    onClick={() => handleDeleteSection(section.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                <div className="section-dropzone">
                                    <div className="controls-row">
                                        {section.controls.map((control, index) => 
                                            renderControlItem(control, section.id, index)
                                        )}
                                        
                                        {section.controls.length === 0 && (
                                            <div className="empty-section-message">
                                                Drag controls here
                                            </div>
                                        )}
                                    </div>
                                    
                                    {section.controls.some(c => c.type !== 'SWITCH') && !section.controls.some(c => c.type === 'SWITCH') && (
                                        <button 
                                            className="add-switch-button"
                                            onClick={() => {
                                                const switchItem: ControlItem = { 
                                                    id: nextId, 
                                                    type: 'SWITCH', 
                                                    status: false 
                                                };
                                                setSections(prevSections => 
                                                    prevSections.map(s => 
                                                        s.id === section.id
                                                            ? {...s, controls: [...s.controls, switchItem]}
                                                            : s
                                                    )
                                                );
                                                setNextId(prev => prev + 1);
                                            }}
                                        >
                                            + Add Master Switch
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {sections.length === 0 && (
                            <div className="no-sections-message">
                                <p>No control sections yet. Create a new section to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CentralUnitPanel; 