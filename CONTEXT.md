# Hostlixo Cloud - Project Context & Memory

## Project Overview
Hostlixo Cloud is a premium web hosting, VPS, Game, Discord Bot, and Dedicated Server hosting provider. 
This project has recently been refactored to replace static JSON configuration files with a dynamic, MongoDB-backed architecture for true Single Source of Truth (SSOT) plan management.

## Architecture 
- **Framework**: Next.js 14+ (App Router), React, TypeScript.
- **Database**: MongoDB (via Mongoose).
- **Styling**: Tailwind CSS, Framer Motion (for animations).
- **Authentication**: JWT-based Admin authentication via `/api/admin/login` and cookies.

## Data Model (Relational Hierarchy)
The database follows a strict relational hierarchy to ensure scalability across different services:
1. **Service**: The top-level product (e.g., "Game Hosting", "VPS Hosting", "Discord Bot Hosting").
2. **PlanType**: The sub-service or runtime (e.g., "Minecraft" for Game Hosting, "Ryzen 9" for VPS).
3. **Category**: Tiering for plans (e.g., "Budget" for Minecraft, "Default" for VPS). *Note: Premium plans have been deprecated.*
4. **Plan**: The actual billing item (e.g., "4GB RAM Server") containing pricing, CPU, RAM, and Storage details.
5. **Location**: Datacenter locations (e.g., "Mumbai, India", "Frankfurt, Germany"), linked directly to Plans.

## Key Design Principles
1. **Dynamic Rendering**: All frontend product pages (e.g., `/games/minecraft`, `/vps`, `/discord`) MUST fetch data dynamically from the MongoDB database using `getServiceData()` from `app/lib/db-data.ts`.
2. **No Hardcoded Configs**: Do not rely on local `.json` files for product specs or pricing.
3. **Out of Stock State**: Plans or Locations can be marked `outOfStock: true`. The frontend must respect this and disable ordering.
4. **Admin Panel**: The Admin Dashboard (`/admin`) is the only place where database records should be modified (CRUD operations).

## Recent Refactoring (July 2026)
- **Database Migration**: All JSON data was seeded into MongoDB via `migrate-to-db.ts`.
- **API Routes**: RESTful APIs were established under `/api/admin/*` for full CRUD operations.
- **Component Upgrades**: `GameHostingLanding`, `VPSPricingSection`, `VDSPricingSection`, `WebHostingPricingSection`, and `DiscordPricingSection` were upgraded to Server Components that consume MongoDB data securely via `transformDbDataForCatalog()`.
- **Admin Dashboard**: Transitioned from a static JSON editor to a direct MongoDB interface (`DatabasePlansTab.tsx`).

## Development Scripts
- `npm run dev`: Start the development server.
- `npm run build`: Build for production.
- `ts-node migrate-to-db.ts`: Run the database migration script (use with caution to avoid duplicate seeding).
