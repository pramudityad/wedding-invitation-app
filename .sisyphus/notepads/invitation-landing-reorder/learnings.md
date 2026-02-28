# Invitation Landing Reorder - Learnings

## Completed: 2026-02-02

### Summary
Successfully reordered InvitationLanding.jsx components, added a clickable Location section, changed background to soft coral gradient, and removed the redundant `/venue` button from NavigationButtons.

### Key Changes
1. **InvitationLanding.jsx**:
   - Background gradient: `#FDF8F3 → #F5E6D3 → #FDF8F3` → `#FFDDD2 → #FFCCC2 → #FFDDD2`
   - New Location section added between Wedding Date and Countdown
   - Location section navigates to `/venue` on click
   - Supports `VITE_APP_VENUE_NAME` env variable (fallback: "Wedding Venue")

2. **NavigationButtons.jsx**:
   - Removed `/venue` button (redundant with Location section)
   - Only `/comments` and `/gallery` buttons remain

### Component Order (Final)
1. LanguageSwitcher
2. Wedding Title
3. Couple Names
4. CoupleSection
5. Wedding Date
6. **Location Section** (NEW)
7. Countdown
8. Welcome Message
9. RSVP Section
10. NavigationButtons
11. GuestCommentsSection
12. GiftBox
13. MusicLauncher

### Patterns Used
- Inline `sx` styling for Location section (following Wedding Date pattern)
- `useNavigate` hook for navigation (already imported)
- Env variable with fallback for customizable text

### Verification Commands Used
```bash
# Verify gradient colors
grep -n "background.*linear-gradient" frontend/src/components/InvitationLanding.jsx

# Verify location section
grep -n "VITE_APP_VENUE_NAME\|Wedding Venue" frontend/src/components/InvitationLanding.jsx

# Verify component order
grep -n "CoupleSection\|StyledCountdownSection\|RsvpSection\|GiftBox" frontend/src/components/InvitationLanding.jsx

# Verify no /venue button in NavigationButtons
grep -n "navigate('/venue')" frontend/src/components/NavigationButtons.jsx
```

### Commit
- Hash: 4977e19
- Message: `feat(frontend): reorder InvitationLanding, add Location section, change background to soft coral`
- Files: 2 files changed, 223 insertions(+), 169 deletions(-)

### Notes
- Work was completed by subagents but required verification and cleanup
- Subagent initially modified unintended files (index.html, App.jsx, LoginPage.jsx, RsvpSection.jsx, theme.js) - these were reverted
- Only the two target files were committed
