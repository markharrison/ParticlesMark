# MarkJSParticles Developer Documentation

## Overview

MarkJSParticles is a JavaScript class that manages particle effects on an HTML5 Canvas. It provides methods to update and render particles, designed to integrate with an external game loop. The animation loop is handled outside the class, allowing for flexible integration with your application's timing.

## Constructor

### `new MarkJSParticles(canvas, options)`

Creates a new MarkJSParticles instance.

#### Parameters

- `canvas` (HTMLCanvasElement): The canvas element to draw on (required)
- `options` (Object): Configuration options
  - `options` (Object): Configuration options

#### Example

```javascript
const canvas = document.getElementById("myCanvas");
const pm = new MarkJSParticles(canvas);
```

## Methods

### `update(deltaTime)`

Updates the particle animation based on the elapsed time.

#### Parameters

- `deltaTime` (Number): Time elapsed since the last update in milliseconds.

#### Example

```javascript
// In your game loop
const deltaTime = 16.67; // For 60 FPS
pm.update(deltaTime);
```

### `render()`

Renders the particles to the canvas. Call this after `update()` in your render loop.

#### Example

```javascript
// In your render loop
pm.render();
```

#### Parameters

-### `addEffect(type, coords, options)`

Adds an effect at the specified coordinates.

#### Parameters

- `type` (String): The type of effect to add. Supported types: "explosion", "confetti", "fireworks"
- `coords` (Array): [x, y] coordinates of the effect center
- `options` (Object): Effect options

  - `particlesPerExplosion` (Number): Number of particles (default: 30 for explosion, 50 for confetti)
  - `particlesMinSpeed` (Number): Minimum particle speed (default: 3 for explosion, 1 for confetti)
  - `particlesMaxSpeed` (Number): Maximum particle speed (default: 6 for explosion, 4 for confetti)
  - `particlesMinSize` (Number): Minimum particle size (default: 1 for explosion, 2 for confetti)
  - `particlesMaxSize` (Number): Maximum particle size (default: 6 for explosion, 8 for confetti)
  - `lifetimeMs` (Number): Optional maximum lifetime in milliseconds for particles created by this effect. If provided, particles will use this as a base TTL and may have per-particle variation.
  - `lifetimeJitter` (Number 0..1): Fractional jitter applied to particle lifetime. Values between 0 and 1 shorten particle lifetimes by up to that fraction (default: 0.5 for explosion, 0.3 for confetti).
  - `gravity` (Number): Gravity applied to particles (default: 0.02 for explosion, 0.01 for confetti).

  - `glowStrength` (Number): Visual glow strength. When `glowStrength` > 0, particles are drawn with a subtle canvas shadow (blur) to make colors pop. The value scales the shadow blur relative to particle size (for example, `glowStrength = 1.6` multiplies particle size by ~1.6 to compute shadow blur). Default: `0` (off). Set to `0` to explicitly disable glow.

  - `shape` (String): (confetti) Preferred shape for confetti particles. Supported: `square`, `circle`, `ribbon`, `star`. If omitted, shapes are assigned randomly.
  - `sway` (Number): (confetti) per-particle sway is generated internally and is not currently exposed as a top-level `addEffect()` option. See note below.
  - `angularVelocity` (Number): (confetti) initial rotation speed for shaped particles.

  Note: the library currently assigns the following per-particle properties internally for confetti: `sway`, `swayFreq`, and `swayPhase`. These values are randomized per particle and are not currently exposed as top-level `addEffect()` options. If you'd like global defaults or option-controlled ranges (for example `options.sway` or `options.swayFreqRange`), I can add support to the API.

#### Supported Effect Types

- `"explosion"`: Creates an explosion effect with particles radiating outward
- `"confetti"`: Creates a confetti effect with floating particles and brighter colors; confetti particles may be rendered as squares, ribbons, circles or stars and include small rotation and sway behavior.
- `"fireworks"`: Launches upward particles that explode at their peak into outward bursts; uses negative gravity for the launch phase and then normal ballistic movement for the burst.

#### Example

```javascript
// Add an explosion
pm.addEffect("explosion", [400, 300], {
  particlesPerExplosion: 50,
  particlesMinSpeed: 2,
  particlesMaxSpeed: 8,
  particlesMinSize: 1,
  particlesMaxSize: 5,
});

// Add confetti
pm.addEffect("confetti", [400, 300], {
  particlesPerExplosion: 100,
  particlesMinSpeed: 1,
  particlesMaxSpeed: 3,
  particlesMinSize: 3,
  particlesMaxSize: 6,
});
```

### `destroy()`

Clears all effects and cleans up memory.

#### Example

```javascript
pm.destroy();
```

## Integration with Game Loop

MarkJSParticles is designed to work with an external game loop. Here's a basic example:

```javascript
let lastTime = 0;

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Update particles
  pm.update(deltaTime);

  // Render particles
  pm.render();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

## Configurable Parameters

All effect parameters are passed through the `options` object when calling `addEffect()`. This allows for dynamic customization of particle behavior.

### Glow (visual)

MarkJSParticles exposes a single visual parameter to control particle glow: `glowStrength`.

- Type: Number
- Default: `0` (off)
- Behavior: If `glowStrength` &gt; 0 the renderer sets a canvas shadowColor equal to the particle color and computes shadowBlur as roughly `size * glowStrength`. If `glowStrength` is `0` no shadow is applied and rendering is identical to the original behavior.
- Usage: pass `glowStrength` inside the `options` object when calling `addEffect()`, for example:

```javascript
// Add confetti with a subtle glow
pm.addEffect("confetti", [400, 300], {
  particlesPerExplosion: 80,
  particlesMinSize: 2,
  particlesMaxSize: 6,
  glowStrength: 1.6, // enable glow
});

// Disable glow explicitly
pm.addEffect("explosion", [200, 200], { glowStrength: 0 });
```

Note: the test application included in the repository exposes a numeric control named `glowStrengthNumber` which defaults to `0`. Use that control to experiment with values and pick what looks best for your scene.

## Internal Classes

### Explosion

Represents a single explosion effect.

### Confetti

Represents a single confetti effect.

### Particle

Represents an individual particle within an effect.

## Memory Management

MarkJSParticles automatically removes particles and effects when they are no longer active. Call `destroy()` when you're done with the instance to free up resources.

## Extending MarkJSParticles

To add new effects:

1. Create a new static class for the effect (e.g., `MarkJSParticles.Firework`)
2. Update the `addEffect()` method to handle the new type
3. Implement any specific logic in the effect class

## Performance Considerations

- Use appropriate deltaTime values for smooth animation
- Limit the number of simultaneous effects
- Use `destroy()` to clean up when not in use
