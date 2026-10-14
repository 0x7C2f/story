import DefaultTheme from 'vitepress/theme'
import ReadingProgress from './ReadingProgress.vue'
import ChapterNav from './ChapterNav.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('ReadingProgress', ReadingProgress)
    app.component('ChapterNav', ChapterNav)
  }
}