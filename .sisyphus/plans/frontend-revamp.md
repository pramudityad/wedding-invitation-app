# Frontend Revamp - Watercolor Wedding Theme

## TL;DR

> **Quick Summary**: Transform the wedding invitation frontend from a minimal gray theme to an elegant watercolor aesthetic with dusty blue, peach/cream colors, floral borders, and romantic typography.
> 
> **Deliverables**:
> - Updated `theme.js` with new color palette and typography
> - Redesigned `InvitationLanding.jsx` with new sections and layout
> - Floral border overlay component
> - Entry animation (fade-in/slide-up)
> - Asset placeholder structure for user-provided images
> - Consistent styling applied to other pages
> 
> **Estimated Effort**: Medium (8-12 hours)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 (Theme) → Task 2 (Layout) → Task 5 (Entry Animation)

---

## Context

### Original Request
User wants to revamp the wedding invitation frontend using two watercolor-style reference images:
1. **Couple Portrait**: Use as actual asset in mid-page section
2. **Decorative Frame**: Design inspiration for floral borders, color palette, overall aesthetic

### Interview Summary
**Key Discussions**:
- **Scope**: Landing page focus with light touch on other pages
- **Styling System**: Keep MUI + styled-components (update theme.js)
- **Layout**: Single scroll page with Hero → Couple Image → Details → Countdown → RSVP → Navigation
- **Background**: Watercolor image (user will provide)
- **Borders**: Floral elements fixed at corners/edges, framing all content
- **Animation**: Subtle fade-in/slide-up on page load
- **Typography**: Add romantic script font (Great Vibes or Cormorant) for couple names
- **Assets**: User will provide later (watercolor bg, floral borders, couple portrait)
- **Verification**: Manual visual review in browser

