<template>
  <footer class="controls-pad">
    <div class="pad-row">
      <button class="pad-btn action" @click="$emit('rotate')">Rotate</button>
    </div>
    <div class="pad-row directional">
      <button class="pad-btn" @click="$emit('move', -1, 0)">◀</button>
      <button class="pad-btn" @click="$emit('drop')">▼</button>
      <button class="pad-btn" @click="$emit('move', 1, 0)">▶</button>
    </div>
  </footer>
</template>

<script setup>
defineEmits(['rotate', 'move', 'drop']);
</script>

<style scoped>
.controls-pad {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pad-row {
  display: flex;
  gap: 8px;
}
.directional {
  justify-content: space-between;
}
.pad-btn {
  flex: 1;
  background-color: #18181b;
  border: 1px solid #27272a;
  color: #ffffff;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}
.pad-btn:active {
  background-color: #27272a;
}
.action {
  background-color: #27272a;
  border-color: #3f3f46;
}
</style>

