# PixelPrism Design System: Studio Brutalist

**"Sharp but Alive"**

---

This is the authoritative design specification for every surface, component, and interaction in PixelPrism. It is not a suggestion. It is the system. Every page, every feature, every prototype must conform to what is written here. If a decision is not covered, extrapolate from the principles below — never from external defaults.

PixelPrism is a social media marketing tool built for small and medium businesses. The interface must feel powerful without feeling enterprise, precise without feeling clinical.

---

## 1. Philosophy & Identity

**Studio Brutalist** is the name. The tagline is **"Sharp but Alive."**

The central design tension is between brutalist geometry and warm depth. Every surface is hard-edged — zero border-radius on everything, no exceptions. But the system is not cold. Warmth comes from gold-tinted shadows, layered depth, and a color palette pulled from late-afternoon light on dark water.

Zero border-radius is an identity choice, not a limitation. Rounded corners are a crutch for approachability. We achieve approachability through shadow, color temperature, and motion instead. A sharp rectangle with a warm gold glow is more inviting than a rounded card with no soul.

**Visual tension IS the design.** The system is built on deliberate contradictions that create energy:

- Smooth monotone curves sit next to square 6x6 data points on charts.
- Filled buttons invert to outlined on hover — solid becomes transparent, background becomes border.
- Glass-effect transparency lives on rigid rectangular containers.
- Editorial typefaces command from the top of the page; conversational ones soften the body.

These tensions are not accidental. They are the system. Remove the tension and you remove the identity.

---

## 2. Color System

### Surface Depths

The interface uses a three-depth surface system. Every surface belongs to one of these layers.

| Layer        | Hex       | Usage                                      |
| ------------ | --------- | ------------------------------------------ |
| Background   | `#071a26` | Page background, app shell                 |
| Card         | `#0e2838` | Cards, containers, table bodies, sidebars  |
| Popover      | `#163344` | Dropdowns, modals, popovers, context menus |

There is also one muted background value:

| Layer            | Hex       | Usage                           |
| ---------------- | --------- | ------------------------------- |
| Muted Background | `#0b2230` | Table headers, progress tracks  |

### Semantic Colors

| Role                  | Hex       | Usage                                                       |
| --------------------- | --------- | ----------------------------------------------------------- |
| Primary (Gold)        | `#f4b964` | Buttons, focus rings, table accents, borders, progress bars |
| Accent (Coral)        | `#e8956a` | Section labels, overlines, gradient endpoints               |
| Muted (Teal)          | `#6d8d9f` | Secondary text, placeholders, captions, disabled states     |
| Secondary Foreground  | `#d4dce2` | Primary readable text on cards and surfaces                 |
| Foreground            | `#eaeef1` | Headings, high-emphasis text, primary foreground            |
| Destructive (Red)     | `#e85454` | Errors, delete actions, failed states                       |

### Chart Palette

Used in order. Cycle restarts after five.

| Index | Name       | Hex       |
| ----- | ---------- | --------- |
| 1     | Gold       | `#f4b964` |
| 2     | Cyan       | `#64dcf4` |
| 3     | Coral      | `#e8956a` |
| 4     | Lime       | `#a4f464` |
| 5     | Light Gold | `#f4d494` |

### Gold-Tinted Border Opacity Scale

All borders use `#f4b964` at varying opacities. Never use gray or white borders.

```
rgba(244, 185, 100, 0.06)  — Barely visible separators (e.g., between list items)
rgba(244, 185, 100, 0.08)  — Section dividers
rgba(244, 185, 100, 0.12)  — Card borders, component outlines (default resting state)
rgba(244, 185, 100, 0.14)  — Input borders (resting)
rgba(244, 185, 100, 0.22)  — Hover-brightened borders
rgba(244, 185, 100, 0.45)  — Focus rings, active input borders
```

This is a spectrum, not a menu. Resting states sit in the 6-14% range. Interactive feedback lives at 22%+. Focus states push to 45%.

---

## 3. Typography

### Dual Font System

