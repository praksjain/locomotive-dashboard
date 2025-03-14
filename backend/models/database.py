from sqlalchemy import Column, Integer, Float, String, DateTime
from database import Base
import datetime

class SimulationLog(Base):
    __tablename__ = "simulation_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    speed = Column(Float)
    engine_status = Column(String)
    throttle_position = Column(Integer)
    brake_pressure = Column(Float)
    fuel_level = Column(Float) 