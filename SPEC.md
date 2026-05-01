# Lunation Guild Management - Specification

## Project Overview
- **Name**: Lunation Guild Site
- **Type**: Single Page Web Application (React + Vite)
- **Core Functionality**: Guild roster management with raid composition tracking for WoW guild "Lunation"
- **Target Users**: Guild members (view only) and Officers (edit access)

## Technical Stack
- React 18 + Vite
- React Router for navigation
- CSS Modules / Styled Components
- JSON file for data storage (no database)
- Railway deployment ready

## UI/UX Specification

### Color Palette
- **Primary**: `#00E1FF` (cyan accent - rgb 0, 225, 255)
- **Background Dark**: `#0a0e17`
- **Background Card**: `#111827`
- **Background Hover**: `#1a2332`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#9ca3af`
- **Border**: `#1e3a5f`
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`

### Typography
- **Font Family**: "Outfit", sans-serif (modern gaming feel)
- **Headings**: Bold, uppercase for guild name
- **Body**: Regular weight

### Layout
- Fixed navbar with logo and login/logout button
- Main content area with max-width 1400px
- Responsive grid for roster display (2-4 columns based on viewport)
- Card-based design for each member

## Functionality Specification

### 1. Authentication System
- Simple password-based login for officers
- Password stored in environment variable
- Session stored in localStorage
- Login modal with password input

### 2. Roster Management
- **Current Roster**: List of guild members with:
  - Character name
  - Role (Tank, Healer, Melee DPS, Ranged DPS)
  - Spec (specific class specialization)
  - WoWHead profile link
  - Officer notes (optional)
- **Wishlist**: Desired recruits with:
  - Character name
  - Role needed
  - Priority (High, Medium, Low)
  - Notes

### 3. Raid Composition Display
- Visual counters showing:
  - Total members
  - Tanks count
  - Healers count
  - Melee DPS count
  - Ranged DPS count
- Progress bars showing ideal raid composition
- Color-coded role indicators

### 4. Data Handling
- All data in `data/roster.json`
- Read on app load
- Write on officer changes (with save button)
- No database - file-based

### 5. Officer Features
- Add new member to roster
- Edit existing member
- Delete member
- Add/edit/delete wishlist entries
- All changes require login

## Data Structure

```json
{
  "roster": [
    {
      "id": "uuid",
      "name": "CharacterName",
      "role": "tank|healer|melee|ranged",
      "spec": "Blood DK",
      "wowheadUrl": "https://www.wowhead.com/character=...",
      "notes": ""
    }
  ],
  "wishlist": [
    {
      "id": "uuid",
      "name": "WantedName",
      "role": "tank|healer|melee|ranged",
      "priority": "high|medium|low",
      "notes": ""
    }
  ]
}
```

## Component Structure

1. **App** - Main router
2. **Navbar** - Logo, navigation, login button
3. **LoginModal** - Password input modal
4. **RosterPage** - Main roster display
5. **MemberCard** - Individual member display
6. **WishlistPage** - Wishlist display
7. **RaidComposition** - Visual raid stats
8. **MemberForm** - Add/Edit member form
9. **ProtectedRoute** - Officer-only route wrapper

## Acceptance Criteria

1. ✅ Site loads without errors
2. ✅ Anyone can view roster and wishlist
3. ✅ Login required to edit anything
4. ✅ Correct password grants officer access
5. ✅ Raid composition shows accurate counts
6. ✅ Blue accent color (#00E1FF) visible throughout
7. ✅ Responsive design works on mobile
8. ✅ Data persists in JSON file
9. ✅ Railway deployment configuration present