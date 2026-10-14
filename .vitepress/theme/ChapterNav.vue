<script setup>
import { computed } from 'vue'
import { useRoute, useData } from 'vitepress'

const route = useRoute()
const { frontmatter } = useData()

const prevLink = computed(() => frontmatter.value.prev)
const nextLink = computed(() => frontmatter.value.next)
const prevText = computed(() => frontmatter.value.prevText || 'Previous Chapter')
const nextText = computed(() => frontmatter.value.nextText || 'Next Chapter')

const isChapterPage = computed(() => route.path.startsWith('/chapters/'))
</script>

<template>
  <nav v-if="isChapterPage && (prevLink || nextLink)" class="chapter-nav" aria-label="Chapter navigation">
    <a v-if="prevLink" :href="prevLink" class="chapter-nav__link chapter-nav__link--prev" rel="prev">
      <span class="chapter-nav__label">{{ prevText }}</span>
      <span class="chapter-nav__title">{{ getChapterTitle(prevLink) }}</span>
    </a>
    <a v-if="nextLink" :href="nextLink" class="chapter-nav__link chapter-nav__link--next" rel="next">
      <span class="chapter-nav__label">{{ nextText }}</span>
      <span class="chapter-nav__title">{{ getChapterTitle(nextLink) }}</span>
    </a>
  </nav>
</template>

<script>
export default {
  methods: {
    getChapterTitle(link) {
      // Extract chapter number from link like /chapters/chapter-01.html
      const match = link.match(/chapter-(\d+)/)
      if (match) {
        return `Chapter ${parseInt(match[1], 10)}`
      }
      return ''
    }
  }
}
</script>

<style scoped>
.chapter-nav {
  display: flex;
  justify-content: space-between;
  padding: 2rem 0;
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 3rem;
  gap: 1rem;
}

.chapter-nav__link {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-decoration: none;
  color: var(--vp-c-text-1);
  max-width: 45%;
  transition: color 0.2s;
}

.chapter-nav__link:hover {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.chapter-nav__link--prev {
  text-align: left;
}

.chapter-nav__link--next {
  text-align: right;
}

.chapter-nav__label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}

.chapter-nav__title {
  font-weight: 500;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .chapter-nav {
    flex-direction: column;
  }
  .chapter-nav__link {
    max-width: 100%;
  }
  .chapter-nav__link--next {
    text-align: left;
  }
}
</style>