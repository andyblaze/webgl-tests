import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';
import CollisionSystem from './collision-system.js';
import Ball from './ball.js';
import Paddle from './paddle.js';
import InputManager from './input-manager.js';
import Hud from './hud.js';
import GameState from './gamestate.js';
import Wall from './wall.js';

const gamestate = new GameState();
gamestate.addObserver(new Hud());
gamestate.notify();

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-10, 10, 7.5, -7.5, 0.1, 100);
camera.position.z = 10;
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// game items
const collisions = new CollisionSystem();
const input = new InputManager();
const wall = new Wall(THREE, scene, 8, 5, { width: 2, height: 1 });

const paddle = new Paddle(THREE, { x: 0, y: -6, width: 3, height: 0.3 });
paddle.addToScene(scene);

const ball = new Ball(THREE, { x: 0, y: 0, radius: 0.2 });
ball.addToScene(scene);

// World Bounds
const edges = { left: -10, right: 10, top: 7.5, bottom: -7.5 };

// animation stuff
const clock = new THREE.Clock();

function animate(timestamp) {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();    

    ball.update(deltaTime, edges);
    paddle.update(deltaTime, input, edges);    
    collisions.ballVsEdges(ball, edges);
    collisions.ballVsPaddle(ball, paddle);
    collisions.ballVsWall(ball, wall, gamestate);
    gamestate.update(ball);
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
