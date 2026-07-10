import { mt_rand, mt_randf } from "./functions.js";

export default class Model {
    constructor(cfg) {
        this.cfg = cfg;
        this.boids = [];
        this.resetSAC();
        this.initBoids(cfg);
    }
    initBoids(cfg) {
        for (let i = 0; i < cfg.numBoids; i++) {
            this.boids.push({
                position: { x: mt_rand(1, cfg.width), y: mt_rand(1, cfg.height) },
                velocity: { x: mt_randf(-1, 1), y: mt_randf(-1, 1) },
                opacity:0.2,
                personality: { curiosity: (Math.random() - 0.5) * 0.2 }
            });
        }
    }
    resetSAC() {
        this.separation = { x: 0, y: 0 };
        this.alignment = { x: 0, y: 0 };
        this.cohesion = { x: 0, y: 0 };
    }
    getTurnAngle(oldVel, newVel) {
        const dot = oldVel.x * newVel.x + oldVel.y * newVel.y;
        const magA = Math.sqrt(oldVel.x * oldVel.x + oldVel.y * oldVel.y);
        const magB = Math.sqrt(newVel.x * newVel.x + newVel.y * newVel.y);
        const cosTheta = dot / (magA * magB + 1e-6); 
        return Math.acos(Math.max(-1, Math.min(1, cosTheta))); // radians
    }
    nudgeTowardCenter(boid, dt) {
        const centerX = this.cfg.width / 2;
        const centerY = this.cfg.height / 2;

        // Vector from boid to center
        const toCenterX = centerX - boid.position.x;
        const toCenterY = centerY - boid.position.y;

        const probability = 1 - Math.exp(-this.cfg.edgeNudgeChance * dt);
        if ( Math.random() < probability ) {
            boid.velocity.x += toCenterX * this.cfg.edgeNudgeStrength * dt;
            boid.velocity.y += toCenterY * this.cfg.edgeNudgeStrength * dt;
        }
    }
    wrapAroundEdges(boid) {
        if (boid.position.x < 0) boid.position.x += this.cfg.width;
        if (boid.position.x > this.cfg.width) boid.position.x -= this.cfg.width;
        if (boid.position.y < 0) boid.position.y += this.cfg.height;
        if (boid.position.y > this.cfg.height) boid.position.y -= this.cfg.height;
    }
    tick(dt, elapsedTime) {
        // Compute new velocities & positions
        for (const boid of this.boids) {
            const oldVel = { ...boid.velocity };
            const { x, y } = this.computeVelocity(boid, dt, elapsedTime);
            const fadeRate = 1.2; // opacity per second
            boid.velocity.x = x;
            boid.velocity.y = y;

            boid.position.x += boid.velocity.x * dt;
            boid.position.y += boid.velocity.y * dt;
            
            const turnAngle = this.getTurnAngle(oldVel, boid.velocity);
            // If sharp turn, bump opacity
            if ( turnAngle > 0.1 ) {  // tweak threshold
                boid.opacity = Math.min(0.4, boid.opacity + 0.3);
            } else {
                // slowly fade back to normal
                // boid.opacity = Math.max(0.2, fadeRate * dt);
                boid.opacity = Math.max(0.2, boid.opacity - 0.02);
            }
            this.nudgeTowardCenter(boid, dt);
            this.wrapAroundEdges(boid);
        }
        return this.boids;
    }
    computeNoise(boid, dt, elapsedTime) {
        // Example using a simple sin/cos drift.  This "stupid" idea turns out to be the best for flocking. 
        // tried simple, perlin, curl, elapsedTime - all are worse.
        const t = Date.now() * dt * 0.001; // seconds
        const noise = {
            x: Math.sin(t + boid.position.y * 0.01) * this.cfg.noiseStrength,
            y: Math.cos(t + boid.position.x * 0.01) * this.cfg.noiseStrength
        };
        return noise;
    }
    limitSpeed(vx, vy) {
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > this.cfg.maxSpeed) {
            vx = (vx / speed) * this.cfg.maxSpeed;
            vy = (vy / speed) * this.cfg.maxSpeed;
        }
        return [ vx, vy ];
    }
    weightedVelocity(idx, velocity) {
        // Weighted sum
        let vx = velocity[idx]
            + this.separation[idx] * this.cfg.separationStrength
            + this.alignment[idx] * this.cfg.alignmentStrength
            + this.cohesion[idx] * this.cfg.cohesionStrength;
        return vx;
    }
    getDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        return [dx, dy, Math.sqrt(dx * dx + dy * dy)];        
    }
    setSeparation(dist, dx, dy, dt) {
        if (dist < this.cfg.separationDistance && dist > 0) {
            this.separation.x -= dx / dist * dt;
            this.separation.y -= dy / dist * dt;
        }    
    }
    setAlignment(velocity, dt) {
        this.alignment.x += velocity.x * dt;
        this.alignment.y += velocity.y * dt;    
    }
    setCohesion(position, dt) {
        this.cohesion.x += position.x * dt;
        this.cohesion.y += position.y * dt; 
    }
    checkOnNeighbors(neighbors, position) {
        if ( neighbors > 0 ) {
            this.alignment.x /= neighbors;
            this.alignment.y /= neighbors;

            this.cohesion.x = (this.cohesion.x / neighbors) - position.x;
            this.cohesion.y = (this.cohesion.y / neighbors) - position.y;
        }
    }
    computeVelocity(boid, dt, elapsedTime) {
        this.resetSAC();

        let neighbors = 0;

        for ( const other of this.boids ) {
            if ( other === boid ) continue;

            const [dx, dy, dist] = this.getDistance(other.position, boid.position);

            if ( dist < this.cfg.neighborRadius ) {
                neighbors++;
                this.setSeparation(dist, dx, dy, dt);
                this.setAlignment(other.velocity, dt);
                this.setCohesion(other.position, dt);
            }
        }

        this.checkOnNeighbors(neighbors, boid.position);

        let vx = this.weightedVelocity("x", boid.velocity);
        let vy = this.weightedVelocity("y", boid.velocity);

        const noise = this.computeNoise(boid, dt, elapsedTime);

        vx += noise.x;
        vy += noise.y; 

        [ vx, vy ] = this.limitSpeed(vx, vy);
        return { x: vx, y: vy };
    }
}