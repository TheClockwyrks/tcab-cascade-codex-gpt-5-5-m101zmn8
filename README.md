# Cascade

Cascade is a browser Klondike solitaire built on the Simple 2D engine. It plays
Draw Three: the stock turns three cards at a time into a fanned waste, with only
the front card playable.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Vite serves the game locally with hot reload. The game runs entirely in the
browser and ships no external art, audio, backend, or credentials.

## Production Build

```sh
npm run build
```

The static site is emitted to `dist/`, with `dist/index.html` as the entry point.

## Controls

Use the mouse or touch to drag face-up cards and runs. Click the stock to turn
three cards, and click it again when empty to recycle the waste. Double-click a
playable waste card or a column's lowest face-up card to send it to its
foundation when legal.

Menus work with pointer or touch. Keyboard controls are `ArrowUp`/`W`,
`ArrowDown`/`S`, `Enter`/`Space`, and `Escape`.
