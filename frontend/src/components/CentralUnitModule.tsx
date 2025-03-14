import React from 'react';
import '../styles/CentralUnitModule.css';

interface CentralUnitModuleProps {
  isOpen: boolean;
  onClose: () => void;
}

const CentralUnitModule: React.FC<CentralUnitModuleProps> = ({ isOpen, onClose }) => {
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
                </div>
                <div className="panel-small-box">
                  <div className="panel-label">MAIN MCS</div>
                  <div className="panel-switches">
                    <div className="switch-group">
                      <div className="switch"></div>
                      <div className="switch"></div>
                      <div className="switch"></div>
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
                    <div className="drive-cell">DRV1</div>
                    <div className="drive-cell">DRV2</div>
                    <div className="drive-cell">DRV3</div>
                    <div className="drive-cell">DRV4</div>
                  </div>
                  <div className="drive-switches">
                    {/* Rows of switches */}
                    <div className="switch-row"></div>
                    <div className="switch-row"></div>
                  </div>
                  <div className="drive-controls">
                    {/* Control elements */}
                    <div className="control-row"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* DRV Panel */}
            <div className="panel-item drv-panel">
              <div className="panel-content">
                <div className="drv-grid">
                  <div className="drv-row">
                    <div className="drv-cell">DRV1</div>
                    <div className="drv-cell">DRV2</div>
                    <div className="drv-cell">DRV3</div>
                    <div className="drv-cell">DRV4</div>
                  </div>
                  <div className="separator"></div>
                  <div className="drv-row">
                    <div className="drv-cell">DRV5</div>
                  </div>
                  <div className="separator"></div>
                  <div className="drv-switches">
                    {/* Rows of switches */}
                    <div className="switch-row"></div>
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
            
            {/* Power Switch Panel */}
            <div className="panel-item power-switch-panel">
              <div className="panel-title">POWER SWITCH</div>
              <div className="panel-content">
                <div className="power-switch-container">
                  <div className="power-switch">
                    <div className="power-switch-icon">
                      <div className="power-switch-body">
                        <div className="power-switch-text">OFF</div>
                      </div>
                    </div>
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