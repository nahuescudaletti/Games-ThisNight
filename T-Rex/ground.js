import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js"

const groundElems = document.querySelectorAll("[data-ground]")
let SPEED = 0.05; // Velocidad inicial

export function setupGround() {
  setCustomProperty(groundElems[0], "--left", 0);
  setCustomProperty(groundElems[1], "--left", 300);
  
  changeSpeedPeriodically();
}

export function updateGround(delta, speedScale) {
  groundElems.forEach(ground => {
    incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1);
    if (getCustomProperty(ground, "--left") <= -300) {
      incrementCustomProperty(ground, "--left", 600);
    }
  });
}

function changeSpeedPeriodically() {
  setInterval(function() {
    const minSpeed = 0.002;
    const maxSpeed = 0.03;
    
    // Generar una velocidad aleatoria dentro del rango especificado
    SPEED = Math.random() * (maxSpeed - minSpeed) + minSpeed;
  }, Math.floor(Math.random() * (7000 - 3000) + 5000)); // Cambio cada 10-20 segundos
}
