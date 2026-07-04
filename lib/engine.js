// Board Matrix Dimensions
export const COLS = 10;
export const ROWS = 20;

// Hardcoded Tetromino piece geometric layouts
export const SHAPES = {
  I: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
  J: [[1,0,0], [1,1,1], [0,0,0]],
  L: [[0,0,1], [1,1,1], [0,0,0]],
  O: [[1,1], [1,1]],
  S: [[0,1,1], [1,1,0], [0,0,0]],
  T: [[0,1,0], [1,1,1], [0,0,0]],
  Z: [[1,1,0], [0,1,1], [0,0,0]]
};

const SHAPE_KEYS = Object.keys(SHAPES);

/**
 * Creates an empty game board matrix.
 */
export function createEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

/**
 * Instantiates a new random tetromino structure centered on the ceiling.
 */
export function generateNextPiece() {
  const type = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
  const shape = SHAPES[type];
  return {
    shape: shape.map(row => [...row]),
    type,
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0
  };
}

/**
 * Validates coordinate updates against boundaries and locked board tiles.
 */
export function checkCollision(grid, nextX, nextY, shape) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const targetX = nextX + c;
        const targetY = nextY + r;

        // Boundary checks
        if (targetX < 0 || targetX >= COLS || targetY >= ROWS) return true;
        // Intersect check with existing static blocks on the field grid
        if (targetY >= 0 && grid[targetY][targetX]) return true;
      }
    }
  }
  return false;
}

/**
 * Rotates a matrix 90 degrees clockwise using transposition mechanics.
 */
export function getRotatedShape(currentShape) {
  const size = currentShape.length;
  return Array.from({ length: size }, (_, c) =>
    Array.from({ length: size }, (_, r) => currentShape[size - 1 - r][c])
  );
}

/**
 * bakes a dropping tetromino configuration into the structural matrix board.
 */
export function mergePieceToGrid(grid, piece) {
  const updatedGrid = grid.map(row => [...row]);
  const { shape, x, y, type } = piece;

  shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val && y + r >= 0 && y + r < ROWS && x + c >= 0 && x + c < COLS) {
        updatedGrid[y + r][x + c] = type;
      }
    });
  });

  return updatedGrid;
}

/**
 * Evaluates, filters, and clears solid rows while calculating scores.
 */
export function resolveFullLines(grid) {
  let cleared = 0;
  
  // Filter out complete rows
  const remainingRows = grid.filter(row => !row.every(cell => cell !== 0));
  cleared = ROWS - remainingRows.length;

  // Re-inject pristine padding arrays onto the ceiling matrix space
  while (remainingRows.length < ROWS) {
    remainingRows.unshift(Array(COLS).fill(0));
  }

  return {
    updatedGrid: remainingRows,
    clearedCount: cleared,
    scoreGain: cleared > 0 ? cleared * 100 * cleared : 0
  };
}

