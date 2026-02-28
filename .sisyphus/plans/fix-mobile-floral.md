# Fix Mobile Floral Decorations

## TL;DR

> **Quick Summary**: Fix mobile floral border overlay to show 4 corner decorations instead of side vines on small screens.
> 
> **Deliverables**:
> - Modified `FloralBorderOverlay.jsx` with corrected mobile breakpoints
> 
> **Estimated Effort**: Quick (5-10 min)
> **Parallel Execution**: NO - single task

---

## Context

### Bug Report
**Current Behavior on Mobile (< 600px):**
- Side vines (LeftVine, RightVine) appear at top and bottom positions
- 4 corner decorations (top-left, top-right, bottom-left, bottom-right) should be visible but are not

### Root Cause
The `MobileVineTop` and `MobileVineBottom` styled components use `display: 'none'` on desktop and `display: 'block'` on mobile (down('sm')). This shows the vines on mobile when they should only show corner decorations.

---

## Work Objectives

### Core Objective
Ensure mobile devices (< 600px width) display:
- 4 corner decorations (top-left, top-right, bottom-left, bottom-right) 
- NO side vines (LeftVine, RightVine)

### Definition of Done
- [x] On mobile: 4 corner decorations visible
- [x] On mobile: Side vines hidden
- [x] On desktop: All decorations work as before
- [x] Build passes

---

## Execution Strategy

### Single Task

- **Task 1**: Fix mobile floral decorations breakpoints

### Dependencies

None - standalone fix

---

## TODOs

### Task 1: Fix Mobile Floral Decorations

- [x] 1. Modify MobileVineTop to show 4 corner decorations instead of horizontal vine
- [x] 2. Modify MobileVineBottom to show 4 corner decorations instead of horizontal vine
- [x] 3. Keep DesktopDecorations unchanged
- [x] 4. Verify build passes

   **What to do**:
   - Create 4 separate corner decorations for mobile
   - Each corner should have:
     - Dusty blue stem
     - Coral flower cluster
     - Golden lily
     - Decorative frame/leaf element
   - Hide LeftVine and RightVine on mobile completely
   - Keep all desktop decorations unchanged

   **Must NOT do**:
   - Don't break desktop behavior
   - Don't change desktop decorations
   - Don't remove the DesktopDecorations component

   **Recommended Agent Profile**:
   - **Category**: `visual-engineering`
     - Reason: SVG and CSS styling for mobile responsiveness
   - **Skills**: [`frontend-ui-ux`]

   **References**:
   - `frontend/src/components/FloralBorderOverlay.jsx` - Current file to fix
   - MUI Breakpoints: `theme.breakpoints.down('sm')` - 600px threshold

   **Acceptance Criteria**:
   - [x] On mobile (<600px): 4 corners visible
   - [x] On mobile (<600px): Side vines hidden
   - [x] On desktop (≥600px): All decorations work as before
   - [x] Build passes: `cd frontend && npm run build`

   **Commit**: YES
   - Message: `fix(ui): correct mobile floral decorations to show 4 corners`
   - Files: `frontend/src/components/FloralBorderOverlay.jsx`
   - Pre-commit: `cd frontend && npm run build`

---

## Success Criteria

### Verification Commands
```bash
cd frontend && npm run build
# Expected: Build succeeds, no errors
```

### Final Checklist
- [x] Mobile shows 4 corner decorations
- [x] Mobile hides side vines
- [x] Desktop unchanged
- [x] Build passes
- [x] No console errors
