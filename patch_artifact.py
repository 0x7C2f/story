def update_artifact():
    with open('worldbuilding/artifacts/heavy-transport.md', 'r') as f:
        content = f.read()

    parts = content.split('---\n')
    frontmatter = parts[1]

    frontmatter = frontmatter.replace('owner: ""', 'owner: jarek')
    frontmatter = frontmatter.replace('location: ""', 'location: old-transit-bridge')

    new_content = "---\n" + frontmatter + "---\n" + parts[2]

    body = """# Heavy Transport

## Description

A massive, armored crawler used by the Oversight Committee's loyalist sweep teams. It has thick reinforced treads, external floodlights, and heavy mag-locks securing the cargo bay doors.

## Function

Used to transport enforcers, drones, and supplies into hostile territory like the Outskirts. Its primary communications terminal can be used to tap into the Committee's operational network.

## History

Deployed by Director Vane to lock down the Outskirts perimeter and hunt down Elias and Kaelen following the counter-broadcast.

## Current State

Captured by Elias, Kaelen, and Jarek during the ambush at the old transit bridge. It is currently offline but secured by the resistance.
"""
    new_content = "---\n" + frontmatter + "---\n" + body

    with open('worldbuilding/artifacts/heavy-transport.md', 'w') as f:
        f.write(new_content)

update_artifact()
