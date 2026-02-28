# FRONTEND COMPONENTS

**Generated:** 2026-02-28

20 React components using MUI styled() API. Flat structure - no pages/views separation.

## STRUCTURE
```
components/
├── InvitationLanding.jsx    # Main container, orchestrates all sections
├── LoginPage.jsx            # Auth entry, auto-login flow
├── GuestComments.jsx        # Infinite scroll, optimistic updates (503 lines)
├── WeddingPhotoGallery.jsx  # Grid + modal dialog
├── PersistentMusicPlayer.jsx # YouTube iframe, survives minimize
├── SplashOverlay.jsx        # Entry animation gate
├── *Section.jsx             # Content sections (Quran, Event, Countdown, etc.)
├── GiftBox.jsx              # Banking info display
├── BackButton.jsx           # Navigation helper
└── ui/                      # (empty - reserved)
```

## CONVENTIONS

### Styling Pattern
```jsx
// Theme-aware with fallback (PREFERRED)
const StyledBox = styled(Box)(({ theme }) => ({
  color: theme.palette.wedding?.navy || '#2C3E6B',
}));

// Static styles (no theme)
const StaticBox = styled(Box)({ padding: '60px 30px' });
```

### Section Container (Copy This)
```jsx
const SectionContainer = styled(Box)({
  padding: '60px 30px',
  textAlign: 'center',
  maxWidth: '520px',
  margin: '0 auto',
});
```

### Font System
| Font | Usage |
|------|-------|
| `'Great Vibes', cursive` | Headings, decorative |
| `'Poppins', sans-serif` | Body, buttons, labels |
| `'Cormorant Garamond', serif` | Quotes, captions |

### Color Palette
```jsx
theme.palette.wedding?.navy || '#2C3E6B'
theme.palette.wedding?.gold || '#C9A96E'
```

### Prop Naming
- Callbacks: `handleRSVP`, `handleSubmit`
- Booleans: `isLoading`, `isVisible`
- State: `rsvpStatus`, `comments`

## UNIQUE PATTERNS

### IntersectionObserver (Scroll Animations)
```jsx
observerRef.current = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);
```

### Persistent Iframe (Music)
```jsx
// Iframe stays rendered off-screen when minimized
<Box sx={{
  position: 'absolute', top: '-9999px',
  ...(isPlayerExpanded && { position: 'relative', top: 'auto' })
}}>
  <iframe src={embedUrl} />
</Box>
```

### AbortController Cleanup
```jsx
const abortController = new AbortController();
getGuestByName(name, { signal: abortController.signal });
return () => abortController.abort();
```

### Memoized List Items
```jsx
const CommentItem = memo(({ comment, isLast, lastCommentRef }) => ( ... ));
```

## ANTI-PATTERNS (AVOID)
- Direct DOM queries (`document.querySelectorAll`) - use refs
- Window dimension without debounce - use `useMediaQuery`
- Hardcoded fallback strings - use i18n
- Missing PropTypes on props-receiving components

## WHERE TO LOOK
| Task | File |
|------|------|
| Add new section | Copy `EventSection.jsx` or `CoupleSection.jsx` pattern |
| Modify auth flow | `LoginPage.jsx`, `contexts/AuthContext.jsx` |
| Comment system | `GuestComments.jsx` (complex - consider splitting) |
| Music integration | `PersistentMusicPlayer.jsx`, `contexts/MusicContext.jsx` |
| Gallery/photos | `WeddingPhotoGallery.jsx` |
| Theme/styling | `theme.js` |

## NOTES
- `GuestComments.jsx` is 503 lines - could split into CommentList, CommentForm, CommentItem
- No TypeScript - pure JSX
- No PropTypes validation
- Environment vars via `import.meta.env.VITE_*`
