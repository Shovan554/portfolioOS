# Feature Specification: Hackathon Wins Showcase

## User Stories

### User Story 1 - Discover Hackathon Achievements
**Acceptance Scenarios**:
1. **Given** the user is viewing the portfolio OS desktop, **When** they hover over the "Hackathon" menu item in the top menu bar, **Then** a dropdown showing two hackathon wins appears
2. **Given** the dropdown is visible, **When** the user clicks on "HopHacks 2025", **Then** a new window opens displaying the hackathon details
3. **Given** the dropdown is visible, **When** the user clicks on "CougarHacks 2025", **Then** a new window opens displaying the hackathon details

---

### User Story 2 - View Hackathon Details
**Acceptance Scenarios**:
1. **Given** the HopHacks 2025 window is open, **When** the user views the window, **Then** they see the hackathon title "HopHacks 2025 | Second Place", project description, and a clickable GitHub link
2. **Given** the CougarHacks 2025 window is open, **When** the user views the window, **Then** they see the hackathon title "CougarHacks 2025 | First Place", project description, and a clickable GitHub link
3. **Given** a hackathon window is open, **When** the user clicks the GitHub link, **Then** a new tab opens with the GitHub repository

---

### User Story 3 - Manage Multiple Hackathon Windows
**Acceptance Scenarios**:
1. **Given** both hackathon windows are open, **When** the user drags the windows, **Then** they can reposition both windows independently on the desktop
2. **Given** a hackathon window is open, **When** the user clicks the minimize button, **Then** the window minimizes and can be restored from the taskbar
3. **Given** a hackathon window is open, **When** the user clicks the close button, **Then** the window closes

---

## Requirements

### Functional Requirements
- **FR1**: Add a "Hackathon" menu item to the top menu bar positioned before "Socials"
- **FR2**: Implement a dropdown menu for the Hackathon item containing two entries: "HopHacks 2025 | Second Place" and "CougarHacks 2025 | First Place"
- **FR3**: Create separate window components for each hackathon that can be opened independently
- **FR4**: Each hackathon window displays:
  - Hackathon title and placement
  - Project description
  - Clickable GitHub repository link
- **FR5**: Hackathon windows must support standard window operations: minimize, close, drag, and z-index management (same as other windows)
- **FR6**: Clicking a dropdown item opens the corresponding hackathon window

### Non-Functional Requirements
- **NFR1**: Hackathon windows follow the same visual style and behavior as existing window components
- **NFR2**: The feature integrates seamlessly with existing window management system in App.js
- **NFR3**: Window positions are tracked and managed consistently with other draggable windows
- **NFR4**: Mobile-responsive design maintained

---

## Success Criteria

1. ✅ "Hackathon" menu item appears in the top menu bar before "Socials"
2. ✅ Hovering over "Hackathon" displays dropdown with two hackathon entries
3. ✅ Clicking each hackathon entry opens a corresponding window
4. ✅ Both hackathon windows are draggable and support minimize/close operations
5. ✅ Each window displays correct hackathon information and GitHub links
6. ✅ Windows can be opened simultaneously and managed independently
7. ✅ Feature does not break existing functionality
8. ✅ All window state is properly tracked in App.js
