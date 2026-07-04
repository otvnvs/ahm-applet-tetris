<template>
  <main class="board-wrapper">
    <div class="tetris-grid">
      <div v-for="(row, rIdx) in grid" :key="rIdx" class="grid-row">
        <div 
          v-for="(cell, cIdx) in row" 
          :key="cIdx" 
          class="grid-cell"
          :class="cell ? `filled block-${cell}` : ''"
        >
          <div v-if="cell" class="block-inner"></div>
        </div>
      </div>
    </div>

    <!-- Interface Overlays -->
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
  background-color: #0b0b0c;
  border: 1px solid #1f1f23;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 4px 24px rgba(0, 0, 0, 0.6);
}
.tetris-grid {
  display: flex;
  flex-direction: column;
  background-color: #050506;
  border: 2px solid #18181b;
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}
.grid-row {
  display: flex;
  gap: 2px;
}
.grid-cell {
  width: 20px;
  height: 20px;
  background-color: #0e0e11;
  border-radius: 3px;
  box-sizing: border-box;
  /* Smooth animation transition for block cascading and translation movements */
  transition: background-color 0.12s cubic-bezier(0.25, 1, 0.5, 1), 
              transform 0.08s ease-out, 
              box-shadow 0.12s ease;
}

/* Premium Minimal Dark Palette Blocks */
.filled {
  transform: scale(0.96);
}
.block-inner {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  box-sizing: border-box;
  border-top: 1.5px solid rgba(255, 255, 255, 0.15);
  border-left: 1.5px solid rgba(255, 255, 255, 0.1);
}

/* Obsidian Core Colors with Luminescent Ambient Shadows */
.block-I { background-color: #0f172a; border: 1px solid #06b6d4; box-shadow: 0 0 8px rgba(6, 182, 212, 0.25); }
.block-J { background-color: #0f172a; border: 1px solid #2563eb; box-shadow: 0 0 8px rgba(37, 99, 235, 0.25); }
.block-L { background-color: #0f172a; border: 1px solid #ea580c; box-shadow: 0 0 8px rgba(234, 88, 12, 0.25); }
.block-O { background-color: #0f172a; border: 1px solid #ca8a04; box-shadow: 0 0 8px rgba(202, 138, 4, 0.25); }
.block-S { background-color: #0f172a; border: 1px solid #16a34a; box-shadow: 0 0 8px rgba(22, 163, 74, 0.25); }
.block-T { background-color: #0f172a; border: 1px solid #9333ea; box-shadow: 0 0 8px rgba(147, 51, 234, 0.25); }
.block-Z { background-color: #0f172a; border: 1px solid #dc2626; box-shadow: 0 0 8px rgba(220, 38, 38, 0.25); }

/* Interface Modals */
.board-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(7, 7, 8, 0.9);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
.board-overlay p {
  color: #71717a;
  font-size: 14px;
  margin-bottom: 16px;
}
.gameover-text {
  font-size: 24px !important;
  font-weight: 700;
  color: #ef4444 !important;
  letter-spacing: 1px;
  margin-bottom: 16px !important;
}
.reset-btn {
  background-color: #18181b;
  color: #ffffff;
  border: 1px solid #27272a;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  transition: background-color 0.2s;
}
.reset-btn:active {
  background-color: #27272a;
}
</style>

