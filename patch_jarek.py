def update_jarek():
    with open('characters/jarek.md', 'r') as f:
        content = f.read()

    parts = content.split('---\n')
    frontmatter = parts[1]

    progression_add = """  - from: chapter-22
    field: standing
    value: "Co-led a successful ambush against Committee forces, securing a heavy transport"
"""
    frontmatter = frontmatter + progression_add

    new_content = "---\n" + frontmatter + "---\n" + parts[2]

    timeline_add = "| Chapter 22 | Detonates the EMP charge and helps capture a transport | Proves the resistance's capability |\n"
    new_content = new_content + timeline_add

    with open('characters/jarek.md', 'w') as f:
        f.write(new_content)

update_jarek()
