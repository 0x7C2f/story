def add_location_to_char(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    parts = content.split('---\n')
    frontmatter = parts[1]

    # Simple replace to add location
    frontmatter = frontmatter.replace('locations:\n', 'locations:\n  - old-transit-bridge\n')

    new_content = "---\n" + frontmatter + "---\n" + parts[2]

    with open(filepath, 'w') as f:
        f.write(new_content)

add_location_to_char('characters/elias-thorne.md')
add_location_to_char('characters/kaelen.md')
add_location_to_char('characters/jarek.md')
