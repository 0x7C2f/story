#!/usr/bin/env node
/**
 * Generate dynamic index.md from story registry data
 * Run at build time before VitePress builds the site
 */

import fs from 'node:fs';
import path from 'node:path';

// The script runs from $SITE_DIR/docs, and the story files are in $SITE_DIR/docs/
const docsRoot = path.resolve(import.meta.dirname);

function readFrontmatter(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return {};
  const data = {};
  for (let index = 1; index < lines.length; index++) {
    const line = lines[index];
    if (line.trim() === '---') break;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[match[1]] = value;
  }
  return data;
}

// Parse chapter registry
const chapterIndexPath = path.join(docsRoot, 'chapters/_index.md');
const chapterIndexContent = fs.readFileSync(chapterIndexPath, 'utf8');

// Extract table rows
const tableMatch = chapterIndexContent.match(/\| \d+ \| .+ \| .+ \| .+ \| \d+ \| \[.+\]\(.+\) \|\n/g);
const chapters = [];
if (tableMatch) {
  for (const row of tableMatch) {
    const parts = row.split('|').map(s => s.trim()).filter(Boolean);
    if (parts.length >= 5) {
      chapters.push({
        number: parseInt(parts[0], 10),
        title: parts[1],
        pov: parts[2],
        status: parts[3],
        wordCount: parseInt(parts[4].replace(/,/g, ''), 10) || 0,
        file: parts[5]
      });
    }
  }
}

// Parse total word count
const totalMatch = chapterIndexContent.match(/## Total Word Count: ([\d,]+)/);
const totalWords = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ''), 10) : chapters.reduce((sum, c) => sum + c.wordCount, 0);

// Count by status
const statusCounts = {};
for (const ch of chapters) {
  statusCounts[ch.status] = (statusCounts[ch.status] || 0) + 1;
}

// Build arc structure from chapter numbers (simplified heuristic)
const arcs = [];
if (chapters.length > 0) {
  // Group into arcs based on narrative structure
  const arcDefs = [
    { name: 'The Discovery', start: 1, end: 2 },
    { name: 'The Conspiracy Unfolds', start: 3, end: 9 },
    { name: 'The Counter-Broadcast', start: 10, end: 13 },
    { name: 'The Outskirts', start: 14, end: 17 },
    { name: 'The Resistance', start: 18, end: 27 },
    { name: 'The Liberation', start: 28, end: Infinity }
  ];
  
  for (const arc of arcDefs) {
    const arcChapters = chapters.filter(c => c.number >= arc.start && c.number <= arc.end);
    if (arcChapters.length > 0) {
      const statuses = arcChapters.map(c => c.status);
      const status = statuses.every(s => s === 'draft') ? 'Draft' :
                     statuses.every(s => s === 'outline') ? 'Outline' : 'Mixed';
      arcs.push({
        name: arc.name,
        range: `${arc.start}–${Math.min(arc.end, chapters[chapters.length - 1].number)}`,
        status,
        chapters: arcChapters.length
      });
    }
  }
}

// Read story.md for metadata
const storyPath = path.join(docsRoot, 'story.md');
let storyTitle = 'The Memory Archivist';
let logline = 'A near-future sci-fi mystery';
if (fs.existsSync(storyPath)) {
  const storyData = readFrontmatter(storyPath);
  if (storyData.title) storyTitle = storyData.title;
  if (storyData.logline) logline = storyData.logline;
}

// Generate index.md
const output = `---
layout: home
hero:
  name: ${storyTitle}
  text: ${logline}
  tagline: Where memory is currency, truth is the first casualty
  actions:
    - theme: brand
      text: Start Reading
      link: /chapters/chapter-01.html
    - theme: alt
      text: View All Chapters
      link: /chapters/
features:
  - title: ${chapters.length} Chapters
    details: Complete story arc from discovery to liberation (${totalWords.toLocaleString()} words)
  - title: Rich Worldbuilding
    details: Characters, locations, factions, and glossary
  - title: Continuity Tracked
    details: Automated validation ensures consistency
---

## Synopsis

Elias Thorne is a memory archivist in a near-future society where personal experiences are digitized and stored. When he stumbles upon a series of systematically altered records, he uncovers a conspiracy that threatens the very fabric of truth and history. Elias must navigate a web of deception to preserve the integrity of human memory before his own mind is compromised.

## Story Progress

| Arc | Chapters | Status |
|-----|----------|--------|
${arcs.map(a => `| **${a.name}** | ${a.range} | ${a.status} |`).join('\n')}

**Total: ~${(totalWords / 1000).toFixed(1)}k words across ${chapters.length} chapters**

## Quick Navigation

- [Chapters](/chapters/) — Read the story
- [Characters](/characters/) — Meet the cast
- [Worldbuilding](/worldbuilding/) — Explore the setting
- [Plot](/plot/) — Timeline and structure
- [Glossary](/glossary/) — Terms and concepts
`;

const outputPath = path.join(docsRoot, 'index.md');
fs.writeFileSync(outputPath, output);
console.log(`Generated index.md: ${chapters.length} chapters, ${totalWords.toLocaleString()} words`);