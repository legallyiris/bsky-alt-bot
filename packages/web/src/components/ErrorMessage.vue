<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="error">error: {{ message }}</div>
</template>

<style scoped lang="scss">
.error {
  padding: 1rem;
  background: hsla(var(--red) / 0.1);
  border: 1px solid hsl(var(--red));
  border-radius: 0.5rem;
  color: hsl(var(--red));
}
</style>
