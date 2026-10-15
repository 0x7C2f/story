import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ReadingProgress from './ReadingProgress.vue'
import ChapterNav from './ChapterNav.vue'
import FrontmatterPanel from './FrontmatterPanel.vue'
import './custom.css'

// The reading progress bar is mounted in the layout-top slot so it runs on
// every page (it was previously registered but never rendered, so the old
// bar never appeared). FrontmatterPanel stays in doc-before. ChapterNav
// remains registered as a global component for hand-placed use; chapter
// prev/next is served by the built-in pager, restyled by custom.css §7.
export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'layout-top': () => h(ReadingProgress),
      'doc-before': () => h(FrontmatterPanel),
      'doc-after': () => h(ChapterNav)
    }),
  enhanceApp({ app }) {
    app.component('ReadingProgress', ReadingProgress)
    app.component('ChapterNav', ChapterNav)
    app.component('FrontmatterPanel', FrontmatterPanel)
  }
} satisfies Theme
