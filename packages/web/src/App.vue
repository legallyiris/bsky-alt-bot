<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <RouterView class="app-content" />
    <footer class="app-footer">
      <p>
        made with <span class="heart">❤️</span> by
        <a href="https://bsky.app/profile/legallyiris.dev">iris</a>
      </p>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.app-container {
  max-width: 768px;
  width: calc(100% - 2rem);
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-content {
  border-radius: 1rem;
  border: 1px solid hsla(var(--subtext0) / 0.25);
  padding: 1rem;
  background-color: hsla(var(--crust));
}

.app-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  a {
    color: hsla(var(--rosewater) / 1);
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: hsla(var(--rosewater) / 1);
    }
  }
}
</style>
