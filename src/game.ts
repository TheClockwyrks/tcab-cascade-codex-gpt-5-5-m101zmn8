import type {
  Game,
  InitApi,
  PointerSample,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  BOUNCE_DAMP,
  CARD_H,
  CARD_W,
  CASCADE_DEBUG_VERSION,
  COLUMN_BOTTOM_LIMIT,
  COLUMN_X,
  CUES,
  DEAL_MODE,
  DEAL_MODE_LABEL,
  DECK_SIZE,
  DOUBLE_CLICK_SLOP,
  DOUBLE_CLICK_WINDOW,
  DRAG_THRESHOLD,
  FACE_DOWN_OFFSET,
  FACE_UP_OFFSET,
  FACE_UP_OFFSET_MIN,
  FLOOR_Y,
  FOUNDATION_COUNT,
  FOUNDATION_X,
  GRAVITY,
  HOWTO_BACK_LABEL,
  HUD_H,
  HUD_ITEMS,
  HUD_Y,
  LAUNCH_INTERVAL,
  LAUNCH_VX_MAX,
  LAUNCH_VX_MIN,
  LAUNCH_VY,
  MENU_BACK,
  MENU_BINDINGS,
  MENU_CONFIRM,
  MENU_DOWN,
  MENU_UP,
  RANK_MAX,
  RANK_MIN,
  STAGE_H,
  STAGE_W,
  STOCK_X,
  SUITS,
  TABLEAU_COLUMNS,
  TABLEAU_Y,
  TAGLINE_TEXT,
  TITLE_ITEMS,
  TITLE_TEXT,
  TOP_ROW_Y,
  TURN_COUNT,
  WASTE_FAN,
  WASTE_X,
  WIN_TEXT,
} from "./constants";

export type Screen = "title" | "howto" | "playing" | "won";
export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type PileKind = "stock" | "waste" | "foundation" | "tableau";

export interface CardState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly faceUp: boolean;
}

export interface DragState {
  readonly cards: readonly CardState[];
  readonly fromPile: "waste" | "foundation" | "tableau";
  readonly fromIndex: number;
  readonly x: number;
  readonly y: number;
}

export interface DropTargetState {
  readonly pile: "foundation" | "tableau";
  readonly index: number;
}

export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
}

export interface PressState {
  readonly x: number;
  readonly y: number;
  readonly at: number;
}

export interface FlyerState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
}

export interface CascadeState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly stock: readonly CardState[];
  readonly waste: readonly CardState[];
  readonly wasteSets: readonly number[];
  readonly foundations: readonly (readonly CardState[])[];
  readonly tableau: readonly (readonly CardState[])[];
  readonly drag: DragState | null;
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly nextId: number;
  readonly simTime: number;
  readonly muted: boolean;
}

type CardSnapshot = CardState & { readonly color: "red" | "black" };

