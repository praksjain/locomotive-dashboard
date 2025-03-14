from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str

class SimulationDataSchema(BaseModel):
    speed: float
    signal: str
