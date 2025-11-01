import { MarkJSParticles } from "./markjsparticles.js";

const canvas = document.getElementById("canvas");
const triggerButton = document.getElementById("triggerEffect");
const effectTypeSelect = document.getElementById("effectType");

// Update UI defaults based on selected effect type
effectTypeSelect.addEventListener("change", function () {
  const selectedType = this.value;
  if (selectedType === "confetti") {
    // Set confetti-friendly defaults
    document.getElementById("particlesPerExplosion").value = "50";
    document.getElementById("particlesMinSpeed").value = "1";
    document.getElementById("particlesMaxSpeed").value = "4";
    document.getElementById("particlesMinSize").value = "2";
    document.getElementById("particlesMaxSize").value = "8";
    document.getElementById("lifetime").value = "3"; // 3 seconds for longer confetti lifetime
    document.getElementById("lifetimeJitter").value = "0.3";
    document.getElementById("gravity").value = "0.01";
  } else if (selectedType === "explosion") {
    // Set explosion defaults
    document.getElementById("particlesPerExplosion").value = "30";
    document.getElementById("particlesMinSpeed").value = "3";
    document.getElementById("particlesMaxSpeed").value = "6";
    document.getElementById("particlesMinSize").value = "1";
    document.getElementById("particlesMaxSize").value = "6";
    document.getElementById("lifetime").value = "2";
    document.getElementById("lifetimeJitter").value = "0.5";
    document.getElementById("gravity").value = "0.02";
  } else if (selectedType === "fireworks") {
    // Fireworks defaults: upward motion then burst
    document.getElementById("particlesPerExplosion").value = "20";
    document.getElementById("particlesMinSpeed").value = "5";
    document.getElementById("particlesMaxSpeed").value = "10";
    document.getElementById("particlesMinSize").value = "2";
    document.getElementById("particlesMaxSize").value = "4";
    document.getElementById("lifetime").value = "2";
    document.getElementById("lifetimeJitter").value = "0.6";
    // Negative gravity makes particles initially move upward (handled by library)
    document.getElementById("gravity").value = "-0.05";
  }
});

const options = {
  background: "#222",
};

const pm = new MarkJSParticles(canvas, options);

// glow strength uses a single numeric input (#glowStrengthNumber)

// Toggle debug overlay with 'D'
window.addEventListener("keydown", (e) => {
  if (e.key === "d" || e.key === "D") {
    pm.debug = !pm.debug;
    console.log("MarkJSParticles debug:", pm.debug);
  }
});

// Game loop for updating and rendering particles
let lastTime = 0;
function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  pm.update(deltaTime);
  pm.ctx.fillStyle = pm.background;
  pm.ctx.fillRect(0, 0, pm.canvas.width, pm.canvas.height);
  pm.render();

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

function getEffectOptions() {
  // Always use parseFloat for all numeric values
  const particlesPerExplosion = parseFloat(
    document.getElementById("particlesPerExplosion").value
  );
  const particlesMinSpeed = parseFloat(
    document.getElementById("particlesMinSpeed").value
  );
  const particlesMaxSpeed = parseFloat(
    document.getElementById("particlesMaxSpeed").value
  );
  const particlesMinSize = parseFloat(
    document.getElementById("particlesMinSize").value
  );
  const particlesMaxSize = parseFloat(
    document.getElementById("particlesMaxSize").value
  );
  const lifetime = parseFloat(document.getElementById("lifetime").value);
  const lifetimeJitterRaw = document.getElementById("lifetimeJitter").value;
  console.log("lifetimeJitter raw:", lifetimeJitterRaw);
  const gravity = parseFloat(document.getElementById("gravity").value);
  const glowStrengthRaw = document.getElementById("glowStrengthNumber")?.value;

  // Normalize lifetimeJitter
  let lifetimeJitter = 0.5;
  if (
    lifetimeJitterRaw !== "" &&
    lifetimeJitterRaw !== null &&
    lifetimeJitterRaw !== undefined
  ) {
    const normalized = String(lifetimeJitterRaw).replace(",", ".");
    const n = parseFloat(normalized);
    if (!isNaN(n)) lifetimeJitter = n;
  }
  console.log("lifetimeJitter parsed:", lifetimeJitter);

  const opts = {
    particlesPerExplosion,
    particlesMinSpeed,
    particlesMaxSpeed,
    particlesMinSize,
    particlesMaxSize,
    gravity: !isNaN(gravity) ? gravity : 0.02,
    lifetimeJitter,
    glowStrength: !isNaN(parseFloat(glowStrengthRaw))
      ? parseFloat(glowStrengthRaw)
      : 0,
  };
  if (!isNaN(lifetime) && lifetime > 0) {
    opts.lifetimeMs = lifetime * 1000;
  }

  // Custom color logic for all effects
  const useCustomColors = document.getElementById("useCustomColors").checked;
  if (useCustomColors) {
    opts.rMin = parseInt(document.getElementById("rMin").value, 10);
    opts.rMax = parseInt(document.getElementById("rMax").value, 10);
    opts.gMin = parseInt(document.getElementById("gMin").value, 10);
    opts.gMax = parseInt(document.getElementById("gMax").value, 10);
    opts.bMin = parseInt(document.getElementById("bMin").value, 10);
    opts.bMax = parseInt(document.getElementById("bMax").value, 10);
  }
  return opts;
}

function triggerEffect(x, y) {
  const effectType = effectTypeSelect.value;
  const effectOptions = getEffectOptions();
  // Clamp coordinates to canvas bounds
  const cx = Math.max(0, Math.min(canvas.width, x));
  const cy = Math.max(0, Math.min(canvas.height, y));
  console.log("addEffect:", effectType, effectOptions, "at", { x: cx, y: cy });
  if (isNaN(cx) || isNaN(cy)) {
    // Show error on canvas
    pm.ctx.save();
    pm.ctx.fillStyle = "#f00";
    pm.ctx.font = "24px monospace";
    pm.ctx.fillText("ERROR: Invalid click coordinates", 32, 64);
    pm.ctx.restore();
    return;
  }
  pm.addEffect(effectType, [cx, cy], effectOptions);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  console.log("Canvas click:", {
    x,
    y,
    rawX: e.clientX,
    rawY: e.clientY,
    rect,
  });
  triggerEffect(x, y);
});

triggerButton.addEventListener("click", () => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  triggerEffect(centerX, centerY);
});

// Show/hide custom color controls based on checkbox and effect type
(function setupCustomColorControls() {
  const useCustomColorsCheckbox = document.getElementById("useCustomColors");
  const customColorControls = document.getElementById("customColorControls");
  if (!useCustomColorsCheckbox || !customColorControls || !effectTypeSelect)
    return;

  function updateCustomColorVisibility() {
    if (useCustomColorsCheckbox.checked) {
      customColorControls.classList.add("visible");
      customColorControls.setAttribute("aria-hidden", "false");
    } else {
      customColorControls.classList.remove("visible");
      customColorControls.setAttribute("aria-hidden", "true");
    }
  }

  useCustomColorsCheckbox.addEventListener(
    "change",
    updateCustomColorVisibility
  );
  effectTypeSelect.addEventListener("change", updateCustomColorVisibility);
  // Ensure correct state on load
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", updateCustomColorVisibility);
  } else {
    updateCustomColorVisibility();
  }
})();
