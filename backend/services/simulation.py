import math
from models.simulation import SimulationState
import asyncio

class SimulationService:
    def __init__(self):
        self.state = SimulationState()
        self.running = False
        
    async def start_engine(self):
        if self.state.engine_status == "off":
            self.state.engine_status = "on"
            self.running = True
            asyncio.create_task(self.run_simulation())
            
    async def stop_engine(self):
        self.state.engine_status = "off"
        self.running = False
        
    async def update_throttle(self, position: int):
        self.state.throttle_position = max(0, min(100, position))
        
    async def run_simulation(self):
        while self.running:
            # Simple physics simulation
            if self.state.engine_status == "on":
                # Calculate acceleration based on throttle position
                acceleration = (self.state.throttle_position / 100.0) * 2.0  # max 2 m/s²
                
                # Update speed
                self.state.speed += acceleration
                
                # Apply air resistance
                air_resistance = 0.01 * self.state.speed * self.state.speed
                self.state.speed = max(0, self.state.speed - air_resistance)
                
                # Consume fuel
                fuel_consumption = 0.01 * self.state.throttle_position
                self.state.fuel_level = max(0, self.state.fuel_level - fuel_consumption)
                
                if self.state.fuel_level <= 0:
                    await self.stop_engine()
                    
            await asyncio.sleep(0.1)  # Update every 100ms 