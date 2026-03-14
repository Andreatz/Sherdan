# Pirate D&D Campaign Website - Setup Guide

Your comprehensive D&D campaign management and showcase website is now ready to use. This guide explains all the features and how to get started.

## Project Overview

This is a full-featured pirate-themed D&D campaign website with:
- **Admin Dashboard**: Complete content management system for campaign data
- **Public Website**: Beautiful showcase of your campaign, characters, sessions, map, and gallery
- **Database**: Supabase PostgreSQL backend for all data persistence
- **Authentication**: Secure login system for admin access

## Getting Started

### 1. Database Setup (Already Completed)

The Supabase database schema has been created with the following tables:
- `profiles` - User accounts and admin status
- `characters` - Player character profiles
- `session_logs` - Adventure session records
- `world_locations` - Interactive map locations
- `gallery_items` - Campaign screenshots and artwork
- `campaign_settings` - Global campaign configuration

All tables have Row Level Security (RLS) enabled with appropriate policies.

### 2. Creating Your First Admin Account

1. Go to `/auth/signup`
2. Create an account with your email and password
3. Contact a Supabase admin to set `is_admin = true` in the `profiles` table, or manually enable it via the Supabase dashboard

**Manual Admin Setup in Supabase:**
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run this query with your user ID:
```sql
UPDATE profiles SET is_admin = true WHERE id = 'YOUR_USER_ID';
```

### 3. Logging In

- Navigate to `/auth/login`
- Enter your email and password
- You'll be redirected to `/admin` if you're an admin

## Admin Dashboard Features

### Characters Management (`/admin/characters`)
- **Add Characters**: Create player character profiles
- **Fields**: Name, Class, Race, Level, Backstory, Portrait URL
- **Edit & Delete**: Manage existing characters
- **Display**: Characters appear on the public Characters page

### Session Logs (`/admin/sessions`)
- **Add Sessions**: Create adventure session records
- **Fields**: Session Number, Title, Date, Summary, Detailed Narrative, Featured Image URL
- **Timeline**: Sessions display in reverse chronological order with expandable details
- **Gallery Integration**: Link images to specific sessions

### Locations (`/admin/locations`)
- **Add Locations**: Create map points of interest
- **Fields**: Name, Description, Type (Port/Island/Territory/Landmark), X & Y Coordinates, Control Status, History
- **Control Status**: Neutral, Player Controlled, Enemy Controlled, Allied
- **Map Integration**: Coordinates determine marker placement (0-100 range for map percentages)

### Gallery (`/admin/gallery`)
- **Upload Images**: Add campaign screenshots and artwork
- **Fields**: Image URL, Title, Description, Session Association, Category
- **Organization**: Sort by session, date, or category
- **Lightbox Display**: Gallery displays with full lightbox viewing on public site

### Campaign Settings (`/admin/settings`)
- **Campaign Title & Tagline**: Main branding
- **World Lore**: Describe your world and its history
- **Story Arc**: Main narrative description
- **House Rules**: Special D&D rules for your campaign

### Dashboard (`/admin`)
- Overview of all campaign statistics
- Quick links to all management sections
- Real-time data counts

## Public Website Features

### Home Page (`/`)
- **Hero Section**: Parallax background with campaign title and tagline
- **Smooth Scrolling**: Navigation to all sections
- **Call-to-Action**: Links to campaign content

### Campaign Overview (`#campaign`)
- Displays your world lore, story arc, and house rules
- Tabbed interface for organized reading
- Pulls data from campaign settings

### Characters Gallery (`#characters`)
- Grid display of all player characters
- Character cards show portrait, name, class, race, and level
- Click to expand for full backstory view
- Class-based emoji icons for visual recognition

### Session Chronicles (`#sessions`)
- Vertical timeline of all adventure sessions
- Expandable session cards showing full narratives
- Chronological ordering (newest first)
- Featured images for sessions
- Detailed narratives with smooth expand/collapse

### Interactive World Map (`#map`)
- Custom map with zooming and panning
- Click and drag to pan across the map
- Scroll wheel or zoom buttons to zoom in/out
- **Location Markers**:
  - Color-coded by control status
  - Type icons (anchor, island, flag, etc.)
  - Click to see location details
- **Location List**: Sidebar showing all locations
- **Coordinates**: Markers positioned using percentage coordinates (0-100)

### Campaign Gallery (`#gallery`)
- Masonry grid of all campaign images
- Lightbox viewer with navigation
- Image metadata display
- Category and session filtering visible

## How to Use Coordinates on the Map

When adding locations, use percentage coordinates (0-100):
- `X: 0-100` represents left to right on the map
- `Y: 0-100` represents top to bottom on the map
- Example: `(50, 50)` places the marker at the center

## Image URLs

For character portraits, session images, and gallery items, provide full URLs:
- Use public image URLs from any hosting service
- Examples:
  - `https://example.com/image.png`
  - Direct links to uploaded images

## Important Files

### Core Application
- `src/App.tsx` - Main routing and app structure
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/utils/supabase.ts` - Supabase client initialization

### Admin Pages
- `src/pages/admin/Dashboard.tsx` - Admin overview
- `src/pages/admin/Characters.tsx` - Character management
- `src/pages/admin/Sessions.tsx` - Session management
- `src/pages/admin/Locations.tsx` - Location/map management
- `src/pages/admin/Gallery.tsx` - Gallery management
- `src/pages/admin/Settings.tsx` - Campaign settings

### Public Pages
- `src/pages/public/Home.tsx` - Landing page with hero
- `src/pages/public/Campaign.tsx` - Campaign overview
- `src/pages/public/Characters.tsx` - Character gallery
- `src/pages/public/Sessions.tsx` - Session timeline
- `src/pages/public/Map.tsx` - Interactive world map
- `src/pages/public/Gallery.tsx` - Campaign gallery

### Components
- `src/components/shared/Navigation.tsx` - Main navigation bar
- `src/components/shared/Footer.tsx` - Footer
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/components/admin/AdminLayout.tsx` - Admin page layout

## Deployment

This project is ready for deployment to any hosting service:

1. **Build**: `npm run build` creates optimized production files
2. **Supabase Configuration**: Ensure environment variables are set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Deploy**: Push to your hosting provider (Vercel, Netlify, etc.)

## Customization

### Colors & Theme
- Modify Tailwind CSS classes to change the color scheme
- Primary colors: `amber-400` (gold), `slate-900` (dark)
- Edit `src/index.css` for custom animations

### Map Image
- Replace `/07BW004-full.png` with your custom world map
- Keep aspect ratio consistent
- Use PNG or JPG format

### Fonts & Typography
- Default system fonts used
- Modify `tailwind.config.js` to add custom fonts

## Troubleshooting

### Admin Access Not Working
- Verify `is_admin = true` in the profiles table
- Check Supabase authentication is working
- Clear browser cache and retry login

### Images Not Displaying
- Verify URLs are publicly accessible
- Check image format (PNG, JPG, WebP supported)
- Ensure URL is complete with protocol (http:// or https://)

### Map Markers Not Appearing
- Verify coordinates are in 0-100 range
- Check location is inserted into database
- Try zooming in/out on the map

### Build Errors
- Run `npm install` to install dependencies
- Clear node_modules and reinstall if issues persist
- Check Node.js version is 16+

## Next Steps

1. Create your first admin account
2. Add campaign lore and settings in Campaign Settings
3. Add your player characters
4. Create your world map locations
5. Log your adventure sessions
6. Upload gallery images
7. Share your campaign with players!

Enjoy chronicling your epic pirate adventure!
