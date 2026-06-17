import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';
import CollisionSystem from './collision-system.js';
import Ball from './ball.js';
import Paddle from './paddle.js?r=1126';
import InputManager from './input-manager.js';
import Hud from './hud.js';
import GameState from './gamestate.js';
import Brick from './brick.js';

const gamestate = new GameState();
gamestate.addObserver(new Hud());
gamestate.notify();

//
// Scene Setup
//

const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-10, 10, 7.5, -7.5, 0.1, 100);

camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const brick = new Brick(THREE, 0, 4, 9, 2);
brick.addToScene(scene);

const paddle = new Paddle(THREE, 0, -6, 3, 0.3);
paddle.addToScene(scene);

const input = new InputManager();
// World Bounds
const bounds = { left: -10, right: 10, top: 7.5, bottom: -7.5 };

const ball = new Ball(THREE, 0, 0, 0.2);
ball.addToScene(scene);

const collisions = new CollisionSystem();
const clock = new THREE.Clock();

function animate(timestamp) {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();    

    ball.update(deltaTime, bounds);
    paddle.update(deltaTime, input, bounds);    
    collisions.ballVsWalls(ball, bounds);
    collisions.ballVsPaddle(ball, paddle);
    const hit = collisions.ballVsBrick(ball, brick);
    gamestate.update(ball, hit);
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
