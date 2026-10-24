#!/usr/bin/env node
// The specialists as an MCP server: stdio, newline-delimited JSON-RPC, zero dependencies.
//
// WHY: skills, subagents and rule files each work in a few tools. MCP is the one door nearly every agent client
// (Claude Code and Desktop, Cursor, Windsurf, VS Code Copilot, Cline, Zed, Continue) can open, so this makes the six
// specialists reachable from all of them. The server runs no model: it hands the HOST model the specialist's
// instructions and references, and the host does the work. Three doors, because clients support different parts:
//   prompts   -> one slash-command style prompt per specialist
//   resources -> the long references, read on demand
//   tools     -> consult_specialist, read_specialist_reference, list_specialists (for tools-only clients)
//
// PROTOCOL (verified against modelcontextprotocol.io/specification/latest on 2026-10-08): the 2026-07-28 revision has no
// initialize handshake; every request carries io.modelcontextprotocol/protocolVersion in params._meta and servers must
// implement server/discover. Revisions up to 2025-11-25 open with `initialize`. Clients today are a mix, so this server
// is dual-era: it answers both, and adds `resultType` and serverInfo only to requests that carry the modern _meta.
//
// DATA: specialists.json beside this file, generated from the same manifest and knowledge files as the skills.
import { readFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const MODERN = '2026-07-28'
const LEGACY = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05']
const META_VERSION = 'io.modelcontextprotocol/protocolVersion'
const META_SERVER = 'io.modelcontextprotocol/serverInfo'
const SERVER_INFO = { name: 'specialists', version: '1.0.0' }
const ERR = { parse: -32700, request: -32600, method: -32601, params: -32602, internal: -32603, version: -32022 }
const SCHEME = 'specialists://'
const CHECKPOINTS = ['start', 'middle', 'end']

const here = dirname(fileURLToPath(import.meta.url))
const DATA = JSON.parse(readFileSync(join(here, 'specialists.json'), 'utf8'))
const specialists = DATA.specialists

const INSTRUCTIONS =
  'Six specialist advisers (web, tester, architect, coder, security, delegator). Call consult_specialist with the one that fits, ' +
  'follow the instructions it returns, and read its references on demand. They advise and review; you do the building.'

const find = (name) => specialists.find((s) => s.name === name)
const uriOf = (s, path) => SCHEME + s.name + '/' + path

function consultText(s, checkpoint, request) {
  const lines = ['ACT AS THE ' + s.title.toUpperCase() + ' SPECIALIST.']
  lines.push(checkpoint === undefined
    ? 'Pick the checkpoint from the project: nothing built yet is start, work in progress is middle, work claimed done is end.'
    : 'Checkpoint: ' + checkpoint + '.')
  if (request !== undefined && request.trim() !== '') lines.push('REQUEST: ' + request.trim())
  lines.push('', s.instructions, '', 'REFERENCES (read the ones the task needs, not all up front; each is a resource with this URI and also readable with read_specialist_reference):')
  for (const r of s.references) lines.push('- ' + uriOf(s, r.path) + '  (' + r.title + ')')
  return lines.join('\n')
}

const promptList = () => specialists.map((s) => ({
  name: s.name,
  title: s.title + ' specialist',
  description: s.description,
  arguments: [
    { name: 'request', description: 'What you want looked at, planned or built.', required: false },
    { name: 'checkpoint', description: 'start, middle or end. Leave empty to let the specialist decide.', required: false },
  ],
}))

const resourceList = () => specialists.flatMap((s) => [
  { uri: uriOf(s, 'SKILL.md'), name: s.name + '/SKILL.md', title: s.title + ' specialist: full instructions', mimeType: 'text/markdown' },
  ...s.references.map((r) => ({ uri: uriOf(s, r.path), name: s.name + '/' + r.path, title: r.title, mimeType: 'text/markdown' })),
])

const TOOLS = [
  {
    name: 'consult_specialist',
    title: 'Consult a specialist',
    description: 'Returns a specialist\'s instructions for a request. Follow them as that specialist: they end in VERDICT: pass, fix or redo with evidence. Specialists: ' +
      specialists.map((s) => s.name + ' (' + s.purpose + ')').join('; ') + '.',
    inputSchema: {
      type: 'object',
      properties: {
        specialist: { type: 'string', enum: specialists.map((s) => s.name), description: 'Which specialist.' },
        request: { type: 'string', description: 'What to look at, plan or build.' },
        checkpoint: { type: 'string', enum: CHECKPOINTS, description: 'Optional. start, middle or end.' },
      },
      required: ['specialist'],
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: 'read_specialist_reference',
    title: 'Read a specialist reference',
    description: 'Returns one reference file of a specialist (see the URIs from consult_specialist). Pass path "SKILL.md" for the full instructions.',
    inputSchema: {
      type: 'object',
      properties: {
        specialist: { type: 'string', enum: specialists.map((s) => s.name) },
        path: { type: 'string', description: 'For example references/web-director.md' },
      },
      required: ['specialist', 'path'],
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: 'list_specialists',
    title: 'List the specialists',
    description: 'Lists the specialists with when to use each and when not to.',
    inputSchema: { type: 'object', additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
]

const textResult = (text, isError = false) => ({ content: [{ type: 'text', text }], isError })

function callTool(name, args) {
  const a = args !== null && typeof args === 'object' ? args : {}
  if (name === 'list_specialists') {
    return textResult(specialists.map((s) => '- ' + s.name + ': ' + s.use + ' ' + s.avoid).join('\n'))
  }
  const s = typeof a.specialist === 'string' ? find(a.specialist) : undefined
  if (name === 'consult_specialist') {
    if (s === undefined) return textResult('Unknown specialist. Use one of: ' + specialists.map((x) => x.name).join(', '), true)
    const cp = typeof a.checkpoint === 'string' && CHECKPOINTS.includes(a.checkpoint) ? a.checkpoint : undefined
    return textResult(consultText(s, cp, typeof a.request === 'string' ? a.request : undefined))
  }
  if (name === 'read_specialist_reference') {
    if (s === undefined) return textResult('Unknown specialist. Use one of: ' + specialists.map((x) => x.name).join(', '), true)
    const text = readPath(s, typeof a.path === 'string' ? a.path : '')
    return text === undefined ? textResult('No such reference for ' + s.name + '. Available: SKILL.md, ' + s.references.map((r) => r.path).join(', '), true) : textResult(text)
  }
  return undefined
}

function readPath(s, path) {
  if (path === 'SKILL.md') return s.skill
  return s.references.find((r) => r.path === path)?.text
}

function readResource(uri) {
  if (typeof uri !== 'string' || !uri.startsWith(SCHEME)) return undefined
  const rest = uri.slice(SCHEME.length)
  const slash = rest.indexOf('/')
  if (slash < 0) return undefined
  const s = find(rest.slice(0, slash))
  const text = s === undefined ? undefined : readPath(s, rest.slice(slash + 1))
  return text === undefined ? undefined : { uri, mimeType: 'text/markdown', text }
}

/** One request in, one {result} or {error} out; undefined for notifications. */
function handle(msg) {
  const { id, method } = msg
  const params = msg.params !== null && typeof msg.params === 'object' ? msg.params : {}
  const requested = params._meta?.[META_VERSION]
  const modern = typeof requested === 'string'
  const fail = (code, message, data) => ({ error: { code, message, ...(data === undefined ? {} : { data }) } })
  const done = (result) => ({
    result: modern ? { resultType: 'complete', ...result, _meta: { ...(result._meta ?? {}), [META_SERVER]: SERVER_INFO } } : result,
  })

  if (id === undefined || id === null) return undefined // notifications: initialized, cancelled, and the rest
  if (modern && requested !== MODERN) return fail(ERR.version, 'Unsupported protocol version', { supported: [MODERN], requested })

  switch (method) {
    case 'initialize': {
      const wanted = params.protocolVersion
      return done({
        protocolVersion: LEGACY.includes(wanted) ? wanted : LEGACY[0],
        capabilities: { prompts: { listChanged: false }, resources: { listChanged: false, subscribe: false }, tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions: INSTRUCTIONS,
      })
    }
    case 'server/discover':
      return done({ supportedVersions: [MODERN], capabilities: { prompts: {}, resources: {}, tools: {} }, instructions: INSTRUCTIONS })
    case 'ping':
      return done({})
    case 'prompts/list':
      return done({ prompts: promptList() })
    case 'prompts/get': {
      const s = typeof params.name === 'string' ? find(params.name) : undefined
      if (s === undefined) return fail(ERR.params, 'Unknown prompt: ' + String(params.name))
      const args = params.arguments !== null && typeof params.arguments === 'object' ? params.arguments : {}
      const cp = typeof args.checkpoint === 'string' && CHECKPOINTS.includes(args.checkpoint) ? args.checkpoint : undefined
      return done({ description: s.description, messages: [{ role: 'user', content: { type: 'text', text: consultText(s, cp, typeof args.request === 'string' ? args.request : undefined) } }] })
    }
    case 'resources/list':
      return done({ resources: resourceList() })
    case 'resources/templates/list':
      return done({ resourceTemplates: [] })
    case 'resources/read': {
      const content = readResource(params.uri)
      return content === undefined ? fail(ERR.params, 'Resource not found', { uri: params.uri }) : done({ contents: [content] })
    }
    case 'tools/list':
      return done({ tools: TOOLS })
    case 'tools/call': {
      const result = typeof params.name === 'string' ? callTool(params.name, params.arguments) : undefined
      return result === undefined ? fail(ERR.params, 'Unknown tool: ' + String(params.name)) : done(result)
    }
    default:
      return fail(ERR.method, 'Method not found: ' + String(method))
  }
}

function respond(id, outcome) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, ...outcome }) + '\n')
}

function onLine(line) {
  if (line.trim() === '') return
  let msg
  try { msg = JSON.parse(line) } catch { respond(null, { error: { code: ERR.parse, message: 'Parse error' } }); return }
  const batch = Array.isArray(msg) ? msg : [msg]
  for (const m of batch) {
    if (m === null || typeof m !== 'object' || typeof m.method !== 'string') { respond(m?.id ?? null, { error: { code: ERR.request, message: 'Invalid request' } }); continue }
    let outcome
    try { outcome = handle(m) } catch (e) { outcome = { error: { code: ERR.internal, message: 'Internal error' } }; process.stderr.write(String(e) + '\n') }
    if (outcome !== undefined) respond(m.id, outcome)
  }
}

// No process.exit on close: a pipe can still hold queued output, and the process ends by itself once stdin is closed and the
// loop is empty, which is the "exit promptly when stdin closes" the stdio transport asks for.
createInterface({ input: process.stdin }).on('line', onLine)
