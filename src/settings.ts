import { type App, PluginSettingTab, type SettingDefinitionItem } from "obsidian";
import { OllamaEmbedder, VoyageEmbedder, type Embedder } from "yami/wiki";
import type YamiWikiPlugin from "./main.js";

/** How the wiki embeds its chunks for semantic search: not at all, with Ollama on this computer, or with Voyage AI. */
export type Embeddings = "off" | "ollama" | "voyage";

export interface WikiSettings {
  embeddings: Embeddings;
  /** Where Ollama listens. */
  ollamaHost: string;
  /** The Ollama model, which the person pulled. */
  ollamaModel: string;
  /** The Voyage AI key. Stored in the plugin's data file, as any plugin setting is. */
  voyageKey: string;
  voyageModel: string;
}

export const DEFAULT_SETTINGS: WikiSettings = {
  embeddings: "off",
  ollamaHost: "http://localhost:11434",
  ollamaModel: "nomic-embed-text",
  voyageKey: "",
  voyageModel: "voyage-3.5",
};

/** Fills in settings that older versions of the plugin did not save. */
export function upgradeSettings(saved: Partial<WikiSettings> | undefined): WikiSettings {
  const settings = { ...DEFAULT_SETTINGS, ...saved };
  if (!["off", "ollama", "voyage"].includes(settings.embeddings)) settings.embeddings = "off";
  return settings;
}

/** The embedder the settings name, or nothing with embeddings off or a Voyage key missing. */
export function embedderOf(settings: WikiSettings): Embedder | undefined {
  if (settings.embeddings === "ollama") return new OllamaEmbedder({ host: settings.ollamaHost.trim() || DEFAULT_SETTINGS.ollamaHost, model: settings.ollamaModel.trim() || DEFAULT_SETTINGS.ollamaModel });
  if (settings.embeddings === "voyage" && settings.voyageKey.trim()) return new VoyageEmbedder({ apiKey: settings.voyageKey.trim(), model: settings.voyageModel.trim() || DEFAULT_SETTINGS.voyageModel });
  return undefined;
}

/** The algorithm a search runs when none is named: hybrid with an embedder, so the semantic half counts, else BM25. */
export function defaultAlgorithm(settings: WikiSettings): string {
  return embedderOf(settings) ? "hybrid" : "bm25";
}

const EMBEDDINGS: Record<Embeddings, string> = {
  off: "Off: search by words alone",
  ollama: "Ollama on this computer",
  voyage: "Voyage AI, with a key",
};

export class WikiSettingTab extends PluginSettingTab {
  constructor(
    app: App,
    private readonly plugin: YamiWikiPlugin,
  ) {
    super(app, plugin);
  }

  getSettingDefinitions(): SettingDefinitionItem[] {
    const { settings } = this.plugin;
    const problem = this.plugin.yami.wiki.embedderProblem;
    return [
      {
        name: "Embeddings",
        desc: "Semantic search finds a note by its meaning, not its words alone. Ollama runs on your computer and needs no key: install it, run ollama pull nomic-embed-text, and choose it here. Voyage AI sends the text of your notes to Voyage. Off, the wiki searches by words.",
        control: { type: "dropdown", key: "embeddings", options: EMBEDDINGS },
      },
      {
        name: "Ollama address",
        desc: "Where Ollama listens.",
        control: { type: "text", key: "ollamaHost", placeholder: DEFAULT_SETTINGS.ollamaHost },
        visible: () => this.plugin.settings.embeddings === "ollama",
      },
      {
        name: "Ollama model",
        desc: "An embedding model that Ollama has, such as nomic-embed-text or embeddinggemma. Changing the model embeds every note again.",
        control: { type: "text", key: "ollamaModel", placeholder: DEFAULT_SETTINGS.ollamaModel },
        visible: () => this.plugin.settings.embeddings === "ollama",
      },
      {
        name: "Voyage AI key",
        desc: "Your API key. Stored in this plugin's data file, in the vault's configuration folder.",
        control: { type: "text", key: "voyageKey", placeholder: "pa-…" },
        visible: () => this.plugin.settings.embeddings === "voyage",
      },
      {
        name: "Voyage AI model",
        control: { type: "text", key: "voyageModel", placeholder: DEFAULT_SETTINGS.voyageModel },
        visible: () => this.plugin.settings.embeddings === "voyage",
      },
      {
        name: "Status",
        desc: problem ? `The last search could not embed: ${problem}` : settings.embeddings === "off" ? "Search ranks by words." : "Search ranks by words and by meaning, with the hybrid algorithm.",
        searchable: false,
      },
    ];
  }

  getControlValue(key: string): unknown {
    return this.plugin.settings[key as keyof WikiSettings];
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    const { settings } = this.plugin;
    if (key === "embeddings") settings.embeddings = value as Embeddings;
    else if (key === "ollamaHost" || key === "ollamaModel" || key === "voyageKey" || key === "voyageModel") settings[key] = String(value).trim();
    await this.plugin.saveSettings();
    this.update();
  }
}
