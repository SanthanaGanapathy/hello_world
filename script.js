const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('status');
const playAgainButton = document.getElementById('play-again');
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let currentPlayer = 'X';
let gameActive = true;

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick, { once: true });
});

playAgainButton.addEventListener('click', startGame);

function startGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning');
        cell.addEventListener('click', handleCellClick, { once: true });
    });
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    gameActive = true;
}

function handleCellClick(e) {
    const cell = e.target;
    if (!gameActive || cell.textContent !== '') {
        return;
    }
    cell.textContent = currentPlayer;
    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (currentPlayer === 'O') {
            computerMove();
        }
    }
}

function endGame(draw) {
    if (draw) {
        statusText.textContent = 'Draw!';
    } else {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        highlightWinningCells();
    }
    gameActive = false;
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.textContent !== '';
    });
}

function swapTurns() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === player;
        });
    });
}

function highlightWinningCells() {
    const winningCombination = winningCombinations.find(combination => {
        return combination.every(index => {
            return cells[index].textContent === currentPlayer;
        });
    });
    winningCombination.forEach(index => {
        cells[index].classList.add('winning');
    });
}

function computerMove() {
    const availableCells = [...cells].filter(cell => cell.textContent === '');
    if (availableCells.length > 0) {
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        randomCell.click();
    }
}
