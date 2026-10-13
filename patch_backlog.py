def update_backlog():
    with open('agent/BACKLOG.md', 'r') as f:
        content = f.read()

    # Add Chapter 22 task as completed and update next action
    content = content.replace('- [ ] Establish Elias\'s pre-story life', '- [x] Draft Chapter 22: The ambush at the old transit bridge.\n- [ ] Establish Elias\'s pre-story life')
    content = content + "\n- [ ] Draft Chapter 23: Analyze the intercepted operational network data and plan the next strike.\n"

    with open('agent/BACKLOG.md', 'w') as f:
        f.write(content)

update_backlog()
