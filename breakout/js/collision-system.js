import { clamp } from "./functions.js";

export default class CollisionSystem {
    constructor() {

    }
    bounceX(ball, dir) {
        ball.x = dir; // snap ball (prevents sticking)
        ball.vx *= -1;
        return 1; // it's a hit
    }
    bounceY(ball, dir) {
        ball.y = dir; 
        ball.vy *= -1;
        return 1;
    }
    ballVsEdges(ball, bounds, gamestate) {
        const r = ball.collider.radius;
        if ( ball.x - r <= bounds.left ) 
            this.bounceX(ball, bounds.left + r);

        if ( ball.x + r >= bounds.right ) 
            this.bounceX(ball, bounds.right - r);

        if ( ball.y + r >= bounds.top ) 
            this.bounceY(ball, bounds.top - r);
    }
    ballVsPaddle(ball, paddle) {
        const bounds = paddle.collider;
        if ( this.isOutsideBounds(ball, bounds) ) return;

        // --- collision happened ---
        const r = ball.collider.radius;
        this.bounceY(ball, bounds.top + r);
        // compute hit position (-1 to +1)
        const hitPos = (ball.x - bounds.x) / (bounds.width / 2);

        // optional clamp so it doesn't go insane at edges
        const clampedHit = clamp(hitPos, -1, 1);

        ball.vx = clampedHit * paddle.maxAngleFactor;
        
    }
    isOutsideBounds(ball, bounds) {
        const r = ball.collider.radius;
        return ( 
            ball.x + r < bounds.left ||
            ball.x - r > bounds.right ||
            ball.y + r < bounds.bottom ||
            ball.y - r > bounds.top );
    }
    ballVsBrick(ball, brick) {
        const r = ball.collider.radius;
        const bounds = brick.collider;

        if (this.isOutsideBounds(ball, bounds))
            return 0;

        const overlapLeft   = Math.abs((ball.x + r) - bounds.left);
        const overlapRight  = Math.abs(bounds.right - (ball.x - r));
        const overlapTop    = Math.abs(bounds.top - (ball.y - r));
        const overlapBottom = Math.abs((ball.y + r) - bounds.bottom);

        const minOverlap = Math.min(
            overlapLeft,
            overlapRight,
            overlapTop,
            overlapBottom
        );

        if (minOverlap === overlapLeft)
            return this.bounceX(ball, bounds.left - r);

        if (minOverlap === overlapRight)
            return this.bounceX(ball, bounds.right + r);

        if (minOverlap === overlapTop)
            return this.bounceY(ball, bounds.top + r);

        return this.bounceY(ball, bounds.bottom - r);
    }
    ballVsBrick0(ball, brick) {
        const r = ball.collider.radius;
        const bounds = brick.collider;
        if ( this.isOutsideBounds(ball, bounds) ) return 0;

        if ( ball.x + r >= bounds.right ) 
            return this.bounceX(ball, bounds.right + r);

        if ( ball.x - r <= bounds.left ) 
            return this.bounceX(ball, bounds.left - r);

        if ( ball.y + r >= bounds.top ) 
            return this.bounceY(ball, bounds.top + r);

        if ( ball.y - r <= bounds.bottom ) 
            return this.bounceY(ball, bounds.bottom - r);
    }
    ballVsWall(ball, wall, gamestate) {
        for ( const b of wall.bricks ) {

            if ( b.destroyed ) continue;

            const hit = this.ballVsBrick(ball, b);
            
            if ( hit === 1 ) {
                gamestate.registerHit(hit);
                b.destroy();
                break;
            }
        }
    }
}