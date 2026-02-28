# Watercolor Floral Upgrade

## TL;DR

> **Quick Summary**: Replace simple SVG decorations with detailed watercolor rose arrangements from user's HTML template.
> 
> **Deliverables**:
> - Updated `FloralBorderOverlay.jsx` with watercolor roses, hydrangeas, and leaves
> 
> **Estimated Effort**: Quick (10-15 min)
> **Parallel Execution**: NO - single task

---

## Context

User provided an HTML template with beautiful watercolor floral SVGs including:
- **Top Right**: Large garden rose, medium blush rose, peach/cream rose, small bud, leaves, filler flowers
- **Top Left**: Cream/white rose, blue delphinium cluster, small pink blossom, leaves
- **Bottom Right**: Large focal rose, medium rose, peach rose, leaves, filler flowers
- **Bottom Left**: Blue hydrangea cluster, pink rose, small yellow flower, leaves

### Features to Include
- Watercolor texture filters (`feTurbulence`, `feDisplacementMap`, `feGaussianBlur`)
- Gradient fills for realistic petals
- Multiple petal layers with organic shapes
- Floating animation keyframes
- Responsive sizing for desktop and mobile

### Color Palette
- Rose Pink: `#f8bbd0`, `#f48fb1`, `#ec407a`, `#d81b60`, `#c2185b`, `#880e4f`
- Cream/Yellow: `#fffde7`, `#fff9c4`, `#ffecb3`, `#ffe082`, `#ffca28`, `#f9a825`
- Blue: `#bbdefb`, `#90caf9`, `#64b5f6`
- Green Leaves: `#a5d6a7`, `#81c784`, `#66bb6a`, `#388e3c`, `#2e7d32`

---

## TODOs

- [x] 1. Update FloralBorderOverlay.jsx with watercolor SVG decorations

  **What to do**:
  - Replace current simple SVGs with detailed watercolor rose arrangements
  - Add SVG filter definitions for watercolor effect
  - Add gradient definitions for realistic petals
  - Add floating animations (8s ease-in-out infinite)
  - Desktop: 4 corner arrangements (14rem x 16-18rem)
  - Mobile: Smaller 4 corner arrangements (11rem x 13-14rem)

  **Acceptance Criteria**:
   - [x] Watercolor roses visible at all 4 corners
   - [x] Floating animation working
   - [x] Responsive sizing (smaller on mobile)
   - [x] Build passes: `cd frontend && npm run build`

  **Commit**: YES
  - Message: `style(ui): upgrade floral borders with watercolor rose arrangements`
  - Files: `frontend/src/components/FloralBorderOverlay.jsx`

---

## Success Criteria

- [x] Build passes
- [x] Watercolor roses render correctly
- [x] Floating animations work smoothly
- [x] Mobile responsive
