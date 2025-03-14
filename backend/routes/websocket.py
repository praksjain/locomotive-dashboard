from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict
import asyncio
import json

router = APIRouter()

class TrainSimulation:
    def __init__(self):
        self.speed = 0.0
        self.signal = "green"
        self.engine_status = "off"
        self.throttle_position = 0
        self.brake_pressure = 100
        self.fuel_level = 100
        
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.simulation = TrainSimulation()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        # Send initial state
        await self.send_simulation_state(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict):
        for connection in self.active_connections:
            await connection.send_json(message)
            
    async def send_simulation_state(self, websocket: WebSocket):
        await websocket.send_json({
            "speed": self.simulation.speed,
            "signal": self.simulation.signal,
            "engineStatus": self.simulation.engine_status,
            "throttlePosition": self.simulation.throttle_position,
            "brakePressure": self.simulation.brake_pressure,
            "fuelLevel": self.simulation.fuel_level
        })
    
    async def update_simulation(self, data: Dict):
        print(f"Received update data: {data}")
        
        # Handle engine status updates first
        if "engine_status" in data:
            new_status = data["engine_status"]
            print(f"Engine status update detected: {new_status}")
            self.simulation.engine_status = new_status
            
            # If engine is turned off, reset speed and throttle
            if new_status == "off":
                self.simulation.speed = 0
                self.simulation.throttle_position = 0
                print("Engine turned off: resetting speed and throttle")
        
        # Handle signal updates
        if "signal" in data:
            new_signal = data["signal"]
            print(f"Signal update detected: {new_signal}")
            self.simulation.signal = new_signal
            
        # Handle throttle updates
        if "throttle_position" in data:
            new_throttle = data["throttle_position"]
            print(f"Throttle update detected: {new_throttle}")
            self.simulation.throttle_position = new_throttle
            
            # Update speed based on throttle if engine is on
            if self.simulation.engine_status == "on":
                target_speed = self.simulation.throttle_position * 1.2
                self.simulation.speed = min(target_speed, self.simulation.speed + 2)
                print(f"Engine on: updating speed to {self.simulation.speed}")
            else:
                self.simulation.speed = 0
                print("Engine off: speed remains 0")
        
        # Prepare response with updated state
        response = {
            "speed": self.simulation.speed,
            "signal": self.simulation.signal,
            "engineStatus": self.simulation.engine_status,
            "throttlePosition": self.simulation.throttle_position,
            "brakePressure": self.simulation.brake_pressure,
            "fuelLevel": self.simulation.fuel_level
        }
        
        print(f"Updated engine status: {self.simulation.engine_status}")
        print(f"Updated throttle position: {self.simulation.throttle_position}")
        print(f"Updated speed: {self.simulation.speed}")
        print(f"Broadcasting response: {response}")
        
        # Broadcast to all clients
        await self.broadcast(response)

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.update_simulation(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
