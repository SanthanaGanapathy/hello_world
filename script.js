const cells = document.querySelectorAll('[data-cell]');
const statusText = document.getElementById('status');
const playAgainButton = document.getElementById('play-again');
const gameOverOverlay = document.getElementById('game-over-overlay');
const gameOverMessage = document.getElementById('game-over-message');
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

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

startGame();

function startGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    gameOverOverlay.classList.remove('visible');
    cells.forEach((cell, index) => {
        cell.textContent = '';
        cell.classList.remove('winning', 'X', 'O');
        cell.addEventListener('click', handleCellClick, { once: true });
    });
}

function handleCellClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (!gameActive || board[index] !== '') {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        gameOverMessage.textContent = 'Draw!';
    } else {
        gameOverMessage.textContent = `Player ${currentPlayer} wins!`;
        highlightWinningCells();
    }
    gameOverOverlay.classList.add('visible');
}

function isDraw() {
    return board.every(cell => cell !== '');
}

function swapTurns() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function highlightWinningCells() {
    const winningCombination = winningCombinations.find(combination => {
        return combination.every(index => {
            return board[index] === currentPlayer;
        });
    });
    winningCombination.forEach(index => {
        cells[index].classList.add('winning');
    });
}

function computerMove() {
    const bestMove = minimax(board, 'O').index;
    board[bestMove] = 'O';
    cells[bestMove].textContent = 'O';
    cells[bestMove].classList.add('O');
    cells[bestMove].removeEventListener('click', handleCellClick);

    if (checkWin('O')) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
    }
}

function minimax(newBoard, player) {
    const availSpots = newBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

    if (checkWin('X')) {
        return { score: -10 };
    } else if (checkWin('O')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}


playAgainButton.addEventListener('click', startGame);
