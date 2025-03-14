export interface SimulationState {
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
}

export type { SimulationState as default }; 