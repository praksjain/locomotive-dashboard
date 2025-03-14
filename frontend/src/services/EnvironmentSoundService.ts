class EnvironmentSoundService {
    private rainSound: HTMLAudioElement;
    private windSound: HTMLAudioElement;
    private railsSound: HTMLAudioElement;
    
    constructor() {
        this.rainSound = new Audio('/assets/sounds/rain.mp3');
        this.windSound = new Audio('/assets/sounds/wind.mp3');
        this.railsSound = new Audio('/assets/sounds/rails.mp3');
        
        this.rainSound.loop = true;
        this.windSound.loop = true;
        this.railsSound.loop = true;
    }
    
    updateWeather(weather: string, speed: number) {
        if (weather === 'rain') {
            this.rainSound.play();
            this.rainSound.volume = 0.3;
        } else {
            this.rainSound.pause();
        }
        
        // Wind sound based on speed
        if (speed > 0) {
            this.windSound.play();
            this.windSound.volume = Math.min(speed / 200, 0.5);
            this.railsSound.play();
            this.railsSound.volume = Math.min(speed / 100, 0.3);
        } else {
            this.windSound.pause();
            this.railsSound.pause();
        }
    }
    
    cleanup() {
        this.rainSound.pause();
        this.windSound.pause();
        this.railsSound.pause();
    }
}

export const environmentSoundService = new EnvironmentSoundService(); 