**Research Findings**:
- Current theme uses gray palette (#333, #555, #f9f9f7)
- Typography: Playfair Display (headings) + Montserrat (body)
- InvitationLanding.jsx has 349 lines with existing styled components
- Countdown timer already exists
- RsvpSection, GiftBox, NavigationButtons are separate components
- Mobile-first responsive design already in place

### Color Palette (Extracted from References)
| Color | Hex | Usage |
|-------|-----|-------|
| Dusty Blue/Grey | `#7D8FA3` | Primary - buttons, accents, borders |
| Soft Peach/Cream | `#F5E6D3` | Secondary - backgrounds, cards |
| Champagne Gold | `#D4A574` | Accent - highlights, decorations |
| Soft Coral | `#D4836C` | Accent - small highlights |
| Deep Blue-Grey | `#4A5568` | Text - primary |
| Light Cream | `#FDF8F3` | Background - page base |

---

## Work Objectives

### Core Objective
Transform the landing page visual design to match the elegant watercolor aesthetic from the reference images while preserving all existing functionality.

### Concrete Deliverables
- `frontend/src/theme.js` - Updated with new color palette and typography
- `frontend/src/components/InvitationLanding.jsx` - Restructured with new sections and styling
- `frontend/src/components/FloralBorderOverlay.jsx` - New component for fixed floral frame
- `frontend/src/components/CoupleSection.jsx` - New component for couple portrait section
- `frontend/public/images/` - Directory structure for assets (placeholders)
- `frontend/src/index.css` or inline styles for entry animation
- Updated styling on: LoginPage, NavigationButtons, RsvpSection

### Definition of Done
- [x] Landing page displays with watercolor background
- [x] Floral borders visible at screen edges (fixed position)
- [x] Couple names use script font
- [x] Page loads with fade-in animation
- [x] All sections visible: Hero, Couple Image, Details, Countdown, RSVP, Navigation
- [x] Mobile responsive (320px - 1920px)
- [x] No console errors
- [x] All existing functionality preserved (RSVP, comments, navigation)

### Must Have
- New color palette applied throughout
- Script font for couple names
- Floral border overlay (with placeholder until assets provided)
- Entry animation
- Watercolor background (with CSS fallback until asset provided)
- Couple portrait section (with placeholder)

### Must NOT Have (Guardrails)
- **NO backend changes** - Frontend only
- **NO new features** - Visual redesign only, preserve existing functionality
- **NO removal of existing sections** - Keep GuestCommentsSection, GiftBox, MusicLauncher
- **NO complex animations** - Keep it subtle (simple fade/slide)
- **NO third-party animation libraries** - Use CSS keyframes or MUI transitions
- **NO changes to API calls or data flow**
- **NO changes to React Context structure**
- **NO removal of i18n translation keys** - Keep all t() calls

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: NO (no frontend tests in project)
- **User wants tests**: Manual-only
- **Framework**: None

### Manual Verification Procedures

Each task includes specific visual verification steps that can be performed by running `npm run dev` and checking in browser.

**Viewports to test**:
- Mobile: 375px width (iPhone SE)
- Tablet: 768px width (iPad)
- Desktop: 1440px width

**Browser**: Chrome DevTools device toolbar

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Update theme.js with new palette + fonts
└── Task 3: Create asset directory structure + placeholders

Wave 2 (After Wave 1):
├── Task 2: Restructure InvitationLanding.jsx layout
├── Task 4: Create FloralBorderOverlay component
└── Task 6: Create CoupleSection component

Wave 3 (After Wave 2):
├── Task 5: Add entry animation
├── Task 7: Update LoginPage styling
└── Task 8: Update NavigationButtons + RsvpSection styling

Final:
└── Task 9: Visual review and polish
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 4, 5, 6, 7, 8 | 3 |
| 2 | 1 | 5, 9 | 4, 6 |
| 3 | None | 2, 4, 6 | 1 |
| 4 | 1, 3 | 9 | 2, 6 |
| 5 | 2 | 9 | 7, 8 |
| 6 | 1, 3 | 9 | 2, 4 |
| 7 | 1 | 9 | 5, 8 |
| 8 | 1 | 9 | 5, 7 |
| 9 | 2, 4, 5, 6, 7, 8 | None | None (final) |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Dispatch |
|------|-------|---------------------|
| 1 | 1, 3 | `delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux"], run_in_background=true)` × 2 |
| 2 | 2, 4, 6 | `delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux"], run_in_background=true)` × 3 |
| 3 | 5, 7, 8 | `delegate_task(category="quick", load_skills=["frontend-ui-ux"], run_in_background=true)` × 3 |
| Final | 9 | `delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux", "playwright"])` |

---

## TODOs

### Task 1: Update Theme Configuration

- [x] 1. Update theme.js with new color palette and typography

  **What to do**:
  - Replace gray palette with watercolor colors (dusty blue, peach, gold, coral)
  - Add Google Font import for script font (Great Vibes or Cormorant Garamond)
  - Add custom palette keys: `accent`, `gold`, `coral`
  - Update component overrides (MuiButton, MuiTextField) with new colors
  - Add new typography variant for script font (e.g., `script` or `romantic`)

  **Must NOT do**:
  - Don't remove existing typography variants (h1-h6)
  - Don't change font weight structure
  - Don't add theme variables that aren't used

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Theme configuration is foundational UI work
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: MUI theming expertise, color system knowledge

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 3)
  - **Blocks**: Tasks 2, 4, 5, 6, 7, 8
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `frontend/src/theme.js:1-87` - Current theme structure (palette, typography, components)

  **External References**:
  - Google Fonts: `https://fonts.google.com/specimen/Great+Vibes` - Script font option
  - Google Fonts: `https://fonts.google.com/specimen/Cormorant+Garamond` - Elegant serif alternative
  - MUI Theming: `https://mui.com/material-ui/customization/theming/` - Theme customization docs

  **WHY Each Reference Matters**:
  - `theme.js` shows exact structure to modify (palette object, typography object, components object)
  - Google Fonts for font selection and import syntax
  - MUI docs for adding custom palette colors

  **Acceptance Criteria**:

  **Automated Verification (using Bash)**:
  ```bash
  # Agent runs:
  cd frontend && npm run build
  # Assert: Build succeeds with no errors
  # Assert: Exit code 0
  ```

  **Manual Verification (after build)**:
  ```
  1. Run: cd frontend && npm run dev
  2. Open: http://localhost:5173/login/TestGuest
  3. Verify: Page background is cream/peach toned (#FDF8F3 or similar)
  4. Verify: Text colors are dusty blue/grey, not gray
  5. Verify: No console errors about missing fonts
  ```

  **Evidence to Capture**:
  - [ ] Build output showing success
  - [ ] Screenshot of login page with new colors

  **Commit**: YES
  - Message: `style(theme): update color palette and typography for watercolor aesthetic`
  - Files: `frontend/src/theme.js`, `frontend/index.html` (font import)
  - Pre-commit: `cd frontend && npm run build`