The type system uses two primary families and one monospace, with an intentional switch point.

**Neue Montreal** handles everything editorial and commanding — display type, headings, labels, and navigation. It is geometric, confident, and slightly cold on its own.

**General Sans** handles everything warm and conversational — body copy, descriptions, form help text, and smaller readable content. It is friendly, open, and highly legible at small sizes.

The switch point is **H4 (17px)**. Everything at H4 and below uses General Sans. Everything above uses Neue Montreal. This is not arbitrary. The shift from commanding to conversational happens exactly where content transitions from scannable headings to readable paragraphs.

**JetBrains Mono** is used exclusively for data display — statistics, metrics, code, and chart axis labels. Any number that represents a data point uses this face.

### Type Scale

#### Neue Montreal (Editorial/Commanding)

| Token   | Size  | Weight | Extras                           | Usage                        |
| ------- | ----- | ------ | -------------------------------- | ---------------------------- |
| Display | 80px  | 700    | —                                | Hero headlines, landing pages |
| H1      | 44px  | 700    | —                                | Page titles                  |
| H2      | 32px  | 700    | —                                | Section headings             |
| H3      | 22px  | 500    | —                                | Subsection headings          |
| Label   | 11px  | 500    | UPPERCASE, letter-spacing 0.10em | Form labels, badge text      |
| Nav     | 13px  | 500    | UPPERCASE, letter-spacing 0.06em | Navigation items             |

#### General Sans (Warm/Conversational)

| Token   | Size | Weight | Usage                                |
| ------- | ---- | ------ | ------------------------------------ |
| H4      | 17px | 600    | Card titles, list headers (THE SWITCH POINT) |
| Body    | 15px | 400    | Paragraphs, descriptions             |
| BodySm  | 13px | 400    | Secondary copy, help text            |
| Caption | 11px | 400    | Captions, timestamps, metadata       |

#### JetBrains Mono (Data)

| Token | Size | Weight | Extras                  | Usage                      |
| ----- | ---- | ------ | ----------------------- | -------------------------- |
| Data  | 14px | 700    | letter-spacing 0.02em   | KPI values, stat numbers   |
| Code  | 13px | 400    | —                       | Code snippets, technical   |

### Font Files

| Family         | Format        | Weights Available |
| -------------- | ------------- | ----------------- |
| Neue Montreal  | OTF (static)  | 300, 400, 500, 700 |
| General Sans   | WOFF2 (variable) | 200-700         |
| JetBrains Mono | WOFF2 (variable) | 100-800         |

---

## 4. Depth & Layering

### Shadow System

Every shadow in the system uses dual layers. Single-layer shadows are flat and lifeless. The first layer provides the broad ambient shadow; the second provides the tight contact shadow.

| Tier     | Value                                                                     | Usage                          |
| -------- | ------------------------------------------------------------------------- | ------------------------------ |
| Base     | `0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.10)`               | Cards, swatches, containers    |
| Elevated | `0 8px 24px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10)`              | Hover states, dropdowns        |
| Modal    | `0 12px 40px rgba(0,0,0,0.25), 0 4px 8px rgba(0,0,0,0.12)`             | Dialogs, modals                |
| Toast    | `0 4px 16px rgba(0,0,0,0.18)`                                            | Toasts, tooltips (single-layer exception for subtlety) |

### Shadow Bloom

On hover, interactive elements gain a colored glow in addition to their elevated shadow. This is the "alive" in "Sharp but Alive."

```css
/* Primary (gold) bloom */
box-shadow: 0 8px 24px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10), 0 0 20px rgba(244, 185, 100, 0.20);

/* Destructive (red) bloom */
box-shadow: 0 8px 24px rgba(0,0,0,0.20), 0 2px 4px rgba(0,0,0,0.10), 0 0 20px rgba(232, 84, 84, 0.20);
```

### Noise Texture

A fixed-position SVG noise overlay covers the entire viewport at all times. It adds grain and warmth to what would otherwise be flat dark surfaces.

