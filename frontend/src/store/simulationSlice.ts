import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SimulationState {
  speed: number;
  engineStatus: 'on' | 'off';
  throttlePosition: number;
  brakePressure: number;
  fuelLevel: number;
  signal: string;
  timeOfDay: number;
  weather: string;
  engineTemp: number;
  oilPressure: number;
  cabinTemp: number;
  fanSpeed: number;
  lights: boolean;
  wipers: boolean;
  horn: boolean;
  headlights: boolean;
  doorsLocked: boolean;
  radio: boolean;
  parkingBrake: boolean;
  autoMode: boolean;
  pantograph: boolean;
  compressor: boolean;
  sanding: boolean;
  coupler: boolean;
  auxiliaryPower: boolean;
  brakeLight: boolean;
  cabinLights: boolean;
}

const initialState: SimulationState = {
  speed: 0,
  engineStatus: 'off',
  throttlePosition: 0,
  brakePressure: 100,
  fuelLevel: 100,
  signal: 'green',
  timeOfDay: 12,
  weather: 'clear',
  engineTemp: 75,
  oilPressure: 45,
  cabinTemp: 21,
  fanSpeed: 2,
  lights: false,
  wipers: false,
  horn: false,
  headlights: false,
  doorsLocked: true,
  radio: false,
  parkingBrake: true,
  autoMode: false,
  pantograph: false,
  compressor: false,
  sanding: false,
  coupler: false,
  auxiliaryPower: false,
  brakeLight: false,
  cabinLights: true,
};

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    updateSimulation: (state, action: PayloadAction<Partial<SimulationState>>) => {
      console.log('Previous state:', state);
      console.log('Action payload:', action.payload);
      const newState = {
        ...state,
        ...action.payload
      };
      console.log('New state:', newState);
      return newState;
    }
  }
});

export const { updateSimulation } = simulationSlice.actions;
export default simulationSlice.reducer; 