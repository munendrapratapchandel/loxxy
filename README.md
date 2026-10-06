# LOXXY — Minecraft Esports Organization Hub

> **Built to Compete. Designed to Dominate.**  
> A tier-1 competitive Minecraft organization platform featuring interactive 3D skin rendering, dynamic PvP tiers, Power Index leaderboards, 3D Trophy Room, and a secured Admin Command Center.

---

## 🌟 What's New & Included

### 1. 3D "Loxxy Universe" Hero Showcase
- Central floating Loxxy core with 3D player constellation orbiting around it.
- Mouse movement shifts camera angles with smooth parallax depth.
- Click any athlete to spotlight their 3D model and inspect their competitive **Player Power Card** live on stage.

### 2. User's Uploaded Custom 3D Minecraft Skin
- The uploaded skin file has been integrated directly into the system as:
  `/skins/user-custom-skin.png` (64x64 format).
- Assigned as the primary battle skin for **Professorx** (Founder & Captain).
- Renders in full 3D with 360° orbital controls, zoom, and animations (**Idle**, **Walk**, **Run**, **Wave**, **Pose**).

### 3. Competitive Player "Power Card"
- Holographic foil borders that dynamically adapt to the athlete's pinnacle tier:
  - **HT1**: Prismatic rainbow holographic foil with ruby flare.
  - **HT2**: Molten golden foil with warm amber glow.
  - **HT3**: Royal purple crystalline foil.
  - **LT1**: Cyber emerald neon foil.
- Displays 3D skin model, Gamemode Tiers breakdown, Skill gauges, and the **Loxxy Power Index**.

### 4. "Loxxy Power Index" (LPI) & Team Rankings (`/rankings`)
- Weighted competitive calculation formula:
  `LPI = (PvP * 0.38) + (Game Sense * 0.24) + (Clutching * 0.16) + (Building * 0.10) + (Parkour * 0.08) + TierBonus`
- **Podium Showcase**: #1 Apex Champion with gold crown, #2 Silver, #3 Bronze.
- Leaderboard filters: Overall LPI | PvP | Sword | Crystal | Mace | Building | Redstone | Clutching.

### 5. Head-to-Head Athlete Comparison (`/compare`)
- Select any two players from dropdowns (e.g. Professorx vs Zephyr).
- Dual side-by-side 3D skin stages.
- Gamemode by gamemode matchup comparison (Sword, Axe, Crystal, Mace, UHC, Bedwars).
- Mechanics differential bars showing skill percentage advantages.

### 6. Chronological Story Timeline & 3D Trophy Room (`/achievements`)
- **3D Trophy Room**: Inspect championship cups with event banners, placements, and rosters.
- **Story Timeline**: Chronological milestone ladder tracking Loxxy from inception to international titles.
- **Standings Table**: Official tournament result records.

### 7. Match Schedule & Results Hub (`/matches`)
- Upcoming fixture cards with opponent name, tournament, gamemode, and date.
- Completed match victory scorecards (e.g. *Loxxy 5 — 2 Team Nexus, Victory*).

### 8. Live Team Status System
- Status ticker at the top of the website:
  `LOXXY LIVE STATUS ● 24 Members Online | ● 7 In Match | Discord Guild Active`
- Fully toggleable and editable from the Admin Panel.

### 9. "Latest from Loxxy" Announcements Feed
- Homepage dispatch cards for roster promotions, tournament victories, and team announcements.

### 10. Enhanced Admin Panel Security (`/admin`)
- **PIN Protection Gate**: Requires entering the admin security PIN before accessing management tools.
- **Default PIN**: `loxxy2026` (can be changed anytime in Branding/Theme settings).
- Session authenticated with instant lock/logout option.

### 11. Logo & Favicon Real File Uploads
- Admin panel includes file upload buttons for the official Logo and Favicon with live preview and instant persistence.

---

## 🚀 Live URLs

- **Public Home Arena**: [http://localhost:3000](http://localhost:3000)
- **Loxxy Rankings Leaderboard**: [http://localhost:3000/rankings](http://localhost:3000/rankings)
- **Head-to-Head Comparison**: [http://localhost:3000/compare](http://localhost:3000/compare)
- **Match Calendar & Scores**: [http://localhost:3000/matches](http://localhost:3000/matches)
- **Hall of Achievements**: [http://localhost:3000/achievements](http://localhost:3000/achievements)
- **Official Team Roster**: [http://localhost:3000/roster](http://localhost:3000/roster)
- **Player Profile (Professorx)**: [http://localhost:3000/roster/player-professorx](http://localhost:3000/roster/player-professorx)
- **Dominance Analytics**: [http://localhost:3000/dominance](http://localhost:3000/dominance)
- **Discord & Recruitment**: [http://localhost:3000/discord](http://localhost:3000/discord)
- **Secured Admin Center**: [http://localhost:3000/admin](http://localhost:3000/admin) *(Passkey: `loxxy2026`)*
