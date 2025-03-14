class SoundService {
    private engineSound: HTMLAudioElement;
    private throttleSound: HTMLAudioElement;
    private brakeSound: HTMLAudioElement;
    private initialized: boolean = false;
    
    constructor() {
        this.engineSound = new Audio();
        this.throttleSound = new Audio();
        this.brakeSound = new Audio();
        
        // Set default sources
        this.engineSound.src = '/assets/sounds/engine-idle.mp3';
        this.throttleSound.src = '/assets/sounds/throttle.mp3';
        this.brakeSound.src = '/assets/sounds/brake.mp3';
        
        this.engineSound.loop = true;
        
        // Preload sounds
        this.preloadSounds();
    }

    private async preloadSounds() {
        try {
            await Promise.all([
                this.engineSound.load(),
                this.throttleSound.load(),
                this.brakeSound.load()
            ]);
            this.initialized = true;
        } catch (error) {
            console.warn('Sound loading failed:', error);
        }
    }

    async startEngine() {
        try {
            if (!this.initialized) {
                console.warn('Sounds not initialized yet');
                return;
            }
            await this.engineSound.play();
            this.engineSound.volume = 0.3;
        } catch (error) {
            console.warn('Engine sound failed to play:', error);
        }
    }

    stopEngine() {
        try {
            this.engineSound.pause();
            this.engineSound.currentTime = 0;
        } catch (error) {
            console.warn('Engine sound failed to stop:', error);
        }
    }

    async updateThrottle(position: number) {
        try {
            if (!this.initialized) return;
            this.engineSound.volume = 0.3 + (position / 100) * 0.7;
            await this.throttleSound.play();
        } catch (error) {
            console.warn('Throttle sound failed to play:', error);
        }
    }

    async applyBrake() {
        try {
            if (!this.initialized) return;
            await this.brakeSound.play();
        } catch (error) {
            console.warn('Brake sound failed to play:', error);
        }
    }
}

export const soundService = new SoundService(); 