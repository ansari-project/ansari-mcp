# Status Line Task Handler

## Purpose
This document instructs Claude to handle `slt:` commands for setting the status line task.

## Instructions for Claude

When you see a message from the user that starts with `slt:`, you should:

1. Extract the text after `slt:` (trimming whitespace)
2. Write that text to `.claude-task` file in the current directory
3. Respond with a brief confirmation like "✓ Status: [task]"

### Examples:
- `slt: Refine mcp prompt` → Write "Refine mcp prompt" to .claude-task
- `slt: Debug auth flow` → Write "Debug auth flow" to .claude-task  
- `slt:` or `slt: ` → Clear the task (empty file or delete it)

### Implementation:
Use the Write tool to update `.claude-task` with just the task text, no extra formatting.

## Note
This is a project-specific convention for this repository to quickly set status line tasks.