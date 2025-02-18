const board = document.querySelector('.board');
const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const resetButton = document.querySelector('#reset');
const twoPlayerButton = document.querySelector('#two-player');
const vsComputerButton = document.querySelector('#vs-computer');

let currentPlayer = 'X';
let gameMode = 'two-player'; // Default mode
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6]  // Diagonal
];

// Handle cell click
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== '' || !gameActive) return;

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add(currentPlayer);

  checkForWinner();
}

// Check for a winner
function checkForWinner() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') continue;

    if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (!gameState.includes('')) {
    statusText.textContent = 'Draw!';
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `It's ${currentPlayer}'s turn`;

  if (gameMode === 'vs-computer' && currentPlayer === 'O') {
    computerMove();
  }
}

// Computer's move
function computerMove() {
  let availableCells = gameState.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];

  if (randomCell !== undefined) {
    gameState[randomCell] = 'O';
    document.querySelector(`.cell[data-index="${randomCell}"]`).textContent = 'O';
    document.querySelector(`.cell[data-index="${randomCell}"]`).classList.add('O');
    checkForWinner();
  }
}

// Reset the game
function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `It's ${currentPlayer}'s turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O');
  });
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
twoPlayerButton.addEventListener('click', () => {
  gameMode = 'two-player';
  resetGame();
});
vsComputerButton.addEventListener('click', () => {
  gameMode = 'vs-computer';
  resetGame();
});

// Initialize game
resetGame();