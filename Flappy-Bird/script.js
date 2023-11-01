let move_speed = 8, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');
let tube_passed = false;

// Define una matriz de imágenes para el pájaro (imagen en reposo y en vuelo)
const birdImages = [
  'images/up.png',  // Imagen en reposo
  'images/down.png',
];

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let maxScoreDisplay = document.getElementById('maxScore');

let game_state = 'Start';
let game_active = true; // Variable para rastrear si el juego está activo
img.style.display = 'none';
message.classList.add('messageStyle');

// Cargar el puntaje máximo almacenado al cargar la página
let maxScore = localStorage.getItem('maxScore') || 0;
maxScoreDisplay.textContent = maxScore;

// Función para detectar si un gamepad está conectado
let gamepadIndex = null;

// Define una variable para rastrear si el botón "X" está presionado
let isJumping = false;

function checkGamepad() {
  const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && gamepads[i].buttons[0].pressed) {
      gamepadIndex = i;
      break;
    }
  }
}

// Detección del gamepad conectado
window.addEventListener("gamepadconnected", checkGamepad);

// Iniciar el juego con el botón "X" del joystick
function checkStartButton() {
  if (gamepadIndex !== null && game_state !== 'Play' && game_active) {
    document.querySelectorAll('.tube').forEach((e) => {
      e.remove();
    });
    img.style.display = 'block';
    bird.style.top = '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
  }
  requestAnimationFrame(checkStartButton);
}

// Llamar a la función para verificar el botón "X" del joystick
checkStartButton();

let bird_dy = 0;

function play() {
  const randomImageIndex = Math.floor(Math.random() * birdImages.length);
  img.src = birdImages[0]; // Establecer la imagen en reposo por defecto

  function move() {
    if (game_state != 'Play' || !game_active) return; // Si el juego no está activo, no continúes

    let tubes = document.querySelectorAll('.tube');
    tubes.forEach((tube) => {
      let tube_props = tube.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (tube_props.right <= 0) {
        tube.remove();
      } else {
        if (bird_props.left < tube_props.left + tube_props.width &&
            bird_props.left + bird_props.width > tube_props.left &&
            bird_props.top < tube_props.top + tube_props.height &&
            bird_props.top + bird_props.height > tube_props.top
        ) {
          game_state = 'End';

          message.innerHTML = 'Juego Terminado'.fontcolor('red') + '<br>Tu Puntuación: ' + score_val.innerHTML;
          message.classList.add('messageStyle');
          img.style.display = 'none';
          sound_die.play();
          // Verificar si el puntaje actual es mayor que el puntaje máximo
          if (parseInt(score_val.innerHTML) > maxScore) {
            maxScore = parseInt(score_val.innerHTML);
            maxScoreDisplay.textContent = maxScore;
            // Almacenar el nuevo puntaje máximo
            localStorage.setItem('maxScore', maxScore);
          }

          game_active = false; // Establecer el juego como no activo

          // Usar setTimeout para mostrar el mensaje durante 2 segundos antes de reiniciar
          setTimeout(function () {
            message.innerHTML = '';
            message.classList.remove('messageStyle');
            // Restablece la posición del pájaro
            bird.style.top = '40vh';
            game_active = true; // Establecer el juego como activo nuevamente
            // Continuar el juego
            requestAnimationFrame(move);
          }, 1500);

          return;
        } else {
          if (tube_props.right < bird_props.left && tube_props.right + move_speed >= bird_props.left && !tube_passed) {
            score_val.innerHTML = +score_val.innerHTML + 1;
            sound_point.play();
            tube_passed = true;
          }
          tube.style.left = tube_props.left - move_speed + 'px';
        }
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  function apply_gravity() {
    if (game_state != 'Play' || !game_active) return; // Si el juego no está activo, no continúes
    bird_dy = bird_dy + gravity;

    // Detección del salto con el botón del joystick
    function checkJumpButton() {
      if (gamepadIndex !== null) {
        const gamepads = navigator.getGamepads();
        const button = gamepads[gamepadIndex].buttons[0];
        if (button.pressed) {
          if (!isJumping) {
            // Cambia la imagen del pájaro a la imagen en vuelo
            img.src = birdImages[1];
            bird_dy = -7.6;
            isJumping = true;
          }
        } else {
          // Cambia la imagen del pájaro a la imagen en reposo cuando se suelta el botón "X"
          img.src = birdImages[0];
          isJumping = false;
        }
      }
      requestAnimationFrame(checkJumpButton);
    }
    requestAnimationFrame(checkJumpButton);

    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      game_state = 'End';
      message.style.left = '28vw';
      window.location.reload();
      message.classList.remove('messageStyle');
      return;
    }
    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let tube_separation = 0;
  let tube_gap = 30;

  function create_tube() {
    if (game_state != 'Play' || !game_active) return; // Si el juego no está activo, no continúes

    if (tube_separation > 70) {
      tube_separation = 0;
      let tube_pos = Math.floor(Math.random() * 43) + 20;

      let tube_top = document.createElement('img');
      tube_top.src = 'images/FPIXEL3-removebg-preview.png';
      tube_top.className = 'tube';
      tube_top.style.top = tube_pos - 70 + 'vh';
      tube_top.style.left = '100vw';
      document.body.appendChild(tube_top);

      let tube_bottom = document.createElement('img');
      tube_bottom.src = 'images/VASOPIXEL-removebg-preview.png';
      tube_bottom.className = 'tube';
      tube_bottom.style.top = tube_pos + tube_gap + 'vh';
      tube_bottom.style.left = '100vw';
      document.body.appendChild(tube_bottom);

      tube_passed = false;
    }
    tube_separation++;
    requestAnimationFrame(create_tube);
  }
  requestAnimationFrame(create_tube);
}
