# Future Effect ideas

## Sparkle / Twinkle
Visual: brief bright flashes that fade (like camera flash confetti).
Behavior: short TTL, occasional random size/alpha pulse, slight outward velocity.
Render: additive blend (globalCompositeOperation = "lighter") and small radial gradient.
Complexity: easy.

## Rain / Drips
Visual: falling streaks, splashes when hitting ground.
Behavior: high gravity, narrow vertical velocity, trail particles; spawn small splash particles on TTL or y>floor.
Render: thin elongated rects, semi-transparent.
Complexity: medium.

## Snow / Softfall
Visual: slow, drifting flakes with gentle rotation.
Behavior: low gravity, strong per-particle sway, slow angular velocity, long TTL.
Render: round/flake sprite or rotated small polygons, soft alpha.
Complexity: easy.

## Smoke / Puff
Visual: rising diffuse clouds that expand and fade.
Behavior: negative gravity (rise), scale up over lifetime, decreasing alpha, mild turbulence (Perlin-ish or seeded noise).
Render: blurred circles (draw to an offscreen canvas, blur), multiply blend.
Complexity: medium.

## Fountain / Jet
Visual: steady upward spray with gravity arching back down.
Behavior: spawn continually while active, initial upward velocity, then fall; size taper with TTL.
Render: small circles with trailing lines; additive for glow.
Complexity: medium.

## Spiral / Vortex
Visual: particles orbit a center, creating spirals.
Behavior: position = center + polar(angle += angularSpeed, radius += radiusVel), radius can shrink/grow.
Render: small points; color gradient by angle or age.
Complexity: medium.

## Flame / Fire
Visual: flickering flame with orange-yellow gradient and ember sparks.
Behavior: upward negative gravity, rising, scale + alpha change, spawn tiny spark particle with outward velocity.
Render: radial gradient, additive, small ember particles as sparks.
Complexity: medium.

## Bubbles / Rise & Pop
Visual: round bubbles rising, wobbling, pop into small particles on TTL.
Behavior: negative gravity, bubble scale oscillation, pop spawns many small shrapnel.
Render: semi-transparent circle with specular highlight.
Complexity: medium.

## Heart / Icon burst (seasonal)
Visual: burst of heart-shaped particles that float and rotate.
Behavior: initial outward velocities, gentle gravity, rotate and drift.
Render: custom path for heart or small sprite; color palette selectable.
Complexity: easy.

## Magnetic Swarm / Follow pointer
Visual: particles attracted/repelled by pointer or moving attractors.
Behavior: compute acceleration toward/away from target positions, damping.
Render: lots of small dots; lines to show connections optional.
Complexity: medium–hard.

## Galaxy / Orbiting Particles
Visual: many particles orbiting a moving center, trails create spiral galaxy.
Behavior: central gravitational force, slightly randomized initial angular momentum, long TTL, fade trails.
Render: additive points with long semi-transparent trails (persist by not fully clearing background).
Complexity: hard.

## Water splash / Ripple
Visual: particles splash outwards, ripples expand on water plane (2D rings).
Behavior: splash particles with ballistic trajectories; ring objects that expand and fade.
Render: ring stroke with low alpha; splash particles tiny circles.
Complexity: medium.
