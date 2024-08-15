document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris-canvas');
    const context = canvas.getContext('2d');
    context.scale(32, 32);  // Scale the canvas drawing area

    const row = 20;
    const col = 10;
    let board = Array.from({ length: row }, () => Array(col).fill(0));
    let score = 0;
    let lines = 0;
    let level = 0;
    let gameOver = false; // Initialize gameOver as false
    let currentPiece = null;
    let dropInterval = 1000;
    let lastTime = 0;

    const shapes = {
        'I': [
            [1, 1, 1, 1]
        ],
        'J': [
            [1, 0, 0],
            [1, 1, 1]
        ],
        'L': [
            [0, 0, 1],
            [1, 1, 1]
        ],
        'O': [
            [1, 1],
            [1, 1]
        ],
        'S': [
            [0, 1, 1],
            [1, 1, 0]
        ],
        'T': [
            [0, 1, 0],
            [1, 1, 1]
        ],
        'Z': [
            [1, 1, 0],
            [0, 1, 1]
        ]
    };

    class Piece {
        constructor(type) {
            this.shape = shapes[type];
            this.row = 0;
            this.col = Math.floor(col / 2) - Math.floor(this.shape[0].length / 2);
        }

        draw() {
            this.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        context.fillStyle = 'blue';
                        context.fillRect(this.col + x, this.row + y, 1, 1);
                    }
                });
            });
        }

        clear() {
            this.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        context.clearRect(this.col + x, this.row + y, 1, 1);
                    }
                });
            });
        }

        moveDown() {
            if (!this.collides(0, 1, this.shape)) {
                this.row++;
            } else {
                this.lock(); // Lock the piece in place if it can't move down
                currentPiece = createPiece(); // Create a new piece after locking
                if (currentPiece.collides(0, 0, currentPiece.shape)) {
                    gameOver = true;
                    alert('Game Over');
                    document.getElementById('start-button').disabled = false;
                    document.getElementById('submit-score-button').disabled = false;
                }
            }
        }

        moveLeft() {
            if (!this.collides(-1, 0, this.shape)) {
                this.col--;
            }
        }

        moveRight() {
            if (!this.collides(1, 0, this.shape)) {
                this.col++;
            }
        }

        rotate() {
            const rotatedShape = this.shape[0].map((_, index) => this.shape.map(row => row[index]).reverse());
            if (!this.collides(0, 0, rotatedShape)) {
                this.shape = rotatedShape;
            }
        }

        collides(offsetX, offsetY, shape) {
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x] &&
                        (board[this.row + y + offsetY] &&
                            board[this.row + y + offsetY][this.col + x + offsetX]) !== 0) {
                        return true;
                    }
                }
            }
            return false;
        }

        lock() {
            this.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        // Add the piece to the board
                        board[this.row + y][this.col + x] = value;
                    }
                });
            });
            removeFullRows();
        }
    }

    function createPiece() {
        const pieces = 'IJLOSTZ';
        const type = pieces[Math.floor(Math.random() * pieces.length)];
        return new Piece(type);
    }

    function removeFullRows() {
        let rowCount = 1;
        for (let r = row - 1; r >= 0; r--) {
            if (board[r].every(value => value !== 0)) {
                const removedRow = board.splice(r, 1)[0].fill(0);
                board.unshift(removedRow);
                score += rowCount * 10;
                lines += 1;
                rowCount *= 2;
                if (lines % 10 === 0) {
                    level += 1;
                    dropInterval -= 50;
                }
            }
        }
        // Update the score, lines, and level
        document.getElementById('score').innerText = score;
        document.getElementById('lines').innerText = lines;
        document.getElementById('level').innerText = level;
    }

    function drawBoard() {
        // Clear the entire board first
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw the entire board
        board.forEach((row, y) => {
            row.forEach((value, x) => {
                context.fillStyle = value ? 'blue' : 'white';
                context.fillRect(x, y, 1, 1);
            });
        });
    }

    function update(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;

        if (deltaTime > dropInterval) {
            currentPiece.clear();
            currentPiece.moveDown();
            drawBoard(); // Redraw the board after moving the piece
            currentPiece.draw(); // Redraw the current piece
        }

        if (!gameOver) {
            requestAnimationFrame(update);
        }
    }

    document.addEventListener('keydown', (event) => {
        if (gameOver) return;
        currentPiece.clear();
        if (event.key === 'ArrowLeft') {
            currentPiece.moveLeft();
        } else if (event.key === 'ArrowRight') {
            currentPiece.moveRight();
        } else if (event.key === 'ArrowUp') {
            currentPiece.rotate();
        } else if (event.key === 'ArrowDown') {
            currentPiece.moveDown();
        }
        drawBoard(); // Redraw the board after each movement
        currentPiece.draw(); // Redraw the current piece
    });

    document.getElementById('start-button').addEventListener('click', () => {
        gameOver = false; // Reset gameOver to false when starting a new game
        board = Array.from({ length: row }, () => Array(col).fill(0));
        score = 0;
        lines = 0;
        level = 0;
        dropInterval = 1000;
        
        currentPiece = createPiece();
        drawBoard(); // Draw the initial board
        currentPiece.draw(); // Draw the first piece
        update(); // Start the game loop
        document.getElementById('start-button').disabled = true;
        document.getElementById('submit-score-button').disabled = true;
    });
});
