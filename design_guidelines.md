# Trading Signal Admin Panel - Design Guidelines

## Design Approach

**Selected Approach**: Modern Admin Dashboard System inspired by Linear, Vercel, and Stripe
**Justification**: As a utility-focused, data-intensive admin panel for trading signal management, the design prioritizes clarity, efficiency, and real-time data visualization over decorative elements. Drawing from industry-leading admin interfaces ensures professional credibility and user familiarity.

**Key Design Principles**:
- Information hierarchy through typography and spacing, not color
- Functional minimalism - every element serves a purpose
- Real-time feedback for live trading data
- Scannable data tables with clear visual states
- Consistent interaction patterns across all CRUD operations

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**:
- Background Base: `222 47% 11%` (neutral dark)
- Surface/Card: `222 47% 15%` (elevated dark)
- Border: `215 20% 25%` (subtle separation)
- Text Primary: `210 40% 98%` (high contrast white)
- Text Secondary: `215 20% 65%` (muted text)

**Brand & Status Colors**:
- Primary Action: `217 91% 60%` (professional blue)
- Success/Profit: `142 71% 45%` (trading green)
- Danger/Loss: `0 84% 60%` (trading red)
- Warning: `38 92% 50%` (alert amber)
- Neutral: `215 16% 47%` (inactive state)

**Light Mode** (Optional fallback):
- Background: `0 0% 100%`
- Surface: `210 20% 98%`
- Borders: `214 32% 91%`

### B. Typography

**Font Stack**:
- Primary: `Inter` (Google Fonts) - UI elements, body text
- Monospace: `JetBrains Mono` - numeric data, prices, quantities

**Hierarchy**:
- Page Titles: `text-2xl font-semibold tracking-tight` (30px)
- Section Headers: `text-lg font-medium` (18px)
- Body/Labels: `text-sm font-normal` (14px)
- Data/Metrics: `text-base font-mono` (16px monospace)
- Captions: `text-xs text-muted-foreground` (12px)

### C. Layout System

**Spacing Primitives**: Consistent use of `2, 4, 6, 8, 12, 16` units
- Component padding: `p-4` to `p-6`
- Section spacing: `space-y-8`
- Card spacing: `gap-4`
- Table cell padding: `px-4 py-3`

**Grid Structure**:
- Dashboard: 3-column metrics grid (`grid-cols-1 md:grid-cols-3 gap-4`)
- Tables: Full-width with internal column definitions
- Forms: Single column, max-width `max-w-2xl`
- Feature toggles: 2-column layout (user list | permission checkboxes)

**Container Widths**:
- Main content: `max-w-7xl mx-auto px-4`
- Forms: `max-w-2xl`
- Modals: `max-w-md` to `max-w-lg`

### D. Component Library

**Navigation**:
- Sidebar: Fixed left, 240px width, dark background with icon+label nav items
- Active state: Subtle blue left border + blue text color
- Hover: Slight background lightening (`hover:bg-white/5`)

**Data Tables**:
- Header: Sticky, slightly elevated background, sortable columns with arrow indicators
- Row hover: Subtle background change (`hover:bg-white/5`)
- Striped rows: Optional alternating backgrounds for dense data
- Action column: Right-aligned with icon buttons (edit, delete)
- Pagination: Bottom-right with page info and controls

**Trading Signal Form**:
- 4-field layout with intelligent toggle
- Toggle switch prominent between Qty/Amount fields
- Disabled field: Reduced opacity (0.5) with calculated value display
- Real-time calculation feedback: Smooth value updates
- Primary CTA: Full-width blue button at bottom

**Cards/Panels**:
- Background: Surface color with subtle border
- Border radius: `rounded-lg` (8px)
- Shadow: Minimal or none - rely on borders
- Padding: `p-6` for content areas

**Buttons**:
- Primary: Blue background, white text, medium size
- Secondary: Outlined, transparent background
- Destructive: Red background for delete actions
- Icon buttons: Square, same height, ghost variant
- Sizes: `h-9` (default), `h-10` (large CTAs)

**Form Inputs**:
- Height: `h-10` consistent across all inputs
- Border: Subtle border with focus ring in brand blue
- Dark backgrounds with light text
- Labels: Above inputs, `text-sm font-medium`
- Helper text: Below, `text-xs text-muted-foreground`

**Charts** (Recharts):
- Line charts: Trading signals with time-series data
- Color scheme: Green (profit), Red (loss), Blue (neutral/volume)
- Grid: Subtle dotted lines
- Tooltips: Dark card with white text, formatted values
- Axes: Muted labels, clear tick marks

**Modals/Dialogs**:
- Overlay: Dark backdrop (50% opacity)
- Container: Centered, dark surface, `rounded-lg`
- Header: Border bottom separation
- Footer: Action buttons right-aligned

**Feature Toggles Interface**:
- Left panel: User list with search, scrollable
- Right panel: Permission matrix with labeled checkboxes
- Global toggles section: Separate card above with master switches
- Visual grouping: Bordered sections for clarity

**Status Indicators**:
- Active/Online: Green dot indicator
- Pending: Amber pulse animation
- Error: Red with alert icon
- Loading: Blue spinner, subtle

### E. Interactions & Animations

**Minimal, Purposeful Motion**:
- Page transitions: None (instant navigation)
- Data updates: Smooth value changes (200ms ease)
- Hover states: Instant background changes
- Loading states: Subtle spinner, no skeleton screens
- Real-time updates: Gentle highlight flash (green/red for +/-)
- Modal entry: Fade in 150ms
- No parallax, no scroll-triggered animations

---

## Page-Specific Guidelines

**Dashboard**:
- Top: 3 metric cards (Total Signals, Active Users, Success Rate)
- Middle: Recent signals table (compact, 5 rows)
- Bottom: Performance chart (line chart, last 30 days)

**Trading Signals**:
- Top: Add Signal button (primary, right-aligned)
- Form modal: 4 fields with toggle, validation feedback
- Main: Sortable table with symbol, entry, qty, amount, status, actions
- Export CSV: Secondary button top-right

**User Management**:
- Table: Email, role, status, registration date, actions
- Actions: Forgot Password button (sends email), Edit role
- No inline password reset forms

**Feature Toggles**:
- Section 1: Global page toggles (Dashboard, Signals, Users, etc.)
- Section 2: User-specific grid (user rows × page columns of checkboxes)
- Clear visual separation between global and per-user sections

**Authentication Pages**:
- Centered card layout, max-width 400px
- Logo/branding at top
- Form fields with clear validation states
- Links: Forgot password, Register admin
- Success messages: Green alert banners

---

## Critical Quality Standards

- **No hero images or decorative graphics** - This is a data-focused admin tool
- **Consistent dark mode throughout** - All inputs, tables, modals match dark theme
- **Monospace for all numeric data** - Prices, quantities, dates use JetBrains Mono
- **Real-time visual feedback** - WebSocket updates show subtle color flashes
- **Accessibility**: WCAG AA contrast ratios, keyboard navigation, ARIA labels on interactive elements
- **Responsive**: Tables scroll horizontally on mobile, cards stack, sidebar collapses to icon-only