export interface CascadeSnapshot {
  readonly version: number;
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly dealMode: string;
  readonly turnCount: number;
  readonly dealModeLabel: string;
  readonly muted: boolean;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly stock: readonly CardSnapshot[];
  readonly waste: readonly CardSnapshot[];
  readonly wasteSets: readonly number[];
  readonly wasteVisibleCount: number;
  readonly foundations: readonly (readonly CardSnapshot[])[];
  readonly tableau: readonly (readonly CardSnapshot[])[];
  readonly drag: null | {
    readonly cards: readonly CardSnapshot[];
    readonly fromPile: "waste" | "foundation" | "tableau";
    readonly fromIndex: number;
    readonly x: number;
    readonly y: number;
  };
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly simTime: number;
}

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface CascadeDebugApi {
  readonly version: number;
  reset(state: DeepReadonly<CascadeState>): CascadeState;
  snapshot(state: DeepReadonly<CascadeState>): CascadeSnapshot;
  reconcile(state: DeepReadonly<CascadeState>): CascadeState;
  menuItemRect(state: DeepReadonly<CascadeState>, index: number): Rect | null;
  setScreen(state: DeepReadonly<CascadeState>, screen: Screen): CascadeState;
  setMenuIndex(state: DeepReadonly<CascadeState>, index: number): CascadeState;
  setTitleIndex(state: DeepReadonly<CascadeState>, index: number): CascadeState;
  addCard(
    state: DeepReadonly<CascadeState>,
    pile: PileKind,
    index: number,
    suit: Suit,
    rank: number,
    faceUp: boolean,
  ): CascadeState;
  removeCard(state: DeepReadonly<CascadeState>, id: number): CascadeState;
  setCardFaceUp(
    state: DeepReadonly<CascadeState>,
    id: number,
    faceUp: boolean,
  ): CascadeState;
  clearPile(
    state: DeepReadonly<CascadeState>,
    pile: PileKind,
    index: number,
  ): CascadeState;
  clearTable(state: DeepReadonly<CascadeState>): CascadeState;
  addWasteSet(state: DeepReadonly<CascadeState>, count: number): CascadeState;
  clearWasteSets(state: DeepReadonly<CascadeState>): CascadeState;
  deal(state: DeepReadonly<CascadeState>): CascadeState;
  turnStock(state: DeepReadonly<CascadeState>): CascadeState;
  move(
    state: DeepReadonly<CascadeState>,
    fromPile: PileKind,
    fromIndex: number,
    fromRow: number,
    toPile: PileKind,
    toIndex: number,
  ): [CascadeState, boolean];
  autoMove(
    state: DeepReadonly<CascadeState>,
    pile: PileKind,
    index: number,
  ): [CascadeState, boolean];
  pointerDown(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerMove(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerUp(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  setAutoFlip(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setWinDetect(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setLaunching(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setTrailPainting(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  addFlyer(
    state: DeepReadonly<CascadeState>,
    suit: Suit,
    rank: number,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ): CascadeState;
  setFlyerPosition(
    state: DeepReadonly<CascadeState>,
    id: number,
    x: number,
    y: number,
  ): CascadeState;
  setFlyerVelocity(
    state: DeepReadonly<CascadeState>,
    id: number,
    vx: number,
    vy: number,
  ): CascadeState;
  removeFlyer(state: DeepReadonly<CascadeState>, id: number): CascadeState;
  clearFlyers(state: DeepReadonly<CascadeState>): CascadeState;
  setLaunchClock(
    state: DeepReadonly<CascadeState>,
    seconds: number,
  ): CascadeState;
  clearTrail(state: DeepReadonly<CascadeState>): CascadeState;
  drawLaunchVx(): number;
}

type MoveResult = {
  readonly state: CascadeState;
  readonly accepted: boolean;
  readonly cues: readonly string[];
};

type PointerResult = {
  readonly state: CascadeState;
  readonly cues: readonly string[];
};

type CardLocation = {
  readonly pile: PileKind;
  readonly index: number;
  readonly row: number;
  readonly card: CardState;
};

type MutableCascadeState = {
  -readonly [K in keyof CascadeState]: CascadeState[K];
};

export const BACKGROUND = "#18533f";

const FELT = "#18533f";
const FELT_DARK = "#0f3a2d";
const FELT_LIGHT = "#287258";
const PANEL = "rgba(8, 24, 20, 0.74)";
const PANEL_SOLID = "#12372d";
const GOLD = "#f3c766";
const CREAM = "#fff7de";
const RED = "#c73336";
const BLACK = "#20252b";
const BLUE = "#2f69a8";
const CARD_FACE = "#fffaf0";
const CARD_EDGE = "#25332f";
const SLOT = "rgba(255, 255, 255, 0.18)";
const SLOT_EDGE = "rgba(255, 255, 255, 0.36)";
const HIGHLIGHT = "rgba(243, 199, 102, 0.44)";
const SHADOW = "rgba(0, 0, 0, 0.32)";
const FONT =
  "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif";

function mutableState(state: DeepReadonly<CascadeState>): MutableCascadeState {
  return {
    screen: state.screen,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    stock: [...state.stock],
    waste: [...state.waste],
    wasteSets: [...state.wasteSets],
    foundations: state.foundations.map((pile) => [...pile]),
    tableau: state.tableau.map((pile) => [...pile]),
    drag: state.drag
      ? {
          cards: [...state.drag.cards],
          fromPile: state.drag.fromPile,
          fromIndex: state.drag.fromIndex,
          x: state.drag.x,
          y: state.drag.y,
        }
      : null,
    dropTarget: state.dropTarget
      ? { pile: state.dropTarget.pile, index: state.dropTarget.index }
      : null,
    pointer: { ...state.pointer },
    lastPress: state.lastPress ? { ...state.lastPress } : null,
    autoFlip: state.autoFlip,
    winDetect: state.winDetect,
    launching: state.launching,
    trailPainting: state.trailPainting,
    launchClock: state.launchClock,
    launched: state.launched,
    flyers: state.flyers.map((flyer) => ({ ...flyer })),
    cascadeDone: state.cascadeDone,
    trailStamps: state.trailStamps,
    nextId: state.nextId,
    simTime: state.simTime,
    muted: state.muted,
  };
}

function emptyState(muted = false): CascadeState {
  return {
    screen: "title",
    menuIndex: 0,
    titleIndex: 0,
    stock: [],
    waste: [],
    wasteSets: [],
    foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
    tableau: Array.from({ length: TABLEAU_COLUMNS }, () => []),
    drag: null,
    dropTarget: null,
    pointer: { x: 0, y: 0, down: false },
    lastPress: null,
    autoFlip: true,
    winDetect: true,
    launching: true,
    trailPainting: true,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: 1,
    simTime: 0,
    muted,
  };
}

function assertInteger(value: number, name: string): void {
  if (!Number.isInteger(value))
    throw new Error(`${name} must be a whole number`);
}

function assertSuit(suit: Suit): void {
  if (!(SUITS as readonly string[]).includes(suit)) {
    throw new Error(`unknown suit ${String(suit)}`);
  }
}

function assertRank(rank: number): void {
  if (!Number.isInteger(rank) || rank < RANK_MIN || rank > RANK_MAX) {
    throw new Error(`rank must be ${RANK_MIN}..${RANK_MAX}`);
  }
}

function assertFinite(value: number, name: string): void {
  if (!Number.isFinite(value)) throw new Error(`${name} must be finite`);
}

function colorOf(suit: Suit): "red" | "black" {
  return suit === "hearts" || suit === "diamonds" ? "red" : "black";
}

function rankLabel(rank: number): string {
  if (rank === 1) return "A";
  if (rank === 11) return "J";
  if (rank === 12) return "Q";
  if (rank === 13) return "K";
  return String(rank);
}

function suitGlyph(suit: Suit): string {
  switch (suit) {
    case "spades":
      return "S";
    case "hearts":
      return "H";
    case "diamonds":
      return "D";
    case "clubs":
      return "C";
  }
}

function cardSnapshot(card: DeepReadonly<CardState>): CardSnapshot {
  return {
    id: card.id,
    suit: card.suit,
    rank: card.rank,
    faceUp: card.faceUp,
    color: colorOf(card.suit),
  };
}

function visibleWasteCount(state: DeepReadonly<CascadeState>): number {
  return state.wasteSets[state.wasteSets.length - 1] ?? 0;
}

function isRun(cards: readonly DeepReadonly<CardState>[]): boolean {
  for (let i = 1; i < cards.length; i += 1) {
    const above = cards[i - 1];
    const below = cards[i];
    if (
      below.rank !== above.rank - 1 ||
      colorOf(below.suit) === colorOf(above.suit)
    ) {
      return false;
    }
  }
  return cards.length > 0;
}

function foundationAccepts(
  pile: readonly DeepReadonly<CardState>[],
  cards: readonly DeepReadonly<CardState>[],
): boolean {
  if (cards.length !== 1) return false;
  const card = cards[0];
  const top = pile[pile.length - 1];
  if (!top) return card.rank === RANK_MIN;
  return card.suit === top.suit && card.rank === top.rank + 1;
}

function tableauAccepts(
  pile: readonly DeepReadonly<CardState>[],
  cards: readonly DeepReadonly<CardState>[],
): boolean {
  if (!isRun(cards)) return false;
  const lead = cards[0];
  const top = pile[pile.length - 1];
  if (!top) return lead.rank === RANK_MAX;
  if (!top.faceUp) return false;
  return lead.rank === top.rank - 1 && colorOf(lead.suit) !== colorOf(top.suit);
}

function foundationFor(
  state: DeepReadonly<CascadeState>,
  card: DeepReadonly<CardState>,
): number | null {
  for (let i = 0; i < state.foundations.length; i += 1) {
    if (foundationAccepts(state.foundations[i], [card])) return i;
  }
  return null;
}

function drawLaunchVx(): number {
  const magnitude =
    LAUNCH_VX_MIN + Math.random() * (LAUNCH_VX_MAX - LAUNCH_VX_MIN);
  return Math.random() < 0.5 ? -magnitude : magnitude;
}

function buildDeck(): CardState[] {
  const deck: CardState[] = [];
  let id = 1;
  for (const suit of SUITS) {
    for (let rank = RANK_MIN; rank <= RANK_MAX; rank += 1) {
      deck.push({ id, suit, rank, faceUp: false });
      id += 1;
    }
  }
  return deck;
}

function shuffle(cards: readonly CardState[]): CardState[] {
  const deck = [...cards];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealState(state: DeepReadonly<CascadeState>): CascadeState {
  const deck = shuffle(buildDeck());
  let cursor = 0;
  const tableau: CardState[][] = [];
  for (let column = 0; column < TABLEAU_COLUMNS; column += 1) {
    const pile: CardState[] = [];
    for (let row = 0; row <= column; row += 1) {
      const card = deck[cursor];
      pile.push({ ...card, faceUp: row === column });
      cursor += 1;
    }
    tableau.push(pile);
  }
  const stock = deck.slice(cursor).map((card) => ({ ...card, faceUp: false }));
  return {
    ...mutableState(state),
    stock,
    waste: [],
    wasteSets: [],
    foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
    tableau,
    drag: null,
    dropTarget: null,
    pointer: { ...state.pointer, down: false },
    lastPress: null,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: DECK_SIZE + 1,
  };
}

function turnStockState(state: DeepReadonly<CascadeState>): CascadeState {
  const next = mutableState(state);
  if (next.stock.length > 0) {
    const count = Math.min(TURN_COUNT, next.stock.length);
    const moved = next.stock
      .slice(next.stock.length - count)
      .reverse()
      .map((card) => ({ ...card, faceUp: true }));
    next.stock = next.stock.slice(0, next.stock.length - count);
    next.waste = [...next.waste, ...moved];
    next.wasteSets = [...next.wasteSets, count];
    return next;
  }
  if (next.waste.length > 0) {
    return {
      ...next,
      stock: [...next.waste]
        .reverse()
        .map((card) => ({ ...card, faceUp: false })),
      waste: [],
      wasteSets: [],
    };
  }
  return next;
}

function removeFromWasteSet(sets: readonly number[]): readonly number[] {
  const next = [...sets];
  for (let i = next.length - 1; i >= 0; i -= 1) {
    if (next[i] > 0) {
      next[i] -= 1;
      if (next[i] === 0) next.splice(i, 1);
      return next;
    }
  }
  return next;
}

function columnOffset(cards: readonly DeepReadonly<CardState>[]): number {
  if (cards.length <= 1) return FACE_UP_OFFSET;
  let fixed = 0;
  let faceUpLinks = 0;
  for (let i = 0; i < cards.length - 1; i += 1) {
    if (cards[i].faceUp) faceUpLinks += 1;
    else fixed += FACE_DOWN_OFFSET;
  }
  const natural = fixed + faceUpLinks * FACE_UP_OFFSET + CARD_H;
  const limit = COLUMN_BOTTOM_LIMIT - TABLEAU_Y;
  if (natural <= limit || faceUpLinks === 0) return FACE_UP_OFFSET;
  return Math.max(FACE_UP_OFFSET_MIN, (limit - CARD_H - fixed) / faceUpLinks);
}

function cardYInColumn(
  cards: readonly DeepReadonly<CardState>[],
  row: number,
): number {
  const upOffset = columnOffset(cards);
  let y = TABLEAU_Y;
  for (let i = 0; i < row; i += 1) {
    y += cards[i].faceUp ? upOffset : FACE_DOWN_OFFSET;
  }
  return y;
}

function contains(rect: Rect, x: number, y: number): boolean {
  return (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  );
}

function stockRect(): Rect {
  return { x: STOCK_X, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
}

function wasteRect(): Rect {
  return { x: WASTE_X, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
}

function foundationRect(index: number): Rect {
  return { x: FOUNDATION_X[index], y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
}

function tableauDropRect(
  state: DeepReadonly<CascadeState>,
  index: number,
): Rect {
  const pile = state.tableau[index];
  if (pile.length === 0) {
    return { x: COLUMN_X[index], y: TABLEAU_Y, w: CARD_W, h: CARD_H };
  }
  const bottomY = cardYInColumn(pile, pile.length - 1) + CARD_H;
  return {
    x: COLUMN_X[index],
    y: TABLEAU_Y,
    w: CARD_W,
    h: bottomY - TABLEAU_Y,
  };
}

function distance(a: PressState, x: number, y: number): number {
  return Math.hypot(a.x - x, a.y - y);
}

function dropPileAt(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): { pile: PileKind; index: number } | null {
  if (contains(stockRect(), x, y)) return { pile: "stock", index: 0 };
  if (contains(wasteRect(), x, y)) return { pile: "waste", index: 0 };
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    if (contains(foundationRect(i), x, y)) {
      return { pile: "foundation", index: i };
    }
  }
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1) {
    if (contains(tableauDropRect(state, i), x, y)) {
      return { pile: "tableau", index: i };
    }
  }
  return null;
}

function runPositionForLocation(
  state: DeepReadonly<CascadeState>,
  pile: "waste" | "foundation" | "tableau",
  index: number,
  row: number,
): { x: number; y: number } {
  if (pile === "waste") {
    const visible = visibleWasteCount(state);
    const visibleStart = Math.max(0, state.waste.length - visible);
    return {
      x: WASTE_X + Math.max(0, row - visibleStart) * WASTE_FAN,
      y: TOP_ROW_Y,
    };
  }
  if (pile === "foundation") {
    return { x: FOUNDATION_X[index], y: TOP_ROW_Y };
  }
  return { x: COLUMN_X[index], y: cardYInColumn(state.tableau[index], row) };
}

function cardAtPoint(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): CardLocation | null {
  for (let column = TABLEAU_COLUMNS - 1; column >= 0; column -= 1) {
    const pile = state.tableau[column];
    for (let row = pile.length - 1; row >= 0; row -= 1) {
      const cy = cardYInColumn(pile, row);
      if (
        contains({ x: COLUMN_X[column], y: cy, w: CARD_W, h: CARD_H }, x, y)
      ) {
        return {
          pile: "tableau",
          index: column,
          row,
          card: pile[row] as CardState,
        };
      }
    }
  }
  for (let i = FOUNDATION_COUNT - 1; i >= 0; i -= 1) {
    const pile = state.foundations[i];
    const card = pile[pile.length - 1];
    if (card && contains(foundationRect(i), x, y)) {
      return { pile: "foundation", index: i, row: pile.length - 1, card };
    }
  }
  const visible = visibleWasteCount(state);
  if (visible > 0) {
    const first = Math.max(0, state.waste.length - visible);
    for (let row = state.waste.length - 1; row >= first; row -= 1) {
      const wx = WASTE_X + (row - first) * WASTE_FAN;
      if (contains({ x: wx, y: TOP_ROW_Y, w: CARD_W, h: CARD_H }, x, y)) {
        return { pile: "waste", index: 0, row, card: state.waste[row] };
      }
    }
  }
  const stockCard = state.stock[state.stock.length - 1];
  if (stockCard && contains(stockRect(), x, y)) {
    return {
      pile: "stock",
      index: 0,
      row: state.stock.length - 1,
      card: stockCard,
    };
  }
  return null;
}

function removeRun(
  state: DeepReadonly<CascadeState>,
  pile: PileKind,
  index: number,
  row: number,
): { readonly state: CascadeState; readonly cards: readonly CardState[] } {
  const next = mutableState(state);
  if (pile === "stock") throw new Error("stock cards are not movable");
  if (pile === "waste") {
    if (index !== 0 || row !== next.waste.length - 1) {
      throw new Error("only the waste top card is movable");
    }
    const card = next.waste[next.waste.length - 1];
    if (!card) throw new Error("waste is empty");
    next.waste = next.waste.slice(0, -1);
    return { state: next, cards: [card] };
  }
  if (pile === "foundation") {
    if (index < 0 || index >= FOUNDATION_COUNT) {
      throw new Error("foundation index out of range");
    }
    const source = next.foundations[index];
    if (row !== source.length - 1) {
      throw new Error("only the foundation top card is movable");
    }
    const card = source[source.length - 1];
    if (!card) throw new Error("foundation is empty");
    next.foundations = next.foundations.map((p, i) =>
      i === index ? p.slice(0, -1) : p,
    );
    return { state: next, cards: [card] };
  }
  if (index < 0 || index >= TABLEAU_COLUMNS) {
    throw new Error("tableau index out of range");
  }
  const source = next.tableau[index];
  if (row < 0 || row >= source.length) throw new Error("fromRow out of range");
  const cards = source.slice(row);
  if (!cards[0].faceUp) throw new Error("face-down cards are not movable");
  next.tableau = next.tableau.map((p, i) =>
    i === index ? p.slice(0, row) : p,
  );
  return { state: next, cards };
}

function appendRun(
  state: DeepReadonly<CascadeState>,
  pile: "foundation" | "tableau",
  index: number,
  cards: readonly CardState[],
): CascadeState {
  const next = mutableState(state);
  if (pile === "foundation") {
    next.foundations = next.foundations.map((p, i) =>
      i === index ? [...p, ...cards] : p,
    );
    return next;
  }
  next.tableau = next.tableau.map((p, i) =>
    i === index ? [...p, ...cards] : p,
  );
  return next;
}

function returnRun(
  state: DeepReadonly<CascadeState>,
  drag: DragState,
): CascadeState {
  const next = mutableState(state);
  if (drag.fromPile === "waste") {
    return {
      ...next,
      waste: [...next.waste, ...drag.cards],
      drag: null,
      dropTarget: null,
    };
  }
  if (drag.fromPile === "foundation") {
    return {
      ...next,
      foundations: next.foundations.map((pile, i) =>
        i === drag.fromIndex ? [...pile, ...drag.cards] : pile,
      ),
      drag: null,
      dropTarget: null,
    };
  }
  return {
    ...next,
    tableau: next.tableau.map((pile, i) =>
      i === drag.fromIndex ? [...pile, ...drag.cards] : pile,
    ),
    drag: null,
    dropTarget: null,
  };
}

function maybeFlip(
  state: DeepReadonly<CascadeState>,
  pile: PileKind,
  index: number,
): { readonly state: CascadeState; readonly flipped: boolean } {
  if (pile !== "tableau" || !state.autoFlip) {
    return { state: mutableState(state), flipped: false };
  }
  const column = state.tableau[index];
  const card = column[column.length - 1];
  if (!card || card.faceUp)
    return { state: mutableState(state), flipped: false };
  const next = mutableState(state);
  next.tableau = next.tableau.map((p, i) =>
    i === index
      ? p.map((candidate, row) =>
          row === p.length - 1 ? { ...candidate, faceUp: true } : candidate,
        )
      : p,
  );
  return { state: next, flipped: true };
}

function completed(state: DeepReadonly<CascadeState>): boolean {
  return (
    state.foundations.reduce((sum, pile) => sum + pile.length, 0) === DECK_SIZE
  );
}

function maybeWin(state: DeepReadonly<CascadeState>): CascadeState {
  if (!state.winDetect || !completed(state)) return mutableState(state);
  return {
    ...mutableState(state),
    screen: "won",
    drag: null,
    dropTarget: null,
    launchClock: LAUNCH_INTERVAL,
    launched: 0,
    flyers: [],
    cascadeDone: false,
  };
}

function attemptMove(
  state: DeepReadonly<CascadeState>,
  fromPile: PileKind,
  fromIndex: number,
  fromRow: number,
  toPile: PileKind,
  toIndex: number,
  fromDrag = false,
): MoveResult {
  if (toPile !== "foundation" && toPile !== "tableau") {
    return { state: mutableState(state), accepted: false, cues: [] };
  }
  let lifted: {
    readonly state: CascadeState;
    readonly cards: readonly CardState[];
  };
  try {
    lifted = removeRun(state, fromPile, fromIndex, fromRow);
  } catch {
    return { state: mutableState(state), accepted: false, cues: [] };
  }
  const cards = lifted.cards;
  const target =
    toPile === "foundation"
      ? lifted.state.foundations[toIndex]
      : lifted.state.tableau[toIndex];
  const legal =
    toPile === "foundation"
      ? toIndex >= 0 &&
        toIndex < FOUNDATION_COUNT &&
        foundationAccepts(target, cards)
      : toIndex >= 0 &&
        toIndex < TABLEAU_COLUMNS &&
        tableauAccepts(target, cards);
  if (!legal) {
    return { state: mutableState(state), accepted: false, cues: [] };
  }
  let next = appendRun(lifted.state, toPile, toIndex, cards);
  if (fromPile === "waste") {
    next = { ...next, wasteSets: removeFromWasteSet(next.wasteSets) };
  }
  const flip = maybeFlip(next, fromPile, fromIndex);
  next = flip.state;
  const wonBefore = next.screen === "won";
  next = maybeWin(next);
  const cues = [
    ...(fromDrag ? [CUES.drop] : []),
    ...(toPile === "foundation" ? [CUES.home] : []),
    ...(flip.flipped ? [CUES.flip] : []),
    ...(!wonBefore && next.screen === "won" ? [CUES.win] : []),
  ];
  return { state: next, accepted: true, cues };
}

function playableForAuto(
  state: DeepReadonly<CascadeState>,
  pile: PileKind,
  index: number,
): {
  readonly pile: PileKind;
  readonly index: number;
  readonly row: number;
} | null {
  if (pile === "waste") {
    if (
      index !== 0 ||
      visibleWasteCount(state) === 0 ||
      state.waste.length === 0
    ) {
      return null;
    }
    return { pile, index, row: state.waste.length - 1 };
  }
  if (pile === "tableau") {
    if (index < 0 || index >= TABLEAU_COLUMNS) return null;
    const column = state.tableau[index];
    const row = column.length - 1;
    const card = column[row];
    return card?.faceUp ? { pile, index, row } : null;
  }
  return null;
}

function autoMoveState(
  state: DeepReadonly<CascadeState>,
  pile: PileKind,
  index: number,
): MoveResult {
  const playable = playableForAuto(state, pile, index);
  if (!playable)
    return { state: mutableState(state), accepted: false, cues: [] };
  const source = pile === "waste" ? state.waste : state.tableau[index];
  const card = source[playable.row];
  const target = foundationFor(state, card);
  if (target === null) {
    return { state: mutableState(state), accepted: false, cues: [] };
  }
  return attemptMove(state, pile, index, playable.row, "foundation", target);
}

function currentDropTarget(
  state: DeepReadonly<CascadeState>,
): DropTargetState | null {
  const drag = state.drag;
  if (!drag) return null;
  const pile = dropPileAt(state, drag.x + CARD_W / 2, drag.y + CARD_H / 2);
  if (!pile || (pile.pile !== "foundation" && pile.pile !== "tableau")) {
    return null;
  }
  const target =
    pile.pile === "foundation"
      ? state.foundations[pile.index]
      : state.tableau[pile.index];
  const accepts =
    pile.pile === "foundation"
      ? foundationAccepts(target, drag.cards)
      : tableauAccepts(target, drag.cards);
  return accepts ? { pile: pile.pile, index: pile.index } : null;
}

function removeForDrag(
  state: DeepReadonly<CascadeState>,
  location: CardLocation,
  _x: number,
  _y: number,
): PointerResult {
  if (location.pile === "stock") {
    return { state: mutableState(state), cues: [] };
  }
  if (location.pile === "waste") {
    if (
      visibleWasteCount(state) === 0 ||
      location.row !== state.waste.length - 1
    ) {
      return { state: mutableState(state), cues: [] };
    }
  }
  if (location.pile === "tableau" && !location.card.faceUp) {
    return { state: mutableState(state), cues: [] };
  }
  if (
    location.pile === "foundation" &&
    location.row !== state.foundations[location.index].length - 1
  ) {
    return { state: mutableState(state), cues: [] };
  }
  const removed = removeRun(state, location.pile, location.index, location.row);
  const origin = runPositionForLocation(
    state,
    location.pile,
    location.index,
    location.row,
  );
  const next: CascadeState = {
    ...removed.state,
    drag: {
      cards: removed.cards,
      fromPile: location.pile,
      fromIndex: location.index,
      x: origin.x,
      y: origin.y,
    },
  };
  return {
    state: { ...next, dropTarget: currentDropTarget(next) },
    cues: [CUES.lift],
  };
}

function menuItemsFor(screen: Screen): readonly string[] {
  if (screen === "title") return TITLE_ITEMS;
  if (screen === "howto") return [HOWTO_BACK_LABEL];
  if (screen === "playing") return HUD_ITEMS;
  return [];
}

function menuRect(
  state: DeepReadonly<CascadeState>,
  index: number,
): Rect | null {
  const items = menuItemsFor(state.screen);
  if (index < 0 || index >= items.length) return null;
  if (state.screen === "playing") {
    return { x: 24 + index * 132, y: HUD_Y + 4, w: 116, h: HUD_H - 8 };
  }
  if (state.screen === "howto") return { x: 560, y: 596, w: 160, h: 48 };
  return { x: 520, y: 362 + index * 66, w: 240, h: 52 };
}

function menuItemAt(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): number | null {
  const items = menuItemsFor(state.screen);
  for (let i = 0; i < items.length; i += 1) {
    const rect = menuRect(state, i);
    if (rect && contains(rect, x, y)) return i;
  }
  return null;
}

function activateMenu(
  state: DeepReadonly<CascadeState>,
  index: number,
): PointerResult {
  if (state.screen === "title") {
    if (index === 0) {
      return {
        state: {
          ...dealState(state),
          screen: "playing",
          menuIndex: 0,
          titleIndex: 0,
        },
        cues: [CUES.deal],
      };
    }
    return {
      state: {
        ...mutableState(state),
        screen: "howto",
        menuIndex: 0,
        titleIndex: 1,
      },
      cues: [],
    };
  }
  if (state.screen === "howto") {
    return {
      state: {
        ...mutableState(state),
        screen: "title",
        menuIndex: state.titleIndex,
      },
      cues: [],
    };
  }
  if (state.screen === "playing") {
    if (index === 0) {
      return {
        state: { ...dealState(state), screen: "playing", menuIndex: 0 },
        cues: [CUES.deal],
      };
    }
    if (index === 1) {
      return {
        state: {
          ...mutableState(state),
          screen: "title",
          menuIndex: state.titleIndex,
          drag: null,
          dropTarget: null,
        },
        cues: [],
      };
    }
    return { state: { ...mutableState(state), muted: !state.muted }, cues: [] };
  }
  return { state: mutableState(state), cues: [] };
}

function pressState(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): PointerResult {
  let next: CascadeState = {
    ...mutableState(state),
    pointer: { x, y, down: true },
    lastPress: { x, y, at: state.simTime },
  };
  const menu = menuItemAt(next, x, y);
  if (menu !== null) next = { ...next, menuIndex: menu };
  if (next.screen === "won") {
    return {
      state: { ...dealState(next), screen: "playing", menuIndex: 0 },
      cues: [CUES.deal],
    };
  }
  if (next.screen !== "playing") return { state: next, cues: [] };
  const location = cardAtPoint(state, x, y);
  const previous = state.lastPress;
  if (
    location &&
    previous &&
    state.simTime - previous.at <= DOUBLE_CLICK_WINDOW &&
    distance(previous, x, y) <= DOUBLE_CLICK_SLOP
  ) {
    const playable =
      (location.pile === "waste" && location.row === state.waste.length - 1) ||
      (location.pile === "tableau" &&
        location.row === state.tableau[location.index].length - 1 &&
        location.card.faceUp);
    if (playable) {
      const result = autoMoveState(state, location.pile, location.index);
      return {
        state: {
          ...result.state,
          pointer: { x, y, down: true },
          lastPress: { x, y, at: state.simTime },
        },
        cues: result.cues,
      };
    }
  }
  if (!location) return { state: next, cues: [] };
  const lifted = removeForDrag(next, location, x, y);
  return {
    state: {
      ...lifted.state,
      pointer: { x, y, down: true },
      lastPress: { x, y, at: state.simTime },
    },
    cues: lifted.cues,
  };
}

function movePointerState(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): CascadeState {
  let next = mutableState(state);
  next = { ...next, pointer: { x, y, down: state.pointer.down } };
  const menu = menuItemAt(next, x, y);
  if (menu !== null) next = { ...next, menuIndex: menu };
  if (next.drag) {
    next = {
      ...next,
      drag: {
        ...next.drag,
        x: next.drag.x + (x - state.pointer.x),
        y: next.drag.y + (y - state.pointer.y),
      },
    };
    next = { ...next, dropTarget: currentDropTarget(next) };
  }
  return next;
}

function releaseState(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): PointerResult {
  let next: CascadeState = {
    ...mutableState(state),
    pointer: { x, y, down: false },
  };
  const menu = menuItemAt(next, x, y);
  const pressedMenu =
    state.lastPress && menuItemAt(next, state.lastPress.x, state.lastPress.y);
  if (menu !== null) next = { ...next, menuIndex: menu };
  if (menu !== null && pressedMenu === menu) return activateMenu(next, menu);
  if (next.screen !== "playing") return { state: next, cues: [] };
  const press = state.lastPress;
  const isClick = !press || distance(press, x, y) <= DRAG_THRESHOLD;
  if (isClick) {
    if (next.drag) next = returnRun(next, next.drag);
    if (press && contains(stockRect(), press.x, press.y)) {
      const beforeStock = next.stock.length;
      const beforeWaste = next.waste.length;
      const turned = turnStockState(next);
      const cue =
        beforeStock > 0 ? CUES.turn : beforeWaste > 0 ? CUES.recycle : null;
      return { state: turned, cues: cue ? [cue] : [] };
    }
    return { state: next, cues: [] };
  }
  const drag = next.drag;
  if (!drag) return { state: next, cues: [] };
  const pile = dropPileAt(next, drag.x + CARD_W / 2, drag.y + CARD_H / 2);
  if (!pile || (pile.pile !== "foundation" && pile.pile !== "tableau")) {
    return { state: returnRun(next, drag), cues: [CUES.reject] };
  }
  const sourceRow =
    drag.fromPile === "waste"
      ? next.waste.length
      : drag.fromPile === "foundation"
        ? next.foundations[drag.fromIndex].length
        : next.tableau[drag.fromIndex].length;
  const restored = returnRun(next, drag);
  const result = attemptMove(
    restored,
    drag.fromPile,
    drag.fromIndex,
    sourceRow,
    pile.pile,
    pile.index,
    true,
  );
  return result.accepted
    ? {
        state: { ...result.state, drag: null, dropTarget: null },
        cues: result.cues,
      }
    : { state: returnRun(next, drag), cues: [CUES.reject] };
}

function updateMenuKeys(
  state: DeepReadonly<CascadeState>,
  api: UpdateApi,
): PointerResult {
  if (state.screen === "won") return { state: mutableState(state), cues: [] };
  const items = menuItemsFor(state.screen);
  if (items.length === 0) return { state: mutableState(state), cues: [] };
  const up = api.input.pressed(MENU_UP);
  const down = api.input.pressed(MENU_DOWN);
  const confirm = api.input.pressed(MENU_CONFIRM);
  const back = api.input.pressed(MENU_BACK);
  if (up || down) {
    if (state.screen === "howto")
      return { state: mutableState(state), cues: [] };
    const delta = up ? -1 : 1;
    return {
      state: {
        ...mutableState(state),
        menuIndex: (state.menuIndex + delta + items.length) % items.length,
      },
      cues: [],
    };
  }
  if (confirm || (back && state.screen === "howto")) {
    return activateMenu(state, state.screen === "howto" ? 0 : state.menuIndex);
  }
  return { state: mutableState(state), cues: [] };
}

function takeLaunchCard(
  state: DeepReadonly<CascadeState>,
): { readonly state: CascadeState } | null {
  const next = mutableState(state);
  for (let step = 0; step < FOUNDATION_COUNT; step += 1) {
    const index = (next.launched + step) % FOUNDATION_COUNT;
    const pile = next.foundations[index];
    const card = pile[pile.length - 1];
    if (card) {
      next.foundations = next.foundations.map((p, i) =>
        i === index ? p.slice(0, -1) : p,
      );
      next.flyers = [
        ...next.flyers,
        {
          id: card.id,
          suit: card.suit,
          rank: card.rank,
          x: FOUNDATION_X[index],
          y: TOP_ROW_Y,
          vx: drawLaunchVx(),
          vy: LAUNCH_VY,
        },
      ];
      next.launched += 1;
      return { state: next };
    }
  }
  return null;
}

function advanceCascade(
  state: DeepReadonly<CascadeState>,
  dt: number,
): PointerResult {
  let next = mutableState(state);
  const cues: string[] = [];
  let stamps = 0;
  next.flyers = next.flyers
    .map((flyer) => {
      let vy = flyer.vy + GRAVITY * dt;
      let y = flyer.y + vy * dt;
      const x = flyer.x + flyer.vx * dt;
      if (y >= FLOOR_Y && vy > 0) {
        vy = -vy * BOUNCE_DAMP;
        y = FLOOR_Y;
      }
      if (next.trailPainting) stamps += 1;
      return { ...flyer, x, y, vy };
    })
    .filter((flyer) => flyer.x + CARD_W >= 0 && flyer.x <= STAGE_W);
  next.trailStamps += stamps;
  if (next.screen === "won" && next.launching && next.launched < DECK_SIZE) {
    let clock = next.launchClock + dt;
    while (clock >= LAUNCH_INTERVAL && next.launched < DECK_SIZE) {
      const launch = takeLaunchCard(next);
      if (!launch) break;
      clock -= LAUNCH_INTERVAL;
      next = launch.state;
      cues.push(CUES.launch);
    }
    next.launchClock = clock;
  }
  if (
    next.screen === "won" &&
    next.launched >= DECK_SIZE &&
    next.flyers.length === 0
  ) {
    next.cascadeDone = true;
  }
  return { state: next, cues };
}

function addUnique(cues: Set<string>, names: readonly string[]): void {
  for (const cue of names) cues.add(cue);
}

function processPointerSample(
  state: DeepReadonly<CascadeState>,
  sample: PointerSample,
): PointerResult {
  if (!sample.primary) return { state: mutableState(state), cues: [] };
  if (sample.type === "down") return pressState(state, sample.x, sample.y);
  if (sample.type === "move") {
    return { state: movePointerState(state, sample.x, sample.y), cues: [] };
  }
  return releaseState(state, sample.x, sample.y);
}

function defineCues(api: InitApi<CascadeState>): void {
  api.audio.define(CUES.deal, {
    wave: "triangle",
    freq: 220,
    freqTo: 440,
    durationMs: 120,
    gain: 0.16,
  });
  api.audio.define(CUES.turn, {
    wave: "square",
    freq: 360,
    freqTo: 520,
    durationMs: 70,
    gain: 0.1,
  });
  api.audio.define(CUES.recycle, {
    wave: "sawtooth",
    freq: 180,
    freqTo: 120,
    durationMs: 140,
    gain: 0.11,
  });
  api.audio.define(CUES.lift, {
    wave: "sine",
    freq: 500,
    freqTo: 640,
    durationMs: 45,
    gain: 0.08,
  });
  api.audio.define(CUES.drop, {
    wave: "triangle",
    freq: 340,
    freqTo: 260,
    durationMs: 80,
    gain: 0.1,
  });
  api.audio.define(CUES.reject, {
    wave: "sawtooth",
    freq: 160,
    freqTo: 90,
    durationMs: 100,
    gain: 0.1,
  });
  api.audio.define(CUES.flip, {
    wave: "square",
    freq: 620,
    freqTo: 760,
    durationMs: 60,
    gain: 0.08,
  });
  api.audio.define(CUES.home, {
    wave: "sine",
    freq: 660,
    freqTo: 880,
    durationMs: 110,
    gain: 0.11,
  });
  api.audio.define(CUES.launch, {
    wave: "triangle",
    freq: 260,
    freqTo: 740,
    durationMs: 90,
    gain: 0.08,
  });
  api.audio.define(CUES.win, {
    wave: "sine",
    freq: 392,
    freqTo: 784,
    durationMs: 300,
    gain: 0.14,
  });
}

function registerActions(api: InitApi<CascadeState>): void {
  for (const [name, keys] of Object.entries(MENU_BINDINGS)) {
    api.input.register(name, { keys: [...keys] });
  }
}

function registerDiagnostics(api: InitApi<CascadeState>): void {
  api.diagnostics.register("screen", (s) => s.screen);
  api.diagnostics.register("deal", () => DEAL_MODE);
  api.diagnostics.register("stock", (s) => s.stock.length);
  api.diagnostics.register("waste", (s) => s.waste.length);
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    api.diagnostics.register(`f${i}`, (s) => s.foundations[i].length);
  }
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1) {
    api.diagnostics.register(`c${i}`, (s) => s.tableau[i].length);
  }
  api.diagnostics.register("hand", (s) =>
    s.drag ? s.drag.cards.length : "none",
  );
  api.diagnostics.register("launched", (s) => s.launched);
  api.diagnostics.register("flyers", (s) => s.flyers.length);
}

function pileCards(
  state: DeepReadonly<CascadeState>,
  pile: PileKind,
  index: number,
): readonly DeepReadonly<CardState>[] {
  if (pile === "stock") {
    if (index !== 0) throw new Error("stock index must be 0");
    return state.stock;
  }
  if (pile === "waste") {
    if (index !== 0) throw new Error("waste index must be 0");
    return state.waste;
  }
  if (pile === "foundation") {
    if (index < 0 || index >= FOUNDATION_COUNT) {
      throw new Error("foundation index out of range");
    }
    return state.foundations[index];
  }
  if (index < 0 || index >= TABLEAU_COLUMNS) {
    throw new Error("tableau index out of range");
  }
  return state.tableau[index];
}

function setPile(
  state: DeepReadonly<CascadeState>,
  pile: PileKind,
  index: number,
  cards: readonly CardState[],
): CascadeState {
  const next = mutableState(state);
  if (pile === "stock") {
    if (index !== 0) throw new Error("stock index must be 0");
    return { ...next, stock: [...cards] };
  }
  if (pile === "waste") {
    if (index !== 0) throw new Error("waste index must be 0");
    return {
      ...next,
      waste: [...cards],
      wasteSets: cards.length ? next.wasteSets : [],
    };
  }
  if (pile === "foundation") {
    if (index < 0 || index >= FOUNDATION_COUNT) {
      throw new Error("foundation index out of range");
    }
    return {
      ...next,
      foundations: next.foundations.map((p, i) =>
        i === index ? [...cards] : p,
      ),
    };
  }
  if (index < 0 || index >= TABLEAU_COLUMNS) {
    throw new Error("tableau index out of range");
  }
  return {
    ...next,
    tableau: next.tableau.map((p, i) => (i === index ? [...cards] : p)),
  };
}

function removeCardById(
  state: DeepReadonly<CascadeState>,
  id: number,
): CascadeState {
  let found = false;
  let next = mutableState(state);
  const remove = (cards: readonly CardState[]) => {
    const filtered = cards.filter((card) => card.id !== id);
    if (filtered.length !== cards.length) found = true;
    return filtered;
  };
  next.stock = remove(next.stock);
  const wasteBefore = next.waste.length;
  next.waste = remove(next.waste);
  if (next.waste.length !== wasteBefore) {
    next.wasteSets = removeFromWasteSet(next.wasteSets);
  }
  next.foundations = next.foundations.map(remove);
  next.tableau = next.tableau.map(remove);
  if (next.drag?.cards.some((card) => card.id === id)) {
    next = { ...next, drag: null, dropTarget: null };
    found = true;
  }
  if (!found) throw new Error(`card ${id} not found`);
  return next;
}

function setCardFace(
  state: DeepReadonly<CascadeState>,
  id: number,
  faceUp: boolean,
): CascadeState {
  let found = false;
  const change = (card: CardState) => {
    if (card.id === id) {
      found = true;
      return { ...card, faceUp };
    }
    return card;
  };
  const next = mutableState(state);
  next.stock = next.stock.map(change);
  next.waste = next.waste.map(change);
  next.foundations = next.foundations.map((pile) => pile.map(change));
  next.tableau = next.tableau.map((pile) => pile.map(change));
  if (next.drag)
    next.drag = { ...next.drag, cards: next.drag.cards.map(change) };
  if (!found) throw new Error(`card ${id} not found`);
  return next;
}

function createDebug(): CascadeDebugApi {
  return {
    version: CASCADE_DEBUG_VERSION,
    reset: (state) => emptyState(state.muted),
    snapshot: (state) => {
      const mapPile = (pile: readonly DeepReadonly<CardState>[]) =>
        pile.map(cardSnapshot);
      return {
        version: CASCADE_DEBUG_VERSION,
        screen: state.screen,
        menuIndex: state.menuIndex,
        titleIndex: state.titleIndex,
        dealMode: DEAL_MODE,
        turnCount: TURN_COUNT,
        dealModeLabel: DEAL_MODE_LABEL,
        muted: state.muted,
        autoFlip: state.autoFlip,
        winDetect: state.winDetect,
        launching: state.launching,
        trailPainting: state.trailPainting,
        stock: mapPile(state.stock),
        waste: mapPile(state.waste),
        wasteSets: [...state.wasteSets],
        wasteVisibleCount: visibleWasteCount(state),
        foundations: state.foundations.map(mapPile),
        tableau: state.tableau.map(mapPile),
        drag: state.drag
          ? {
              cards: mapPile(state.drag.cards),
              fromPile: state.drag.fromPile,
              fromIndex: state.drag.fromIndex,
              x: state.drag.x,
              y: state.drag.y,
            }
          : null,
        dropTarget: currentDropTarget(state),
        pointer: { ...state.pointer },
        lastPress: state.lastPress ? { ...state.lastPress } : null,
        launchClock: state.launchClock,
        launched: state.launched,
        flyers: state.flyers.map((flyer) => ({ ...flyer })),
        cascadeDone: state.cascadeDone,
        trailStamps: state.trailStamps,
        simTime: state.simTime,
      };
    },
    reconcile: (state) => ({
      ...mutableState(state),
      dropTarget: currentDropTarget(state),
    }),
    menuItemRect: menuRect,
    setScreen: (state, screen) => ({ ...mutableState(state), screen }),
    setMenuIndex: (state, index) => ({
      ...mutableState(state),
      menuIndex: index,
    }),
    setTitleIndex: (state, index) => ({
      ...mutableState(state),
      titleIndex: index,
    }),
    addCard: (state, pile, index, suit, rank, faceUp) => {
      assertSuit(suit);
      assertRank(rank);
      const next = mutableState(state);
      const card = { id: next.nextId, suit, rank, faceUp };
      return {
        ...setPile(next, pile, index, [...pileCards(next, pile, index), card]),
        nextId: next.nextId + 1,
      };
    },
    removeCard: removeCardById,
    setCardFaceUp: setCardFace,
    clearPile: (state, pile, index) => setPile(state, pile, index, []),
    clearTable: (state) => ({
      ...mutableState(state),
      stock: [],
      waste: [],
      wasteSets: [],
      foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
      tableau: Array.from({ length: TABLEAU_COLUMNS }, () => []),
      drag: null,
      dropTarget: null,
    }),
    addWasteSet: (state, count) => {
      assertInteger(count, "count");
      if (count < 0) throw new Error("count must be non-negative");
      return { ...mutableState(state), wasteSets: [...state.wasteSets, count] };
    },
    clearWasteSets: (state) => ({ ...mutableState(state), wasteSets: [] }),
    deal: dealState,
    turnStock: turnStockState,
    move: (state, fromPile, fromIndex, fromRow, toPile, toIndex) => {
      const result = attemptMove(
        state,
        fromPile,
        fromIndex,
        fromRow,
        toPile,
        toIndex,
      );
      return [result.state, result.accepted];
    },
    autoMove: (state, pile, index) => {
      const result = autoMoveState(state, pile, index);
      return [result.state, result.accepted];
    },
    pointerDown: (state, x, y) => pressState(state, x, y).state,
    pointerMove: movePointerState,
    pointerUp: (state, x, y) => releaseState(state, x, y).state,
    setAutoFlip: (state, enabled) => ({
      ...mutableState(state),
      autoFlip: enabled,
    }),
    setWinDetect: (state, enabled) => ({
      ...mutableState(state),
      winDetect: enabled,
    }),
    setLaunching: (state, enabled) => ({
      ...mutableState(state),
      launching: enabled,
    }),
    setTrailPainting: (state, enabled) => ({
      ...mutableState(state),
      trailPainting: enabled,
    }),
    addFlyer: (state, suit, rank, x, y, vx, vy) => {
      assertSuit(suit);
      assertRank(rank);
      for (const [name, value] of Object.entries({ x, y, vx, vy })) {
        assertFinite(value, name);
      }
      const next = mutableState(state);
      return {
        ...next,
        flyers: [...next.flyers, { id: next.nextId, suit, rank, x, y, vx, vy }],
        nextId: next.nextId + 1,
      };
    },
    setFlyerPosition: (state, id, x, y) => {
      let found = false;
      const flyers = state.flyers.map((flyer) => {
        if (flyer.id !== id) return { ...flyer };
        found = true;
        return { ...flyer, x, y };
      });
      if (!found) throw new Error(`flyer ${id} not found`);
      return { ...mutableState(state), flyers };
    },
    setFlyerVelocity: (state, id, vx, vy) => {
      let found = false;
      const flyers = state.flyers.map((flyer) => {
        if (flyer.id !== id) return { ...flyer };
        found = true;
        return { ...flyer, vx, vy };
      });
      if (!found) throw new Error(`flyer ${id} not found`);
      return { ...mutableState(state), flyers };
    },
    removeFlyer: (state, id) => {
      const flyers = state.flyers.filter((flyer) => flyer.id !== id);
      if (flyers.length === state.flyers.length) {
        throw new Error(`flyer ${id} not found`);
      }
      return { ...mutableState(state), flyers };
    },
    clearFlyers: (state) => ({ ...mutableState(state), flyers: [] }),
    setLaunchClock: (state, seconds) => {
      assertFinite(seconds, "seconds");
      return { ...mutableState(state), launchClock: seconds };
    },
    clearTrail: (state) => ({ ...mutableState(state), trailStamps: 0 }),
    drawLaunchVx,
  };
}

export const game: Game<CascadeState, CascadeDebugApi> = {
  initialize(api: InitApi<CascadeState>): [CascadeState, CascadeDebugApi] {
    registerActions(api);
    defineCues(api);
    registerDiagnostics(api);
    return [emptyState(false), createDebug()];
  },

  update(
    state: DeepReadonly<CascadeState>,
    api: UpdateApi,
    dt: number,
  ): CascadeState {
    let next: CascadeState = {
      ...mutableState(state),
      simTime: state.simTime + dt,
      muted: api.audio.muted(),
    };
    const cues = new Set<string>();
    const keyResult = updateMenuKeys(next, api);
    next = keyResult.state;
    addUnique(cues, keyResult.cues);
    for (const sample of api.input.pointerSamples()) {
      const result = processPointerSample(next, sample);
      next = result.state;
      addUnique(cues, result.cues);
    }
    if (next.muted !== api.audio.muted()) api.audio.setMuted(next.muted);
    const cascade = advanceCascade(next, dt);
    next = cascade.state;
    addUnique(cues, cascade.cues);
    for (const cue of cues) api.audio.play(cue);
    return { ...next, muted: api.audio.muted() };
  },

  render(state: DeepReadonly<CascadeState>, api: RenderApi): void {
    const { ctx } = api;
    drawTable(ctx, state);
    if (state.screen === "title") drawTitle(ctx, state);
    if (state.screen === "howto") drawHowTo(ctx, state);
    if (state.screen === "playing") drawHud(ctx, state);
    if (state.screen === "won") drawWon(ctx, state);
  },
};

function drawTable(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  ctx.fillStyle = FELT;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.save();
  ctx.rotate(-0.45);
  ctx.fillStyle = "rgba(255, 255, 255, 0.035)";
  for (let x = -STAGE_H; x < STAGE_W * 1.4; x += 48) {
    ctx.fillRect(x, 0, 14, STAGE_H * 2);
  }
  ctx.restore();
  drawPaintedTrail(ctx, state.trailStamps);
  drawSlot(ctx, STOCK_X, TOP_ROW_Y, "STOCK");
  drawSlot(ctx, WASTE_X, TOP_ROW_Y, "WASTE");
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    drawSlot(ctx, FOUNDATION_X[i], TOP_ROW_Y, "A");
  }
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1) {
    if (state.tableau[i].length === 0)
      drawSlot(ctx, COLUMN_X[i], TABLEAU_Y, "K");
  }
  drawPile(ctx, state.stock, STOCK_X, TOP_ROW_Y);
  drawWaste(ctx, state);
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    drawPile(ctx, state.foundations[i], FOUNDATION_X[i], TOP_ROW_Y);
  }
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1) {
    drawColumn(ctx, state.tableau[i], i);
  }
  if (state.dropTarget) drawDropHighlight(ctx, state);
  for (const flyer of state.flyers) {
    drawCard(ctx, flyer, flyer.x, flyer.y, true, 0.98);
  }
  if (state.drag) drawDrag(ctx, state.drag);
}

function drawPaintedTrail(ctx: CanvasRenderingContext2D, count: number): void {
  const capped = Math.min(count, 220);
  for (let i = 0; i < capped; i += 1) {
    const x = ((i * 73) % (STAGE_W + CARD_W)) - CARD_W / 2;
    const y = 20 + ((i * 41) % 560);
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.translate(x + CARD_W / 2, y + CARD_H / 2);
    ctx.rotate((((i * 19) % 50) - 25) * (Math.PI / 180));
    drawCard(
      ctx,
      { id: i, suit: SUITS[i % 4], rank: (i % 13) + 1, faceUp: true },
      -CARD_W / 2,
      -CARD_H / 2,
      true,
      1,
    );
    ctx.restore();
  }
}

function drawSlot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
): void {
  roundRect(ctx, x, y, CARD_W, CARD_H, 9);
  ctx.fillStyle = SLOT;
  ctx.fill();
  ctx.strokeStyle = SLOT_EDGE;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.34)";
  ctx.font = `700 18px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + CARD_W / 2, y + CARD_H / 2);
}

function drawPile(
  ctx: CanvasRenderingContext2D,
  pile: readonly DeepReadonly<CardState>[],
  x: number,
  y: number,
): void {
  const card = pile[pile.length - 1];
  if (card) drawCard(ctx, card, x, y, card.faceUp, 1);
}

function drawWaste(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  const visible = visibleWasteCount(state);
  if (visible === 0) return;
  const start = Math.max(0, state.waste.length - visible);
  if (start > 0)
    drawCard(ctx, state.waste[start - 1], WASTE_X, TOP_ROW_Y, false, 1);
  for (let row = start; row < state.waste.length; row += 1) {
    drawCard(
      ctx,
      state.waste[row],
      WASTE_X + (row - start) * WASTE_FAN,
      TOP_ROW_Y,
      true,
      1,
    );
  }
}

function drawColumn(
  ctx: CanvasRenderingContext2D,
  pile: readonly DeepReadonly<CardState>[],
  index: number,
): void {
  for (let row = 0; row < pile.length; row += 1) {
    drawCard(
      ctx,
      pile[row],
      COLUMN_X[index],
      cardYInColumn(pile, row),
      pile[row].faceUp,
      1,
    );
  }
}

function drawDropHighlight(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  if (!state.dropTarget) return;
  const rect =
    state.dropTarget.pile === "foundation"
      ? foundationRect(state.dropTarget.index)
      : tableauDropRect(state, state.dropTarget.index);
  roundRect(
    ctx,
    rect.x - 5,
    rect.y - 5,
    rect.w + 10,
    Math.min(rect.h + 10, CARD_H + 44),
    12,
  );
  ctx.fillStyle = HIGHLIGHT;
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawDrag(
  ctx: CanvasRenderingContext2D,
  drag: DeepReadonly<DragState>,
): void {
  ctx.save();
  ctx.shadowColor = SHADOW;
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 12;
  for (let i = 0; i < drag.cards.length; i += 1) {
    drawCard(ctx, drag.cards[i], drag.x, drag.y + i * FACE_UP_OFFSET, true, 1);
  }
  ctx.restore();
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  card: DeepReadonly<CardState> | DeepReadonly<FlyerState>,
  x: number,
  y: number,
  faceUp: boolean,
  alpha: number,
): void {
  ctx.save();
  ctx.globalAlpha *= alpha;
  roundRect(ctx, x, y, CARD_W, CARD_H, 9);
  ctx.fillStyle = faceUp ? CARD_FACE : BLUE;
  ctx.fill();
  ctx.strokeStyle = CARD_EDGE;
  ctx.lineWidth = 2;
  ctx.stroke();
  if (faceUp) {
    const color = colorOf(card.suit) === "red" ? RED : BLACK;
    ctx.fillStyle = color;
    ctx.font = `800 22px ${FONT}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(rankLabel(card.rank), x + 10, y + 8);
    ctx.font = `700 26px ${FONT}`;
    ctx.fillText(suitGlyph(card.suit), x + 10, y + 34);
    ctx.font = `700 48px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(suitGlyph(card.suit), x + CARD_W / 2, y + CARD_H / 2 + 8);
    ctx.save();
    ctx.translate(x + CARD_W - 10, y + CARD_H - 8);
    ctx.rotate(Math.PI);
    ctx.font = `800 22px ${FONT}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(rankLabel(card.rank), 0, 0);
    ctx.restore();
  } else {
    ctx.fillStyle = "#98c3df";
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        ctx.beginPath();
        ctx.arc(x + 26 + col * 24, y + 26 + row * 22, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.strokeStyle = "#d7ecf7";
    ctx.lineWidth = 4;
    roundRect(ctx, x + 14, y + 14, CARD_W - 28, CARD_H - 28, 7);
    ctx.stroke();
  }
  ctx.restore();
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  ctx.fillStyle = FELT_DARK;
  ctx.fillRect(0, HUD_Y, STAGE_W, HUD_H);
  ctx.fillStyle = CREAM;
  ctx.font = `700 16px ${FONT}`;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(DEAL_MODE_LABEL, STAGE_W - 28, HUD_Y + HUD_H / 2);
  for (let i = 0; i < HUD_ITEMS.length; i += 1) {
    const rect = menuRect(state, i);
    if (rect) drawButton(ctx, rect, HUD_ITEMS[i], state.menuIndex === i);
  }
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  ctx.fillStyle = "rgba(0,0,0,0.48)";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = GOLD;
  ctx.font = `900 92px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(TITLE_TEXT, STAGE_W / 2, 190);
  ctx.fillStyle = CREAM;
  ctx.font = `700 24px ${FONT}`;
  ctx.fillText(TAGLINE_TEXT, STAGE_W / 2, 256);
  ctx.fillStyle = "#cfe8d8";
  ctx.font = `700 18px ${FONT}`;
  ctx.fillText(DEAL_MODE_LABEL, STAGE_W / 2, 302);
  for (let i = 0; i < TITLE_ITEMS.length; i += 1) {
    const rect = menuRect(state, i);
    if (rect) drawButton(ctx, rect, TITLE_ITEMS[i], state.menuIndex === i);
  }
}

function drawHowTo(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  roundRect(ctx, 320, 112, 640, 448, 14);
  ctx.fillStyle = PANEL;
  ctx.fill();
  ctx.strokeStyle = FELT_LIGHT;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.font = `800 38px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("How to Play", STAGE_W / 2, 142);
  ctx.fillStyle = CREAM;
  ctx.font = `500 23px ${FONT}`;
  ctx.textAlign = "left";
  const lines = [
    "Build all four foundations from ACE to KING.",
    "Columns build downward, alternating red and black.",
    "Only a KING can move into an empty column.",
    "Tap the STOCK to turn three cards; tap again to recycle.",
    "Drag cards or runs. DOUBLE-CLICK a playable card to send it home.",
  ];
  for (let i = 0; i < lines.length; i += 1) {
    ctx.fillText(lines[i], 382, 220 + i * 46);
  }
  const rect = menuRect(state, 0);
  if (rect) drawButton(ctx, rect, HOWTO_BACK_LABEL, true);
}

function drawWon(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  if (!state.cascadeDone && state.flyers.length > 0) return;
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = GOLD;
  ctx.font = `900 76px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(WIN_TEXT, STAGE_W / 2, 332);
  ctx.fillStyle = CREAM;
  ctx.font = `600 22px ${FONT}`;
  ctx.fillText("Press anywhere for a fresh deal", STAGE_W / 2, 398);
}

function drawButton(
  ctx: CanvasRenderingContext2D,
  rect: Rect,
  label: string,
  selected: boolean,
): void {
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
  ctx.fillStyle = selected ? GOLD : PANEL_SOLID;
  ctx.fill();
  ctx.strokeStyle = selected ? CREAM : FELT_LIGHT;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = selected ? "#17251f" : CREAM;
  ctx.font = `800 16px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
