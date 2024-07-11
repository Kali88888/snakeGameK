
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highestScoreDisplay = document.getElementById("highestScore");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");

const box = 20;
let snake, direction, food, score, game, gamePaused;
let highestScore = localStorage.getItem("highestScore") || 0;

function initializeGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    food = {
        x: Math.floor(Math.random() * 19 + 1) * box,
        y: Math.floor(Math.random() * 19 + 3) * box
    };
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    displayHighestScore();
    clearInterval(game);
    game = setInterval(draw, 100);
    gamePaused = false;
}

document.addEventListener("keydown", setDirection);
startButton.addEventListener("click", initializeGame);
pauseButton.addEventListener("click", pauseGame);

function setDirection(event) {
    if (event.keyCode == 37 && direction != "RIGHT") {
        direction = "LEFT";
    } else if (event.keyCode == 38 && direction != "DOWN") {
        direction = "UP";
    } else if (event.keyCode == 39 && direction != "LEFT") {
        direction = "RIGHT";
    } else if (event.keyCode == 40 && direction != "UP") {
        direction = "DOWN";
    }
}

function pauseGame() {
    if (gamePaused) {
        game = setInterval(draw, 100);
        pauseButton.textContent = "Pause Game";
    } else {
        clearInterval(game);
        pauseButton.textContent = "Resume Game";
    }
    gamePaused = !gamePaused;
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function eatFood() {
    if (snake[0].x == food.x && snake[0].y == food.y) {
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 3) * box
        };
        score++;
        scoreDisplay.textContent = "Score: " + score;

        if (score > highestScore) {
            highestScore = score;
            localStorage.setItem("highestScore", highestScore);
            displayHighestScore();
        }

        return true;
    }
    return false;
}

function displayHighestScore() {
    highestScoreDisplay.textContent = "Highest Score: " + highestScore;
}

function gameOver() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#F08080";
    ctx.font = "50px 'Press Start 2P'";
    ctx.textAlign = "center";
    //ctx.shadowColor = "black";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px 'Press Start 2P'";
    ctx.shadowBlur = 0;
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 30);

    clearInterval(game);
}

function draw() {
    if (!gamePaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        ctx.fillStyle = "pink";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i == 0 ? "black" : "white";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);

            ctx.strokeStyle = "black";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }

        ctx.fillStyle = "white";
        ctx.fillRect(food.x, food.y, box, box);

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (direction == "LEFT") snakeX -= box;
        if (direction == "UP") snakeY -= box;
        if (direction == "RIGHT") snakeX += box;
        if (direction == "DOWN") snakeY += box;

        if (eatFood()) {
            // Snake grows, so no need to pop the last element
        } else {
            snake.pop();
        }

        let newHead = { x: snakeX, y: snakeY };

        if (
            snakeX < 0 ||
            snakeY < 0 ||
            snakeX >= canvas.width ||
            snakeY >= canvas.height ||
            collision(newHead, snake)
        ) {
            gameOver();
            return;
        }

        snake.unshift(newHead);
    }
}
