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
        
        # Handle signal updates first and explicitly
        if "signal" in data:
            new_signal = data["signal"]
            print(f"Signal update detected: {new_signal}")
            self.simulation.signal = new_signal
            
        # Handle other updates
        if "speed" in data:
            self.simulation.speed = data["speed"]
        if "throttle_position" in data:
            self.simulation.throttle_position = data["throttle_position"]
        if "engine_status" in data:
            self.simulation.engine_status = data["engine_status"]
        
        # Prepare response with updated state
        response = {
            "speed": self.simulation.speed,
            "signal": self.simulation.signal,
            "engineStatus": self.simulation.engine_status,
            "throttlePosition": self.simulation.throttle_position,
            "brakePressure": self.simulation.brake_pressure,
            "fuelLevel": self.simulation.fuel_level
        }
        
        print(f"Updated signal value: {self.simulation.signal}")
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
