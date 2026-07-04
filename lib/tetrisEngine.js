// src/apps/tetris/lib/tetrisEngine.js

export const COLS = 10;
export const ROWS = 20;

// Standard explicit integer matrices that pass plain runtime JS evaluation safely
export const SHAPES = {
  I: [,
 ,
 ,
    [0, 0, 0, 0]
  ],
  J: [,
 ,
    [0, 0, 0]
  ],
  L: [,
 ,
    [0, 0, 0]
  ],
  O: [,
    [1, 1]
  ],
  S: [,
 ,
    [0, 0, 0]
  ],
  T: [,
 ,
    [0, 0, 0]
  ],
  Z: [,
 ,
    [0, 0, 0]
  ]
};

const SHAPE_KEYS = Object.keys(SHAPES);

export function createEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export function generateNextPiece() {
  const type = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
  const shape = SHAPES[type];
  return {
    shape: shape.map(row => [...row]),
    type,
    x: Math.floor((COLS - shape.length) / 2),
    y: 0
  };
}

export function checkCollision(grid, nextX, nextY, shape) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const targetX = nextX + c;
        const targetY = nextY + r;

        if (targetX < 0 || targetX >= COLS || targetY >= ROWS) return true;
        if (targetY >= 0 && grid[targetY][targetX]) return true;
      }
    }
  }
  return false;
}

export function getRotatedShape(currentShape) {
  const size = currentShape.length;
  return Array.from({ length: size }, (_, c) =>
    Array.from({ length: size }, (_, r) => currentShape[size - 1 - r][c])
  );
}

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

export function resolveFullLines(grid) {
  const remainingRows = grid.filter(row => !row.every(cell => cell !== 0));
  const cleared = ROWS - remainingRows.length;

  while (remainingRows.length < ROWS) {
    remainingRows.unshift(Array(COLS).fill(0));
  }

  return {
    updatedGrid: remainingRows,
    clearedCount: cleared,
    scoreGain: cleared > 0 ? cleared * 100 * cleared : 0
  };
}

