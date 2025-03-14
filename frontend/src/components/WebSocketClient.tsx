import React, { useEffect, useState } from "react";

const WebSocketClient: React.FC = () => {
    const [speed, setSpeed] = useState(0);
    const [signal, setSignal] = useState("green");

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setSpeed(data.speed);
            setSignal(data.signal);
        };

        return () => ws.close();
    }, []);

    return (
        <div>
            <h2>Speed: {speed} km/h</h2>
            <h2>Signal: {signal}</h2>
        </div>
    );
};

export default WebSocketClient;
