const config = {
  width: window.innerWidth,   // canvas width
  height: window.innerHeight, // canvas height
  numBoids: 425,             // number of boids to simulate
  framesPerTick: 1,           // update frequency (higher = slower updates, lower CPU)

  // --- perception ---
  neighborRadius: 250,        // how far a boid "sees" others
                              // bigger → flock acts more coherently
                              // smaller → more local chaos & splintering

  separationDistance: 30,     // minimum comfortable distance
                              // if neighbors are closer than this, boid steers away

  // --- weights / strengths ---
  separationStrength: 0.2,   // how strongly a boid avoids crowding
                              // bigger → flock looks looser, more "pushy"
                              // smaller → boids overlap more

  alignmentStrength: 0.0001,     // how strongly a boid matches neighbor direction
                              // bigger → flock aligns quickly, straighter flight
                              // smaller → flock looks messy / scattered

  cohesionStrength: 0.001,     // how strongly a boid moves toward neighbor center
                              // bigger → flock clumps tighter, denser formations
                              // smaller → flock drifts apart

  // --- motion limits ---
  maxSpeed: 3.5,              // maximum boid speed
                              // bigger → flock moves faster, more energetic
                              // smaller → slower, gentler motion

  maxForce: 0.0001,               // maximum steering adjustment per frame
                              // bigger → boids can make sharp, agile turns
                              // smaller → smooth but less responsive turns
// --- environment ---
noiseStrength: 0.2,   // how strong the "gusts of wind" are
                        // bigger → more chaotic ripples
                        // smaller → subtle, natural undulations  
    driftSpeed: 0.002, // How much far away boids drift around

    edgeNudgeStrength: 0.001, // how much boids will avoid edges - bigger number is more avoidance
    
    edgeNudgeChance: 0.02 // Random chance to apply edge nudge
};
export default config;