```css
.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.025; /* 2.5% */
}
```

The SVG uses `<feTurbulence type="fractalNoise">`. The noise is cosmetic — it must never intercept clicks or affect layout.

### Glass / Frosted Effect

Used sparingly on secondary buttons and navigation backgrounds.

```css
/* Secondary button glass */
backdrop-filter: blur(8px);

/* Navigation bar */
@apply backdrop-blur-sm; /* Tailwind: 4px blur */
```

### Z-Layering

| Layer      | z-index | Content                        |
| ---------- | ------- | ------------------------------ |
| Noise      | 0       | Background noise texture       |
| Content    | 10      | Page content, cards, sections  |
| Navigation | 50      | Sticky nav, floating headers   |

---

## 5. Motion & Interaction

### Spring Easing

The system uses one primary easing curve for all transitions:

```css
transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
```

This curve overshoots slightly before settling. On a rigid rectangle, this overshoot creates a sense of physicality — as if the element has weight and momentum. Never use `ease`, `ease-in-out`, or `linear` as the sole timing function on any interactive transition.

### Duration Hierarchy

| Duration | Usage                                    |
| -------- | ---------------------------------------- |
| 80ms     | Click/press feedback (active states)     |
| 200ms    | List items, table rows                   |
| 250ms    | Buttons, inputs, tooltips                |
| 300ms    | Cards, larger containers                 |

### translateY Micro-Interactions

Every clickable element uses vertical translation for tactile feedback:

```css
/* Hover: lift */
transform: translateY(-2px);

/* Active: press */
transform: translateY(1px);
```

The lift on hover is subtle but perceptible. The press on active is smaller but provides the "click" feeling. Both must be present on every interactive element.

### The "Hard Invert" Pattern

Primary interactive elements invert their fill/stroke relationship on hover:

**Primary button:**
- Resting: `background: #f4b964`, `color: #071a26`, `border: 1px solid #f4b964`
- Hover: `background: transparent`, `color: #f4b964`, `border: 1px solid #f4b964`

**Bar chart rectangle:**
- Resting: filled rect with drop-shadow
- Hover: `fill: transparent`, `stroke: currentColor`, `stroke-width: 2px`

This inversion is not optional on primary actions. It is the signature interaction of the system.

### Gold Left Accent Bar

Table rows and dropdown items reveal a gold left accent bar on hover:

```css
/* Implemented via a pseudo-element or dedicated element */
width: 3px;
background: #f4b964;
/* Animate in via: */
transform: scaleY(0);        /* resting */
transform: scaleY(1);        /* hover */
transform-origin: top;
transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Row Dimming

When hovering over a table row or list item, non-hovered siblings dim:

```css
/* On parent hover, all children dim */
.row-group:hover .row { opacity: 0.85; }

/* The hovered child stays full */
.row-group:hover .row:hover { opacity: 1; }
```

Transition: `200ms cubic-bezier(0.34, 1.56, 0.64, 1)`.

### Navigation Underline

The active/hover underline on nav items expands from center outward:

```css
/* Pseudo-element approach */
&::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  right: 50%;
  height: 2px;
  background: #f4b964;
  transition: left 250ms cubic-bezier(0.34, 1.56, 0.64, 1),
              right 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

&:hover::after,
&.active::after {
  left: 0;
  right: 0;
}
```

### Tooltip Entrance

```css
/* Initial (hidden) */
opacity: 0;
transform: scale(0.94) translateY(2px);

/* Visible */
opacity: 1;
transform: scale(1) translateY(0);
transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 6. Spacing & Layout

### Page Structure

| Property           | Tailwind     | Value  |
| ------------------ | ------------ | ------ |
| Max content width  | `max-w-7xl`  | 1280px |
| Center alignment   | `mx-auto`    | —      |
| Horizontal padding | `px-8`       | 32px   |
| Vertical padding   | `py-16`      | 64px   |

### Vertical Rhythm

