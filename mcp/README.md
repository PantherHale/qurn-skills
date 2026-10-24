# Specialists as an MCP server

One server that gives any MCP client the six specialists. It runs no model: it returns each specialist's instructions and references to the model your client already uses. It speaks MCP over stdio with no dependencies (Node 18 or newer) and answers both the older `initialize` handshake and the 2026-07-28 revision's `server/discover`.

| Door | What you get | Works in clients that support |
|---|---|---|
| prompts | one prompt per specialist (`web`, `security`, ...) with `request` and `checkpoint` arguments | MCP prompts (slash commands) |
| resources | `specialists://<name>/SKILL.md` and every reference file, read on demand | MCP resources |
| tools | `consult_specialist`, `read_specialist_reference`, `list_specialists` | MCP tools (every agent client) |

## Add it

Replace `/path/to` with where you put this folder. Commands and file shapes were checked against each tool's documentation on 2026-10-08.

**Claude Code**
```sh
claude mcp add --scope user --transport stdio specialists -- node /path/to/mcp/server.mjs
```
Use `--scope project` to write a shared `.mcp.json` instead. Prompts then appear as slash commands; check `/mcp`.

**Project file read by Claude Code and VS Code (`.mcp.json`)**
```json
{ "mcpServers": { "specialists": { "command": "node", "args": ["/path/to/mcp/server.mjs"] } } }
```

**VS Code (`.vscode/mcp.json`)**, prompts run as `/specialists.web`
```json
{ "servers": { "specialists": { "type": "stdio", "command": "node", "args": ["/path/to/mcp/server.mjs"] } } }
```

Other clients (Cursor, Windsurf, Cline, Claude Desktop, Zed, Continue) take the same three values: command `node`, argument the path to `server.mjs`. Their config file locations differ, so use each client's own "add MCP server" screen.

Keep `specialists.json` in the same folder as `server.mjs`.
