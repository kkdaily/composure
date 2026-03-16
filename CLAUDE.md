# Composure — Project Guide

Composure is a React component library and documentation site built specifically for AI-powered web interfaces (think ChatGPT, Claude, Replit). The components solve real, recurring UI problems in AI apps that developers currently reinvent from scratch on every project.

The deliverable is two things in one repo:
1. The component library itself (`/src/components`, `/src/tokens`)
2. A single-page documentation site (`/src/docs`) that showcases every component with live examples, props tables, and code snippets — similar in feel to shadcn/ui or Radix UI docs

---

## Styling rules

- Use CSS Modules for all component styles. Every component has a corresponding `.module.css` file
- Use CSS custom properties (defined in `tokens.css`) for every color, spacing value, font size, border radius, animation speed, and transition easing. Never hardcode these values anywhere
- Never use inline styles
- Never install an external UI library (no Radix, MUI, Chakra, etc.)
- Never use Tailwind

---

## TypeScript rules

- Every component must have an exported TypeScript interface for its props
- Prefer string union types over booleans for variant-style props. Use `role: 'assistant' | 'user'` not `isAssistant: boolean`
- Export all props interfaces from the component file so consumers can import them

---

## Component API rules

- Every component must accept a `className` prop for external style overrides
- Components should have sensible defaults and work correctly with zero props passed
- Callbacks follow the `onEventName` convention and are always optional props
- All input components must be controlled — they accept a `value` prop and `onChange` callback. The parent owns state, not the component

### When to use a flat props API vs. composable sub-components

Not every component needs sub-components. Use the right pattern for the component's complexity:

**Flat props API** — for components that are a single interactive element with optional decoration (icons, spinners). These have one semantic role and no independently interactive children. Examples: Button, IconButton. Use `before`/`after` ReactNode slots for extensibility rather than sub-components.

**Composable sub-components** — for components that contain multiple distinct, independently interactive pieces. If a component has a textarea *and* optional layout slots that each have their own behavior, it should be decomposed into separately exported primitives that share state through React context. Examples: Composer (root + input + footer).

### Sub-component design rules (shadcn pattern)

The design philosophy follows shadcn/ui, not traditional compound components. Sub-components are **independently importable named exports**, not dot-notation namespace objects. This enables tree-shaking and keeps each piece a focused, loosely coupled primitive.

```tsx
// ✅ Correct — shadcn-style separate named exports
import { Composer, ComposerInput, ComposerFooter } from 'composure'

// ❌ Wrong — compound dot-notation pattern
import { Composer } from 'composure'
<Composer.Input />
```

When a component needs sub-components, follow these conventions:
- Export each piece as a **separate named export** from the same file — `Composer`, `ComposerInput`, `ComposerFooter` — not dot notation (`Composer.Input`).
- The root component provides shared state via React context. Sub-components consume context internally — consumers never deal with context directly.
- Each sub-component is a focused primitive with its own props interface, its own `className` prop, and minimal assumptions about its siblings. Sub-components are loosely coupled through context, not tightly bound to a parent object.
- Sub-components should be usable in any order and any combination within the root. The root should not break if an optional sub-component is omitted.
- All sub-components live in the same folder (`/src/components/ComponentName/`) and are exported from the same file.

### Avoid opinionated sub-components

Do not create sub-components that wrap existing library primitives with hardcoded opinions (variant, size, icon). If a sub-component would just be a thin wrapper around `Button` or `IconButton` with preset props, don't create it — let the consumer use `Button` or `IconButton` directly. Components should provide **structure and behavior** (layout, context, keyboard handling, auto-resize) but not prescribe which buttons, icons, or variants the consumer uses. The consumer already has the building blocks — don't re-wrap them.

---

## Token system

Tokens are defined in `/src/tokens/tokens.css` and imported once at the app root. They are the single source of truth for all visual values. Components never reference raw values — only variable names.

### Categories
- **Colors** — backgrounds (3 levels), text (primary/secondary/muted), accent, assistant bubble, user bubble, destructive, border. Support light and dark mode via `@media (prefers-color-scheme: dark)`
- **Spacing** — `--space-1` through `--space-10` on a base-4px scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px)
- **Typography** — `--text-xs` through `--text-2xl`
- **Border radius** — `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`
- **Animation** — `--speed-fast` (120ms), `--speed-normal` (220ms), `--speed-stream` (30ms), `--ease-out` (cubic-bezier(0.16, 1, 0.3, 1))

---

## File structure

```
/src
  /tokens
    tokens.css
  /components
    /ComponentName
      ComponentName.tsx
      ComponentName.module.css
  /docs
    /pages
      one file per component doc page
    Sidebar.tsx
    DocsLayout.tsx
App.tsx
```

One folder per component, no exceptions. Each folder is self-contained.

---

## Documentation site rules

The aesthetic should feel like shadcn's documentation site — minimal, clean typography, subtle sidebar. No gradients, no decorative elements.

- Fixed left sidebar (240px) listing all pages: Overview, Tokens, then one entry per component in alphabetical order
- Top header with library name and tagline
- Main content area renders the active page
- Navigation uses React Router (`react-router-dom`) with clean URLs — each page has a direct URL (e.g. `/avatar`, `/code-block`). The sidebar uses `NavLink` for automatic active state. Routes are defined in `App.tsx`, the `BrowserRouter` wraps the app in `main.tsx`
- Active sidebar item has a clear but subtle highlight state (handled automatically by `NavLink`)

