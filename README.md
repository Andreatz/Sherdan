# Pirate D&D Campaign Website

A comprehensive, production-ready website for managing and showcasing your D&D pirate campaign. Features a beautiful admin dashboard for content management and a stunning public-facing website to chronicle your adventures.

## Quick Links

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes
- **[Setup Guide](SETUP.md)** - Detailed setup and deployment instructions
- **[Database Schema](DATABASE_SCHEMA.md)** - Complete database documentation
- **[Project Summary](PROJECT_SUMMARY.md)** - Comprehensive feature overview

## What You Get

### Admin Dashboard
Complete content management system for:
- **Characters** - Manage player character profiles
- **Sessions** - Log adventure narratives and details
- **Locations** - Create interactive map points of interest
- **Gallery** - Upload and organize campaign images
- **Settings** - Configure global campaign information

### Public Website
Beautiful showcase featuring:
- **Hero Landing** - Cinematic introduction with parallax effects
- **Campaign Overview** - World lore, story arc, and house rules
- **Character Gallery** - Stunning grid of player characters
- **Session Chronicles** - Timeline of adventure narratives
- **Interactive Map** - Custom world map with zoomable, pannable interface
- **Campaign Gallery** - Lightbox gallery of campaign moments

## Quick Start

1. **Create Admin Account**
   - Go to `/auth/signup`
   - Enter email and password

2. **Enable Admin Access** (in Supabase SQL Editor)
   ```sql
   UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';
   ```

3. **Access Admin Dashboard**
   - Visit `/admin`
   - Start adding campaign content

4. **View Public Website**
   - Visit `/`
   - See your campaign come to life

## Key Features

✨ **Fully Responsive** - Works on mobile, tablet, desktop
🎨 **Beautiful Design** - Pirate-themed with professional styling
🔒 **Secure Authentication** - Email/password via Supabase
📊 **Admin Dashboard** - Easy-to-use content management
🗺️ **Interactive Map** - Zoom, pan, clickable location markers
📸 **Gallery Lightbox** - Professional image viewer
⚓ **Sea-Themed Design** - Dark navy, gold accents, pirate aesthetics

## Technology

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **Routing**: React Router

## File Organization

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components (admin, public, auth)
├── contexts/         # State management (auth)
├── utils/            # Helper functions (Supabase client)
├── App.tsx           # Main routing
├── index.css         # Global styles
└── main.tsx          # Entry point
```

## Database

- 6 tables: profiles, characters, session_logs, world_locations, gallery_items, campaign_settings
- Row Level Security on all tables
- Public read access, admin-only write access
- Automatic timestamp tracking
- Foreign key relationships with cascade delete

## Deployment

Ready for immediate deployment:

```bash
npm run build
```

Deploy the `dist/` directory to any hosting platform (Vercel, Netlify, AWS, etc.)

## Administration

### Adding Characters
1. Go to `/admin/characters`
2. Click "Add Character"
3. Fill in: Name, Class, Race, Level, Backstory
4. Optional: Add portrait URL
5. Save and characters appear on public site

### Creating Map Locations
1. Go to `/admin/locations`
2. Click "Add Location"
3. Set coordinates (0-100 for positioning)
4. Save and markers appear on map

### Logging Sessions
1. Go to `/admin/sessions`
2. Click "Add Session"
3. Fill in narrative and details
4. Save and timeline updates

### Uploading Images
1. Go to `/admin/gallery`
2. Paste image URL
3. Add title and description
4. Save and images appear in gallery

## Customization

### Colors
Edit Tailwind classes in any component:
- Primary: `amber-400` (gold)
- Dark: `slate-900` (navy)
- Accents: `slate-700`, `slate-800`

### Map Background
Replace `/public/07BW004-full.png` with your custom world map

### Fonts
Add custom fonts in `tailwind.config.js`

## Troubleshooting

**Can't access admin panel?**
- Verify `is_admin = true` in database
- Try signing out and back in

**Characters/locations not appearing?**
- Refresh the page (Ctrl+F5)
- Check database for saved entries

**Map markers missing?**
- Verify coordinates are 0-100 range
- Ensure location is saved

**Images not loading?**
- Verify URL is publicly accessible
- Use PNG or JPG format
- Check URL starts with http:// or https://

## Support

For issues with:
- **Supabase**: Check Supabase documentation
- **React/TypeScript**: Refer to React docs
- **Tailwind**: See Tailwind CSS docs
- **React Router**: Check React Router docs

## Future Enhancements

- Player profile pages
- Real-time collaboration
- PDF exports
- Dice roller
- Campaign calendar
- NPC database
- Combat log
- Message system

## License

This project is yours to customize and deploy!

---

**Ready to chronicle your epic adventure?** Start with the [Quick Start Guide](QUICKSTART.md)!

⚓ May your tales be legendary! ⚓
