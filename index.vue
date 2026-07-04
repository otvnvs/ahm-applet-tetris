<template>
  <div class="tetris-container">
    <TetrisHeader 
      :game-state="gameState" 
      :score="score" 
      :lines="linesCleared" 
      @toggle="toggleGame"
    />

    <TetrisGrid 
      :grid="displayGrid" 
      :game-state="gameState" 
      @reset="resetMatch"
    />

    <TetrisControls 
      @rotate="rotatePiece" 
      @move="movePiece" 
      @drop="dropPiece"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { tetrisSfx } from './lib/sound.js';
import { 
  createEmptyGrid, 
  generateNextPiece, 
  checkCollision, 
  getRotatedShape, 
  mergePieceToGrid, 
  resolveFullLines 
} from './lib/engine.js';

import TetrisHeader from './components/TetrisHeader.vue';
import TetrisGrid from './components/TetrisGrid.vue';
import TetrisControls from './components/TetrisControls.vue';

// Reactive Engine Hooks
const grid = ref(createEmptyGrid());
const gameState = ref('ready'); // ready, playing, paused, lost
const score = ref(0);
const linesCleared = ref(0);
const currentPiece = ref({ shape: [], x: 0, y: 0, type: '' });

let gameInterval = null;
const baseSpeed = ref(800);

// Merges the dropping piece onto the static coordinate fields dynamically
const displayGrid = computed(() => {
  if (gameState.value === 'playing' || gameState.value === 'paused') {
    return mergePieceToGrid(grid.value, currentPiece.value);
  }
  return grid.value;
});

function spawnTetromino() {
  const nextPiece = generateNextPiece();
  
  if (checkCollision(grid.value, nextPiece.x, nextPiece.y, nextPiece.shape)) {
    gameState.value = 'lost';
    tetrisSfx.playGameOver();
    clearInterval(gameInterval);
    return;
  }
  currentPiece.value = nextPiece;
}

function movePiece(dx, dy) {
  if (gameState.value !== 'playing') return false;
  
  const nextX = currentPiece.value.x + dx;
  const nextY = currentPiece.value.y + dy;

  if (!checkCollision(grid.value, nextX, nextY, currentPiece.value.shape)) {
    currentPiece.value.x = nextX;
    currentPiece.value.y = nextY;
    if (dx !== 0) tetrisSfx.playMove();
    return true;
  }
  return false;
}

function dropPiece() {
  if (!movePiece(0, 1)) {
    lockPiece();
  }
}

function rotatePiece() {
  if (gameState.value !== 'playing') return;

  const targetRotation = getRotatedShape(currentPiece.value.shape);

  if (!checkCollision(grid.value, currentPiece.value.x, currentPiece.value.y, targetRotation)) {
    currentPiece.value.shape = targetRotation;
    tetrisSfx.playRotate();
  }
}

function lockPiece() {
  // Bake piece configurations flat into layout arrays
  grid.value = mergePieceToGrid(grid.value, currentPiece.value);
  
  // Evaluate line clear parameters
  const result = resolveFullLines(grid.value);
  grid.value = result.updatedGrid;
  
  if (result.clearedCount > 0) {
    linesCleared.value += result.clearedCount;
    score.value += result.scoreGain;
    tetrisSfx.playLineClear();
  }

  spawnTetromino();
}

function toggleGame() {
  tetrisSfx.playMove();
  if (gameState.value === 'playing') {
    gameState.value = 'paused';
    clearInterval(gameInterval);
  } else {
    if (gameState.value === 'lost' || gameState.value === 'ready') resetMatch();
    gameState.value = 'playing';
    gameInterval = setInterval(dropPiece, baseSpeed.value);
  }
}

function resetMatch() {
  grid.value = createEmptyGrid();
  score.value = 0;
  linesCleared.value = 0;
  gameState.value = 'playing';
  spawnTetromino();
  clearInterval(gameInterval);
  gameInterval = setInterval(dropPiece, baseSpeed.value);
}

onMounted(() => {
  spawnTetromino();
});

onUnmounted(() => {
  clearInterval(gameInterval);
});
</script>

<style scoped>
.tetris-container {
  min-height: 100vh;
  background-color: #0b0b0c;
  color: #e3e3e6;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
</style>

