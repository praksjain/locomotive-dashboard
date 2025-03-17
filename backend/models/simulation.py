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
        # Add new control states
        self.wiper = False
        self.radio = False
        self.heater = False
        self.air_cond = False
        self.night_mode = False
        self.auto_signal = False
        self.ventilation = False
        self.defrost = False
        self.fan = False
        self.cabin_lights = False
        self.headlights = False

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
                
        if "signal" in data:
            new_signal = data["signal"]
            print(f"Changing signal from {self.signal} to {new_signal}")
            self.signal = new_signal
            
        # Handle new controls
        if "wiper" in data:
            self.wiper = data["wiper"]
            print(f"Wiper set to: {self.wiper}")
            
        if "radio" in data:
            self.radio = data["radio"]
            print(f"Radio set to: {self.radio}")
            
        if "heater" in data:
            self.heater = data["heater"]
            print(f"Heater set to: {self.heater}")
            
        if "air_cond" in data:
            self.air_cond = data["air_cond"]
            print(f"Air conditioning set to: {self.air_cond}")
            
        if "night_mode" in data:
            self.night_mode = data["night_mode"]
            print(f"Night mode set to: {self.night_mode}")
            
        if "auto_signal" in data:
            self.auto_signal = data["auto_signal"]
            print(f"Auto signal set to: {self.auto_signal}")
            
        if "ventilation" in data:
            self.ventilation = data["ventilation"]
            print(f"Ventilation set to: {self.ventilation}")
            
        if "defrost" in data:
            self.defrost = data["defrost"]
            print(f"Defrost set to: {self.defrost}")
            
        if "fan" in data:
            self.fan = data["fan"]
            print(f"Fan set to: {self.fan}")
            
        if "cabin_lights" in data:
            self.cabin_lights = data["cabin_lights"]
            print(f"Cabin lights set to: {self.cabin_lights}")
            
        if "headlights" in data:
            self.headlights = data["headlights"]
            print(f"Headlights set to: {self.headlights}")

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
            "weather": self.weather,
            "wiper": self.wiper,
            "radio": self.radio,
            "heater": self.heater,
            "airCond": self.air_cond,
            "nightMode": self.night_mode,
            "autoSignal": self.auto_signal,
            "ventilation": self.ventilation,
            "defrost": self.defrost,
            "fan": self.fan,
            "cabinLights": self.cabin_lights,
            "headlights": self.headlights
        }

class SimulationUpdate(BaseModel):
    speed: Optional[float] = None
    throttle_position: Optional[int] = None
    engine_status: Optional[str] = None 