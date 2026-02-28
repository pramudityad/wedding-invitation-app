# Invitation Landing Page Reorder

## TL;DR

> **Quick Summary**: Reorder InvitationLanding.jsx components, add clickable Location section to `/venue`, remove `/venue` button from NavigationButtons, and change background to soft coral gradient.
>
> **Deliverables**:
> - Modified: `frontend/src/components/InvitationLanding.jsx` (reordered components + new Location section + gradient change)
> - Modified: `frontend/src/components/NavigationButtons.jsx` (remove `/venue` button)
>
> **Estimated Effort**: Quick
> **Parallel Execution**: NO - sequential task
> **Critical Path**: N/A (single task)

---

## Context

### Original Request
Change the order of InvitationLanding.jsx content:
1. nama pasangan (Couple Names)
2. couple art (CoupleSection)
3. tgl (Date)
4. lokasi (Location - clickable to /venue)
5. countdown
6. pesan kasih sayang (Welcome Message)
7. hadiah pernikahan (Gift Box)
8. putar musik (Music Launcher)
9. button lain2 (RSVP, Navigation, Comments)

Additional: Change background to warmer tones.

### Interview Summary
**Key Discussions**:
- **Route clarification**: Location section will navigate to existing `/venue` route (not create `/location`)
- **NavigationButtons**: Remove the `/venue` button since Location section on landing page serves same purpose
- **Gradient**: Change to "soft coral" - specific hex values: `#FFDDD2 → #FFCCC2 → #FFDDD2`
- **Location text**: "Wedding Venue" (default) with env variable support for customization
- **Styling**: Use existing pattern from Wedding Date section (lines 310-323)

**Research Findings**:
- Current gradient: `#FDF8F3 → #F5E6D3 → #FDF8F3` (cream/beige)
- `/venue` route exists with VenueMap component
- NavigationButtons.jsx has buttons for `/venue`, `/comments`, `/gallery` (no "location" button)
- Wedding Date section pattern uses `Box` with `Typography` and `sx` styling

### Metis Review
**Critical Gaps Identified & Resolved**:
- No `/location` route → Use existing `/venue` route
- NavigationButtons has no location button → Remove `/venue` button instead
- Ambiguous "warmer" → Specific soft coral hex values provided by user
- Scope creep risks → Explicitly locked to 2 files only

---

## Work Objectives

### Core Objective
Reorder InvitationLanding.jsx components to new sequence, add clickable Location section that navigates to `/venue`, remove duplicate `/venue` button from NavigationButtons, and update background gradient to soft coral tones.

### Concrete Deliverables
- Modified `frontend/src/components/InvitationLanding.jsx` with:
  - Reordered JSX elements in specified sequence
  - New Location section with "Wedding Venue" text (env variable: `VITE_APP_VENUE_NAME`)
  - Updated `StyledInvitationContainer` background to `#FFDDD2 → #FFCCC2 → #FFDDD2`
- Modified `frontend/src/components/NavigationButtons.jsx` with:
  - `/venue` button removed (leaving `/comments` and `/gallery` only)

### Definition of Done
- [x] Component order verified in DOM (LanguageSwitcher, Title, Names, Portrait, Date, Location, Countdown, Welcome, RSVP, NavButtons, Comments, Gift, Music)
- [x] Location section text shows "Wedding Venue" (or env var override)
- [x] Location section is clickable → navigates to `/venue`
- [x] Background gradient uses soft coral colors (`#FFDDD2 → #FFCCC2 → #FFDDD2`)
- [x] NavigationButtons no longer has `/venue` button

### Must Have
- Location section between Wedding Date and Countdown
- Location section navigates to `/venue` on click
- NavigationButtons `/venue` button removed
- Background gradient updated to soft coral
- Location text supports `VITE_APP_VENUE_NAME` env variable (fallback to "Wedding Venue")

### Must NOT Have (Guardrails)
- Do NOT create new routes (use existing `/venue`)
- Do NOT add new styled components (use existing inline `sx` pattern)
- Do NOT modify any other components beyond these 2 files
- Do NOT add i18n keys (hardcoded English with env var support)
- Do NOT add animations beyond existing `fadeInUp`

