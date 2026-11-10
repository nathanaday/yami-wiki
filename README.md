# Yami Wiki

An LLM wiki inside your Obsidian vault. You hand it papers, slides, and notes; agents read them and draft pages in which every claim cites its source. Nothing in the wiki changes until you approve the plan.

Yami Wiki runs on the [yami](https://github.com/nathanaday/yami) library and replaces the [Almagest plugin](https://github.com/nathanaday/obsidian-almagest), which is at its end of life. To give the same wiki to Claude Code or Codex outside Obsidian, use [Yami Wiki for Claude Code and Codex](https://github.com/nathanaday/yami-wiki-agent-plugin).

## What It Does

- **Ingest.** Point it at a file or a folder. The plugin saves a frozen copy of each file as a source, and an agent reads the sources in chunks, matches each subject against the pages you have, and proposes one change plan.
- **Approve.** The wiki panel shows each plan that waits for you: what it creates, changes, and removes, with a diff for each note. Each approval saves a version, so you can restore any earlier state of the wiki.
- **Citations you can follow.** Rest the pointer on a citation such as `([[DINOv2 (source)]], p. 3)` and the cited passage appears; click its title to open the source at that place. A verify session reads each citation against its source and proposes fixes.
- **Pages of a template.** Each page is a kind of article: a topic, an event, a glossary, a list, a portal, a timeline, or a stub to write later. Its template, a note you can edit, says which properties and sections the page has, and how the agent writes it. Add templates of your own, such as a person or a recipe.
- **Sources that change.** Ingest an edited file again and the agent reads only the changed passages, then moves the citations to the new copy. Lint names the pages that still cite the old one.
- **Search.** Search by words out of the box, or by meaning too with [Ollama](https://ollama.com) on your computer or a Voyage AI key.
- **Checkouts.** Ask for the material on a subject and get a reading list with a copy of each document. Mark up the copies, and returning the checkout applies your edits as one change.
- **The navigator.** A sidebar that walks the wiki by its tags (`ml/vision` sits below `ml`) and follows the note you have open.
- **Bundles and figures.** Export the pages around a subject for another vault, import a bundle, and have an agent draw the figures that pages mark as missing.

Yami Wiki has no conversations of its own. An agent works on the wiki in one of three ways:

- **A command.** Run an ingest, a checkout, a verify, or a figures session from the command palette (Cmd+P or Ctrl+P), as [Commands](#commands) lists.
- **[Duet](https://github.com/nathanaday/obsidian-duet)**, the conversation plugin. Its agents have the wiki tools and skills, so a conversation in a note can answer from the wiki, with citations you can check, or start an ingest.
- **[Yami Wiki for Claude Code and Codex](https://github.com/nathanaday/yami-wiki-agent-plugin)**, which gives the wiki tools and skills to an agent outside the vault.

## Requirements

- Obsidian 1.13 or later, on the desktop.
- [Claude Code](https://code.claude.com/docs/en/overview) (`claude`) or the [Codex CLI](https://github.com/openai/codex) (`codex`), installed and signed in. The plugin starts your own installation, with your instructions, skills, MCP servers, and permission rules; it needs no API key of its own.
- On Linux, Claude Code needs `bubblewrap` for the sessions that only read (ingest, verify, figures, import), because they run in Claude Code's sandbox. On macOS the sandbox needs nothing extra.
- Optional, for search by meaning: Ollama with an embedding model, or a Voyage AI key.

## Install

Yami Wiki is not in the community plugin directory yet. Install it from a release:

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/nathanaday/yami-wiki/releases/latest).
2. Put them in `<your vault>/.obsidian/plugins/yami-wiki/`.
3. In Obsidian, turn on **Yami Wiki** under **Settings → Community plugins**.

[BRAT](https://github.com/TfTHacker/obsidian42-brat) can install it from `nathanaday/yami-wiki` and keep it up to date.

## Your First Ingest

1. Open a note or a PDF you want the wiki to learn from, and run **Wiki: ingest this file** from the command palette. The plugin creates an ingest session and opens it.
2. Run **Run this session with Claude** (or **with Codex**). The agent reads the source, drafts pages, and stops once it has proposed a change plan.
3. Select the book icon in the ribbon to open the wiki panel. Read the plan and its diffs, then approve or reject it. On approval, the pages appear in `wiki/pages/` and the source in `wiki/sources/`.
4. To ask a question about the source, start a conversation in [Duet](https://github.com/nathanaday/obsidian-duet), or ask Claude Code or Codex with [Yami Wiki for Claude Code and Codex](https://github.com/nathanaday/yami-wiki-agent-plugin). The agent searches the wiki and answers with citations.

## Pages and Templates

Every page of the wiki has a `type` that names its template:

| Template | For |
| --- | --- |
| `topic` | One subject, an idea or a named thing. The page that no other template fits. |
| `event` | A dated happening that is a subject in itself, such as a conference or a release. It has a `date`. |
| `glossary` | The terms of one subject, each a heading you can link to, with a short definition. |
| `list` | The members of a set that one rule defines, such as the devices a product supports. |
| `portal` | The entrance to the pages of one tag, grouped and linked, with no claims of its own. |
| `timeline` | The history of one subject as dated entries, oldest first. |
| `stub` | A subject to write later, before its kind of page is known. It becomes any other template. |

The templates are notes in `internal/wiki/templates/`. Each says when to use it, what properties and sections its pages have, and how to write each section; the agents read it before they write a page. Edit one to change what the wiki asks of its pages, or run **Wiki: new template** to add your own, such as a `person` with a `born` date. Lint warns when a page lacks a section of its template or a property it requires, and lists the stubs that wait. A wiki from an earlier version keeps its pages: the plugin moves `wiki/topics/` to `wiki/pages/` at the first start, with every link into it.

## Commands

| Command | What it does |
| --- | --- |
| **Open the wiki panel**, **Open the wiki navigator** | Open the panel (change plans, sessions, problems) or the navigator in the right sidebar. |
| **Wiki: ingest this file**, **Wiki: ingest a folder** | Save the files as sources and create an ingest session. |
| **Wiki: approve this change**, **Wiki: reject this change** | Act on the change note you have open. **Wiki: approve a change** and **Wiki: reject a change** pick one from the list. |
| **Wiki: search**, **Wiki: notes related to this note**, **Wiki: match the selection**, **Wiki: compare the algorithms** | Find notes. In the results, Enter opens a note, Cmd+Enter opens it in a new tab, and Alt+Enter inserts a link. |
| **Wiki: lint this note**, **Wiki: lint the vault** | List problems such as dead links and outdated citations, errors first, each with its fix. |
| **Wiki: new checkout**, **Wiki: return this checkout** | Create a checkout session (write your request in it, then run it), and later return your edits of the copies. |
| **Wiki: new page**, **Wiki: new template** | Create a page from a template you pick, with its sections ready to fill, or a template of your own. |
| **Wiki: new verify** | Create a session that checks each citation against its source. Name pages in its `pages` field, or leave it empty for the pages most in need. |
| **Wiki: new figures** | Create a session that draws the figures that pages mark as missing. |
| **Wiki: export a page**, **Wiki: import a bundle** | Write the pages around a subject, with their sources, to a folder; read such a folder, a path, or a GitHub URL back in. |
| **Wiki: take a snapshot**, **Wiki: versions**, **Wiki: restore a version**, **Wiki: rebuild the index** | Manage the versions of the wiki and its search index. |
| **Run this session with Claude** (or **with Codex**), **Resume this session**, **Stop this session**, **Kill this session's agent** | Control the session note you have open. |
| **Protect the selected text**, **Unprotect the selected text**, **Toggle editing of protected text** | Mark text that no agent may change. |
| **New module** | Create a module of your own, defined in markdown in the internal folder, `internal/<name>/`. See [Bring Your Own Skills](https://github.com/nathanaday/yami#bring-your-own-skills). |

Inside a session, the agent gets the wiki tools (`wiki_search`, `wiki_match`, `wiki_templates`, `wiki_citations`, `wiki_change`, and more) and the wiki skills (`/wiki:ingest`, `/wiki:checkout`, `/wiki:verify`, and more).

## Settings

| Setting | What it does |
| --- | --- |
| **Embeddings** | **Off** (the default): search ranks by words. **Ollama on this computer**: search also ranks by meaning, with a model Ollama runs locally and no key; install Ollama and run `ollama pull nomic-embed-text`. **Voyage AI, with a key**: the same through Voyage AI, which receives the text of your notes. |
| **Ollama address**, **Ollama model** | Where Ollama listens (default `http://localhost:11434`) and which embedding model to use (default `nomic-embed-text`). Changing the model embeds every note again. |
| **Voyage AI key**, **Voyage AI model** | Your key, stored in the plugin's data file in the vault's configuration folder, and the model (default `voyage-3.5`). |
| **Wiki folder**, **Internal folder** | Where the wiki is (default `wiki`), and where the modules keep what they need (default `internal`). Type another folder, such as `library/wiki`, and choose **Move the folders**. |

A change of the embeddings takes effect at the next search. The setting tab shows a status line, with the error when the last search could not embed.

**Move the folders** moves them with every link into them, and then you reload Obsidian. A folder whose name starts with a dot is refused, because Obsidian hides it and its notes and links would stop working. The choice is kept in `.yami.json` at the vault's root, so Duet, Yami Threads, and Yami Wiki for Claude Code and Codex use the same folders. A change plan that waits for approval holds the wiki in place until you approve or reject it.

## What It Adds to Your Vault

- `wiki/pages/` and `wiki/sources/`: the wiki itself, for you to read.
- `internal/wiki/templates/`: one folder for each template of the pages, `topic`, `event`, `glossary`, `list`, `portal`, `stub`, `timeline`, and `source`, with its `TEMPLATE.md`. Edit them, or add your own beside them with **Wiki: new template**. A template you delete comes back at the next start.
- `internal/wiki/`: the sessions, change notes, versions, frozen copies of the sources, and the policies, skills, and agents the sessions use. `internal/wiki/sessions.base` lists them, and the stubs that wait to be written.
- `conversations/`: a note that records each run of a session.
- `internal/yami/skills/run/SKILL.md`, the skill every run starts with.

These are the default folders; the **Wiki folder** and **Internal folder** settings move them. Nothing is written at the vault's root, except `.yami.json` once you move a folder. The plugin never overwrites a file you edited. It also colors the wiki's folder cyan and the internal folder gray in the file explorer, and adds a status bar item that shows which agents are working.

## Network Use and Privacy

The plugin starts Claude Code or Codex on your computer, and they send your requests and the notes they read to Anthropic or OpenAI. With embeddings set to Ollama, the plugin sends the text of your notes to Ollama at the address in the settings, on your own computer by default. With Voyage AI, the plugin sends the text of your notes to `api.voyageai.com` with your key. **Wiki: import a bundle** with a repository URL clones it with your own `git`. Apart from these, the plugin makes no network requests and collects no data. It reads your environment variables and your home folder to find and start the agents, as a terminal does.

## With Duet and Yami Threads

[Duet](https://github.com/nathanaday/obsidian-duet) adds conversations with mentions in your notes; Yami Wiki leaves conversations to it. [Yami Threads](https://github.com/nathanaday/yami-threads) carries work on your repositories from an idea to a validated close. All three can run in one vault. Each runs its own agents, and the notes that record a run stay with the plugin that ran it. Keep them on the same version of `yami`, or the older plugin reports the newer shared files as your edits. The [library README](https://github.com/nathanaday/yami/blob/main/yami/README.md#two-yami-plugins-in-one-vault) lists what else to know.

## Development

```sh
npm install                                 # takes yami from the release that package.json names
npm run dev                                 # rebuilds main.js and styles.css on every change
npm run install:vault -- /path/to/vault     # builds, and copies the plugin into the vault
```

For a live vault, link this folder into `.obsidian/plugins/yami-wiki` once and run `npm run dev`. Reload Obsidian, or turn the plugin off and on, to load a build.

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks the plugin and its tests, and writes a minified `main.js` and `styles.css`. |
| `npm run lint` | Runs Obsidian's review rules, as the community scan runs them, with no warning allowed. |
| `npm test` | Unit tests: the version files agree, the embeddings setting, and a sample vault module run through a review. |
| `npm run test:obsidian` | Starts a separate Obsidian with a temporary vault, installs the built plugin, and drives it with real agents. Your own Obsidian and vaults are untouched. Build first. |

To move to a new library version, change the `yami` URL in `package.json` and run `npm install`. Work happens on `main`, and CI runs the type check, lint, tests, and build on every push and pull request. A version bump in `manifest.json` on `main` publishes a release; see [releasing](https://github.com/nathanaday/yami/blob/main/docs/releasing.md) in the yami repository.

## License

[MIT](LICENSE)