---

### Task 2: Restructure Landing Page Layout

- [x] 2. Restructure InvitationLanding.jsx with new section order and styling

  **What to do**:
  - Update `StyledInvitationContainer` to use watercolor background image (with CSS fallback)
  - Remove `StyledCard` wrapper (full-bleed design instead of card)
  - Reorder sections: Hero → Couple Image placeholder → Wedding Details → Countdown → RSVP → Navigation
  - Apply new color palette to all styled components
  - Update `StyledCoupleNames` to use script font
  - Add proper spacing between sections
  - Ensure mobile responsiveness is preserved

  **Must NOT do**:
  - Don't remove any existing functionality (RSVP, comments fetch, etc.)
  - Don't change React hooks or state management
  - Don't modify API calls
  - Don't remove GuestCommentsSection, GiftBox, MusicLauncher components
  - Don't remove translation t() calls

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Major layout restructuring with visual focus
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Layout patterns, MUI styled-components, responsive design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 6)
  - **Blocks**: Tasks 5, 9
  - **Blocked By**: Task 1 (needs theme colors)

  **References**:

  **Pattern References**:
  - `frontend/src/components/InvitationLanding.jsx:16-93` - Current styled components to modify
  - `frontend/src/components/InvitationLanding.jsx:275-344` - Current JSX structure to restructure
  - `frontend/src/components/RsvpSection.jsx` - RSVP component integration pattern

  **External References**:
  - MUI Box: `https://mui.com/material-ui/react-box/` - Layout component docs
  - CSS background-image: `https://developer.mozilla.org/en-US/docs/Web/CSS/background-image`

  **WHY Each Reference Matters**:
  - Lines 16-93 show all styled components that need color/font updates
  - Lines 275-344 show component order to rearrange
  - RsvpSection shows how child components are integrated

  **Acceptance Criteria**:

  **Automated Verification (using Bash)**:
  ```bash
  # Agent runs:
  cd frontend && npm run build
  # Assert: Build succeeds with no errors
  # Assert: Exit code 0
  ```

  **Manual Verification**:
  ```
  1. Run: cd frontend && npm run dev
  2. Login at: http://localhost:5173/login/TestGuest
  3. Verify: Landing page loads without card wrapper (full-bleed)
  4. Verify: Sections appear in order: Hero, Details, Countdown, RSVP, Navigation
  5. Verify: Couple names use script font
  6. Verify: Background has watercolor colors (even if placeholder gradient)
  7. Verify: RSVP buttons still work (click Yes/No)
  8. Verify: Navigation buttons still navigate to /venue, /comments, etc.
  9. Test at 375px width - verify mobile layout works
  ```

  **Evidence to Capture**:
  - [ ] Build output showing success
  - [ ] Screenshot of landing page at desktop width
  - [ ] Screenshot of landing page at mobile width (375px)

  **Commit**: YES
  - Message: `refactor(landing): restructure layout with watercolor styling`
  - Files: `frontend/src/components/InvitationLanding.jsx`
  - Pre-commit: `cd frontend && npm run build`

---

### Task 3: Create Asset Directory Structure

