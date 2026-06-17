export default class GameState {
    constructor() {
        this.observers = [];

        this.data = {
            lives: 3,
            score: 0,
            gameOver: false
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
    update(ball, hit) {
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