### Tokens page
Visually renders the full token set — color swatches with variable names, spacing scale as sized rectangles, typography scale showing each size, animation speeds labeled clearly.

### Each component doc page
- Live interactive demo at the top
- All major variants/states shown below, each with a short description of when to use that prop, followed by live examples and a copyable `CodeSnippet`
- Props table with columns: Prop, Type, Default, Description. Only list props that are custom to the component — omit inherited/generic props like `className`, `children`, `onClick`, `value`, `onChange`, etc. that exist on every component. If a sub-component has only generic props and no custom ones, omit it from the props table entirely — no standalone explanation needed
### Prop example sections
Each prop or feature gets its own section below the demo. The structure for every section is:
1. **Heading** — the prop or feature name (e.g. "Variants", "Sizes", "Loading")
2. **Description** — 1–2 sentences explaining *when* and *why* to use this prop, framed around real AI interface scenarios (e.g. "Use `disabled` when a precondition hasn't been met — for example, disabling the send button until the user has typed a message"). Uses the `styles.sectionDescription` class.
3. **Live examples** — rendered component instances showing the prop in action
4. **Code snippet** — a `CodeSnippet` showing the corresponding JSX

### Code snippets
Use the `CodeSnippet` component (`src/docs/CodeSnippet.tsx`) for all code blocks in doc pages — never use raw `<pre>` tags. `CodeSnippet` renders a `<pre><code>` block with a copy-to-clipboard `IconButton` in the top-right corner (swaps to a checkmark on success). Do not add a separate "Usage" section at the bottom — the per-section snippets already serve that purpose.

### Interactive demo pattern
The demo section at the top of each doc page renders a single live instance of the component with controls beneath it. Every meaningful prop gets a control row:

- **String union props** (variant, size, etc.) — a row of chip-style buttons, one per option, with the active option highlighted. The prop label is uppercase on the left (`VARIANT`, `SIZE`, etc.)
- **Multi-option props** that aren't a direct prop union — use a single row of chips representing all useful states. Example: icon placement uses chips `none`, `before`, `after`, `both` rather than two separate boolean toggles
- **Boolean props** (loading, disabled, etc.) — a single chip that toggles between `on`/`off`

All controls use the same visual chip pattern (`styles.chip` / `styles.chipActive`) for consistency. Every control row follows the layout: `[LABEL]  [chip] [chip] [chip]`.

Icons and labels used in demos should be contextually relevant to AI interfaces (send, copy, regenerate, sparkle, etc.) — not generic placeholders.

---

## Accessibility rules

Every component must meet WCAG 2.1 AA standards. Run an accessibility audit whenever a new component is created or an existing component's props are added or changed. Identify gaps and fix them immediately — do not leave accessibility improvements as future work.

### Required for every component
- Use semantic HTML elements (`<button>`, `<input>`, `<dialog>`, etc.) — never `<div>` with `role="button"` unless there is no semantic equivalent
- Use `focus-visible` for keyboard focus styling (2px solid accent outline, 2px offset)
- Support native `disabled` attribute; use `cursor: not-allowed` and reduced opacity when disabled
- Extend the appropriate `HTMLAttributes` type (e.g. `ButtonHTMLAttributes`) so consumers can pass `aria-*` attributes through via `...rest`

### Decorative vs meaningful content
- Icon slots, spinners, and decorative visuals must have `aria-hidden="true"`
- Icon-only interactive elements must have a required `label` prop rendered as `aria-label`

### Loading states
- Set `aria-busy="true"` on the element during loading (use `aria-busy={loading || undefined}` to omit when false)
- Disable interaction during loading via native `disabled`

### Color and theming
- Never hardcode `#ffffff` or any raw color value in component styles — use token variables
- Use `--color-text-on-accent` for text rendered on accent/destructive backgrounds so contrast can be adjusted centrally
- All color pairings must maintain a minimum 4.5:1 contrast ratio (AA standard)

### Motion
- Every component with transitions or animations must include a `@media (prefers-reduced-motion: reduce)` block that disables `transition` and `animation` properties

---

## Build order

Always follow this sequence. Do not skip ahead. Verify each step renders correctly before moving to the next.

1. Token system — define `tokens.css`, verify it imports correctly at the app root
2. Docs site shell — sidebar, layout, empty page placeholders
3. Components — one at a time, in the order they are specified in conversation
4. Doc pages — fill in each component's doc page immediately after the component is built, not at the end

---

## Never do this

- Never hardcode a color, spacing value, or animation speed — always use `var(--token-name)`
- Never install an external UI dependency without explicitly confirming with the user first
- Never use inline styles
- Never build a new component on top of a broken or untested one
- Never combine multiple component builds into a single step — one component at a time
- Never leave a doc page as a placeholder after its component is complete

---

## How to work

- If a decision involves a genuine tradeoff, briefly state the options and make a recommendation — don't ask for clarification on every small thing
- When something is broken, fix it before continuing
- Keep the file structure clean and consistent with the conventions above
