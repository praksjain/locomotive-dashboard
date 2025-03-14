from database import Base
from sqlalchemy import Column, Integer, String, Float

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)

class SimulationData(Base):
    __tablename__ = "simulation"
    id = Column(Integer, primary_key=True, index=True)
    speed = Column(Float, default=0.0)
    signal = Column(String, default="green")