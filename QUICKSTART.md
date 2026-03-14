# Quick Start Guide

## 1. Start the Development Server

The dev server will automatically launch when you run the project. It will be available at `http://localhost:5173`

## 2. Create Your Admin Account

1. Click "Create Account" or go to `/auth/signup`
2. Enter your email and create a password
3. Your account is created!

## 3. Become an Admin

For admin access, you need to set `is_admin = true` in the database:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run this query:
```sql
UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';
```

4. Sign out and sign back in
5. You should now see an "Admin" button in the navigation

## 4. Add Campaign Content

### In Order of Priority:

#### Step 1: Campaign Settings
- Go to `/admin/settings`
- Add your campaign title, tagline, and lore
- This is the foundation of your campaign

#### Step 2: Add Characters
- Go to `/admin/characters`
- Click "Add Character"
- Fill in: Name, Class, Race, Level, Backstory
- Optional: Add portrait URL
- Characters appear on the public Characters page

#### Step 3: Add Locations (for the map)
- Go to `/admin/locations`
- Click "Add Location"
- Enter Name, Description, Type
- **Important**: Set X and Y coordinates (0-100 range)
  - X: 0 is left, 100 is right
  - Y: 0 is top, 100 is bottom
- Set control status (neutral, player controlled, etc.)
- Locations appear as clickable pins on the interactive map

#### Step 4: Add Session Logs
- Go to `/admin/sessions`
- Click "Add Session"
- Fill in: Session Number, Title, Date, Summary, Detailed Narrative
- Optional: Add featured image URL
- Sessions appear in the timeline on the Chronicles page

#### Step 5: Add Gallery Images
- Go to `/admin/gallery`
- Click "Add Image"
- Paste image URL
- Add title, description, category
- Optional: Link to a session
- Images appear in the Gallery with a lightbox viewer

## 5. View Your Campaign

Visit `/` (home page) to see your campaign:

- **Hero Section**: Your campaign title and tagline
- **Campaign Overview**: Your lore, story arc, and house rules
- **Characters**: All player characters in a beautiful grid
- **Sessions**: Timeline of adventures
- **Map**: Interactive world map with your locations
- **Gallery**: Campaign artwork and screenshots

## Navigation

### Public Site URLs
- `/` - Home page with all campaign content
- Scroll to see: Campaign → Characters → Sessions → Map → Gallery

### Admin URLs
- `/admin` - Dashboard overview
- `/admin/characters` - Character management
- `/admin/sessions` - Session management
- `/admin/locations` - Map location management
- `/admin/gallery` - Gallery management
- `/admin/settings` - Campaign settings

### Auth URLs
- `/auth/login` - Login page
- `/auth/signup` - Sign up page

## Useful Tips

### Character Classes
Use these for class emojis to display:
- Fighter ⚔️
- Rogue 🗡️
- Wizard 🔮
- Cleric ✨
- Ranger 🏹
- Paladin ⚡
- Bard 🎵
- Druid 🌿
- Barbarian 💪
- Monk 🥋

### Map Location Types
- **Port** ⚓ - Harbor or seaside town
- **Island** 🏝️ - Island or atoll
- **Territory** 🚩 - Region or territory
- **Landmark** 🗺️ - Notable location

### Image URLs
- Use public image URLs (not local files)
- Supported formats: PNG, JPG, WebP
- Examples:
  - `https://example.com/character.png`
  - `https://cdn.example.com/image.jpg`

### Coordinates on the Map
- Used percentages (0-100) for easy positioning
- `(50, 50)` = center of map
- `(0, 0)` = top-left corner
- `(100, 100)` = bottom-right corner

## Troubleshooting

### I can't access the admin panel
- Make sure you're logged in
- Check that `is_admin = true` in the database (see Step 3 above)
- Try signing out and back in

### Characters/Sessions/Locations don't appear
- Make sure they're saved in the admin panel
- Check that you've filled in all required fields
- Refresh the public page (Ctrl+F5 or Cmd+Shift+R)

### Map markers not showing
- Verify coordinates are 0-100 (not latitude/longitude)
- Make sure location name and description are filled in
- Try zooming in/out on the map

### Images not loading
- Make sure URL is publicly accessible (not local)
- Check the URL is complete (starts with http:// or https://)
- Try a different image to test
- Use PNG or JPG format

## Next Steps

1. Set up your campaign settings
2. Add 2-3 characters
3. Add 3-5 map locations
4. Log your first session
5. Add a few gallery images
6. Share your campaign with your players!

## Want More Features?

The foundation is set! You can:
- Customize colors by editing Tailwind classes
- Add more interactive elements
- Create PDF exports for character sheets
- Add real-time notifications
- Build player profile pages
- Add campaign messaging system

Enjoy your epic pirate adventure! ⚓
