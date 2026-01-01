# Technical Specification: Hackathon Wins Showcase Feature

## Technical Context
- **Language**: JavaScript (React 18.2.0)
- **Framework**: React with React Router v6
- **State Management**: React hooks (useState, useRef, useEffect) at component level
- **Primary Dependencies**: React, React Router, CSS
- **Styling**: CSS (custom, no CSS-in-JS library)
- **Window System**: Custom WindowBox component with drag, minimize, close functionality
- **Key Files**: 
  - `src/components/TopMenuBar.js` - Menu system
  - `src/App.js` - Global window state management
  - `src/pages/` - Page components wrapped in WindowBox
  - `src/components/WindowBox.js` - Window wrapper component

---

## Technical Implementation Brief

### Key Technical Decisions

1. **Window Architecture**: Create two separate page components (`HopHacks2025Page.js` and `CougarHacks2025Page.js`) following the same pattern as existing pages (HomePage, SkillsPage, etc.). Each wraps content in a WindowBox component.

2. **State Management**: Add two new entries to App.js state dictionaries:
   - `openWindows['/hophacks2025']` and `openWindows['/cougarhacks2025']`
   - `windowZIndex['/hophacks2025']` and `windowZIndex['/cougarhacks2025']`
   - `windowPositions['/hophacks2025']` and `windowPositions['/cougarhacks2025']`
   - `minimizedWindows['/hophacks2025']` and `minimizedWindows['/cougarhacks2025']`

3. **Menu Integration**: Modify TopMenuBar.js to add:
   - `showHackathonsDropdown` state
   - Hackathon dropdown menu item (positioned before Socials)
   - Click handlers that call `window.handleOpenWindow()` with the respective paths

4. **Styling**: Create `src/styles/hackathonsPage.css` following existing naming conventions, similar to `commonPage.css`

5. **Content Presentation**: Each hackathon window will display:
   - Title with placement (e.g., "HopHacks 2025 | Second Place")
   - Project description text
   - Styled GitHub link button/icon

---

## Source Code Structure

```
src/
├── pages/
│   ├── HopHacks2025Page.js          (NEW)
│   └── CougarHacks2025Page.js       (NEW)
├── styles/
│   └── hackathonsPage.css            (NEW)
├── components/
│   └── TopMenuBar.js                 (MODIFIED)
└── App.js                            (MODIFIED)
```

---

## Contracts

### App.js State Changes
```javascript
// Add to openWindows state object:
'/hophacks2025': false
'/cougarhacks2025': false

// Add to minimizedWindows state object:
'/hophacks2025': false
'/cougarhacks2025': false

// Add to windowZIndex state object:
'/hophacks2025': 1
'/cougarhacks2025': 1

// Add to windowPositions state object:
'/hophacks2025': { x: 400, y: 200 }
'/cougarhacks2025': { x: 450, y: 250 }
```

### Window Component Props Interface
Each hackathon page component receives:
```javascript
{
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  onClose: () => void,
  zIndex: number,
  onFocus: () => void,
  initialPosition: { x: number, y: number },
  onPositionChange: (position: { x: number, y: number }) => void
}
```

### TopMenuBar Changes
- Add `showHackathonsDropdown` state
- Add `hackathonsDropdownRef` ref
- Add dropdown JSX with two menu items before Socials dropdown
- Each menu item has onClick handler that calls `window.handleOpenWindow('/hophacks2025')` or `window.handleOpenWindow('/cougarhacks2025')`

### Content Data Structure
Each hackathon will have:
```javascript
{
  title: string,        // e.g., "HopHacks 2025 | Second Place"
  description: string,  // Project description
  githubUrl: string     // GitHub repository link
}
```

---

## Delivery Phases

### Phase 1: UI Integration - Add Hackathon Menu Item
**Deliverable**: Hackathon dropdown menu appears in TopMenuBar before Socials
- Add `showHackathonsDropdown` state to TopMenuBar
- Add HTML/JSX for dropdown menu with two items
- Add CSS styling for dropdown appearance
- Dropdown opens on hover, closes on mouse leave (following existing pattern)

**Verification**: 
- Visual inspection: Menu item appears before Socials
- Dropdown shows on hover with correct labels
- No console errors
- Existing menu items still functional

