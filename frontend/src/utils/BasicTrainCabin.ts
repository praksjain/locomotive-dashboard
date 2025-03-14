import * as THREE from 'three';

export function createBasicTrainCabin() {
    const cabin = new THREE.Group();

    // Main cabin body
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2.5, 4),
        new THREE.MeshStandardMaterial({
            color: 0x1a3c5a,
            metalness: 0.8,
            roughness: 0.2
        })
    );
    body.position.y = 1.25;
    cabin.add(body);

    // Front nose section
    const nose = new THREE.Mesh(
        new THREE.ConeGeometry(1.5, 2, 4),
        new THREE.MeshStandardMaterial({
            color: 0x1a3c5a,
            metalness: 0.8,
            roughness: 0.2
        })
    );
    nose.rotation.z = Math.PI;
    nose.rotation.y = Math.PI / 4;
    nose.position.set(0, 1.25, 2.5);
    cabin.add(nose);

    // Windows
    const windowMaterial = new THREE.MeshStandardMaterial({
        color: 0x84c1ff,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.7
    });

    // Front windows
    const frontWindow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.5, 1),
        windowMaterial
    );
    frontWindow.position.set(0, 1.8, 2.01);
    cabin.add(frontWindow);

    // Side windows
    const sideWindowRight = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.8),
        windowMaterial
    );
    sideWindowRight.rotation.y = -Math.PI / 2;
    sideWindowRight.position.set(1.51, 1.8, 1);
    cabin.add(sideWindowRight);

    // Control console
    const console = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.8, 0.8),
        new THREE.MeshStandardMaterial({ 
            color: 0x2c3e50,
            metalness: 0.5,
            roughness: 0.8
        })
    );
    console.position.set(0, 1.2, 1.6);
    cabin.add(console);

    // Add gauges and displays
    const displayPanel = new THREE.Mesh(
        new THREE.PlaneGeometry(1.8, 0.4),
        new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            emissive: 0x27ae60,
            emissiveIntensity: 0
        })
    );
    displayPanel.position.set(0, 1.4, 1.65);
    displayPanel.rotation.x = -Math.PI / 6;
    cabin.add(displayPanel);

    // Throttle lever
    const lever = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.3),
        new THREE.MeshStandardMaterial({ 
            color: 0xe74c3c,
            metalness: 0.8,
            roughness: 0.2
        })
    );
    lever.position.set(0.5, 1.3, 1.65);
    lever.rotation.x = Math.PI / 4;
    lever.name = "throttle_lever";
    cabin.add(lever);

    return cabin;
} 