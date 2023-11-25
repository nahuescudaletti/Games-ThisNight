import {
  setCustomProperty,
  incrementCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js"

const CACTUS_INTERVAL_MIN = 700;
const CACTUS_INTERVAL_MAX = 900;
const worldElem = document.querySelector("[data-world]");

let nextCactusTime;

export function setupCactus() {
  nextCactusTime = CACTUS_INTERVAL_MIN;
  document.querySelectorAll("[data-cactus]").forEach(cactus => {
    cactus.remove();
  });
}

export function updateCactus(delta) {
  document.querySelectorAll("[data-cactus]").forEach(cactus => {
    const speed = parseFloat(cactus.dataset.speed); // Obtener la velocidad del cactus
    incrementCustomProperty(cactus, "--left", delta * speed * -2);
    if (getCustomProperty(cactus, "--left") <= -100) {
      cactus.remove();
    }
  });

  if (nextCactusTime <= 1) {
    createCactus();
    nextCactusTime =
      randomNumberBetween(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX);
  }
  nextCactusTime -= delta;
}

export function getCactusRects() {
  return [...document.querySelectorAll("[data-cactus]")].map(cactus => {
    return cactus.getBoundingClientRect();
  });
}

function createCactus() {
  const cactus = document.createElement("img");
  cactus.dataset.cactus = true;
  cactus.src = "imgs/bullet.png";
  cactus.classList.add("cactus");

  // Asignar una velocidad aleatoria al cactus
  let speed;
  if (Math.random() < 0.2) {
    // 20% de probabilidad de que sea más rápido
    speed = Math.random() * (0.05 - 0.04 ) + 0.06;
  } else {
    speed = Math.random() * (0.05 - 0.04) + 0.05;
  }

  cactus.dataset.speed = speed;

  setCustomProperty(cactus, "--left", 100);
  worldElem.append(cactus);
}


function randomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
