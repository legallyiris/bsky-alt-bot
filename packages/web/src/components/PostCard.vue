<script setup lang="ts">
import type { Record as DescriptionRecord } from '@altbot/lexicon'
import type { AppBskyFeedPost } from '@atcute/client/lexicons'
import type { AppBskyFeedDefs } from '@atcute/client/lexicons'

defineProps<{
  post: AppBskyFeedDefs.PostView
  relatedDescriptions: DescriptionRecord[]
}>()
</script>

<template>
  <article class="post">
    <div class="post-header">
      <img :src="post.author.avatar" :alt="post.author.displayName" class="avatar" />
      <div class="author-info">
        <span class="display-name">{{ post.author.displayName }}</span>
        <span class="handle">@{{ post.author.handle }}</span>
      </div>
    </div>
    <div class="post-content">
      <p class="post-text">{{ (post.record as AppBskyFeedPost.Record).text }}</p>
      <div
        class="post-media"
        v-if="relatedDescriptions.length > 0 && post.embed?.$type === 'app.bsky.embed.images#view'"
      >
        <div
          v-for="(image, idx) in post.embed?.images"
          :key="idx"
          :id="`image-${idx}`"
          class="image-container"
        >
          <img :src="image.thumb" class="post-image" :alt="relatedDescriptions[idx]?.text || ''" />
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.post {
  margin-bottom: 1rem;
  padding: 1rem;
  background: hsla(var(--base) / 0.5);
  border: 1px solid hsla(var(--subtext1) / 0.05);
  border-radius: 0.5rem;

  .post-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    .avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }

    .author-info {
      display: flex;
      flex-direction: column;

      .display-name {
        font-weight: bold;
      }

      .handle {
        color: hsl(var(--subtext0));
        font-size: 0.9rem;
      }
    }
  }

  .post-content {
    .post-text {
      margin: 0;
      line-height: 1.5;
    }

    .post-media {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.75rem;
      margin-top: 0.75rem;

      .image-container {
        aspect-ratio: 1/1;
        overflow: hidden;
        border-radius: 0.5rem;

        .post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.05);
          }
        }
      }
    }
  }
}
</style>
