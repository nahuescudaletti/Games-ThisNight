let move_speed = 10, gravity = 0.5;
let bird = document.querySelectorAll('.bird');
let imgUp = document.getElementById('bird-up');
let imgDown = document.getElementById('bird-down');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');
let tube_passed = false;

const birdImages = [
    'images/up.png',
    'images/down.png',
];

let bird_props = bird[0].getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let maxScoreDisplay = document.getElementById('maxScore');

let game_state = 'Start';
let game_active = true; // Variable para rastrear si el juego está activo
imgUp.style.opacity = 0;
imgDown.style.opacity = 0;
message.classList.add('messageStyle');

// Cargar el puntaje máximo almacenado al cargar la página
let maxScore = localStorage.getItem('maxScore') || 0;
maxScoreDisplay.textContent = maxScore;

let bird_dy = 0;

// Iniciar el juego con la barra espaciadora
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && game_state !== 'Play' && game_active) {
        document.querySelectorAll('.tube').forEach((e) => e.remove());
        bird[0].style.top = '40vh';
        bird[1].style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Score : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

function play() {
    const randomImageIndex = Math.floor(Math.random() * birdImages.length);
    imgUp.style.opacity = 0;

    function move() {
        if (game_state != 'Play' || !game_active) return;

        let tubes = document.querySelectorAll('.tube');
        tubes.forEach((tube) => {
            let tube_props = tube.getBoundingClientRect();
            bird_props = bird[0].getBoundingClientRect();

            if (tube_props.right <= 0) {
                tube.remove();
            } else {
                if (bird_props.left < tube_props.left + tube_props.width &&
                    bird_props.left + bird_props.width > tube_props.left &&
                    bird_props.top < tube_props.top + tube_props.height &&
                    bird_props.top + bird_props.height > tube_props.top
                ) {
                    game_state = 'End';
                    message.innerHTML = 'Juego terminado'.fontcolor('red') + '<br>Tu puntuación: ' + score_val.innerHTML;
                    message.classList.add('messageStyle');
                    imgUp.style.opacity = 0;
                    imgDown.style.opacity = 0;
                    sound_die.play();

                    if (parseInt(score_val.innerHTML) > maxScore) {
                        maxScore = parseInt(score_val.innerHTML);
                        maxScoreDisplay.textContent = maxScore;
                        localStorage.setItem('maxScore', maxScore);
                    }

                    game_active = false;

                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);

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
        if (game_state != 'Play' || !game_active) return;
        bird_dy = bird_dy + gravity;

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }

        bird[0].style.top = bird_props.top + bird_dy + 'px';
        bird[1].style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird[0].getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    // Manejar el salto con la barra espaciadora
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && game_state === 'Play') {
            imgUp.style.opacity = 0;
            imgDown.style.opacity = 1;
            bird_dy = -7.6;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space' && game_state === 'Play') {
            imgUp.style.opacity = 1;
            imgDown.style.opacity = 0;
        }
    });

    let tube_separation = 0;
    let tube_gap = 40;

    function create_tube() {
        if (game_state != 'Play' || !game_active) return;

        if (tube_separation > 70) {
            tube_separation = 0;
            let tube_pos = Math.floor(Math.random() * 43) + 20;

            let tube_top = document.createElement('img');
            tube_top.src = 'images/speedinvertido.png';
            tube_top.className = 'tube';
            tube_top.style.top = tube_pos - 70 + 'vh';
            tube_top.style.left = '100vw';
            document.body.appendChild(tube_top);

            let tube_bottom = document.createElement('img');
            tube_bottom.src = 'images/speedlata.png';
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
