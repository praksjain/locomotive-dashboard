from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from models.simulation import SimulationState

app = FastAPI()
simulation = SimulationState()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Locomotive Simulator Backend Running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connected")
    
    try:
        # Send initial state immediately after connection
        initial_state = simulation.to_dict()
        print("Sending initial state:", initial_state)
        await websocket.send_json(initial_state)
        
        while True:
            data = await websocket.receive_json()
            print("Received data:", data)
            updated_state = simulation.update(data)
            print("Sending updated state:", updated_state)
            await websocket.send_json(updated_state)
    except Exception as e:
        print(f"WebSocket error: {e}")
