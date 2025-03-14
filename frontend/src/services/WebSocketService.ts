import { AppDispatch } from '../store';
import { updateSimulation } from '../store/simulationSlice';

interface WebSocketMessage {
  lights: boolean;
  wipers: boolean;
  horn: boolean;
  headlights: boolean;
  doors_locked: boolean;
  radio: boolean;
  parking_brake: boolean;
  auto_mode: boolean;
  pantograph: boolean;
  compressor: boolean;
  sanding: boolean;
  coupler: boolean;
  auxiliary_power: boolean;
  brake_light: boolean;
  cabin_lights: boolean;
  cabin_temp: number;
  fan_speed: number;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private dispatch: any;
  private isConnecting: boolean = false;

  constructor(dispatch: any) {
    this.dispatch = dispatch;
  }

  connect() {
    if (this.isConnecting) return;
    this.isConnecting = true;

    console.log('Connecting to WebSocket...');
    this.ws = new WebSocket('ws://localhost:8000/ws');
    
    this.ws.onopen = () => {
      console.log('WebSocket Connected');
      this.isConnecting = false;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket received:', data);
        if (data.engineStatus !== undefined) {
          console.log(`Updating engine status to: ${data.engineStatus}`);
        }
        this.dispatch(updateSimulation(data));
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      this.isConnecting = false;
    };

    this.ws.onclose = () => {
      console.log('WebSocket Disconnected');
      this.isConnecting = false;
      setTimeout(() => this.connect(), 1000);
    };
  }

  sendUpdate(data: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not ready, attempting to reconnect...');
      this.connect();
      return;
    }

    try {
      // Special handling for signal updates
      if (data.signal) {
        console.log(`Sending signal update: ${data.signal}`);
        
        // For signal updates, directly update the Redux store
        this.dispatch(updateSimulation({ signal: data.signal }));
      }
      
      // Convert camelCase to snake_case for backend
      const convertedData = Object.entries(data).reduce((acc, [key, value]) => {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        acc[snakeKey] = value;
        return acc;
      }, {} as any);

      console.log('Sending to server:', convertedData);
      this.ws.send(JSON.stringify(convertedData));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
} 