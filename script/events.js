import { MIN_RELATION, MAX_RELATION } from "./constants.js";
import * as UI from "./ui-elements.js";

export function initEventListeners(particleManager) {
  // init resize canvas
  window.addEventListener("resize", () => {
    UI.canvas.width = window.innerWidth;
    UI.canvas.height = window.innerHeight;
  });

  // init restart simulation
  UI.restart.addEventListener("click", () => {
    particleManager.randomPositions();
    particleManager.randomRelations(MIN_RELATION, MAX_RELATION);
    particleManager.randomColors();
  });

  // init random relations
  UI.randomRelations.addEventListener("click", () => {
    particleManager.randomRelations(MIN_RELATION, MAX_RELATION);
  });

  // init random colors
  UI.randomColors.addEventListener("click", () => {
    particleManager.randomColors();
  });

  // init group count
  const updateGroupCount = () => {
    particleManager.updateGroupCount(
      UI.groupCount.value,
      UI.particleCount.value,
      MIN_RELATION,
      MAX_RELATION
    );
    UI.groupCountText.innerHTML = `Group Count: ${UI.groupCount.value}`;
  };
  UI.groupCount.addEventListener("input", updateGroupCount);
  updateGroupCount();

  // init total particle count
  const updateParticleCount = () => {
    particleManager.updateParticleCount(UI.particleCount.value);
    UI.particleCountText.innerHTML = `Total Particle Count: ${UI.particleCount.value}`;
  };
  UI.particleCount.addEventListener("input", updateParticleCount);
  updateParticleCount();

  // init relation scale
  const updateRelationScale = () => {
    UI.relationScaleText.innerHTML = `Relation Scale: ${
      UI.relationScale.value / 10
    }%`;
  };
  UI.relationScale.addEventListener("input", updateRelationScale);
  updateRelationScale();

  // init cohesion
  const updateCohesion = () => {
    UI.cohesionText.innerHTML = `Cohesion: ${UI.cohesion.value / 100}`;
  };
  UI.cohesion.addEventListener("input", updateCohesion);
  updateCohesion();

  // init friction
  const updateFriction = () => {
    UI.frictionText.innerHTML = `Friction: ${UI.friction.value / 10}%`;
  };
  UI.friction.addEventListener("input", updateFriction);
  updateFriction();

  // init range
  const updateRange = () => {
    UI.rangeText.innerHTML = `Range: ${UI.range.value}px`;
  };
  UI.range.addEventListener("input", updateRange);
  updateRange();
}
