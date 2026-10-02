# Design Direction

## Product
Digital Logic Lab is a single-page educational lab for learning digital logic from individual gates through combinational circuits. The learning loop is select a component, manipulate binary inputs, inspect signal flow and outputs, compare the state with the truth table, then test understanding in challenge mode.

## Audience
Students learning Sistem Digital who need a bridge between Boolean expressions, truth tables, gate-level concepts, and common combinational circuits.

## Visual language
Use the feel of a digital lab bench: dark neutral surfaces, precise signal paths, compact instructional text, and one live-signal accent. The interface should feel like an instrument used to inspect state, not a marketing dashboard. Avoid decorative technical grids, glass-heavy surfaces, and effects that do not explain circuit state.

## Design dials
- ENERGY 2: state changes should feel responsive while the interface remains instructional.
- RHYTHM 1: navigation, simulation, and analysis use a predictable workstation structure.
- MOTION 1: motion is limited to short state transitions that clarify changes.

## Identity motif
The repeated motif is a lab readout: binary values use fixed-width type, state is represented by precise signal lines and bordered readouts, and active logic uses one cyan signal color from input through output.

## Palette
- Neutral base: slate tones for page, panels, inactive circuit elements, tables, and text hierarchy.
- Signal accent: cyan for active inputs, active wires, selected controls, active outputs, and focus.
- Binary 0 stays neutral. Binary 1 uses cyan.
- Challenge correctness is communicated by text and border treatment, not by adding a second binary color system.

## Typography
- Inter is used for instructional copy because it remains readable at compact interface sizes.
- JetBrains Mono is limited to binary values, signal labels, Boolean expressions, and truth-table data because fixed-width glyphs improve state scanning.
- Uppercase is reserved for established digital-logic notation such as SUM, CARRY, CIN, and signal names. General interface labels remain sentence case.

## Layout
- Desktop follows a workstation model: component catalog, active simulator, and analysis inspector.
- The circuit and current input/output state are the primary focal point.
- Truth tables and challenge mode are supporting analysis tools.
- On tablet, the inspector moves below the simulator.
- On mobile, every column stacks into one reading order and controls remain at least 44 px high.
- Multi-output components must remain readable without horizontal page overflow; only the truth table may scroll inside its own container when needed.

## Components
- The component catalog is a compact list because its purpose is navigation, not feature marketing.
- Input controls are larger than output readouts because inputs are interactive and outputs are observational.
- Compound circuits use block diagrams with internal stage labels. Individual gates use gate-shaped SVG diagrams.
- Component metadata is data-driven so UI treatment remains consistent across new logic blocks.

## Motion and effects
- State transitions should be short and functional.
- Respect `prefers-reduced-motion`.
- Glow is reserved for the active output node only.
- Shadow is reserved for the circuit board as the primary working surface.

## Accessibility
- Normal text must meet WCAG AA contrast.
- Non-text circuit states and focus indicators must reach at least 3:1 contrast against adjacent colors.
- Controls need visible focus states, keyboard operation, meaningful accessible names, and at least 44 x 44 px touch targets.
- Binary state must be available as text, not color alone.
- Selected catalog items and bit controls expose state with `aria-pressed`.
- Output state and challenge feedback use live status regions.
- Keyboard shortcuts must not intercept typing inside text fields.

## Major decision reasons
- Dark theme: circuit visualization benefits from a stable low-luminance ground where cyan signal state remains distinct.
- Three-column desktop layout: catalog, simulation, and analysis are three simultaneous tasks in a learning lab.
- Cyan-only signal semantics: one color maps to one meaning, binary 1, across every component.
- Data-driven catalog: the educational scope is expected to grow beyond the initial gate set.
- Native JavaScript modules: the project remains deployable as static files while gaining maintainable boundaries between logic, data, and UI.