- [x] 3. Create asset directory and placeholder files

  **What to do**:
  - Create `frontend/public/images/` directory
  - Create `frontend/public/images/wedding/` subdirectory for wedding-specific assets
  - Add placeholder README explaining expected assets:
    - `watercolor-bg.jpg` - Full-page watercolor background
    - `couple-portrait.png` - Couple illustration (transparent PNG)
    - `floral-border-top-left.png` - Top-left corner decoration
    - `floral-border-top-right.png` - Top-right corner decoration
    - `floral-border-bottom-left.png` - Bottom-left corner decoration
    - `floral-border-bottom-right.png` - Bottom-right corner decoration
    - `floral-side-left.png` - Left side vine decoration
    - `floral-side-right.png` - Right side vine decoration
  - Create simple CSS gradient placeholder that mimics watercolor look

  **Must NOT do**:
  - Don't create actual image assets (user will provide)
  - Don't add large placeholder images that bloat the repo

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file/directory creation
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Understands asset organization patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Tasks 2, 4, 6
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `frontend/public/` - Existing public directory structure
  - `frontend/vite.config.js` - Vite static asset handling

  **WHY Each Reference Matters**:
  - `public/` shows where static assets should go in Vite projects
  - Vite config confirms public directory is served at root

  **Acceptance Criteria**:

  **Automated Verification (using Bash)**:
  ```bash
  # Agent runs:
  ls -la frontend/public/images/wedding/
  # Assert: Directory exists
  # Assert: README.md file exists
  
  cat frontend/public/images/wedding/README.md
  # Assert: Contains list of expected asset filenames
  ```

  **Evidence to Capture**:
  - [ ] Directory listing output
  - [ ] README.md content

  **Commit**: YES
  - Message: `chore(assets): add image directory structure and asset guide`
  - Files: `frontend/public/images/wedding/README.md`
  - Pre-commit: None

---

### Task 4: Create Floral Border Overlay Component

- [x] 4. Create FloralBorderOverlay.jsx component

  **What to do**:
  - Create new component `frontend/src/components/FloralBorderOverlay.jsx`
  - Use `position: fixed` to keep borders at screen edges during scroll
  - Place corner decorations at top-left, top-right, bottom-left, bottom-right
  - Place side decorations along left and right edges
  - Use `pointer-events: none` so content beneath is clickable
  - Use CSS fallback (colored SVG or gradient) until real assets provided
  - Make responsive (smaller/hidden on mobile if needed)
  - Add `z-index` below modals but above content

  **Must NOT do**:
  - Don't make borders interactive (they're decorative only)
  - Don't block scrolling or content interaction
  - Don't use heavy images that slow page load
  - Don't overcomplicate with animation on the borders

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual component with positioning complexity
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: CSS positioning, overlay patterns, responsive design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 6)
  - **Blocks**: Task 9
  - **Blocked By**: Tasks 1, 3 (needs theme + asset structure)

  **References**:

  **Pattern References**:
  - `frontend/src/components/InvitationLanding.jsx:16-35` - Styled component pattern to follow
  - `frontend/src/components/PersistentMusicPlayer.jsx` - Example of fixed-position overlay component

  **External References**:
  - CSS position fixed: `https://developer.mozilla.org/en-US/docs/Web/CSS/position`
  - pointer-events: `https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events`

  **WHY Each Reference Matters**:
  - InvitationLanding shows MUI styled() pattern to use
  - PersistentMusicPlayer shows how to create fixed overlays that don't block interaction

  **Acceptance Criteria**:

  **Automated Verification (using Bash)**:
  ```bash
  # Agent runs:
  cd frontend && npm run build
  # Assert: Build succeeds
  
  grep -l "FloralBorderOverlay" frontend/src/components/*.jsx
  # Assert: Component file exists
  
  grep -l "FloralBorderOverlay" frontend/src/App.jsx
  # Assert: Component is imported and used in App
  ```

  **Manual Verification**:
  ```
  1. Run: cd frontend && npm run dev
  2. Open: http://localhost:5173/login/TestGuest → login → landing
  3. Verify: Decorative elements visible at screen corners
  4. Verify: Scroll the page - borders stay fixed
  5. Verify: Click on content (RSVP buttons, nav) - clicks work through borders
  6. Verify at 375px width: borders don't obstruct mobile content
  ```

  **Evidence to Capture**:
  - [ ] Build output
  - [ ] Screenshot showing border overlay on landing page

  **Commit**: YES
  - Message: `feat(ui): add floral border overlay component`
  - Files: `frontend/src/components/FloralBorderOverlay.jsx`, `frontend/src/App.jsx`
  - Pre-commit: `cd frontend && npm run build`

---

### Task 5: Add Entry Animation

