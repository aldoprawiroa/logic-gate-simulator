# Design Direction

## Product
Logic Gate Simulator is a single-page educational tool for learning basic digital logic through direct interaction with gate inputs, signal paths, output state, and truth tables.

## Audience
Students who are learning Sistem Digital and need a readable visual bridge between Boolean logic and circuit behavior.

## Visual language
Use the feel of a digital lab bench: dark neutral surfaces, precise signal paths, compact instructional text, and one clear live-signal accent. Avoid generic cyberpunk styling, decorative technical grids, and effects that do not explain circuit state.

## Design dials
- ENERGY 2: the simulator should feel active when a signal changes, but the interface should remain instructional.
- RHYTHM 1: this is a focused tool, so the layout stays predictable and task-oriented.
- MOTION 1: motion is limited to short state transitions that clarify changes.

## Palette
- Neutral base: slate tones for page, panels, inactive circuit elements, and text hierarchy.
- Signal accent: cyan for active inputs, selected controls, active wires, and output state.
- Do not use separate red, green, yellow, and blue semantics for the same binary state.

The cyan accent exists to make a live signal immediately distinguishable from the inactive circuit. Neutral surfaces keep the truth table and diagram readable without competing with that state.

## Typography
- Inter is used for instructional copy because it remains readable at small interface sizes.
- JetBrains Mono is limited to binary values, signal labels, and truth-table data because fixed-width glyphs make 0/1 states easier to scan.
- Avoid wide-tracked uppercase labels unless the content specifically requires code-like notation.

## Layout
- Gate selection comes before the circuit because it defines the model being studied.
- The circuit is the primary focal point.
- Explanation and truth table support the circuit instead of competing with it.
- On narrow screens, the circuit gets a taller coordinate space rather than being squeezed into the desktop ratio.

## Motion and effects
- State transitions should be short and functional.
- Respect `prefers-reduced-motion`.
- Glow is reserved for the active output path and output indicator.
- Shadow is reserved for the circuit board as the primary working surface.

## Accessibility
- Normal text must meet WCAG AA contrast.
- Non-text circuit states and focus indicators must reach at least 3:1 contrast against adjacent colors.
- Controls need visible focus states, keyboard operation, meaningful accessible names, and at least 44 x 44 px touch targets.
- Binary state must be available as text, not color alone.
