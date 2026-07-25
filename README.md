# Hostlixo Cloud - Game Hosting & Cloud Infrastructure

An India-based cloud hosting website headquartered in Mumbai, built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
hostlixo-project/
├── app/
│   ├── components/           # React components
│   │   ├── HeroSection.tsx   # Hero with game banner cycling
│   │   ├── Navbar.tsx        # Navigation with mega-menus
│   │   ├── PricingSection.tsx # Pricing cards
│   │   ├── FeaturesSection.tsx
│   │   ├── LocationsSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── PanelShowcase.tsx
│   │   ├── Footer.tsx
│   │   ├── dedicated/       # VDS pricing
│   │   ├── discord/         # Discord bot pricing
│   │   ├── games/           # Game server listing
│   │   ├── vps/             # VPS pricing + OS picker
│   │   └── webhosting/      # Web hosting pricing
│   ├── config/sections/      # JSON configuration files
│   │   ├── hero.json        # Hero content, games, partners
│   │   ├── navigation.json  # Nav items, banner, social links
│   │   ├── pricing.json     # Plan pricing overview
│   │   ├── games.json       # Game server plans
│   │   ├── vps.json         # VPS plans
│   │   ├── dedicated.json   # Dedicated/VDS plans
│   │   ├── discord.json     # Discord bot plans
│   │   ├── webhosting.json  # Web hosting plans
│   │   ├── showcase.json    # Panel showcase tabs
│   │   └── ui.json          # Currency settings
│   ├── types/               # TypeScript types
│   ├── dedicated/page.tsx   # Dedicated servers page
│   ├── discord/page.tsx     # Discord bot page
│   ├── games/page.tsx       # Game servers page
│   ├── vps/page.tsx         # VPS page
│   ├── webhosting/page.tsx  # Web hosting page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout + metadata
│   └── page.tsx             # Home page
├── public/                  # Static assets
│   ├── advertisement/       # Partner logos
│   ├── banners/            # Game banners
│   ├── flags/              # Country flags
│   ├── icons/              # Game icons
│   ├── os/                 # OS icons
│   ├── showcase/           # Panel screenshots
│   └── meta/               # Logo, OG images
├── tailwind.config.ts       # Hostlixo Cloud color palette
└── package.json
```

## 🎨 Customization

### Brand & Content
All content is driven by JSON configs in `app/config/sections/`. Edit these files to change:
- **hero.json** — Brand name, games list, partners, hero text
- **navigation.json** — Nav items, promo banner, social links
- **pricing.json** — Overview pricing cards
- **games.json** — Game server plans & pricing
- **vps.json** — VPS plans & pricing  
- **dedicated.json** — VDS/Dedicated plans
- **discord.json** — Discord bot plans
- **webhosting.json** — Web hosting plans

### Colors
The Hostlixo Cloud color palette is defined in `tailwind.config.ts`:
- **Crimson**: `#ff174f` (primary)
- **Cyan**: `#06b6d4` (accent)
- **Blue**: `#3b82f6` (secondary)
- **Background**: `#020610`

### Fonts
- **Orbitron** — Headings (futuristic display)
- **Quicksand** — Body text (clean, readable)

## 🛠️ Tech Stack

- **Next.js 15** with App Router & Turbopack
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **next-themes** for dark/light mode
- **lucide-react** for icons

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, features, locations, pricing, FAQ |
| `/games` | Game server listing with plans |
| `/vps` | VPS hosting with OS picker |
| `/dedicated` | Dedicated/VDS servers |
| `/discord` | Discord bot hosting |
| `/webhosting` | Shared & business web hosting |
| `/terms-of-services` | Terms of Service |
| `/privacy-policy` | Privacy Policy |

## Hostlixo Cloud

India-based game hosting, cloud VPS, dedicated compute, bot hosting and web hosting from Mumbai, with additional regions in Singapore, Germany and the USA.