| Context               | Tailwind      | Value  |
| --------------------- | ------------- | ------ |
| Between page sections | `space-y-32`  | 128px  |
| Within sections       | `space-y-8`   | 32px   |
| Card grids            | `gap-6`       | 24px   |
| Form / chart grids    | `gap-8`       | 32px   |
| Button groups         | `gap-4`       | 16px   |
| Nav items             | `gap-8`       | 32px   |

### Navigation

```css
height: 64px;       /* h-16 */
position: sticky;
top: 0;
z-index: 50;
border-bottom: 1px solid rgba(244, 185, 100, 0.08);
```

The nav bar uses `backdrop-blur-sm` for the frosted glass effect over scrolling content.

---

## 7. Component Interaction Rules

Every interactive element must implement **all three** feedback states: hover, focus, and active. An element with only a hover state is incomplete.

### Buttons

| State  | Behavior                                                                                     |
| ------ | -------------------------------------------------------------------------------------------- |
| Hover  | Hard invert (filled to outlined) + `translateY(-2px)` + shadow base to elevated + gold bloom |
| Focus  | Gold focus ring: `0 0 0 3px rgba(244, 185, 100, 0.08)`                                      |
| Active | `translateY(1px)`, 80ms duration                                                             |

### Cards

| State  | Behavior                                                                                     |
| ------ | -------------------------------------------------------------------------------------------- |
| Hover  | `translateY(-2px)` + shadow base to elevated + border opacity 12% to 22%, 300ms              |
| Active | `translateY(1px)`, 80ms                                                                      |

### Table Rows

| State  | Behavior                                                                                     |
| ------ | -------------------------------------------------------------------------------------------- |
| Hover  | 3px gold left bar (scaleY animation) + `rgba(244, 185, 100, 0.04)` background tint + siblings dim to 0.85 opacity |

### Inputs

| State  | Behavior                                                                                     |
| ------ | -------------------------------------------------------------------------------------------- |
| Focus  | Border opacity 14% to 45% + outer glow ring via box-shadow                                  |

### Dropdowns (Focused Item)

| State   | Behavior                                                                                    |
| ------- | ------------------------------------------------------------------------------------------- |
| Focused | 3px gold left bar + text color shifts to `#f4b964` + `rgba(244, 185, 100, 0.06)` background |

### Tooltips

| State    | Behavior                                                                                   |
| -------- | ------------------------------------------------------------------------------------------ |
| Entrance | `scale(0.94) translateY(2px)` to `scale(1) translateY(0)`, 250ms spring easing             |

---

## 8. Badge & Status System

All badges follow a single structural pattern:

```
Background:  status-color at 12% opacity
Border:      status-color at 20% opacity, 1px solid
Text:        status-color at 100%
Font:        Neue Montreal 500, 11px, UPPERCASE, letter-spacing 0.08em
Padding:     4px 12px
```

### Status Definitions

| Status    | Color Hex  | Extra Behavior                                                |
| --------- | ---------- | ------------------------------------------------------------- |
| Live      | `#f4b964`  | Pulsing 6x6 square dot, `animation: pulse 1.5s ease-in-out infinite` |
| Scheduled | `#e8956a`  | Static                                                        |
| Draft     | `#6d8d9f`  | Static                                                        |
| Failed    | `#e85454`  | Static                                                        |
| Trending  | `#f4b964`  | Background at 15% instead of 12%                              |
| New       | `#e8956a`  | Background at 15% instead of 12%                              |
| Pro       | `#64dcf4`  | Static                                                        |

The "Live" pulsing dot is a 6x6 pixel square (not a circle). It uses a scale-based pulse:

```css
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.6; transform: scale(1.3); }
}

.live-dot {
  width: 6px;
  height: 6px;
  background: #f4b964;
  animation: pulse 1.5s ease-in-out infinite;
}
```

---

## 9. Chart & Data Visualization

### Line & Area Charts

- Curve type: **monotone** (smooth interpolation between points)
- Data points: **SquareDot** — a 6x6 pixel rect SVG element, not a circle
- Area gradient fill: top color at **12% opacity** fading to **0% opacity** at the bottom

