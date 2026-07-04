<template>
  <footer class="controls-pad">
    <!-- Left Hand Side: Navigation Cross D-PAD -->
    <div class="dpad-wrapper">
      <div class="dpad">
        <button class="dpad-btn up-placeholder" disabled></button>
        <button class="dpad-btn left" @click="$emit('move', -1, 0)">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button class="dpad-btn right" @click="$emit('move', 1, 0)">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M9 5l7 7-7 7"/></svg>
        </button>
        <button class="dpad-btn down" @click="$emit('drop')">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div class="dpad-center"></div>
      </div>
    </div>

    <!-- Right Hand Side: Round Action Fire Triggers -->
    <div class="actions-wrapper">
      <button class="action-circle-btn rotate" @click="$emit('rotate')">
        <span class="btn-label">ROTATE</span>
      </button>
      <button class="action-circle-btn drop-hard" @click="$emit('hardDrop')">
        <span class="btn-label">SLAM</span>
      </button>
    </div>
  </footer>
</template>

<script setup>
defineEmits(['rotate', 'move', 'drop', 'hardDrop']);
</script>

<style scoped>
.controls-pad {
  margin-top: 24px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  user-select: none;
}

/* D-PAD Cross Architecture Layout */
.dpad-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
}
.dpad {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
}
.dpad-btn {
  background-color: #141416;
  border: 1px solid #232326;
  color: #a1a1aa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.05s ease;
}
.dpad-btn svg {
  width: 22px;
  height: 22px;
}
.dpad-btn:active {
  background-color: #27272a;
  color: #ffffff;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
}
.up-placeholder {
  grid-column: 2;
  grid-row: 1;
  background-color: #0e0e10;
  border: none;
}
.left {
  grid-column: 1;
  grid-row: 2;
  border-radius: 8px 0 0 8px;
}
.right {
  grid-column: 3;
  grid-row: 2;
  border-radius: 0 8px 8px 0;
}
.down {
  grid-column: 2;
  grid-row: 3;
  border-radius: 0 0 8px 8px;
}
.dpad-center {
  grid-column: 2;
  grid-row: 2;
  background-color: #141416;
  border-left: none;
  border-right: none;
}

/* Round Action Buttons Layout */
.actions-wrapper {
  display: flex;
  gap: 16px;
  align-items: center;
  height: 100%;
}
.action-circle-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
  transition: transform 0.05s, box-shadow 0.05s;
}
.action-circle-btn:active {
  transform: scale(0.92);
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
}
.rotate {
  background: linear-gradient(135deg, #27272a, #18181b);
  border: 1px solid #3f3f46;
  color: #ffffff;
}
.rotate:active { background: #3f3f46; }

.drop-hard {
  background: linear-gradient(135deg, #1e1b4b, #11103b);
  border: 1px solid #312e81;
  color: #38bdf8;
  box-shadow: 0 4px 12px rgba(49, 46, 129, 0.4);
}
.drop-hard:active { background: #312e81; }

.btn-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
</style>

