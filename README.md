# Yami Wiki

An LLM wiki inside your Obsidian vault. Agents read your sources and draft topics with a citation on every claim. Nothing changes until you approve the plan. Every agent you run can search the wiki, so a conversation can answer from your notes.

Yami Wiki is the wiki plugin of [Yami](https://github.com/nathanaday/yami), and lives in its own repository so that the community directory can review it. It replaces [Almagest](https://github.com/nathanaday/obsidian-almagest), which is at its end of life.

## What it does

- **Ingest.** Pick a note, a file, or a folder, and the plugin captures each file as a source and starts an ingest session. The agent reads the sources in chunks, matches the subjects against the topics you have, and proposes one change plan.
- **Approve or reject.** The wiki panel lists each plan that waits for you, with what it creates, changes, and removes, and a diff for each note. Each approval saves a version before and after, so you can restore any earlier state.
- **Checkouts.** Ask for the material on a subject. The plugin puts a copy of each document in a folder with a reading list. Mark up the copies, and **Return this checkout** proposes your edits as one change.
- **Citations you can follow.** Rest the pointer on a citation, `([[DINOv2 (source)]], p. 3)`, and the passage it cites appears; click its title to open the source there. **Wiki: new verify** starts a session that reads each citation of the topics against its source and proposes the fixes.
- **Sources that stay current.** When a file you ingested changes, ingest it again: the new source supersedes the old, lint names the topics that still cite the old one, and the ingest reads only what changed and moves the citations.
- **Search, lint, versions.** Commands to search the wiki as you type, find the notes related to the open note, lint a note or the vault, take a snapshot, list the versions, and restore one. With [Ollama](https://ollama.com) on your computer, search finds notes by meaning too, with no key: see Settings.
- **The navigator.** A sidebar that walks the wiki by its tags, where `ml/vision` is below `ml`, and follows the note you read.
- **Sessions.** Each ingest and checkout is a session note. The panel shows its status, its promises, and its conversation, and runs it.

## Install

You need Obsidian 1.13 or later on the desktop, and [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (`claude`) or the [Codex CLI](https://github.com/openai/codex) (`codex`) installed and signed in. The plugin uses your own installation and login; it needs no API key of its own.

1. In Obsidian, open **Settings → Community plugins** and turn off restricted mode.
2. Select **Browse**, search for **Yami Wiki**, then select **Install** and **Enable**.

Until the plugin is in the community directory, or to run a version ahead of it, install it by hand: download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/nathanaday/yami-wiki/releases/latest), put them in `<your vault>/.obsidian/plugins/yami-wiki/`, and turn on **Yami Wiki** under **Settings → Community plugins**. [BRAT](https://github.com/TfTHacker/obsidian42-brat) can do this for you and keep the plugin up to date.

Then run **Open the wiki panel** from the command palette, or select the book in the ribbon.

## Use it

| Command | What it does |
| --- | --- |
| **Open the wiki panel** | The panel in the right sidebar: the change plans that wait for you, the wiki module, its sessions, and its problems. |
| **Open the wiki navigator** | The navigator in the right sidebar. |
| **Wiki: ingest this file**, **Wiki: ingest a folder** | Captures the file, or every file of a folder, as sources, and creates an ingest session. Open the session and **Run this session with Claude** or **with Codex**. |
| **Wiki: new checkout** | Creates a checkout session. Write your request in it, and run it. |
| **Wiki: return this checkout** | With the reading list open: proposes your edits of the copies as one change. |
| **Wiki: approve this change**, **Wiki: reject this change** | With a change document open. **Wiki: approve a change** and **Wiki: reject a change** pick one from the plans that wait. |
| **Wiki: search**, **Wiki: notes related to this note**, **Wiki: compare the algorithms**, **Wiki: match the selection** | Search and lookup. Enter opens the note, Cmd+Enter opens it in a new tab, Alt+Enter inserts a link. |
| **Wiki: lint this note**, **Wiki: lint the vault** | The findings, errors first, each with its fix. |
| **Wiki: new verify** | Creates a verify session. Name the topics in its `topics` field, or leave it empty for the topics most in need, and run it. It proposes one change with the fixes, and stamps each topic `verified`. |
| **Wiki: new figures** | Creates a figures session, which draws the figures the topics mark as missing. |
| **Wiki: take a snapshot**, **Wiki: versions**, **Wiki: restore a version** | The versions of the wiki. |
| **Run this session with Claude**, **with Codex**, **Resume this session**, **Stop this session**, **Kill this session's agent** | With a session note open. |
| **New module** | Writes a starter module in the internal folder, `internal/<name>/`, which you define in markdown. See the [Yami README](https://github.com/nathanaday/yami#bring-your-own-skills). |

The agents use your own Claude Code and Codex setup: your instructions, skills, plugins, MCP servers, and permission rules. In a session, the agent gets the wiki tools (`wiki_search`, `wiki_match`, `wiki_citations`, `wiki_change`, …) and the wiki skills (`/wiki:ingest`, `/wiki:checkout`, `/wiki:verify`, …).

## Settings

| Setting | What it does |
| --- | --- |
| **Embeddings** | Off: search ranks by words. **Ollama on this computer**: search also ranks by meaning, with a model Ollama runs on your machine; install [Ollama](https://ollama.com), run `ollama pull nomic-embed-text`, and choose it. **Voyage AI, with a key**: the same through Voyage AI, which gets the text of your notes. The address, the model, and the key have fields of their own. A change takes effect at the next search; the first search embeds every note, which takes a moment. |
| **Folders** | Where the wiki is (default `wiki`), and where the modules keep what they need (default `internal`). Type another folder, such as `library/wiki`, and choose **Move the folders**: the folders move with every link into them, and you reload Obsidian. A folder whose name starts with a dot is refused, because Obsidian hides it, and its notes and links would stop working. The choice is kept in `.yami.json` at the vault's root, so Duet, Yami Threads, and the Yami Wiki plugin for Claude Code and Codex use the same folders. A change plan that waits for approval holds the wiki in place until you approve or reject it. |

## What it adds to your vault

- **Folders.** `wiki/topics/` and `wiki/sources/`, the knowledge base, which you read. `internal/wiki/` holds the module's document, its ledger (`sessions.base`), its policies, promises, skills, and agents, its sessions, its change documents, its snapshots, and the frozen copies of the sources. `conversations/` holds the conversation note of each run. These are the default folders; the **Folders** setting moves the first two.
- **Files.** `internal/yami/skills/run/SKILL.md`, the base skill of every run. A file that you edited is never overwritten. Nothing is written at the vault's root, except `.yami.json` once you move a folder.
- **Folder colors.** The wiki's folder is cyan in the file explorer, the internal folder gray.
- **A status bar item** that says which agents work.

## With Duet and Yami Threads

[Duet](https://github.com/nathanaday/obsidian-duet) is the conversation plugin: mentions and conversation notes. [Yami Threads](https://github.com/nathanaday/yami-threads) holds the threads workflow. Each plugin runs on its own Yami, and all three can be on in one vault: each keeps its own conversation notes, by the note's `plugin` property. The known costs of two Yami plugins in one vault are in the [library README](https://github.com/nathanaday/yami/blob/main/yami/README.md#two-yami-plugins-in-one-vault). Keep the plugins at the same version of `yami`.

## Network use and privacy

The plugin does not connect to the internet itself. It starts Claude Code or Codex on your computer, which send your requests and the notes they read to Anthropic or OpenAI. With embeddings set to Ollama, it sends the text of your notes to Ollama on your own computer, at the address in the settings; with Voyage AI, to Voyage AI with your key. The plugin reads your environment variables and your home folder to find and start the agents, as a terminal does, and sends nothing anywhere. The plugin collects no data.

## Development

```sh
npm install                 # takes yami from the release that package.json names
npm run dev                 # rebuilds main.js and styles.css on every change
npm run install:vault -- /path/to/vault   # builds, and copies the plugin into the vault
```

For a live vault, link this folder into `.obsidian/plugins/yami-wiki` once, then `npm run dev`; reload Obsidian, or turn the plugin off and on, to load a build.

| Command | What it does |
| --- | --- |
| `npm run build` | Type-checks the plugin and its tests, and writes a minified `main.js` and `styles.css`. |
| `npm run lint` | Runs Obsidian's review rules, as the community scan runs them, with no warning allowed. |
| `npm test` | The unit tests: the version files agree, and the Hello vault module runs through a review with the library's test kit. |
| `npm run test:obsidian` | Starts a separate Obsidian with a temporary vault, installs the built plugin, and drives it with real agents: the wiki commands, a checkout, the proposals in the panel, the hello module, conversations, the panel, and the navigator. Your own Obsidian and vaults are not touched. Build the plugin first. |

To take a new library, change the URL of `yami` in `package.json` and run `npm install`. Work happens on `main`: a version bump there is a release. See [docs/releasing.md](https://github.com/nathanaday/yami/blob/main/docs/releasing.md) in the yami repository.

## License

[MIT](LICENSE)
