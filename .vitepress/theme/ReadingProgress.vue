<script setup>
// Enhancement 5 — Reading Progress 2.0: gradient fill, glowing tip,
// rAF-throttled scroll updates, fades in only once reading starts, and
// follows the brand palette in BOTH themes (the old sheet only defined a
// dark-mode color).
import { onMounted, onUnmounted, ref } from 'vue'

const progress = ref(0)
const active = ref(false)
let ticking = false

const updateProgress = () => {
  ticking = false
  const scrollTop = window.scrollY
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight
  progress.value =
    docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
  active.value = scrollTop > 24
}

const onScroll = () => {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(updateProgress)
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div
    class="reading-progress"
    :class="{ 'reading-progress--active': active }"
    :style="{ '--reading-progress': progress + '%' }"
    aria-hidden="true"
  />
</template>

<style scoped>
.reading-progress {
  position: fixed;
  inset: 0 0 auto 0;
  height: var(--reading-progress-height, 3px);
  z-index: 100;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.reading-progress--active {
  opacity: 1;
}

/* The fill: brand gradient across the width read so far. */
.reading-progress::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--reading-progress, 0%);
  border-radius: 0 999px 999px 0;
  background: linear-gradient(
    90deg,
    var(--vp-c-brand-1),
    var(--vp-c-brand-3)
  );
  box-shadow: 0 0 10px color-mix(in srgb, var(--vp-c-brand-1) 80%, transparent);
  transition: width 0.12s linear;
}

/* The tip: a soft lantern at the reading edge. */
.reading-progress--active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: var(--reading-progress, 0%);
  width: 18px;
  height: 6px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: var(--vp-c-brand-3);
  filter: blur(3px);
  opacity: 0.9;
}
</style>
