<template>
  <main class="board-wrapper">
    <div class="tetris-grid">
      <div v-for="(row, rIdx) in grid" :key="rIdx" class="grid-row">
        <div 
          v-for="(cell, cIdx) in row" 
          :key="cIdx" 
          class="grid-cell"
          :class="cell ? `filled color-${cell}` : ''"
        ></div>
      </div>
    </div>

    <!-- Action Screen Overlays -->
    <div v-if="gameState !== 'playing'" class="board-overlay">
      <p v-if="gameState === 'ready'">Tap "Start" to deploy blocks.</p>
      <p v-if="gameState === 'paused'">Game Paused</p>
      <p v-if="gameState === 'lost'" class="gameover-text">Game Over</p>
      <button v-if="gameState === 'lost'" class="reset-btn" @click="$emit('reset')">Try Again</button>
    </div>
  </main>
</template>

<script setup>
defineProps({
  grid: { type: Array, required: true },
  gameState: { type: String, required: true }
});

defineEmits(['reset']);
</script>

<style scoped>
.board-wrapper {
  position: relative;
  flex: 1;
  background-color: #111113;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tetris-grid {
  display: flex;
  flex-direction: column;
  background-color: #070708;
  border: 1px solid #1f1f23;
  gap: 1px;
}
.grid-row {
  display: flex;
  gap: 1px;
}
.grid-cell {
  width: 16px;
  height: 16px;
  background-color: #0b0b0c;
  box-sizing: border-box;
}

.filled { border: 1px solid rgba(255, 255, 255, 0.1); }
.color-I { background-color: #06b6d4; }
.color-J { background-color: #3b82f6; }
.color-L { background-color: #f97316; }
.color-O { background-color: #eab308; }
.color-S { background-color: #22c55e; }
.color-T { background-color: #a855f7; }
.color-Z { background-color: #ef4444; }

.board-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(11, 11, 12, 0.85);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.board-overlay p {
  color: #a1a1aa;
  font-size: 14px;
  margin-bottom: 12px;
}
.gameover-text {
  font-size: 22px !important;
  font-weight: 700;
  color: #ef4444 !important;
}
.reset-btn {
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
}
</style>

