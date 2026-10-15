<script setup lang="ts">
// Enhancement 6 — the frontmatter panel becomes a "memory record" card:
// prettified keys, status rendered as pills, POV and list ids turned into
// readable names, word counts humanized. Layout-shaping keys stay hidden.
import { computed } from 'vue'
import { useData } from 'vitepress'

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

// Keys with special rendering.
const STATUS_KEYS = new Set(['status'])
const POV_KEYS = new Set(['pov'])
const COUNT_KEYS = new Set(['word-count'])
// Lists whose entries are kebab-case ids, shown as names.
const ID_LIST_KEYS = new Set(['characters', 'mentions', 'locations', 'arcs-advanced'])

const titleCase = (text: string) =>
  text.replace(/[-_]/g, ' ').replace(/\b[a-z]/g, (letter) => letter.toUpperCase())

const labelOf = (key: string) => titleCase(key)

interface Row {
  key: string
  label: string
  value: string
  kind: 'status' | 'pov' | 'count' | 'text'
}

const { frontmatter, page } = useData()

const rows = computed<Row[]>(() =>
  Object.entries(frontmatter.value ?? {})
    .filter(([key, value]) => !HIDDEN.has(key) && value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      const text = Array.isArray(value)
        ? value.join(', ')
        : typeof value === 'object'
          ? JSON.stringify(value)
          : String(value)
      let kind: Row['kind'] = 'text'
      let display = text
      if (STATUS_KEYS.has(key)) {
        kind = 'status'
      } else if (POV_KEYS.has(key)) {
        kind = 'pov'
        display = titleCase(text)
      } else if (COUNT_KEYS.has(key)) {
        kind = 'count'
        display = `${text} words`
      } else if (ID_LIST_KEYS.has(key)) {
        display = text
          .split(', ')
          .map((item) => titleCase(item.trim()))
          .join(', ')
      }
      return { key, label: labelOf(key), value: display, kind }
    })
)

const show = computed(() => page.value.filePath !== 'index.md' && rows.value.length > 0)
</script>

<template>
  <div v-if="show" class="record-card-wrap" aria-label="Story record">
    <span class="record-card__tag">◈ Record</span>
    <dl class="record-card">
    <template v-for="row in rows" :key="row.key">
      <dt>{{ row.label }}</dt>
      <dd>
        <span
          v-if="row.kind === 'status'"
          class="story-pill"
          :class="`story-pill--${row.value.toLowerCase()}`"
        >{{ row.value }}</span>
        <span v-else-if="row.kind === 'pov'" class="record-card__pov">{{ row.value }}</span>
        <span v-else-if="row.kind === 'count'" class="record-card__count">{{ row.value }}</span>
        <template v-else>{{ row.value }}</template>
      </dd>
    </template>
    </dl>
  </div>
</template>

<style scoped>
/* A glass data card with archive corner brackets. */
.record-card-wrap {
  position: relative;
  margin: 0 0 1.75rem;
}

.record-card {
  position: relative;
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.3rem 1.25rem;
  margin: 0;
  padding: 1rem 1.25rem 0.9rem;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 25%, var(--vp-c-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 4%, var(--vp-c-bg-soft));
  box-shadow: 0 10px 30px -22px color-mix(in srgb, var(--vp-c-brand-1) 60%, transparent);
  font-size: 0.85rem;
  line-height: 1.55;
}

.record-card__tag {
  position: absolute;
  top: -9px;
  left: 14px;
  margin: 0;
  padding: 0 0.45rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-brand-1);
  font-family: var(--story-font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* Archive corner brackets. */
.record-card::before,
.record-card::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: var(--vp-c-brand-1);
  opacity: 0.85;
}

.record-card::before {
  top: -1px;
  right: -1px;
  border-top: 2px solid;
  border-right: 2px solid;
  border-radius: 0 12px 0 0;
}

.record-card::after {
  bottom: -1px;
  left: -1px;
  border-bottom: 2px solid;
  border-left: 2px solid;
  border-radius: 0 0 0 12px;
}

.record-card dt {
  margin: 0;
  font-family: var(--story-font-mono);
  font-weight: 500;
  font-size: 0.78rem;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-2);
}

.record-card dd {
  margin: 0;
  color: var(--vp-c-text-1);
}

.record-card__pov {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.record-card__count {
  font-family: var(--story-font-mono);
  color: var(--vp-c-text-2);
}
</style>
