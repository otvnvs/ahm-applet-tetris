<template>
  <header class="game-header">
    <div class="header-title">
      <h1>Tetris</h1>
      <span class="status-badge" :class="gameState">● {{ gameStateText }}</span>
    </div>

    <div class="stats-bar">
      <div class="stat-box">
        <span class="label">SCORE</span>
        <span class="stat-value">{{ score }}</span>
      </div>
      <button class="control-btn" @click="$emit('toggle')">
        {{ gameState === 'playing' ? 'Pause' : 'Start' }}
      </button>
      <div class="stat-box">
        <span class="label">LINES</span>
        <span class="stat-value">{{ lines }}</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  gameState: { type: String, required: true },
  score: { type: Number, required: true },
  lines: { type: Number, required: true }
});

defineEmits(['toggle']);

const gameStateText = computed(() => {
  if (props.gameState === 'ready') return 'Ready';
  if (props.gameState === 'playing') return 'Active';
  if (props.gameState === 'paused') return 'Paused';
  return 'Game Over';
});
</script>

<style scoped>
.game-header {
  margin-bottom: 16px;
}
.header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.header-title h1 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}
.status-badge {
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 20px;
  background-color: #18181b;
  border: 1px solid #27272a;
}
.status-badge.ready { color: #a1a1aa; }
.status-badge.playing { color: #22c55e; }
.status-badge.paused { color: #f59e0b; }
.status-badge.lost { color: #ef4444; }

.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #18181b;
  border: 1px solid #27272a;
  border-radius: 12px;
  padding: 10px 14px;
}
.stat-box {
  display: flex;
  flex-direction: column;
}
.stat-box .label {
  font-size: 10px;
  color: #71717a;
  letter-spacing: 0.5px;
}
.stat-value {
  font-size: 18px;
  font-weight: 700;
  font-family: monospace;
  color: #ffffff;
}
.control-btn {
  background-color: #27272a;
  border: 1px solid #3f3f46;
  color: #ffffff;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}
</style>