---

### Phase 2: Window Components - Create Hackathon Page Components
**Deliverable**: Two separate, functional window components for each hackathon
- Create `HopHacks2025Page.js` with WindowBox wrapper and content display
- Create `CougarHacks2025Page.js` with WindowBox wrapper and content display
- Create `hackathonsPage.css` with styling
- Each component displays title, description, and GitHub link

**Verification**:
- Components render without errors
- Window title displays correctly
- Content is readable and properly formatted
- GitHub links are clickable and target correct repositories
- CSS styling is applied correctly

---

### Phase 3: State Management - Integrate with App.js
**Deliverable**: Window state management fully integrated
- Add state entries for both hackathon windows in App.js
- Add window handlers in App.js (open, close, minimize, restore, position update)
- Add window component instances to App.js render
- Verify global `window.handleOpenWindow()` can open hackathon windows

**Verification**:
- Windows can be opened by clicking dropdown menu
- Windows display at correct initial positions
- Window state persists correctly (open/closed/minimized)
- Multiple windows can be open simultaneously
- Window management functions work (minimize, close, drag)
- Z-index management works correctly when switching focus

---

### Phase 4: Feature Validation - End-to-End Testing
**Deliverable**: Full feature functionality verified
- Test all user stories from requirements
- Test window interactions
- Test edge cases and error scenarios

**Verification**:
- All acceptance scenarios from PRD pass
- No breaking changes to existing features
- Console has no errors or warnings
- Lint and build passes

---

## Verification Strategy

### Phase 1 Verification (TopMenuBar UI)
**Tools**: Visual inspection + browser console
**Steps**:
1. Open application in browser
2. Hover over "Hackathon" menu item - verify dropdown appears
3. Check dropdown styling matches other dropdowns
4. Verify menu item position (before Socials)
5. Open browser console - verify no errors
6. Check that existing menu items still work

### Phase 2 Verification (Window Components)
**Tools**: Visual inspection + browser console + manual testing
**Steps**:
1. Create minimal test - render components standalone
2. Verify WindowBox props are correctly passed
3. Verify window title renders
4. Verify content (description and GitHub link) renders
5. Test GitHub link by clicking (should open in new tab)
6. Check CSS styling renders properly
7. Run console check for errors

**Test Script**: Create `test-hackathons.js` helper script to verify component rendering

### Phase 3 Verification (State Management)
**Tools**: Browser console + React DevTools
**Steps**:
1. Click "Hackathon" dropdown menu
2. Click each hackathon entry
3. Verify window opens with correct title
4. Verify window state in React DevTools shows correct isOpen/position/zIndex
5. Test minimize/close buttons work
6. Test dragging window works
7. Test opening both windows simultaneously
8. Verify z-index changes when clicking windows
9. Close window and verify state updates

### Phase 4 Verification (Full Feature)
**Tools**: Jest test framework + manual testing
**Steps**:
1. Run full test suite: `npm test` (if tests exist)
2. Run lint: `npm run lint` (if available)
3. Run build: `npm run build`
4. Manually test all user stories:
   - Hover over Hackathon menu
   - Click each hackathon entry
   - Verify windows open
   - Verify content displays
   - Verify GitHub links work
   - Test window interactions (drag, minimize, close)
   - Test opening both windows
   - Test with mobile warning active
   - Test dark mode compatibility

### Required Artifacts

**No external artifacts required**. All code and styling are part of standard source files.

**Sample Test Data** (embedded in components):
```javascript
const hackathons = {
  hophacks2025: {
    title: "HopHacks 2025 | Second Place",
    description: "Built an EHR connecting doctors and patients with an AI-powered clinical assistant and continuous health monitoring.",
    githubUrl: "https://github.com/Shovan554/medlink"
  },
  cougarhacks2025: {
    title: "CougarHacks 2025 | First Place",
    description: "Built AI-powered Apple Watch companion for health monitoring and personalized insights.",
    githubUrl: "https://github.com/Shovan554/PulseX-AI"
  }
}
```

---

## Notes
- Follow existing code patterns for consistency (component structure, naming, styling)
- Ensure window positions don't overlap with default positions in App.js
- Maintain responsive design compatibility
- Test in multiple browsers if possible
