<script setup lang="ts">
import DescriptionCard from "@/components/DescriptionCard.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import PostCard from "@/components/PostCard.vue";
import { onBeforeUnmount, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useDescriptionsStore } from "../stores/descriptionStore";
import { usePostsStore } from "../stores/postStore";

const route = useRoute();
const descStore = useDescriptionsStore();
const postStore = usePostsStore();

onMounted(async () => {
	const id = route.params.id as string;
	await descStore.fetchDescription(id);

	if (
		descStore.currentDescription?.post &&
		descStore.currentDescription?.generation
	) {
		await postStore.fetchPost(descStore.currentDescription.post);
		if (descStore.currentDescription?.generation) {
			await descStore.fetchRelatedDescriptions(
				descStore.currentDescription.generation,
			);
		}
	}
});

onBeforeUnmount(() => {
	descStore.clearCurrentDescription();
	postStore.clearPost();
});
</script>

<template>
  <main>
    <header class="header">
      <RouterLink to="/" class="back" aria-label="back">← back</RouterLink>
      <h1>description</h1>
    </header>

    <PostCard
      v-if="postStore.currentPost"
      :post="postStore.currentPost"
      :relatedDescriptions="descStore.relatedDescriptions"
    />

    <LoadingSpinner v-if="descStore.loading || postStore.loading" />

    <ErrorMessage
      v-else-if="descStore.error || postStore.error"
      :message="descStore.error || postStore.error || ''"
    />

    <div v-else class="descriptions">
    <DescriptionCard
      v-for="desc in descStore.relatedDescriptions"
      :key="desc.image"
        :description="desc"
      />
    </div>
  </main>
</template>

<style scoped lang="scss">
.header {
  display: inline-flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 2rem;

  .back {
    flex-shrink: 1;
    color: hsl(var(--blue));
    text-decoration: none;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background-color: hsla(var(--blue) / 0.1);
    }
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    color: hsl(var(--text));
  }
}


.descriptions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

</style>
