const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restartButton');
const startGameButton = document.getElementById('startGameButton');
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');
const drawsElement = document.getElementById('draws');

let currentPlayer = 'X';
let player1Marker = 'X';
let player2Marker = 'O';
let player1Score = 0;
let player2Score = 0;
let draws = 0;
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;

    checkResult();
    if (gameActive && currentPlayer === player2Marker) {
        handleAIMove();
    }
};

const handleAIMove = () => {
    let availableCells = gameState.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    if (availableCells.length > 0) {
        const aiMove = availableCells[Math.floor(Math.random() * availableCells.length)];
        gameState[aiMove] = currentPlayer;
        document.querySelector(`.cell[data-index="${aiMove}"]`).innerText = currentPlayer;
        checkResult();
    }
};

const checkResult = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        alert(`Player ${currentPlayer} wins!`);
        updateScore(currentPlayer);
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        alert("It's a draw!");
        draws++;
        drawsElement.innerText = draws;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === player1Marker ? player2Marker : player1Marker;
};

const updateScore = (winner) => {
    if (winner === player1Marker) {
        player1Score++;
        player1ScoreElement.innerText = player1Score;
    } else {
        player2Score++;
        player2ScoreElement.innerText = player2Score;
    }
};

const restartGame = () => {
    gameActive = true;
    currentPlayer = player1Marker;
    gameState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.innerText = '');
};

const startGame = () => {
    player1Marker = player1Input.value || 'X';
    player2Marker = player2Input.value || 'O';
    restartGame();
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
startGameButton.addEventListener('click', startGame);
