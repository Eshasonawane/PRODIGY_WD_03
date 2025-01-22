const playerChoice = document.getElementById('player-choice');
const modeSelection = document.getElementById('mode-selection');
const gameContainer = document.getElementById('game-container');
const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');
const pvpButton = document.getElementById('pvp-mode');
const aiButton = document.getElementById('ai-mode');
const chooseXButton = document.getElementById('choose-x');
const chooseOButton = document.getElementById('choose-o');

// Game variables
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let playerSymbol = 'X';
let aiSymbol = 'O';
let gameActive = true;
let gameMode = 'pvp';

// Winning combinations
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Create board cells
function createBoard() {
    board.innerHTML = '';
    boardState.forEach((_, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        board.appendChild(cellElement);
    });
}

// Handle cell click
function handleCellClick(e) {
    const cellIndex = e.target.dataset.index;

    // Prevent move if cell is already taken or the game is inactive
    if (boardState[cellIndex] !== '' || !gameActive) return;

    // Make move for the current player
    makeMove(cellIndex, currentPlayer);

    if (gameMode === 'ai' && gameActive && currentPlayer !== playerSymbol) {
        // AI makes its move after the player
        setTimeout(() => {
            makeAIMove();
        }, 300);
    }
}

// Make a move for a player (common logic for player and AI)
function makeMove(index, symbol) {
    boardState[index] = symbol;
    const cellElement = document.querySelector(`.cell[data-index='${index}']`);
    cellElement.textContent = symbol;
    cellElement.classList.add('taken');

    checkResult();
    if (gameActive) {
        switchPlayer();
    }
}

// Switch player
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

// Check for win or draw
function checkResult() {
    let roundWon = false;

    for (let condition of winningConditions) {
        const [a, b, c] = condition;

        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;

            // Highlight winning cells
            [a, b, c].forEach(index => {
                const cellElement = document.querySelector(`.cell[data-index='${index}']`);
                cellElement.classList.add('winning-cell');
            });

            statusDisplay.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }
    }

    if (!boardState.includes('')) {
        statusDisplay.textContent = "It's a draw!";
        gameActive = false;
    }
}

// Restart game
function restartGame() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = playerSymbol; // Player starts first
    gameActive = true;
    statusDisplay.textContent = `Player ${playerSymbol}'s turn`;
    createBoard();
}

// AI Logic: Random Move
function makeAIMove() {
    const emptyCells = boardState
        .map((value, index) => (value === '' ? index : null))
        .filter(index => index !== null);

    if (emptyCells.length > 0 && gameActive) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex, aiSymbol);
    }
}

// Handle player symbol choice
chooseXButton.addEventListener('click', () => {
    playerSymbol = 'X';
    aiSymbol = 'O';
    playerChoice.style.display = 'none';
    modeSelection.style.display = 'block';
});

chooseOButton.addEventListener('click', () => {
    playerSymbol = 'O';
    aiSymbol = 'X';
    playerChoice.style.display = 'none';
    modeSelection.style.display = 'block';
});

// Handle mode selection
pvpButton.addEventListener('click', () => {
    gameMode = 'pvp';
    modeSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    restartGame();
});

aiButton.addEventListener('click', () => {
    gameMode = 'ai';
    modeSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    restartGame();
});

// Restart button listener
restartButton.addEventListener('click', restartGame);

// Initialize board
createBoard();