- [x] 5. Add fade-in/slide-up entry animation to landing page

  **What to do**:
  - Add CSS keyframes for fade-in + slight slide-up effect
  - Apply animation to main content container on page load
  - Use `animation-fill-mode: forwards` to keep final state
  - Keep animation subtle (300-500ms duration, small movement)
  - Option A: Add to `frontend/src/index.css` (global)
  - Option B: Add inline with styled-components in InvitationLanding.jsx
  - Ensure animation only plays once on initial load

  **Must NOT do**:
  - Don't use heavy animation libraries (Framer Motion, GSAP)
  - Don't animate every element separately (just the container)
  - Don't make animation distracting or slow (>1s)
  - Don't block content visibility during animation

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small CSS addition
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: CSS animation knowledge

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 2 (needs layout restructure complete)

  **References**:

  **Pattern References**:
  - `frontend/src/components/InvitationLanding.jsx:16-25` - StyledInvitationContainer to animate

  **External References**:
  - CSS animations: `https://developer.mozilla.org/en-US/docs/Web/CSS/animation`
  - @keyframes: `https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes`

  **WHY Each Reference Matters**:
  - StyledInvitationContainer is the root element to apply animation to
  - MDN docs for correct keyframe and animation syntax

  **Acceptance Criteria**:

  **Automated Verification (using Bash)**:
  ```bash
  # Agent runs:
  cd frontend && npm run build
  # Assert: Build succeeds
  
  grep -E "@keyframes|animation:" frontend/src/components/InvitationLanding.jsx
  # Assert: Animation keyframes or animation property found
  ```

  **Manual Verification**:
  ```
  1. Run: cd frontend && npm run dev
  2. Open: http://localhost:5173/login/TestGuest
  3. Login and navigate to landing page
  4. Verify: Content fades in with subtle upward motion
  5. Verify: Animation is smooth (not janky)
  6. Verify: Animation completes in <1 second
  7. Hard refresh (Cmd+Shift+R) to see animation again
  ```

  **Evidence to Capture**:
  - [ ] Build output
  - [ ] Note confirming animation behavior observed

  **Commit**: YES (groups with Task 2 if done together)
  - Message: `style(landing): add subtle entry animation`
  - Files: `frontend/src/components/InvitationLanding.jsx`
  - Pre-commit: `cd frontend && npm run build`

---

### Task 6: Create Couple Section Component

- [x] 6. Create CoupleSection.jsx for couple portrait display

  **What to do**:
  - Create `frontend/src/components/CoupleSection.jsx`
  - Display couple portrait image (from `public/images/wedding/couple-portrait.png`)
  - Add fallback/placeholder if image not yet provided
  - Style with soft shadow or frame effect
  - Make responsive (scales down on mobile)
  - Import and add to InvitationLanding.jsx in correct position (after Hero, before Details)

  **Must NOT do**:
  - Don't hardcode couple-specific text (keep it in i18n if needed)
  - Don't make the image too large (aim for 300-400px max on desktop)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: New visual component
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Image styling, responsive images

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 4)
  - **Blocks**: Task 9
  - **Blocked By**: Tasks 1, 3 (needs theme + asset structure)

  **References**:

  **Pattern References**:
  - `frontend/src/components/GiftBox.jsx` - Similar self-contained section component
  - `frontend/src/components/InvitationLanding.jsx:315-330` - How to integrate section components

  **WHY Each Reference Matters**:
  - GiftBox shows pattern for creating a styled section component
  - InvitationLanding shows how child components are placed in the layout

  **Acceptance Criteria**:

  **Automated Verification (using Bash)**:
  ```bash
  # Agent runs:
  cd frontend && npm run build
  # Assert: Build succeeds
  
  grep -l "CoupleSection" frontend/src/components/InvitationLanding.jsx
  # Assert: Component is imported and used
  ```

  **Manual Verification**:
  ```
  1. Run: cd frontend && npm run dev
  2. Navigate to landing page
  3. Verify: Couple section visible (placeholder or image)
  4. Verify: Section appears between Hero and Wedding Details
  5. Test at 375px width: image scales appropriately
  ```

  **Evidence to Capture**:
  - [ ] Build output
  - [ ] Screenshot of couple section on landing page

  **Commit**: YES
  - Message: `feat(ui): add couple portrait section component`
  - Files: `frontend/src/components/CoupleSection.jsx`, `frontend/src/components/InvitationLanding.jsx`
  - Pre-commit: `cd frontend && npm run build`

