import { RADIUS } from "./constants.js";
import * as UI from "./ui-elements.js";
import { initEventListeners } from "./events.js";
import { ParticleManager } from "./particle-manager.js";

UI.canvas.width = window.innerWidth;
UI.canvas.height = window.innerHeight;

const particleManager = new ParticleManager();

initEventListeners(particleManager);

setInterval(() => {
  UI.context.clearRect(0, 0, UI.canvas.width, UI.canvas.height);

  particleManager.simulate(
    UI.relationScale.value / 100,
    1 - UI.friction.value / 1000,
    UI.cohesion.value / 100,
    UI.range.value,
    UI.canvas
  );

  particleManager.drawParticles(UI.context, RADIUS);
}, 40);
