<script setup>
// Enhancement 7 — chapter prev/next as portal cards, mounted at doc-after.
// The built-in pager is retired (custom.css §7) because it shows the raw
// frontmatter link as its title. This card reads the same frontmatter and
// derives clean "Chapter N" labels. All links and the chapter-page check are
// base-aware, so the site works under any base (here: /story/).
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'

const route = useRoute()
const { frontmatter } = useData()

const isChapterPage = computed(() =>
  route.path.startsWith(withBase('/chapters/'))
)

const prevHref = computed(() => {
  const link = frontmatter.value.prev
  return link ? withBase(String(link)) : null
})

const nextHref = computed(() => {
  const link = frontmatter.value.next
  return link ? withBase(String(link)) : null
})

const prevText = computed(() => frontmatter.value.prevText || 'Previous Chapter')
const nextText = computed(() => frontmatter.value.nextText || 'Next Chapter')

// "Chapter 7" from a link like /chapters/chapter-07.html
function chapterTitle(link) {
  const match = String(link || '').match(/chapter-(\d+)/)
  return match ? `Chapter ${parseInt(match[1], 10)}` : ''
}
</script>

<template>
  <nav
    v-if="isChapterPage && (prevHref || nextHref)"
    class="chapter-nav"
    aria-label="Chapter navigation"
  >
    <a
      v-if="prevHref"
      :href="prevHref"
      class="chapter-nav__card chapter-nav__card--prev"
      rel="prev"
    >
      <span class="chapter-nav__label">
        <span class="chapter-nav__arrow" aria-hidden="true">←</span>
        {{ prevText }}
      </span>
      <span class="chapter-nav__title">{{ chapterTitle(frontmatter.prev) }}</span>
    </a>
    <a
      v-if="nextHref"
      :href="nextHref"
      class="chapter-nav__card chapter-nav__card--next"
      rel="next"
    >
      <span class="chapter-nav__label">
        {{ nextText }}
        <span class="chapter-nav__arrow" aria-hidden="true">→</span>
      </span>
      <span class="chapter-nav__title">{{ chapterTitle(frontmatter.next) }}</span>
    </a>
  </nav>
</template>

<style scoped>
/* Two portal cards under the prose. */
.chapter-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
}

.chapter-nav__card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 48%;
  padding: 1rem 1.3rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.chapter-nav__card--next {
  text-align: right;
}

.chapter-nav__label {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-brand-1);
}

.chapter-nav__arrow {
  transition: transform 0.3s ease;
}

.chapter-nav__card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 45%, transparent);
  box-shadow: 0 14px 34px -16px color-mix(in srgb, var(--vp-c-brand-1) 55%, transparent);
}

.chapter-nav__card--prev:hover .chapter-nav__arrow {
  transform: translateX(-4px);
}

.chapter-nav__card--next:hover .chapter-nav__arrow {
  transform: translateX(4px);
}

.chapter-nav__title {
  font-family: var(--story-font-serif);
  font-weight: 600;
  font-size: 1.05rem;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .chapter-nav {
    flex-direction: column;
  }

  .chapter-nav__card {
    max-width: 100%;
  }

  .chapter-nav__card--next {
    text-align: left;
  }
}
</style>
