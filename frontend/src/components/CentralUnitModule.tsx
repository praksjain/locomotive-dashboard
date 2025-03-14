import React, { useState } from 'react';
import '../styles/CentralUnitModule.css';

interface CentralUnitModuleProps {
  isOpen: boolean;
  onClose: () => void;
}

const CentralUnitModule: React.FC<CentralUnitModuleProps> = ({ isOpen, onClose }) => {
  // State to track which MCB switches are on
  const [mcbStates, setMcbStates] = useState({
    door1: false,
    door2: false,
    door3: false,
    drive1: false,
    drive2: false,
    drive3: false,
    drive4: false,
    drv1: false,
    drv2: false,
    drv3: false,
    drv4: false,
    drv5: false,
    mainPower: false
  });

  // Toggle MCB switch state
  const toggleMcb = (id: keyof typeof mcbStates) => {
    setMcbStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="central-unit-overlay">
      <div className="central-unit-popup">
        <div className="central-unit-header">
          <h2>DRIVE PANEL COMPONENT LAYOUT</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="central-unit-content">
          <div className="panel-grid">
            {/* Door Panel */}
            <div className="panel-item door-panel">
              <div className="panel-title">DOOR</div>
              <div className="panel-content">
                <div className="panel-box">
                  <div className="panel-label">SMPS</div>
                  <div className="mcb-container">
                    <div 
                      className={`mcb-switch ${mcbStates.door1 ? 'mcb-on' : 'mcb-off'}`}
                      onClick={() => toggleMcb('door1')}
                    >
                      <div className="mcb-body">
                        <div className="mcb-lever"></div>
                        <div className="mcb-text">{mcbStates.door1 ? 'ON' : 'OFF'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="panel-small-box">
                  <div className="panel-label">MAIN MCS</div>
                  <div className="mcb-container">
                    <div className="mcb-group">
                      <div 
                        className={`mcb-switch small ${mcbStates.door2 ? 'mcb-on' : 'mcb-off'}`}
                        onClick={() => toggleMcb('door2')}
                      >
                        <div className="mcb-body">
                          <div className="mcb-lever"></div>
                        </div>
                      </div>
                      <div 
                        className={`mcb-switch small ${mcbStates.door3 ? 'mcb-on' : 'mcb-off'}`}
                        onClick={() => toggleMcb('door3')}
                      >
                        <div className="mcb-body">
                          <div className="mcb-lever"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Drive Panel */}
            <div className="panel-item drive-panel">
              <div className="panel-content">
                <div className="drive-grid">
                  <div className="drive-row">
                    <div className="drive-cell">
                      <div className="panel-label">DRV1</div>
                      <div 
                        className={`mcb-switch ${mcbStates.drive1 ? 'mcb-on' : 'mcb-off'}`}
                        onClick={() => toggleMcb('drive1')}
                      >
                        <div className="mcb-body">
                          <div className="mcb-lever"></div>
                          <div className="mcb-text">{mcbStates.drive1 ? 'ON' : 'OFF'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="drive-cell">
                      <div className="panel-label">DRV2</div>
                      <div 
                        className={`mcb-switch ${mcbStates.drive2 ? 'mcb-on' : 'mcb-off'}`}
                        onClick={() => toggleMcb('drive2')}
                      >
                        <div className="mcb-body">
                          <div className="mcb-lever"></div>
                          <div className="mcb-text">{mcbStates.drive2 ? 'ON' : 'OFF'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="drive-row">
                    <div className="drive-cell">
                      <div className="panel-label">DRV3</div>
                      <div 
                        className={`mcb-switch ${mcbStates.drive3 ? 'mcb-on' : 'mcb-off'}`}
                        onClick={() => toggleMcb('drive3')}
                      >
                        <div className="mcb-body">
                          <div className="mcb-lever"></div>
                          <div className="mcb-text">{mcbStates.drive3 ? 'ON' : 'OFF'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="drive-cell">
                      <div className="panel-label">DRV4</div>
                      <div 
                        className={`mcb-switch ${mcbStates.drive4 ? 'mcb-on' : 'mcb-off'}`}
                        onClick={() => toggleMcb('drive4')}
                      >
                        <div className="mcb-body">
                          <div className="mcb-lever"></div>
                          <div className="mcb-text">{mcbStates.drive4 ? 'ON' : 'OFF'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* DRV Panel */}
            <div className="panel-item drv-panel">
              <div className="panel-content">
                <div className="drv-grid">
                  <div className="drv-row">
                    <div className="drv-cell">
                      <div className="panel-label">DRV1</div>
                      <div 
                        className={`mcb-switch ${mcbStates.drv1 ? 'mcb-on' : 'mcb-off'}`}
                        onClick={() => toggleMcb('drv1')}
                      >
                        <div className="mcb-body">
                          <div className="mcb-lever"></div>
                        </div>
                      </div>
                    </div>
                    <div className="drv-cell">
                      <div className="panel-label">DRV2</div>
                      <div 
                        className={`mcb-switch ${mcbStates.drv2 ? 'mcb-on' : 'mcb-off'}`}
                        onClick={() => toggleMcb('drv2')}
                      >
                        <div className="mcb-body">
                          <div className="mcb-lever"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="drv-row">
                    <div className="drv-cell">
                      <div className="panel-label">DRV3</div>
                      <div 
                        className={`mcb-switch ${mcbStates.drv3 ? 'mcb-on' : 'mcb-off'}`}
                        onClick={() => toggleMcb('drv3')}
                      >
                        <div className="mcb-body">
                          <div className="mcb-lever"></div>
                        </div>
                      </div>
                    </div>
                    <div className="drv-cell">
                      <div className="panel-label">DRV4</div>
                      <div 
                        className={`mcb-switch ${mcbStates.drv4 ? 'mcb-on' : 'mcb-off'}`}
                        onClick={() => toggleMcb('drv4')}
                      >
                        <div className="mcb-body">
                          <div className="mcb-lever"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="separator"></div>
                  <div className="drv-row">
                    <div className="drv-cell">
                      <div className="panel-label">DRV5</div>
                      <div 
                        className={`mcb-switch ${mcbStates.drv5 ? 'mcb-on' : 'mcb-off'}`}
                        onClick={() => toggleMcb('drv5')}
                      >
                        <div className="mcb-body">
                          <div className="mcb-lever"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Power Switch Panel */}
            <div className="panel-item power-switch-panel">
              <div className="panel-title">POWER SWITCH</div>
              <div className="panel-content">
                <div className="power-switch-container">
                  <div 
                    className={`mcb-switch large ${mcbStates.mainPower ? 'mcb-on' : 'mcb-off'}`}
                    onClick={() => toggleMcb('mainPower')}
                  >
                    <div className="mcb-body">
                      <div className="mcb-lever"></div>
                      <div className="mcb-text">{mcbStates.mainPower ? 'ON' : 'OFF'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gland Panel */}
            <div className="panel-item gland-panel">
              <div className="panel-content">
                <div className="gland-details">
                  <div className="gland-title">GLAND DETAILS</div>
                  <div className="gland-subtitle">6 no's. GLAND</div>
                  <div className="gland-circles">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Display Panel */}
            <div className="panel-item display-panel">
              <div className="panel-title">DISPLAY PANEL</div>
              <div className="panel-content">
                <div className="display-container">
                  <div className="display-screen"></div>
                  <div className="display-buttons">
                    <div className="button-row">
                      <div className="display-button"></div>
                      <div className="display-button"></div>
                      <div className="display-button"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Control Panel */}
            <div className="panel-item control-panel">
              <div className="panel-content">
                <div className="control-container">
                  <div className="control-display"></div>
                  <div className="control-switches">
                    <div className="switch-row"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gland Details Panel */}
            <div className="panel-item gland-details-panel">
              <div className="panel-title">GLAND DETAILS</div>
              <div className="panel-subtitle">6 no's. GLAND</div>
              <div className="panel-content">
                <div className="gland-grid">
                  <div className="gland-row">
                    <div className="gland-item"></div>
                    <div className="gland-item"></div>
                    <div className="gland-item"></div>
                    <div className="gland-item"></div>
                  </div>
                  <div className="gland-row">
                    <div className="gland-item"></div>
                    <div className="gland-item"></div>
                    <div className="gland-item"></div>
                    <div className="gland-item"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentralUnitModule; 