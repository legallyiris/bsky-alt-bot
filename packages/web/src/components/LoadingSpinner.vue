<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <span>loading...</span>
  </div>
</template>

<style scoped lang="scss">
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: hsl(var(--subtext0));
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid hsla(var(--blue) / 0.1);
  border-top-color: hsl(var(--blue));
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
