# Floral SVG Decorations Update

## TL;DR

> **Quick Summary**: Replace placeholder CSS decorations with SVG-based floral elements inspired by the user's watercolor reference image.
> 
> **Deliverables**:
> - Updated `FloralBorderOverlay.jsx` with SVG decorations (vines, lilies, coral flowers, ribbons)
> 
> **Estimated Effort**: Quick (15-30 min)
> **Parallel Execution**: NO - single task

---

## Context

User provided Image 2 with floral elements including:
- **Top ribbon**: Curved dusty blue ribbon
- **Left/Right vines**: Vertical vines with dusty blue stems, coral/orange small flowers, and golden yellow lilies
- **Bottom ribbon**: Curved ribbon with lily decoration
- **Leaves**: Blue-gray leaves along the vines

### Color Palette (from reference)
- Dusty Blue (stems/ribbons): `#7D8FA3`
- Coral/Orange (small flowers): `#D4836C`
- Golden Yellow (lilies): `#E8C88D` / `#D4A574`

---

## TODOs

- [x] 1. Update FloralBorderOverlay.jsx with SVG decorations

  **What to do**:
  Replace the current CSS-based decorations with inline SVG elements:
  
  1. **TopRibbon SVG**: Curved wavy lines at top
  2. **LeftVine SVG**: Vertical vine with:
     - Coral flower clusters (small ellipses)
     - Golden lily flowers (overlapping ellipses)
     - Blue-gray leaves (small ellipses)
  3. **RightVine SVG**: Mirror of LeftVine (using scaleX(-1))
  4. **BottomRibbon SVG**: Curved line with central lily
  5. **Mobile versions**: Simplified horizontal decorations for small screens

  **SVG Code for FloralBorderOverlay.jsx**:
  
  ```jsx
  import { styled } from '@mui/material/styles';
  import { Box } from '@mui/material';

  const BorderContainer = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 10,
    overflow: 'hidden',
  });

  const TopRibbon = () => (
    <svg
      viewBox="0 0 400 60"
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        maxWidth: 400,
        height: 'auto',
        opacity: 0.85,
      }}
    >
      <path
        d="M0 30 Q50 5, 100 25 T200 30 T300 25 T400 30"
        fill="none"
        stroke="#7D8FA3"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 35 Q70 55, 120 35 T220 40 T320 35 T380 40"
        fill="none"
        stroke="#7D8FA3"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );

  const BottomRibbon = () => (
    <svg
      viewBox="0 0 400 80"
      style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        maxWidth: 400,
        height: 'auto',
        opacity: 0.85,
      }}
    >
      <path
        d="M0 40 Q50 60, 100 45 T200 50 T300 45 T400 40"
        fill="none"
        stroke="#7D8FA3"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="200" cy="30" rx="20" ry="12" fill="#E8C88D" opacity="0.7" />
      <ellipse cx="185" cy="35" rx="15" ry="10" fill="#E8C88D" opacity="0.5" />
      <ellipse cx="215" cy="35" rx="15" ry="10" fill="#E8C88D" opacity="0.5" />
      <circle cx="200" cy="32" r="4" fill="#D4A574" opacity="0.8" />
    </svg>
  );

  const LeftVine = () => (
    <svg
      viewBox="0 0 80 500"
      style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        height: '70vh',
        maxHeight: 500,
        width: 'auto',
        opacity: 0.9,
      }}
    >
      {/* Main stem */}
      <path
        d="M40 0 Q60 50, 45 100 T50 200 T40 300 T55 400 T45 500"
        fill="none"
        stroke="#7D8FA3"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* Coral flowers cluster 1 */}
      <ellipse cx="55" cy="80" rx="4" ry="6" fill="#D4836C" opacity="0.8" />
      <ellipse cx="60" cy="90" rx="3" ry="5" fill="#D4836C" opacity="0.7" />
      <ellipse cx="52" cy="95" rx="3" ry="4" fill="#D4836C" opacity="0.6" />
      
      {/* Golden lily 1 */}
      <ellipse cx="35" cy="150" rx="18" ry="12" fill="#E8C88D" opacity="0.7" />
      <ellipse cx="25" cy="158" rx="14" ry="10" fill="#E8C88D" opacity="0.5" />
      <ellipse cx="45" cy="160" rx="12" ry="8" fill="#E8C88D" opacity="0.5" />
      <circle cx="35" cy="152" r="4" fill="#D4A574" opacity="0.8" />
      
      {/* Leaf branch 1 */}
      <path d="M50 120 Q65 115, 70 130" fill="none" stroke="#7D8FA3" strokeWidth="1.5" />
      <ellipse cx="72" cy="128" rx="8" ry="5" fill="#7D8FA3" opacity="0.4" />
      
      {/* Coral flowers cluster 2 */}
      <ellipse cx="58" cy="220" rx="4" ry="6" fill="#D4836C" opacity="0.8" />
      <ellipse cx="62" cy="230" rx="3" ry="5" fill="#D4836C" opacity="0.7" />
      
      {/* Leaf branch 2 */}
      <path d="M45 180 Q60 175, 68 185" fill="none" stroke="#7D8FA3" strokeWidth="1.5" />
      <ellipse cx="70" cy="184" rx="10" ry="6" fill="#7D8FA3" opacity="0.4" />
      
      {/* Golden lily 2 */}
      <ellipse cx="30" cy="300" rx="18" ry="12" fill="#E8C88D" opacity="0.7" />
      <ellipse cx="20" cy="308" rx="14" ry="10" fill="#E8C88D" opacity="0.5" />
      <ellipse cx="40" cy="310" rx="12" ry="8" fill="#E8C88D" opacity="0.5" />
      <circle cx="30" cy="302" r="4" fill="#D4A574" opacity="0.8" />
      
      {/* Coral flowers cluster 3 */}
      <ellipse cx="60" cy="360" rx="4" ry="6" fill="#D4836C" opacity="0.8" />
      <ellipse cx="55" cy="370" rx="3" ry="5" fill="#D4836C" opacity="0.7" />
      <ellipse cx="62" cy="375" rx="3" ry="4" fill="#D4836C" opacity="0.6" />
      
      {/* Leaf branch 3 */}
      <path d="M50 340 Q65 335, 72 345" fill="none" stroke="#7D8FA3" strokeWidth="1.5" />
      <ellipse cx="74" cy="343" rx="8" ry="5" fill="#7D8FA3" opacity="0.4" />
      
      {/* Coral flowers cluster 4 */}
      <ellipse cx="50" cy="450" rx="4" ry="6" fill="#D4836C" opacity="0.8" />
      <ellipse cx="55" cy="460" rx="3" ry="5" fill="#D4836C" opacity="0.7" />
      
      {/* Leaf branch 4 */}
      <path d="M40 420 Q55 415, 62 425" fill="none" stroke="#7D8FA3" strokeWidth="1.5" />
      <ellipse cx="64" cy="423" rx="10" ry="6" fill="#7D8FA3" opacity="0.4" />
    </svg>
  );

  const RightVine = () => (
    <svg
      viewBox="0 0 80 500"
      style={{
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%) scaleX(-1)',
        height: '70vh',
        maxHeight: 500,
        width: 'auto',
        opacity: 0.9,
      }}
    >
      {/* Same content as LeftVine - mirrored via scaleX(-1) */}
      <path
        d="M40 0 Q60 50, 45 100 T50 200 T40 300 T55 400 T45 500"
        fill="none"
        stroke="#7D8FA3"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="55" cy="80" rx="4" ry="6" fill="#D4836C" opacity="0.8" />
      <ellipse cx="60" cy="90" rx="3" ry="5" fill="#D4836C" opacity="0.7" />
      <ellipse cx="52" cy="95" rx="3" ry="4" fill="#D4836C" opacity="0.6" />
      <ellipse cx="35" cy="150" rx="18" ry="12" fill="#E8C88D" opacity="0.7" />
      <ellipse cx="25" cy="158" rx="14" ry="10" fill="#E8C88D" opacity="0.5" />
      <ellipse cx="45" cy="160" rx="12" ry="8" fill="#E8C88D" opacity="0.5" />
      <circle cx="35" cy="152" r="4" fill="#D4A574" opacity="0.8" />
      <path d="M50 120 Q65 115, 70 130" fill="none" stroke="#7D8FA3" strokeWidth="1.5" />
      <ellipse cx="72" cy="128" rx="8" ry="5" fill="#7D8FA3" opacity="0.4" />
      <ellipse cx="58" cy="220" rx="4" ry="6" fill="#D4836C" opacity="0.8" />
      <ellipse cx="62" cy="230" rx="3" ry="5" fill="#D4836C" opacity="0.7" />
      <path d="M45 180 Q60 175, 68 185" fill="none" stroke="#7D8FA3" strokeWidth="1.5" />
      <ellipse cx="70" cy="184" rx="10" ry="6" fill="#7D8FA3" opacity="0.4" />
      <ellipse cx="30" cy="300" rx="18" ry="12" fill="#E8C88D" opacity="0.7" />
      <ellipse cx="20" cy="308" rx="14" ry="10" fill="#E8C88D" opacity="0.5" />
      <ellipse cx="40" cy="310" rx="12" ry="8" fill="#E8C88D" opacity="0.5" />
      <circle cx="30" cy="302" r="4" fill="#D4A574" opacity="0.8" />
      <ellipse cx="60" cy="360" rx="4" ry="6" fill="#D4836C" opacity="0.8" />
      <ellipse cx="55" cy="370" rx="3" ry="5" fill="#D4836C" opacity="0.7" />
      <ellipse cx="62" cy="375" rx="3" ry="4" fill="#D4836C" opacity="0.6" />
      <path d="M50 340 Q65 335, 72 345" fill="none" stroke="#7D8FA3" strokeWidth="1.5" />
      <ellipse cx="74" cy="343" rx="8" ry="5" fill="#7D8FA3" opacity="0.4" />
      <ellipse cx="50" cy="450" rx="4" ry="6" fill="#D4836C" opacity="0.8" />
      <ellipse cx="55" cy="460" rx="3" ry="5" fill="#D4836C" opacity="0.7" />
      <path d="M40 420 Q55 415, 62 425" fill="none" stroke="#7D8FA3" strokeWidth="1.5" />
      <ellipse cx="64" cy="423" rx="10" ry="6" fill="#7D8FA3" opacity="0.4" />
    </svg>
  );

  const MobileVineTop = styled(Box)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
    },
  }));

  const MobileVineBottom = styled(Box)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
    },
  }));

  const DesktopDecorations = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  }));

  const FloralBorderOverlay = () => {
    return (
      <BorderContainer>
        <DesktopDecorations>
          <TopRibbon />
          <LeftVine />
          <RightVine />
          <BottomRibbon />
        </DesktopDecorations>
        
        <MobileVineTop>
          <svg viewBox="0 0 400 60" style={{ width: '100%', height: '100%' }}>
            <path
              d="M0 30 Q100 10, 200 30 T400 30"
              fill="none"
              stroke="#7D8FA3"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <ellipse cx="50" cy="35" rx="4" ry="6" fill="#D4836C" opacity="0.6" />
            <ellipse cx="350" cy="35" rx="4" ry="6" fill="#D4836C" opacity="0.6" />
            <ellipse cx="200" cy="25" rx="12" ry="8" fill="#E8C88D" opacity="0.5" />
          </svg>
        </MobileVineTop>
        
        <MobileVineBottom>
          <svg viewBox="0 0 400 60" style={{ width: '100%', height: '100%' }}>
            <path
              d="M0 30 Q100 50, 200 30 T400 30"
              fill="none"
              stroke="#7D8FA3"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <ellipse cx="50" cy="25" rx="4" ry="6" fill="#D4836C" opacity="0.6" />
            <ellipse cx="350" cy="25" rx="4" ry="6" fill="#D4836C" opacity="0.6" />
            <ellipse cx="200" cy="35" rx="12" ry="8" fill="#E8C88D" opacity="0.5" />
          </svg>
        </MobileVineBottom>
      </BorderContainer>
    );
  };

  export default FloralBorderOverlay;
  ```

  **Acceptance Criteria**:
  - [x] Build passes: `cd frontend && npm run build`
  - [x] SVG decorations visible at screen edges
  - [x] Desktop: Full vines on sides, ribbons top/bottom
  - [x] Mobile: Simplified horizontal decorations
  - [x] Colors match reference image palette

  **Commit**: YES
  - Message: `style(ui): update floral border with SVG decorations inspired by reference`
  - Files: `frontend/src/components/FloralBorderOverlay.jsx`

---

## Success Criteria

- [x] SVG decorations render correctly
- [x] Build passes
- [x] Responsive (mobile-friendly)
- [x] Colors match the dusty blue, coral, and golden yellow from reference