---

### Task 7: Update LoginPage Styling

- [x] 7. Apply watercolor theme to LoginPage

  **What to do**:
  - Update colors to match new theme palette
  - Apply watercolor background (or gradient fallback)
  - Update button colors to dusty blue
  - Update input field styling
  - Ensure visual consistency with landing page

  **Must NOT do**:
  - Don't change login functionality
  - Don't modify API calls or auth logic
  - Don't change form validation

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Styling updates only, no structural changes
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Color application, form styling

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 5, 8)
  - **Blocks**: Task 9
  - **Blocked By**: Task 1 (needs theme)

  **References**:

  **Pattern References**:
  - `frontend/src/components/LoginPage.jsx` - Current login page to update
  - `frontend/src/theme.js` - Theme values to apply

  **WHY Each Reference Matters**:
  - LoginPage is the file to modify
  - theme.js contains the color values to use

  **Acceptance Criteria**:

  **Automated Verification (using Bash)**:
  ```bash
  # Agent runs:
  cd frontend && npm run build
  # Assert: Build succeeds
  ```

  **Manual Verification**:
  ```
  1. Run: cd frontend && npm run dev
  2. Open: http://localhost:5173/login/TestGuest
  3. Verify: Background uses watercolor colors (cream/peach tones)
  4. Verify: Login button is dusty blue
  5. Verify: Input fields match new styling
  6. Verify: Login still works (enter password, submit)
  ```

  **Evidence to Capture**:
  - [ ] Build output
  - [ ] Screenshot of login page with new styling

  **Commit**: YES
  - Message: `style(login): apply watercolor theme to login page`
  - Files: `frontend/src/components/LoginPage.jsx`
  - Pre-commit: `cd frontend && npm run build`

---

### Task 8: Update Navigation and RSVP Styling

- [x] 8. Apply watercolor theme to NavigationButtons and RsvpSection

  **What to do**:
  - Update NavigationButtons.jsx colors to dusty blue/gold accents
  - Update RsvpSection.jsx button colors (Yes = dusty blue, No = muted coral)
  - Ensure hover states match new palette
  - Update any hardcoded colors (#669966, #a7a7a3) to theme colors

  **Must NOT do**:
  - Don't change button functionality
  - Don't change RSVP submission logic
  - Don't modify navigation routes

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Color updates only
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Button styling, color application

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 5, 7)
  - **Blocks**: Task 9
  - **Blocked By**: Task 1 (needs theme)

  **References**:

  **Pattern References**:
  - `frontend/src/components/NavigationButtons.jsx` - Navigation component
  - `frontend/src/components/RsvpSection.jsx` - RSVP component
  - `frontend/src/theme.js` - Theme values to apply

  **WHY Each Reference Matters**:
  - These are the files to modify for button styling
  - theme.js has the new color values

  **Acceptance Criteria**:

  **Automated Verification (using Bash)**:
  ```bash
  # Agent runs:
  cd frontend && npm run build
  # Assert: Build succeeds
  
  # Check old colors are removed
  grep -c "#669966" frontend/src/components/RsvpSection.jsx
  # Assert: Returns 0 (old green removed)
  ```

  **Manual Verification**:
  ```
  1. Run: cd frontend && npm run dev
  2. Navigate to landing page
  3. Verify: RSVP Yes button is dusty blue
  4. Verify: RSVP No button is muted (not bright red)
  5. Verify: Navigation buttons match new color scheme
  6. Verify: Hover states work correctly
  7. Verify: Clicking buttons still works
  ```

  **Evidence to Capture**:
  - [ ] Build output
  - [ ] Screenshot of RSVP section with new colors
  - [ ] Screenshot of navigation buttons

  **Commit**: YES
  - Message: `style(components): apply watercolor theme to navigation and RSVP`
  - Files: `frontend/src/components/NavigationButtons.jsx`, `frontend/src/components/RsvpSection.jsx`
  - Pre-commit: `cd frontend && npm run build`

---

### Task 9: Final Visual Review and Polish

