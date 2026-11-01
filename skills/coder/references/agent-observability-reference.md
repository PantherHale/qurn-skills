# Coder: observing and storing long-running agent work

For a process that runs unattended for a while and needs to be watched live and trusted afterward.

## Observability without polling
Emit every state change as an event (`{type, who, what, when, attributes}`) through one append-mostly log with an in-memory ring buffer; a reconnecting client replays from the last sequence number it saw instead of re-querying full history. Anything that shows "what is happening right now" -- a dashboard, an OS notification, a progress bar -- renders directly off this stream; none of it polls.

## Storage you can trust
- **Append-only transcripts.** No code path edits or deletes a past entry -- a record that can be quietly rewritten is a record nobody can trust. "Deletion" is a timestamp mark in a separate small store, filtered out of what's displayed; nothing is actually removed, so a record written to again on the same id simply reappears, which is correct, not a bug.
- **Append-only migrations.** A schema's migration log only ever gains new steps; a past migration is never edited in place, even to fix a mistake in it -- fix forward with a new migration instead.
- **JSON sidecars for small state.** Not everything needs a table. Small per-process state that doesn't justify schema overhead can live as a plain JSON file beside the main store, read fresh and written whole each time, parsed defensively so a hand-edited or half-written file loses only its own bad entries, never the feature built on it.

## Rendering large live-updating graphs
For a few hundred nodes rendered live with per-item hover (a memory/dependency/event graph), prefer a single canvas repaint over many individually-styled DOM/SVG nodes -- restyling hundreds of DOM elements every frame is the actual bottleneck, not the data size.

## Memory as a graph
Represent accumulated knowledge (lessons, decisions, facts, subsystem write-ups) as one fact per file: a `name`/`description`/`type` frontmatter header, `[[wikilink]]`-style references in the body as edges. An unresolved `[[link]]` should render as a visible placeholder ("ghost" entry), not be silently hidden -- a missing memory is a to-do, not an error. A type specifically for documenting *how a subsystem works*, written at the time it's built, turns the graph into living architecture documentation instead of only a log of status updates.
