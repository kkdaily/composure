# Implementation Plan

## Step 1 — Update CLAUDE.md

- Clarify sub-component design philosophy: emphasize shadcn-style **separate named exports** (not dot notation), loosely coupled through React context, tree-shakeable
- Accessibility audit trigger rule already exists — no change needed

## Step 2 — Add ComposerFooter sub-components

Add three new sub-components to `src/components/Composer/Composer.tsx`:

1. **ComposerFooter** — layout wrapper below the textarea row. Flexbox row with `justify-content: space-between`. Props: `className`, `children`.
2. **ComposerFooterStart** — groups left-aligned footer items. Flexbox row with gap. Props: `className`, `children`.
3. **ComposerFooterEnd** — groups right-aligned footer items. Flexbox row with gap, `margin-left: auto`. Props: `className`, `children`.

All three are pure layout primitives with no context dependency.

CSS changes to `Composer.module.css`:
- Add `flex-wrap: wrap` to `.composer` so footer drops to its own line
- Add `.footer` class with `flex-basis: 100%` to force full-width row
- Add `.footerStart` and `.footerEnd` classes

When no footer is present, layout is identical to current behavior.

## Step 3 — Update ComposerPage.tsx documentation

- Add "With Footer" section showing ComposerFooter with ComposerFooterStart and ComposerFooterEnd
- Add "Footer with Send Button" section showing ComposerSend placed inside ComposerFooterEnd
- Add props tables for ComposerFooter, ComposerFooterStart, ComposerFooterEnd

## Step 4 — Accessibility audit on Composer

Verify all sub-components meet WCAG 2.1 AA:
- Semantic HTML, aria-label on form, aria-disabled
- focus-visible, prefers-reduced-motion
- Keyboard navigation (Enter to submit, Shift+Enter for newline)
- Fix any gaps immediately
