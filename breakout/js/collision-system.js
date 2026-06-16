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
        if ( ball.x + r < paddle.collider.left ) return;
        if ( ball.x - r > paddle.collider.right ) return;
        if ( ball.y + r < paddle.collider.bottom ) return;
        if ( ball.y - r > paddle.collider.top ) return;        
        
        ball.y = paddle.collider.top + r;
        ball.vy *= -1;
    }
}
