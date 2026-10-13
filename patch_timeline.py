def update_timeline():
    with open('plot/timeline.md', 'r') as f:
        content = f.read()

    new_entry = "| Day 7 | Elias, Kaelen, and Jarek successfully ambush the sweep teams at the old transit bridge and capture a heavy transport | | 22 |\n"
    content = content + new_entry

    with open('plot/timeline.md', 'w') as f:
        f.write(content)

update_timeline()
