import sys
from datetime import datetime

def update_changelog():
    with open('CHANGELOG.md', 'r') as f:
        content = f.read()

    parts = content.split('\n\n', 1)
    header = parts[0]
    rest = parts[1]

    date_str = datetime.now().strftime("%Y-%m-%d")

    new_entry = f"""
## {date_str}
- Drafted Chapter 24: Elias, Kaelen, and Jarek infiltrate the Sector Six staging ground in the captured crawler.
- Created Sector Six Staging Ground location file and Primary Signal Repeater artifact file.
- Updated characters (Elias Thorne, Kaelen, Jarek) with progression and timeline entries for Chapter 24.
- Updated continuity state to reflect infiltration and new entities.
- Checked off Chapter 24 task in BACKLOG.md.
Next run: Draft Chapter 25 or outline the next story beat for the destruction of the primary signal repeater.
Model: Jules
"""

    new_content = header + "\n" + new_entry + "\n" + rest

    with open('CHANGELOG.md', 'w') as f:
        f.write(new_content)

update_changelog()
