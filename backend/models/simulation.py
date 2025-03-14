from pydantic import BaseModel
from typing import Optional

class SimulationState:
    def __init__(self):
        self.speed = 0.0
        self.engine_status = "off"
        self.throttle_position = 0
        self.brake_pressure = 100
        self.fuel_level = 100
        self.signal = "green"
        self.time_of_day = 12
        self.weather = "clear"

    def update(self, data: dict):
        print(f"Updating state with data: {data}")
        
        if "engine_status" in data:
            new_status = data["engine_status"]
            print(f"Changing engine status from {self.engine_status} to {new_status}")
            self.engine_status = new_status
            if new_status == "off":
                self.speed = 0
                self.throttle_position = 0

        if "throttle_position" in data:
            self.throttle_position = int(data["throttle_position"])
            if self.engine_status == "on":
                target_speed = self.throttle_position * 1.2
                self.speed = min(target_speed, self.speed + 2)
            else:
                self.speed = 0

        state = self.to_dict()
        print(f"New state after update: {state}")
        return state

    def to_dict(self):
        return {
            "engineStatus": self.engine_status,
            "throttlePosition": self.throttle_position,
            "speed": round(self.speed, 1),
            "brakePressure": self.brake_pressure,
            "fuelLevel": self.fuel_level,
            "signal": self.signal,
            "timeOfDay": self.time_of_day,
            "weather": self.weather
        }

class SimulationUpdate(BaseModel):
    speed: Optional[float] = None
    throttle_position: Optional[int] = None
    engine_status: Optional[str] = None 