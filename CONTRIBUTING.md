# Contributing

Thanks for helping. This repo is a set of portable agent skills: plain Markdown instructions plus a few small Node scripts. You need Git and Node 22 or newer. Nothing else.

## Run it locally

```bash
git clone https://github.com/PantherHale/qurn-skills
cd qurn-skills
./install.sh claude --project     # Windows: ./install.ps1 -Agent claude -Project
```

`--project` installs into the current folder only, so it does not touch your global skills.

## How the repo fits together

- `skills/<name>/SKILL.md` is the source of truth for each skill, with its `references/` next to it.
- `flatten/<name>.prompt.md` is generated from the skill, for models with no skill loader. **Do not edit these by hand.**
- `commands/`, `adapters/` and `mcp/` wire the skills into each client.

## Before you open a pull request

```bash
node --test scripts/build-flatten.test.mjs     # unit tests
node scripts/build-flatten.mjs                 # regenerate flatten/ after editing a skill
node scripts/build-flatten.mjs --check         # must print OK: CI runs this
```

Then open a pull request that says what you changed, why, and how you checked it. CI runs the same commands on Linux and Windows.

## What makes a good change

- **One thing per pull request.** A fix, a new reference, or a wording change, not all three.
- **Cite sources** for any fact you add to a reference, and say how sure the source is. If you could not verify something, mark it "to verify" rather than stating it as true.
- **No secrets, personal paths or private project names** in any file.
- Keep skills self-contained: a skill must work without any other skill installed.

## Reporting bugs and asking questions

Use the issue templates for bugs and feature requests. For questions, open a Discussion if they are enabled, otherwise an issue labelled `question`.
