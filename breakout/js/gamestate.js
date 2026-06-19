export default class GameState {
    constructor() {
        this.observers = [];

        this.data = {
            lives: 3,
            score: 0,
            gameOver: false,
            isPaused: false
        };
    }
    addObserver(o) {
        this.observers.push(o);
    }
    registerHit(hit) {
        if ( hit === 1 ) {
            this.data.score++;
            this.notify();
        }
    }
    togglePaused() {
        this.isPaused = !this.isPaused;
    }
    paused() {
        return this.isPaused;
    }
    registerLifeLoss() {
        this.data.lives--;

        if ( this.data.lives <= 0 )
            this.data.gameOver = true;

        this.notify();  
        this.togglePaused();      
    }
    update(ball) {
        if ( ball.y < -5.5 ) {
            this.data.lives--;

            if ( this.data.lives <= 0 )
                this.data.gameOver = true;

            this.notify();
        }
    }
    notify() {
        for ( const o of this.observers )
            o.update(this.data);
    }
}
