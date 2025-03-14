import { soundPaths } from '../utils/soundPaths';

export class EnhancedSoundService {
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private initialized: boolean = false;
    
    constructor() {
        this.setupSounds();
    }

    private setupSounds() {
        Object.entries(soundPaths).forEach(([key, path]) => {
            const audio = new Audio();
            audio.crossOrigin = "anonymous";
            audio.onerror = () => console.warn(`Failed to load sound: ${path}`);
            audio.src = path;
            if (key.startsWith('engine') || ['rails', 'wind', 'rain'].includes(key)) {
                audio.loop = true;
            }
            this.sounds.set(key, audio);
        });
    }

    async init() { }

    private getSound(key: string): HTMLAudioElement | undefined {
        return this.sounds.get(key);
    }

    async playOneShot(key: string, volume = 1.0) {
        const sound = this.getSound(key);
        if (sound && this.initialized) {
            try {
                sound.volume = volume;
                sound.currentTime = 0;
                await sound.play();
            } catch (error) {
                console.warn(`Failed to play ${key}:`, error);
            }
        }
    }

    updateEngineSound(throttlePosition: number, speed: number) {
        if (!this.initialized) return;

        const idleSound = this.getSound('engineIdle');
        const revSound = this.getSound('engineRevving');
        
        if (idleSound && revSound) {
            const idleVolume = Math.max(0.2, 1 - (throttlePosition / 50));
            const revVolume = Math.min(1.0, throttlePosition / 50);
            
            idleSound.volume = idleVolume * 0.7;
            revSound.volume = revVolume * 0.7;
        }
    }

    updateEnvironmentSounds(speed: number, weather: string) {
        if (!this.initialized) return;

        const railsSound = this.getSound('rails');
        const windSound = this.getSound('wind');
        const rainSound = this.getSound('rain');

        if (railsSound && windSound) {
            const speedFactor = Math.min(1.0, speed / 100);
            railsSound.volume = speedFactor * 0.5;
            windSound.volume = speedFactor * 0.3;
        }

        if (rainSound) {
            rainSound.volume = weather === 'rain' ? 0.4 : 0;
        }
    }

    async startEngine() { }

    stopEngine() {
        ['engineIdle', 'engineRevving', 'rails', 'wind'].forEach(key => {
            const sound = this.getSound(key);
            if (sound) {
                sound.pause();
                sound.currentTime = 0;
            }
        });
    }

    soundHorn() { }

    ringBell() { }

    toggleDoor(open: boolean) {
        this.playOneShot(open ? 'doorOpen' : 'doorClose', 0.5);
    }

    playSignal() { }

    async updateThrottle(position: number) {
        await this.playOneShot('throttle', 0.5);
        this.updateEngineSound(position, 0);
    }

    async applyBrake() { }

    private static sounds = {
        buttonClick: new Audio('/sounds/button-click.mp3'),
        engineStart: new Audio('/sounds/engine-start.mp3'),
        engineStop: new Audio('/sounds/engine-stop.mp3'),
        horn: new Audio('/sounds/horn.mp3'),
        door: new Audio('/sounds/door.mp3'),
        wipers: new Audio('/sounds/wipers.mp3'),
        pantograph: new Audio('/sounds/pantograph.mp3'),
        compressor: new Audio('/sounds/compressor.mp3'),
        brake: new Audio('/sounds/brake.mp3'),
        radio: new Audio('/sounds/radio-static.mp3'),
    };

    static playSound(soundName: keyof typeof EnhancedSoundService.sounds) {
        const sound = this.sounds[soundName];
        sound.currentTime = 0;
        sound.play().catch(console.error);
    }
}

export const soundService = new EnhancedSoundService(); 