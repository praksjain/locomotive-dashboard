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
  wiper: boolean;
  heater: boolean;
  air_cond: boolean;
  night_mode: boolean;
  auto_signal: boolean;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private dispatch: any;
  private isConnecting: boolean = false;
  private speedUpdateInterval: NodeJS.Timeout | null = null;

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
      
      // Start speed update interval when connected
      this.startSpeedUpdates();
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
      this.stopSpeedUpdates();
      setTimeout(() => this.connect(), 1000);
    };
  }

  // Add this method to start periodic speed updates
  startSpeedUpdates() {
    if (this.speedUpdateInterval) {
      clearInterval(this.speedUpdateInterval);
    }
    
    // Send a "ping" update every 2 seconds to trigger speed calculations on the server
    this.speedUpdateInterval = setInterval(() => {
      this.sendUpdate({ update_speed: true });
    }, 2000);
  }
  
  // Add this method to stop periodic speed updates
  stopSpeedUpdates() {
    if (this.speedUpdateInterval) {
      clearInterval(this.speedUpdateInterval);
      this.speedUpdateInterval = null;
    }
  }

  sendUpdate(data: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not ready, attempting to reconnect...');
      this.connect();
      return;
    }

    try {
      // Convert camelCase to snake_case for backend
      const convertedData = Object.entries(data).reduce((acc, [key, value]) => {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        acc[snakeKey] = value;
        return acc;
      }, {} as any);

      // Special handling for engine status updates - update Redux store directly for immediate UI feedback
      if (data.engine_status !== undefined) {
        console.log(`Sending engine status update: ${data.engine_status}`);
        this.dispatch(updateSimulation({ engineStatus: data.engine_status }));
      }

      // Special handling for throttle position updates
      if (data.throttle_position !== undefined) {
        console.log(`Sending throttle position update: ${data.throttle_position}`);
        this.dispatch(updateSimulation({ throttlePosition: data.throttle_position }));
      }

      // Special handling for signal updates
      if (data.signal) {
        console.log(`Sending signal update: ${data.signal}`);
        this.dispatch(updateSimulation({ signal: data.signal }));
      }

      // Special handling for new controls
      if (data.wiper !== undefined) {
        console.log(`Sending wiper update: ${data.wiper}`);
        this.dispatch(updateSimulation({ wiper: data.wiper }));
      }

      if (data.radio !== undefined) {
        console.log(`Sending radio update: ${data.radio}`);
        this.dispatch(updateSimulation({ radio: data.radio }));
      }

      if (data.heater !== undefined) {
        console.log(`Sending heater update: ${data.heater}`);
        this.dispatch(updateSimulation({ heater: data.heater }));
      }

      if (data.air_cond !== undefined) {
        console.log(`Sending air conditioning update: ${data.air_cond}`);
        this.dispatch(updateSimulation({ airCond: data.air_cond }));
      }

      if (data.night_mode !== undefined) {
        console.log(`Sending night mode update: ${data.night_mode}`);
        this.dispatch(updateSimulation({ nightMode: data.night_mode }));
      }

      if (data.auto_signal !== undefined) {
        console.log(`Sending auto signal update: ${data.auto_signal}`);
        this.dispatch(updateSimulation({ autoSignal: data.auto_signal }));
      }

      console.log('Sending to server:', convertedData);
      this.ws.send(JSON.stringify(convertedData));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  disconnect() {
    this.stopSpeedUpdates();
    if (this.ws) {
      this.ws.close();
    }
  }
} 