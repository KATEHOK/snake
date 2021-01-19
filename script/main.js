'use strict';
const startBtn = document.querySelector('#start');
const stopBtn = document.querySelector('#stop');
const messageEl = document.querySelector('#message');

let cell = {

    /**
     * 
     * @param {object} cell координаты (х, у) ячейки
     * @returns {boolean} true, если такая ячейка существует, иначе - false
     */
    isCellCorrect(currentCell) {
        return (currentCell[0] <= config.x) && (currentCell[0] > 0) && (currentCell[1] <= config.y) && (currentCell[1] > 0)
    },

    /**
     * 
     * @param {object} currentCell - координаты (x, y) текущей ячейки
     * @param {string} direction - текущее направление
     * @returns {string} - координаты (х, у) следующей ячейки
     */
    getNextCell(currentCell, direction) {
        switch (direction) {
            case 'ArrowUp':
                return [
                    currentCell[0],
                    currentCell[1] - 1,
                ]
            case 'ArrowDown':
                return [
                    currentCell[0],
                    currentCell[1] + 1,
                ]
            case 'ArrowLeft':
                return [
                    currentCell[0] - 1,
                    currentCell[1],
                ]
            case 'ArrowRight':
                return [
                    currentCell[0] + 1,
                    currentCell[1],
                ]
        }
    },

    /**
     * 
     * @param {object} cell
     * @returns {Element}  
     */
    getCelEl(cell) {
        return document.querySelector(`td[data-x="${cell[0]}"][data-y="${cell[1]}"]`)
    },

    getRandomCell() {
        return [game.getRandomInt(config.x), game.getRandomInt(config.y)]
    }
};

let config = {
    x: 20,
    y: 20,
    speed: 5,
    counter: 0,
};


let game = {
    lost: false,
    intervalId: null,
    status: false,
    start() {
        if (game.lost) {
            return;
        }
        game.status = true;
        game.intervalId = setInterval(function () {
            if (cell.isCellCorrect(cell.getNextCell(snake.body[snake.body.length - 1], snake.direction))) {
                let localSpeed = game.makeStep();
                if (localSpeed > config.speed) {
                    config.speed = localSpeed;
                    game.stop();
                    game.start();
                }
            }
            else {
                game.stop();
                game.lost = true;
            }
        }, 1000 / config.speed);
    },
    stop() {
        clearInterval(game.intervalId);
        game.status = false;
    },
    makeStep() {
        snake.body.push(cell.getNextCell(snake.body[snake.body.length - 1], snake.direction));
        let snakeHead = snake.body[snake.body.length - 1];
        let snakeTail = snake.body[0];
        let snakeHeadEl = cell.getCelEl(snakeHead);
        let snakeTailEl = cell.getCelEl(snakeTail);
        if (!snakeHeadEl.classList.contains('snake')) {
            snakeHeadEl.classList.add('snake');
        } else {
            game.stop();
            game.lost = true;
            alert(snake.body.length - 3);
        }
        if (snakeHeadEl.classList.contains('food')) {
            snakeHeadEl.classList.remove('food');
            game.generateRandomFood();
            config.counter++;
            let nextSpeed = config.speed;
            if (config.counter % 3 == 0) {
                nextSpeed++;
            }
            game.changeProgress();
            return nextSpeed;
        }
        if (snakeTailEl.classList.contains('snake')) {
            snakeTailEl.classList.remove('snake');
        }
        snake.body.shift();
    },
    keyDownHandler(event) {
        let code = event.code;
        if (code == 'Enter') {
            if (game.status) {
                game.stop();
            } else {
                game.start();
            }
            return;
        }
        if (code == snake.direction) {
            event.preventDefault();
            config.speed++;
            game.stop();
            game.start();
            return;
        }
        if (game.isDirectionCorrect(code)) {
            event.preventDefault();
            snake.direction = code;
            return;
        }
    },
    isDirectionCorrect(direction) {
        if ((direction == 'ArrowUp' && snake.direction == 'ArrowDown') || (direction == 'ArrowDown' && snake.direction == 'ArrowUp') || (direction == 'ArrowLeft' && snake.direction == 'ArrowRight') || (direction == 'ArrowRight' && snake.direction == 'ArrowLeft')) {
            return false;
        }
        return true;
    },
    getRandomInt(range) {
        return parseInt(Math.random() * range + 1);
    },
    generateRandomFood() {
        let localCell = cell.getRandomCell();
        if (snake.body.includes(localCell)) {
            this.generateFood();
        }
        let cellEl = cell.getCelEl(localCell);
        cellEl.classList.add('food');
    },
    changeProgress() {
        messageEl.textContent = config.counter;
    },
};

let snake = {
    body: [
        [1, 1],
        [1, 2],
        [1, 3],
    ],
    direction: 'ArrowDown',
};

game.generateRandomFood();
startBtn.addEventListener('click', function (event) {
    if (!game.status) {
        game.start();
    }
});
stopBtn.addEventListener('click', function (event) {
    if (game.status) {
        game.stop();
    }
});
window.addEventListener('keydown', function (event) {
    game.keyDownHandler(event);
});