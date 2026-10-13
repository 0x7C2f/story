import sys

def update_state():
    with open('continuity/state.md', 'r') as f:
        content = f.read()

    parts = content.split('---\n')
    if len(parts) < 3:
        return

    frontmatter = parts[1]

    # Update current-chapter
    frontmatter = frontmatter.replace('current-chapter: 21', 'current-chapter: 22')

    # Add to knowledge-state
    knowledge_add = """  - character: elias-thorne
    knows: The resistance has captured a heavy transport and secured a physical tap into the operational network.
    learned-in: chapter-22
  - character: kaelen
    knows: The resistance has captured a heavy transport and secured a physical tap into the operational network.
    learned-in: chapter-22
  - character: jarek
    knows: The resistance has captured a heavy transport and secured a physical tap into the operational network.
    learned-in: chapter-22
"""
    frontmatter += knowledge_add

    object_add = """  - artifact: heavy-transport
    owner: jarek
    location: old-transit-bridge
    status: active
"""
    frontmatter = frontmatter.replace('knowledge-state:', object_add + 'knowledge-state:')

    new_content = "---\n" + frontmatter + "---\n" + parts[2]

    # Update tables
    knowledge_table_add = """| Elias Thorne | The resistance has captured a heavy transport and secured a physical tap into the operational network | Chapter 22 |
| Kaelen | The resistance has captured a heavy transport and secured a physical tap into the operational network | Chapter 22 |
| Jarek | The resistance has captured a heavy transport and secured a physical tap into the operational network | Chapter 22 |
"""
    new_content = new_content + knowledge_table_add

    # Object State table
    new_content = new_content.replace('| Mesh Network | Elias Thorne | The Scrapyard Settlement | Active |', '| Mesh Network | Elias Thorne | The Scrapyard Settlement | Active |\n| Heavy Transport | Jarek | Old Transit Bridge | Active |')

    with open('continuity/state.md', 'w') as f:
        f.write(new_content)

update_state()
