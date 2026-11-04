import { Plugin } from "obsidian";
import { ClaudeAgent } from "yami/agent/claude";
import { CodexAgent } from "yami/agent/codex";
import { createYami, NAVIGATOR_VIEW, PANEL_VIEW, revealView, WikiNavigator, YamiPanel, type ObsidianYami } from "yami/obsidian";
import { defaultAlgorithm, embedderOf, upgradeSettings, WikiSettingTab, type WikiSettings } from "./settings.js";

/**
 * The wiki plugin: the library's wiki module, with the panel and the navigator over it. Threads is left to
 * the threads plugin, and the conversation commands to Duet when it is on; this plugin still runs its own
 * agents for the wiki's sessions. `app.plugins.getPlugin("yami-wiki").yami` is the Yami, for the console.
 */
export default class YamiWikiPlugin extends Plugin {
  yami!: ObsidianYami;
  declare settings: WikiSettings;

  async onload() {
    this.settings = upgradeSettings(((await this.loadData()) ?? {}) as Partial<WikiSettings>);
    this.yami = createYami(this, {
      agents: [new ClaudeAgent(), new CodexAgent()],
      threads: false,
      // The default algorithm follows the setting: hybrid once an embedder is on, so a changed setting needs no reload.
      wiki: { embedder: embedderOf(this.settings), defaultAlgorithm: () => defaultAlgorithm(this.settings) },
    });
    this.addSettingTab(new WikiSettingTab(this.app, this));

    this.registerView(PANEL_VIEW, (leaf) => new YamiPanel(leaf, this.yami, { name: "Wiki", icon: "book-open" }));
    this.addRibbonIcon("book-open", "Open the wiki panel", () => void revealView(this.app, PANEL_VIEW));
    this.addCommand({ id: "open-panel", name: "Open the wiki panel", callback: () => void revealView(this.app, PANEL_VIEW) });

    this.registerView(NAVIGATOR_VIEW, (leaf) => new WikiNavigator(leaf, this.yami));
    this.addCommand({ id: "open-wiki-navigator", name: "Open the wiki navigator", callback: () => void revealView(this.app, NAVIGATOR_VIEW) });
  }

  /** Saves the settings, and gives the wiki the embedder they name, so the next search uses it. */
  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.yami.wiki.setEmbedder(embedderOf(this.settings));
  }
}
