import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ReadingProgress from './ReadingProgress.vue'
import ChapterNav from './ChapterNav.vue'
import FrontmatterPanel from './FrontmatterPanel.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'doc-before': () => h(FrontmatterPanel)
    }),
  enhanceApp({ app }) {
    app.component('ReadingProgress', ReadingProgress)
    app.component('ChapterNav', ChapterNav)
    app.component('FrontmatterPanel', FrontmatterPanel)
  }
} satisfies Theme