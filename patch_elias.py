def update_elias():
    with open('characters/elias-thorne.md', 'r') as f:
        content = f.read()

    parts = content.split('---\n')
    frontmatter = parts[1]

    progression_add = """  - from: chapter-22
    field: standing
    value: "Secured a direct physical tap into Director Vane's operational network"
"""
    frontmatter = frontmatter + progression_add

    new_content = "---\n" + frontmatter + "---\n" + parts[2]

    timeline_add = "| Chapter 22 | Captures a heavy transport and taps into the operational network | Takes the offensive |\n"
    new_content = new_content + timeline_add

    with open('characters/elias-thorne.md', 'w') as f:
        f.write(new_content)

update_elias()
