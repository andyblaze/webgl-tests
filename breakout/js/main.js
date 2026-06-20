import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';
import Config from './config.js';
import CollisionSystem from './collision-system.js';
import Ball from './ball.js';
import Paddle from './paddle.js';
import InputManager from './input-manager.js';
import Hud from './hud.js';
import GameState from './gamestate.js';
import Wall from './wall.js';

class Rules {
    constructor() {

    }
    update(ball, bounds, gamestate) {
        const ballLost = ( false === ball.dead && ball.y <= bounds.bottom);
        if ( true === ballLost ) {
            ball.kill();                    
            gamestate.registerLifeLoss();
            ball.reset();
            //ball.dead = false;
            gamestate.togglePaused();
        }
    }
}

const config = new Config();

const gamestate = new GameState();
gamestate.addObserver(new Hud());
gamestate.notify();

const rules = new Rules();

// Scene Setup
const scene = new THREE.Scene();
const { left, right, top, bottom } = {...config.edgesCfg};
const camera = new THREE.OrthographicCamera(left, right, top, bottom, 0.1, 100);
camera.position.z = 10;
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// game items
const collisions = new CollisionSystem();
const input = new InputManager();
const wall = new Wall(THREE, scene, config.wallCfg);

const paddle = new Paddle(THREE, config.paddleCfg);
paddle.addToScene(scene);

const ball = new Ball(THREE, config.ballCfg);
ball.addToScene(scene);

// World Bounds
const edges = config.edgesCfg;

// animation stuff
const clock = new THREE.Clock();

function animate(timestamp) {
    requestAnimationFrame(animate);
    if ( true === gamestate.paused() ) return;
    const deltaTime = clock.getDelta();    

    rules.update(ball, edges, gamestate);
    ball.update(deltaTime);
    paddle.update(deltaTime, input, edges);    
    collisions.ballVsEdges(ball, edges, gamestate);
    collisions.ballVsPaddle(ball, paddle);
    collisions.ballVsWall(ball, wall, gamestate);
    renderer.render(scene, camera);
}
animate(performance.now());

//
// Resize Handling
//

window.addEventListener('resize', () => {
    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
});
