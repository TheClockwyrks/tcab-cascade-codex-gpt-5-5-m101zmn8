import { describe, expect, it } from "vitest";
import type { InitApi, UpdateApi } from "@clockwyrks/simple-2d";
import { CUES, DECK_SIZE, LAUNCH_INTERVAL } from "./constants";
import { game } from "./game";
import type { CascadeDebugApi, CascadeState, Suit } from "./game";

function init(): [CascadeState, CascadeDebugApi] {
  const api = {
    input: {
      register: () => undefined,
      layout: () => null,
    },
    audio: {
      define: () => undefined,
      load: async () => undefined,
    },
    assets: {
      loadImage: async () => {
        throw new Error("unused");
      },
      loadAudio: async () => {
        throw new Error("unused");
      },
      load: async () => new Blob(),
      resolve: (path: string) => path,
    },
    diagnostics: {
      register: () => undefined,
    },
    events: {
      on: () => () => undefined,
    },
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }),
  } satisfies InitApi<CascadeState>;
  return game.initialize(api) as [CascadeState, CascadeDebugApi];
}

function updateApi(played: string[] = [], muted = false): UpdateApi {
  let isMuted = muted;
  return {
    input: {
      value: () => 0,
      pressed: () => false,
      pointer: () => ({
        x: 0,
        y: 0,
        down: false,
        device: "mouse",
        buttons: [],
      }),
      pointerPressed: () => false,
      pointerReleased: () => false,
      pointerSamples: () => [],
      pointerContacts: () => [],
      wheel: () => ({ x: 0, y: 0 }),
    },
    audio: {
      play: (cue) => {
        played.push(cue);
      },
      loop: () => undefined,
      stop: () => undefined,
      looping: () => false,
      setMuted: (next) => {
        isMuted = next;
      },
      muted: () => isMuted,
    },
    frame: () => ({ count: 0, timeMs: 0, lastDeltaMs: 0 }),
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }),
  };
}

function add(
  state: CascadeState,
  debug: CascadeDebugApi,
  pile: "stock" | "waste" | "foundation" | "tableau",
  index: number,
  suit: Suit,
  rank: number,
  faceUp = true,
): CascadeState {
  return debug.addCard(state, pile, index, suit, rank, faceUp);
}

describe("Cascade rules", () => {
  it("deals 28 tableau cards, 24 stock cards, and one face-up card per column", () => {
    const [state, debug] = init();
    const dealt = debug.deal(state);
    const snapshot = debug.snapshot(dealt);

    expect(snapshot.stock).toHaveLength(24);
    expect(snapshot.waste).toHaveLength(0);
    expect(snapshot.foundations.flat()).toHaveLength(0);
    expect(snapshot.tableau.map((pile) => pile.length)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(
      snapshot.tableau.map((pile) => pile.filter((c) => c.faceUp).length),
    ).toEqual([1, 1, 1, 1, 1, 1, 1]);
    expect(
      new Set(
        [...snapshot.stock, ...snapshot.tableau.flat()].map((card) => card.id),
      ).size,
    ).toBe(DECK_SIZE);
  });

  it("turns draw-three sets and recycles waste back to stock", () => {
    const [state, debug] = init();
    let s = add(state, debug, "stock", 0, "spades", 1, false);
    s = add(s, debug, "stock", 0, "hearts", 2, false);
    s = add(s, debug, "stock", 0, "clubs", 3, false);
    s = add(s, debug, "stock", 0, "diamonds", 4, false);

    s = debug.turnStock(s);
    let snapshot = debug.snapshot(s);
    expect(snapshot.stock).toHaveLength(1);
    expect(snapshot.waste.map((card) => card.rank)).toEqual([4, 3, 2]);
    expect(snapshot.wasteSets).toEqual([3]);
    expect(snapshot.wasteVisibleCount).toBe(3);

    s = debug.turnStock(s);
    snapshot = debug.snapshot(s);
    expect(snapshot.stock).toHaveLength(0);
    expect(snapshot.waste.map((card) => card.rank)).toEqual([4, 3, 2, 1]);
    expect(snapshot.wasteSets).toEqual([3, 1]);

    s = debug.turnStock(s);
    snapshot = debug.snapshot(s);
    expect(snapshot.stock.map((card) => card.rank)).toEqual([1, 2, 3, 4]);
    expect(snapshot.waste).toHaveLength(0);
    expect(snapshot.wasteSets).toEqual([]);
  });

  it("moves legal tableau runs and flips the newly exposed card", () => {
    const [state, debug] = init();
    let s = add(state, debug, "tableau", 0, "spades", 9, false);
    s = add(s, debug, "tableau", 0, "hearts", 8);
    s = add(s, debug, "tableau", 1, "clubs", 9);

    const [moved, accepted] = debug.move(s, "tableau", 0, 1, "tableau", 1);
    const snapshot = debug.snapshot(moved);

    expect(accepted).toBe(true);
    expect(snapshot.tableau[0][0].faceUp).toBe(true);
    expect(snapshot.tableau[1].map((card) => card.rank)).toEqual([9, 8]);
  });

  it("sends a playable card home and updates waste set memory", () => {
    const [state, debug] = init();
    let s = add(state, debug, "waste", 0, "hearts", 1);
    s = debug.addWasteSet(s, 1);

    const [moved, accepted] = debug.autoMove(s, "waste", 0);
    const snapshot = debug.snapshot(moved);

    expect(accepted).toBe(true);
    expect(snapshot.waste).toHaveLength(0);
    expect(snapshot.wasteSets).toEqual([]);
    expect(snapshot.foundations.flat().map((card) => card.rank)).toEqual([1]);
  });

  it("launches the first victory card on the first cascade frame", () => {
    const [state, debug] = init();
    let s = debug.clearTable(state);
    for (const suit of ["spades", "hearts", "diamonds", "clubs"] as const) {
      const foundation = { spades: 0, hearts: 1, diamonds: 2, clubs: 3 }[suit];
      for (let rank = 1; rank <= 13; rank += 1) {
        s = add(s, debug, "foundation", foundation, suit, rank);
      }
    }
    s = debug.setScreen(s, "won");
    s = debug.setLaunchClock(s, LAUNCH_INTERVAL);
    const played: string[] = [];
    const next = game.update(s, updateApi(played), 1 / 60);
    const snapshot = debug.snapshot(next);

    expect(snapshot.launched).toBe(1);
    expect(snapshot.flyers).toHaveLength(1);
    expect(snapshot.foundations[0]).toHaveLength(12);
    expect(played).toContain(CUES.launch);
  });
});
