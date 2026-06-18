export default class CollisionSystem {
    constructor() {}

    ballVsWalls(ball, bounds) {
        const r = ball.collider.radius;
        if ( ball.x + r >= bounds.right ) {
            ball.x = bounds.right - r;
            ball.vx *= -1;
        }
        if ( ball.x - r <= bounds.left ) {
            ball.x = bounds.left + r;
            ball.vx *= -1;
        }
        if ( ball.y + r >= bounds.top ) {
            ball.y = bounds.top - r;
            ball.vy *= -1;
        }
        if ( ball.y - r <= bounds.bottom ) {
            ball.y = bounds.bottom + r;
            ball.vy *= -1;
        }
    }
    ballVsPaddle(ball, paddle) {
        const r = ball.collider.radius;
        const bounds = paddle.collider;

        // quick rejection (your existing optimisation)
        if ( ball.x + r < bounds.left ) return;
        if ( ball.x - r > bounds.right ) return;
        if ( ball.y + r < bounds.bottom ) return;
        if ( ball.y - r > bounds.top ) return;

        // --- collision happened ---

        // snap ball above paddle (prevents sticking)
        ball.y = bounds.top + r;

        // compute hit position (-1 to +1)
        const hitPos = (ball.x - bounds.x) / (bounds.width / 2);

        // optional clamp so it doesn't go insane at edges
        const clampedHit = Math.max(-1, Math.min(1, hitPos));

        // tweak angle influence strength
        const maxAngleFactor = 6;

        ball.vx = clampedHit * maxAngleFactor;
        ball.vy *= -1;
    }
    ballVsBrick(ball, brick) {
        const r = ball.collider.radius;
        const bounds = brick.collider;
        if ( ball.x + r < bounds.left ) return 0;
        if ( ball.x - r > bounds.right ) return 0;
        if ( ball.y + r < bounds.bottom ) return 0;
        if ( ball.y - r > bounds.top ) return 0;   

        if ( ball.x + r >= bounds.right ) {
            ball.x = bounds.right + r;
            ball.vx *= -1;
            return 1;
        }
        if ( ball.x - r <= bounds.left ) {
            ball.x = bounds.left - r;
            ball.vx *= -1;
            return 1;
        }
        if ( ball.y + r >= bounds.top ) {
            ball.y = bounds.top + r;
            ball.vy *= -1;
            return 1;
        }
        if ( ball.y - r <= bounds.bottom ) {
            ball.y = bounds.bottom - r;
            ball.vy *= -1;
            return 1;
        }
    }
    ballVsWall(ball, wall, gamestate) {
        for ( const b of wall.bricks ) {
            const hit = this.ballVsBrick(ball, b);
            gamestate.registerHit(hit);
        }
    }
}
