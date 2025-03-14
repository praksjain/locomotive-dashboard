import { useEffect } from 'react';
import * as THREE from 'three';

interface Props {
    scene: THREE.Scene;
}

const WeatherEffects: React.FC<Props> = ({ scene }) => {
    useEffect(() => {
        // Rain effect
        const rainGeometry = new THREE.BufferGeometry();
        const rainCount = 15000;
        const positions = new Float32Array(rainCount * 3);
        
        for (let i = 0; i < rainCount * 3; i += 3) {
            positions[i] = Math.random() * 400 - 200;
            positions[i + 1] = Math.random() * 500;
            positions[i + 2] = Math.random() * 400 - 200;
        }
        
        rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const rainMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.1,
            transparent: true
        });
        
        const rain = new THREE.Points(rainGeometry, rainMaterial);
        scene.add(rain);
        
        // Animation
        const animateRain = () => {
            const positions = (rain.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= 1.5;
                if (positions[i + 1] < 0) {
                    positions[i + 1] = 500;
                }
            }
            rain.geometry.attributes.position.needsUpdate = true;
            requestAnimationFrame(animateRain);
        };
        
        animateRain();
        
        return () => {
            scene.remove(rain);
        };
    }, [scene]);
    
    return null;
};

export default WeatherEffects; 