import { describe, expect, it, vi } from "vitest";

// The obsidian package is types alone; the tab's base class is a stand-in here.
vi.mock("obsidian", () => ({ Notice: class {}, PluginSettingTab: class {} }));

import { OllamaEmbedder, VoyageEmbedder } from "yami/wiki";
import { DEFAULT_SETTINGS, defaultAlgorithm, embedderOf, folderMove, upgradeSettings } from "../../src/settings.js";

describe("the embeddings setting", () => {
  it("fills in what an older plugin did not save, and refuses a value it does not know", () => {
    expect(upgradeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
    expect(upgradeSettings({ embeddings: "ollama", ollamaModel: "embeddinggemma" })).toEqual({ ...DEFAULT_SETTINGS, embeddings: "ollama", ollamaModel: "embeddinggemma" });
    expect(upgradeSettings({ embeddings: "cloud" as never }).embeddings).toBe("off");
  });

  it("names the embedder the settings choose, and the algorithm follows", () => {
    expect(embedderOf(DEFAULT_SETTINGS)).toBeUndefined();
    expect(defaultAlgorithm(DEFAULT_SETTINGS)).toBe("bm25");
    const ollama = embedderOf({ ...DEFAULT_SETTINGS, embeddings: "ollama", ollamaHost: " http://box:11434/ ", ollamaModel: "" });
    expect(ollama).toBeInstanceOf(OllamaEmbedder);
    expect(ollama).toMatchObject({ id: "ollama:nomic-embed-text", host: "http://box:11434" });
    expect(defaultAlgorithm({ ...DEFAULT_SETTINGS, embeddings: "ollama" })).toBe("hybrid");
    // Voyage without a key is no embedder.
    expect(embedderOf({ ...DEFAULT_SETTINGS, embeddings: "voyage" })).toBeUndefined();
    expect(defaultAlgorithm({ ...DEFAULT_SETTINGS, embeddings: "voyage" })).toBe("bm25");
    const voyage = embedderOf({ ...DEFAULT_SETTINGS, embeddings: "voyage", voyageKey: "pa-x" });
    expect(voyage).toBeInstanceOf(VoyageEmbedder);
    expect(voyage).toMatchObject({ id: "voyage:voyage-3.5" });
  });
});

describe("the folders setting", () => {
  const current = { internal: "internal", wiki: "wiki" };

  it("says nothing moves for the folders as they are, and what moves for others", () => {
    expect(folderMove(current, { internal: "internal", wiki: " wiki/ " })).toEqual({ moves: [] });
    expect(folderMove(current, { internal: "system", wiki: "library/wiki" })).toEqual({ moves: ["wiki/ to library/wiki/", "internal/ to system/"] });
  });

  it("refuses a hidden folder and folders that overlap", () => {
    expect(folderMove(current, { internal: ".internal", wiki: "wiki" }).problem).toMatch(/Obsidian hides a folder/);
    expect(folderMove(current, { internal: "library", wiki: "library/wiki" }).problem).toMatch(/must be apart/);
  });
});
