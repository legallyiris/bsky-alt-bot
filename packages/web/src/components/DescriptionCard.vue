<script setup lang="ts">
import type { Record as DescriptionRecord } from "@altbot/lexicon";
import { computed } from "vue";
import { getBskyUrl } from "../utils/url";

const props = defineProps<{
	description: DescriptionRecord;
	showViewLink?: boolean;
}>();

const id = computed(() => {
	return (props.description.uri as string).split("/").pop();
});
</script>

<template>
  <article class="description">
    <p class="text">{{ description.text }}</p>
    <div class="meta">
      <RouterLink
        v-if="showViewLink"
        :to="`/description/${id}`"
        aria-label="View full description details"
      >
        view details
      </RouterLink>

      <a
        v-if="description.post"
        :href="getBskyUrl(description.post)"
        target="_blank"
        class="post-link"
      >
        view original post
      </a>

      <span v-if="!isNaN(description.image)" class="image-number">
        image #{{ description.image + 1 }}
      </span>

      <time :datetime="description.createdAt">
        {{ new Date(description.createdAt).toLocaleString() }}
      </time>
    </div>
  </article>
</template>

<style scoped lang="scss">
.description {
  padding: 1.5rem;
  background: hsla(var(--base) / 0.5);
  border: 1px solid hsla(var(--subtext1) / 0.05);
  border-radius: 0.5rem;
  transition: 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px hsla(var(--crust) / 0.15);
    border-color: hsla(var(--subtext1) / 0.1);
  }

  .text {
    margin: 0 0 1.5rem;
    font-size: 1.1rem;
    line-height: 1.6;
    color: hsla(var(--text) / 0.9);
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    color: hsl(var(--subtext0));

    a {
      color: hsl(var(--blue));
      text-decoration: none;
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
      transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background-color: hsla(var(--blue) / 0.1);
      }

      &:focus-visible {
        outline: 2px solid hsl(var(--blue));
        background-color: hsla(var(--blue) / 0.1);
      }
    }

    time {
      color: hsl(var(--overlay2));
    }
  }
}
</style>
