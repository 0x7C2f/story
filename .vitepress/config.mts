import { defineConfig, type DefaultTheme } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

// The reader site's config. It builds the navigation from the story itself:
// every story folder is walked recursively, and each page is labelled from
// its frontmatter (title, then name, then term) rather than its heading or
// its file name. Generated registry pages (_index.md) are rewritten to
// index.md at every depth. Tooling never reaches the build: folder guides
// (AGENTS.md) and their guide text stay out via srcExclude.

const docsRoot = path.resolve(import.meta.dirname, '..')

const SECTIONS = [
  { dir: 'chapters', title: 'Chapters' },
  { dir: 'scenes', title: 'Scenes' },
  { dir: 'plot', title: 'Plot' },
  { dir: 'characters', title: 'Characters' },
  { dir: 'worldbuilding', title: 'Worldbuilding' },
  { dir: 'glossary', title: 'Glossary' },
  { dir: 'continuity', title: 'Continuity' }
]

const LABEL_KEYS = ['title', 'name', 'term']

// The top-level scalars of a file's frontmatter, as written. This is a label
// reader, not a YAML implementation: it takes `key: value` lines and leaves
// blocks (lists, nested maps) to the theme, which parses the same file fully.
function readFrontmatter(file: string): Record<string, string> {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  if (lines[0]?.trim() !== '---') return {}
  const data: Record<string, string> = {}
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index]
    if (line.trim() === '---') break
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) continue
    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    data[match[1]] = value
  }
  return data
}

// A page's label: frontmatter first, then its first heading, then its name.
function label(file: string, fallback: string): string {
  const data = readFrontmatter(file)
  for (const key of LABEL_KEYS) {
    if (data[key] !== undefined && data[key] !== '') return data[key]
  }
  const heading = fs.readFileSync(file, 'utf8').match(/^#\s+(.+)$/m)
  if (heading) return heading[1].trim()
  return fallback.replace(/[-_]/g, ' ')
}

function prettify(name: string): string {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function isExcluded(relative: string): boolean {
  const parts = relative.split('/')
  return (
    parts.some((part) => part.startsWith('.')) ||
    parts.some((part) => part === 'AGENTS.md') ||
    relative.startsWith('continuity/guides/')
  )
}

// One folder's sidebar items, deepest folders as collapsed groups. Each
// _index.md becomes the group's link and a rewrite to index.md at that depth.
function walkFolder(
  relativeDir: string,
  rewrites: Record<string, string>
): { items: DefaultTheme.SidebarItem[]; link: string | undefined } {
  const fullDir = path.join(docsRoot, relativeDir)
  let items: DefaultTheme.SidebarItem[] = []
  let link: string | undefined
  if (!fs.existsSync(fullDir)) return { items, link }

  const entries = fs
    .readdirSync(fullDir, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }))

  const files: DefaultTheme.SidebarItem[] = []
  for (const entry of entries) {
    const relative = `${relativeDir}/${entry.name}`
    if (isExcluded(relative)) continue

    if (entry.isDirectory()) {
      const child = walkFolder(relative, rewrites)
      if (child.items.length > 0 || child.link !== undefined) {
        items.push({
          text: prettify(entry.name),
          collapsed: true,
          link: child.link,
          items: child.items
        })
      }
      continue
    }
    if (!entry.name.endsWith('.md')) continue

    const full = path.join(docsRoot, relative)
    const name = entry.name.replace(/\.md$/, '')
    if (name === '_index') {
      rewrites[relative] = `${relativeDir}/index.md`
      link = `/${relativeDir}/`
      continue
    }
    files.push({ text: label(full, name), link: `/${relative.replace(/\.md$/, '')}` })
  }
  // A folder's own pages before its subfolders.
  items = [...files, ...items]
  return { items, link }
}

const rewrites: Record<string, string> = {}
const sidebar: DefaultTheme.SidebarItem[] = []
const nav: DefaultTheme.NavItem[] = [{ text: 'Home', link: '/' }]

for (const section of SECTIONS) {
  const { items, link } = walkFolder(section.dir, rewrites)
  if (items.length > 0 || link !== undefined) {
    sidebar.push({ text: section.title, collapsed: false, link, items })
  }
  nav.push({ text: section.title, link: link ?? items[0]?.link ?? '/' })
}

// The story's own metadata sets the site title and description.
const about = fs.existsSync(path.join(docsRoot, 'about.md'))
  ? readFrontmatter(path.join(docsRoot, 'about.md'))
  : {}
if (fs.existsSync(path.join(docsRoot, 'about.md'))) {
  sidebar.unshift({ text: label(path.join(docsRoot, 'about.md'), 'About'), link: '/about' })
}

export default defineConfig({
  title: about.title || 'Story Archive',
  description: about.logline || 'Autonomous story repository',
  base: '/story/',
  ignoreDeadLinks: true,
  srcExclude: ['**/AGENTS.md', 'continuity/guides/**'],
  rewrites,
  themeConfig: {
    search: { provider: 'local' },
    nav,
    sidebar,
    darkModeSwitchLabel: 'Appearance',
    outline: { level: [2, 3], label: 'On this page' }
  }
})
