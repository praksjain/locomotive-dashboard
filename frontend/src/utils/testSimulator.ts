export async function testSimulator() {
    console.log('Testing Locomotive Simulator...');
    
    // Wait for user interaction before testing sounds
    const startTest = () => {
        document.removeEventListener('click', startTest);
        
        // Test controls
        const controls = [
            { key: 'e', description: 'Start/Stop Engine' },
            { key: 'ArrowUp', description: 'Increase Throttle' },
            { key: 'ArrowDown', description: 'Decrease Throttle' },
            { key: 't', description: 'Change Time of Day' },
            { key: 'w', description: 'Change Weather' }
        ];

        controls.forEach(control => {
            const event = new KeyboardEvent('keydown', { key: control.key });
            window.dispatchEvent(event);
            console.log(`Tested: ${control.description}`);
        });
    };

    document.addEventListener('click', startTest);
    console.log('Click anywhere to start the test...');

    // Test WebSocket
    try {
        const ws = new WebSocket('ws://localhost:8000/ws');
        ws.onopen = () => console.log('WebSocket connection successful');
        ws.onerror = () => console.error('WebSocket connection failed');
    } catch (error) {
        console.error('WebSocket test failed:', error);
    }
} 