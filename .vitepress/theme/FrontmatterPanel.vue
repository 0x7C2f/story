<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

// The story metadata of the page being read, straight from its frontmatter.
// Site-shaping keys stay hidden: the layout renders those itself.
const HIDDEN = new Set([
  'layout',
  'hero',
  'features',
  'head',
  'title',
  'description',
  'prev',
  'next',
  'pagination',
  'aside',
  'outline',
  'editLink',
  'lastUpdated',
  'sidebar',
  'footer'
])

const { frontmatter, page } = useData()

const rows = computed(() =>
  Object.entries(frontmatter.value ?? {})
    .filter(([key, value]) => !HIDDEN.has(key) && value !== undefined && value !== null && value !== '')
    .map(([key, value]) => ({
      key,
      value: Array.isArray(value)
        ? value.join(', ')
        : typeof value === 'object'
          ? JSON.stringify(value)
          : String(value)
    }))
)

const show = computed(() => page.value.filePath !== 'index.md' && rows.value.length > 0)
</script>

<template>
  <dl v-if="show" class="frontmatter-panel">
    <template v-for="row in rows" :key="row.key">
      <dt>{{ row.key }}</dt>
      <dd>{{ row.value }}</dd>
    </template>
  </dl>
</template>