---

## Verification Strategy (MANDATORY)

> This section determines TODO acceptance criteria structure.
> **Test Decision**:
> - **Infrastructure exists**: YES (npm run dev available)
> - **User wants tests**: NO (manual verification only)
> - **Framework**: none

### Manual Verification (Automated Commands)

All verification is automated via shell commands and playwright browser automation.

**By Deliverable Type:**

| Type | Verification Tool | Automated Procedure |
|------|------------------|---------------------|
| **DOM Order** | Bash grep + line number checks | Agent checks line numbers in file to verify order |
| **UI Appearance** | Playwright browser | Agent screenshots page to verify visual order and gradient |
| **Click Behavior** | Playwright browser | Agent clicks Location, verifies URL change to `/venue` |
| **NavButtons Change** | Bash grep | Agent verifies `/venue` button no longer exists in file |

**Evidence Requirements (Agent-Executable):**
- Screenshots saved to `.sisyphus/evidence/` for visual verification (before/after)
- Command output captured showing grep results
- Playwright navigation assertions showing URL changes

---

## Execution Strategy

### Parallel Execution Waves

> Sequential task - no parallelization needed.

```
Task 1: Modify InvitationLanding.jsx (reorder + add Location + gradient)
  └── Blocks: Task 2

Task 2: Modify NavigationButtons.jsx (remove /venue button)
  └── Final task
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2 | None |
| 2 | 1 | None | None |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Agents |
|------|-------|-------------------|
| 1 | 1 | delegate_task(category="quick", load_skills=["git-master"], run_in_background=false) |
| 2 | 2 | delegate_task(category="quick", load_skills=["git-master"], run_in_background=false) |

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info.

- [x] 1. Reorder InvitationLanding.jsx components, add Location section, update background gradient

  **What to do**:
  1. **Reorder components** in the JSX return (lines 288-373) to this sequence:
     - LanguageSwitcher (keep at top-right, no change)
     - Wedding Title (lines 296-298)
     - Couple Names (lines 300-302)
     - CoupleSection (line 306)
     - Wedding Date (lines 309-323)
     - **[NEW]** Location Section (insert after Wedding Date)
     - Countdown Section (lines 326-345) - move after Location
     - Welcome Message (lines 347-350)
     - RSVP Section (lines 353-357)
     - NavigationButtons (lines 360)
     - GuestCommentsSection (lines 363-366)
     - GiftBox (lines 369)
     - MusicLauncher (lines 372)

  2. **Add new Location Section** after Wedding Date (insert between lines 323 and 325):
     ```jsx
     {/* Location Section */}
     <Box sx={{ mb: 4, cursor: 'pointer' }} onClick={() => navigate('/venue')}>
       <Typography variant="h6" sx={{
         mb: 2,
         fontFamily: "'Playfair Display', serif",
         fontWeight: 400,
         color: '#4A5568',
         '&:hover': {
           textDecoration: 'underline',
           color: '#7D8FA3',
         },
       }}>
         📍 {import.meta.env.VITE_APP_VENUE_NAME || 'Wedding Venue'}
       </Typography>
     </Box>
     ```

  3. **Update background gradient** in `StyledInvitationContainer` (line 34):
     - Change from: `background: 'linear-gradient(135deg, #FDF8F3 0%, #F5E6D3 50%, #FDF8F3 100%)'`
     - Change to: `background: 'linear-gradient(135deg, #FFDDD2 0%, #FFCCC2 50%, #FFDDD2 100%)'`

  **Must NOT do**:
  - Do NOT create new styled components (use inline `sx` pattern like Wedding Date section)
  - Do NOT add i18n keys for location text
  - Do NOT modify other components or files
  - Do NOT change the existing styles except for the background gradient

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Simple file modification with clear, straightforward edits (reorder JSX, add section, change color)
  - **Skills**: `["git-master"]`
    - `git-master`: Not strictly needed for this task, but recommended for commit history tracking if needed

  **Skills Evaluated but Omitted**:
  - `frontend-ui-ux`: Not needed - styling changes are minimal (gradient color only), no new UI design required

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 2
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `frontend/src/components/InvitationLanding.jsx:309-323` - Wedding Date section pattern (Box with Typography and sx styling) - Use this exact pattern for Location section
  - `frontend/src/components/InvitationLanding.jsx:28-38` - StyledInvitationContainer definition - Update line 34 background property
  - `frontend/src/components/InvitationLanding.jsx:7` - `useNavigate` import - Already imported, use for Location onClick handler

  **API/Type References** (contracts to implement against):
  - None - direct navigation only

  **Test References** (testing patterns to follow):
  - None - no test infrastructure setup

  **Documentation References** (specs and requirements):
  - User requirements: New order, Location → `/venue`, remove `/venue` from NavButtons, soft coral gradient

  **External References** (libraries and frameworks):
  - None - React and MUI patterns already in codebase

  **WHY Each Reference Matters** (explain the relevance):
  - `frontend/src/components/InvitationLanding.jsx:309-323`: This shows the exact inline `sx` styling pattern to replicate for Location section - Box wrapper + Typography with hover effects
  - `frontend/src/components/InvitationLanding.jsx:28-38`: This is where the background gradient is defined - must update line 34 to use soft coral colors
  - `frontend/src/components/InvitationLanding.jsx:7`: Confirms `useNavigate` is already imported, so no new import needed for Location click handler

  **Acceptance Criteria**:

  > **CRITICAL: AGENT-EXECUTABLE VERIFICATION ONLY**

  **For DOM Order Verification** (using Bash grep):
  ```bash
  # Agent runs:
  cd frontend/src/components && grep -n "CoupleSection\|StyledCountdownSection\|RsvpSection\|GiftBox" InvitationLanding.jsx
  # Assert:
  # - Line numbers show: CoupleSection < StyledCountdownSection < RsvpSection < GiftBox
  # - Location section appears between Date and Countdown
  ```

  **For Gradient Change Verification** (using Bash grep):
  ```bash
  # Agent runs:
  grep -n "background.*linear-gradient" frontend/src/components/InvitationLanding.jsx
  # Assert: Output contains "#FFDDD2" and "#FFCCC2" (soft coral colors)
  ```

  **For Location Section Existence** (using Bash grep):
  ```bash
  # Agent runs:
  grep -n "VITE_APP_VENUE_NAME\|Wedding Venue" frontend/src/components/InvitationLanding.jsx
  # Assert: Line shows location section with env variable fallback
  ```

  **For UI Verification** (using Playwright browser via playwright skill):
  ```
  # Agent executes via playwright browser automation:
  1. Start dev server: cd frontend && npm run dev
  2. Navigate to: http://localhost:5173
  3. Wait for: selector ".MuiTypography-root" with text "Wedding Venue" (or env var value)
  4. Screenshot: .sisyphus/evidence/task-1-before-click.png
  5. Click: element with text "📍 Wedding Venue"
  6. Wait for: URL to change to "/venue"
  7. Screenshot: .sisyphus/evidence/task-1-after-click.png
  8. Assert: Current URL is "http://localhost:5173/venue"
  ```

  **For Background Color Verification** (visual check via screenshot):
  ```
  # Agent executes via playwright:
  1. Navigate to: http://localhost:5173
  2. Take full page screenshot: .sisyphus/evidence/task-1-background.png
  3. Assert: Background appears as soft coral tones (visual confirmation)
  ```

  **Evidence to Capture**:
  - [x] Grep output showing component line order
  - [x] Grep output showing gradient colors (#FFDDD2, #FFCCC2)
  - [x] Grep output showing Location section with env var
  - [x] Screenshots: .sisyphus/evidence/task-1-before-click.png, .sisyphus/evidence/task-1-after-click.png
  - [x] Screenshot: .sisyphus/evidence/task-1-background.png
  - [x] Playwright assertion output showing URL change to `/venue`

  **Commit**: YES (groups with Task 2)
  - Message: `feat(frontend): reorder InvitationLanding, add Location section, change background to soft coral`
  - Files: `frontend/src/components/InvitationLanding.jsx`, `frontend/src/components/NavigationButtons.jsx`
  - Pre-commit: None

- [x] 2. Remove /venue button from NavigationButtons

  **What to do**:
  1. **Read NavigationButtons.jsx** to understand current structure
  2. **Remove the `/venue` button** from the JSX (likely using `StyledNavButton` with `navigate('/venue')`)
  3. **Leave only** `/comments` and `/gallery` buttons

  **Must NOT do**:
  - Do NOT remove any other buttons
  - Do NOT modify styling of remaining buttons
  - Do NOT add new buttons

  **Recommended Agent Profile**:
  > Select category + skills based on task domain. Justify each choice.
  - **Category**: `quick`
    - Reason: Simple button removal from existing component
  - **Skills**: `["git-master"]`
    - `git-master`: For commit history tracking

  **Skills Evaluated but Omitted**:
  - `frontend-ui-ux`: Not needed - no design changes, just removal

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (after Task 1)
  - **Blocks**: None (final task)
  - **Blocked By**: Task 1

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `frontend/src/components/NavigationButtons.jsx` - Full file to understand button structure and identify `/venue` button

  **API/Type References** (contracts to implement against):
  - None

  **Test References** (testing patterns to follow):
  - None

  **Documentation References** (specs and requirements):
  - User requirements: Remove `/venue` button from NavigationButtons

  **External References** (libraries and frameworks):
  - None

  **WHY Each Reference Matters** (explain the relevance):
  - `frontend/src/components/NavigationButtons.jsx`: Need to read entire file to find `/venue` button and remove it without breaking other buttons

  **Acceptance Criteria**:

  > **CRITICAL: AGENT-EXECUTABLE VERIFICATION ONLY**

  **For Button Removal Verification** (using Bash grep):
  ```bash
  # Agent runs:
  grep -n "navigate('/venue')\|venue" frontend/src/components/NavigationButtons.jsx
  # Assert: NO results (venue button removed)
  ```

  **For Remaining Buttons Verification** (using Bash grep):
  ```bash
  # Agent runs:
  grep -n "navigate" frontend/src/components/NavigationButtons.jsx
  # Assert: Shows only "navigate('/comments')" and "navigate('/gallery')"
  ```

  **Evidence to Capture**:
  - [x] Grep output showing NO `/venue` button
  - [x] Grep output showing only `/comments` and `/gallery` buttons remain

  **Commit**: YES (groups with Task 1 - single commit for both changes)
  - Message: `feat(frontend): reorder InvitationLanding, add Location section, change background to soft coral`
  - Files: `frontend/src/components/InvitationLanding.jsx`, `frontend/src/components/NavigationButtons.jsx`
  - Pre-commit: None

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 2 | `feat(frontend): reorder InvitationLanding, add Location section, change background to soft coral` | `frontend/src/components/InvitationLanding.jsx`, `frontend/src/components/NavigationButtons.jsx` | Manual verification complete |

**Note**: Both tasks are committed together as a single logical change (reordering + location addition + nav button removal).

---

## Success Criteria

### Verification Commands
```bash
# Verify component order
cd frontend/src/components && grep -n "CoupleSection\|StyledCountdownSection\|RsvpSection" InvitationLanding.jsx

# Verify gradient colors
grep -n "background.*linear-gradient" frontend/src/components/InvitationLanding.jsx | grep -E "#FFDDD2|#FFCCC2"

# Verify location section
grep -n "VITE_APP_VENUE_NAME" frontend/src/components/InvitationLanding.jsx

# Verify venue button removed
! grep -q "navigate('/venue')" frontend/src/components/NavigationButtons.jsx
```

### Final Checklist
- [x] Component order: LanguageSwitcher, Title, Names, Portrait, Date, Location, Countdown, Welcome, RSVP, NavButtons, Comments, Gift, Music
- [x] Location section exists with "Wedding Venue" text (or env var)
- [x] Location section navigates to `/venue` on click
- [x] Background gradient is soft coral (#FFDDD2 → #FFCCC2 → #FFDDD2)
- [x] NavigationButtons has no `/venue` button
- [x] Only `/comments` and `/gallery` buttons remain in NavigationButtons
- [x] No other files or components modified
