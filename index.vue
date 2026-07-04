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
      @hardDrop="hardDropPiece"
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
} from './lib/tetrisEngine.js';

import TetrisHeader from './components/TetrisHeader.vue';
import TetrisGrid from './components/TetrisGrid.vue';
import TetrisControls from './components/TetrisControls.vue';

const grid = ref(createEmptyGrid());
const gameState = ref('ready');
const score = ref(0);
const linesCleared = ref(0);
const currentPiece = ref({ shape: [], x: 0, y: 0, type: '' });

let gameInterval = null;
const baseSpeed = ref(800);

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

function hardDropPiece() {
  if (gameState.value !== 'playing') return;
  // Instantly push piece down until hit detection triggers
  while (movePiece(0, 1)) {
    // Cascades internally down to base floor
  }
  lockPiece();
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
  grid.value = mergePieceToGrid(grid.value, currentPiece.value);
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

// Enforce cleanup upon screen destruction routing cycles
onUnmounted(() => {
  clearInterval(gameInterval);
  tetrisSfx.stopAll(); // Instantly mute and garbage collect sound structures
});
</script>

<style scoped>
.tetris-container {
  min-height: 100vh;
  background-color: #070708;
  color: #e3e3e6;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
</style>

