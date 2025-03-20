<script setup lang="ts">
import DescriptionCard from '@/components/DescriptionCard.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useDescriptionsStore } from '@/stores/descriptionStore'
import { onMounted } from 'vue'

const store = useDescriptionsStore()

onMounted(() => {
  store.fetchDescriptions()
})
</script>

<template>
  <main>
    <h1>all descriptions</h1>

    <LoadingSpinner v-if="store.loading" />

    <ErrorMessage v-else-if="store.error" :message="store.error" />

    <div v-else class="descriptions">
      <DescriptionCard
        v-for="desc in store.descriptions"
        :key="desc.uri as string"
        :id="desc.uri"
        :description="desc"
        :showViewLink="true"
      />
    </div>
  </main>
</template>

<style scoped lang="scss">
.descriptions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1 {
  margin: 0;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: bold;
  color: var(--text);
}
</style>