```jsx
// Recharts example
<defs>
  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#f4b964" stopOpacity={0.12} />
    <stop offset="100%" stopColor="#f4b964" stopOpacity={0} />
  </linearGradient>
</defs>
```

### Bar Charts

- Bar radius: **always 0** (use `radius={[0, 0, 0, 0]}` explicitly)
- Resting state: filled rect with base shadow
- Hover state: **InvertBar** — fill becomes transparent, 2px stroke outline appears in the bar's color

### Grid & Axes

- Grid lines: **horizontal only**, `rgba(255, 255, 255, 0.04)`, solid
- Axis labels: **JetBrains Mono**, 11px, `#6d8d9f`
- No visible axis lines or tick marks

### Color Cycle

Apply in this order, cycling back to the start after five series:

```
1. #f4b964 (Gold)
2. #64dcf4 (Cyan)
3. #e8956a (Coral)
4. #a4f464 (Lime)
5. #f4d494 (Light Gold)
```

---

## 10. Toast & Notification Pattern

### Implementation

- Library: **sonner**
- Position: **bottom-center**
- Duration: **6000ms**

### Styling

```css
border-radius: 0;
background: #0e2838;
border: 1px solid rgba(244, 185, 100, 0.10);
color: #eaeef1;
font-family: 'General Sans', sans-serif;
box-shadow: 0 4px 16px rgba(0,0,0,0.18);
```

### Left Color Stripe

A 4px `border-left` indicates toast type:

| Type    | Color     |
| ------- | --------- |
| Info    | `#f4b964` |
| Success | `#a4f464` |
| Error   | `#e85454` |

---

## 11. Rules That Must Never Be Broken

These are absolute. They are not guidelines. They are not recommendations. Violating any of these rules means the implementation is wrong.

1. **Zero border-radius. Always. On everything.** No `rounded-sm`, no `rounded-lg`, no `border-radius: 2px` "just to soften it." Zero means zero. Buttons, cards, inputs, badges, tooltips, modals, toasts, dropdowns, avatars, charts, progress bars. Zero.

2. **Spring easing on all transitions.** The curve is `cubic-bezier(0.34, 1.56, 0.64, 1)`. Never use `ease`, `ease-in-out`, or `linear` as the sole timing function on any interactive transition. The overshoot is the personality.

3. **Gold-tinted borders, never gray or white borders.** Every border in the system uses `#f4b964` at an opacity from the defined scale. A `border-gray-700` or `border-white/10` is always wrong.

4. **Dual-layer shadows, never single shadows.** Every shadow (except toast) uses two layers: one broad ambient, one tight contact. A single `box-shadow` value (on non-toast elements) means a shadow is missing.

5. **Neue Montreal for headings and labels, General Sans for body. Never mix.** A heading in General Sans is wrong. Body text in Neue Montreal is wrong. The switch point is H4 (17px/600). Learn it.

6. **JetBrains Mono for any number displayed as data.** KPI values, chart labels, stat counters, percentages, currency amounts in dashboards. If it is a number the user is meant to read as data, it is in JetBrains Mono.

7. **Every hover must do something meaningful.** A color shift alone is not enough. Hovers must include at least one of: translation, shadow change, border change, inversion, or scale. The user must feel the element react.

8. **Noise texture always present in background.** The SVG fractalNoise overlay at 2.5% opacity is applied to the root layout. It is never removed, never conditionally rendered, never z-indexed behind the background.

9. **The "hard invert" pattern on primary actions.** Primary buttons and primary interactive elements invert from filled to outlined on hover. Filled background becomes transparent. Background color becomes border and text. This is the signature.

10. **translateY micro-interactions on all clickable elements.** `-2px` on hover, `+1px` on active. No clickable element should remain stationary when interacted with. The user must feel depth.

---

*This document governs all design decisions in PixelPrism. When in doubt, refer here. When this document and an implementation disagree, this document is correct.*