- [x] 9. Comprehensive visual review and final adjustments

  **What to do**:
  - Review entire landing page flow on desktop and mobile
  - Check all color applications are consistent
  - Verify spacing and alignment across sections
  - Fix any visual inconsistencies found
  - Test all interactive elements still work
  - Document any remaining issues for user to address (e.g., "add real assets")

  **Must NOT do**:
  - Don't add new features
  - Don't make major structural changes
  - Don't spend excessive time on minor pixel adjustments

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual QA and polish
  - **Skills**: [`frontend-ui-ux`, `playwright`]
    - `frontend-ui-ux`: Visual review expertise
    - `playwright`: Automated screenshots across viewports

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (final task)
  - **Blocks**: None (final)
  - **Blocked By**: Tasks 2, 4, 5, 6, 7, 8

  **References**:

  **Pattern References**:
  - All modified files from previous tasks

  **Acceptance Criteria**:

  **Automated Verification (using Playwright)**:
  ```
  # Agent uses playwright skill to:
  1. Navigate to http://localhost:5173/login/TestGuest
  2. Screenshot login page → .sisyphus/evidence/final-login-desktop.png
  3. Login to landing page
  4. Screenshot landing page (full page) → .sisyphus/evidence/final-landing-desktop.png
  5. Set viewport to 375px width
  6. Screenshot landing page mobile → .sisyphus/evidence/final-landing-mobile.png
  7. Click RSVP Yes → verify snackbar appears
  8. Click navigation to /venue → verify navigation works
  ```

  **Evidence to Capture**:
  - [ ] Screenshot: Login page desktop
  - [ ] Screenshot: Landing page desktop (full scroll)
  - [ ] Screenshot: Landing page mobile (375px)
  - [ ] Confirmation all interactions work

  **Commit**: YES (if any fixes made)
  - Message: `style(frontend): visual polish and consistency fixes`
  - Files: Any files with fixes
  - Pre-commit: `cd frontend && npm run build`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `style(theme): update color palette and typography` | theme.js, index.html | npm run build |
| 2 | `refactor(landing): restructure layout with watercolor styling` | InvitationLanding.jsx | npm run build |
| 3 | `chore(assets): add image directory structure and asset guide` | public/images/wedding/README.md | ls |
| 4 | `feat(ui): add floral border overlay component` | FloralBorderOverlay.jsx, App.jsx | npm run build |
| 5 | `style(landing): add subtle entry animation` | InvitationLanding.jsx | npm run build |
| 6 | `feat(ui): add couple portrait section component` | CoupleSection.jsx, InvitationLanding.jsx | npm run build |
| 7 | `style(login): apply watercolor theme to login page` | LoginPage.jsx | npm run build |
| 8 | `style(components): apply watercolor theme to navigation and RSVP` | NavigationButtons.jsx, RsvpSection.jsx | npm run build |
| 9 | `style(frontend): visual polish and consistency fixes` | various | npm run build |

---

## Success Criteria

### Verification Commands
```bash
# Build verification
cd frontend && npm run build
# Expected: Build succeeds, no errors

# Dev server verification
cd frontend && npm run dev
# Expected: Server starts on port 5173
```

### Final Checklist
- [x] All "Must Have" present:
  - [x] New color palette applied
  - [x] Script font for couple names
  - [x] Floral border overlay
  - [x] Entry animation
  - [x] Watercolor background
  - [x] Couple portrait section
- [x] All "Must NOT Have" absent:
  - [x] No backend changes
  - [x] No new features beyond visual
  - [x] No removed existing sections
  - [x] No complex animations
  - [x] No third-party animation libraries
  - [x] No changed API calls
- [x] Build passes
- [x] No console errors
- [x] Mobile responsive (375px - 1440px)
- [x] All existing functionality preserved

---

## Post-Completion Notes for User

After the plan is executed, you will need to:

1. **Add your image assets** to `frontend/public/images/wedding/`:
   - `watercolor-bg.jpg` - Your watercolor background
   - `couple-portrait.png` - The couple portrait from Image 1
   - Floral border PNGs (see README in that directory)

2. **Replace placeholder colors/gradients** with your actual asset references once uploaded

3. **Fine-tune colors** if the extracted palette doesn't perfectly match your vision

4. **Test on actual mobile devices** (not just DevTools emulation)
