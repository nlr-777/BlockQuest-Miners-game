# BlockQuest Miners - Product Requirements Document

## Original Problem Statement
Build a standalone kid-safe Web3 edutainment mini-game app called "BlockQuest Miners" for ages 8-12, deployable to Vercel. Theme: Retro arcade/pixel art with BlockQuest characters (Gerry the Goat, Zara, Sam, Miko, Ollie, Lila).

Core concept: Players "mine" blocks by solving simple chain-building puzzles and math that teach blockchain (immutable chains, consensus, no single control). No real crypto — pure simulation.

## User Personas
- **Primary**: Kids ages 8-12 learning blockchain concepts
- **Secondary**: Parents/educators looking for safe educational games
- **Tertiary**: BlockQuest community members seeking interactive content

## Core Requirements (Static)
- 5 game levels teaching blockchain concepts
- Linear level unlock progression
- XP and badge reward system
- Educational popups for each level
- Retro pixel art aesthetic
- Mobile-first responsive design
- No real crypto, ads, or inappropriate content
- Progress persistence via localStorage + MongoDB

## What's Been Implemented (January 2026)

### Frontend
- [x] Start screen with Gerry the Goat intro
- [x] Level 1: Basic Chain (drag-and-drop 3-block puzzle)
- [x] Level 2: Consensus (miner voting puzzle)
- [x] Level 3: Tamper Detection (find/fix hacked block)
- [x] Level 4: Proof of Work (tapping timing game)
- [x] Level 5: Full Chain (5-block chain puzzle)
- [x] Quest Complete screen with redirect to BlockQuest HQ
- [x] Educational popups for each level
- [x] Progress dashboard (XP, badges, completion %)
- [x] Sound effects toggle (Web Audio API chiptune sounds)
- [x] Header with Back to HQ link
- [x] Mobile-responsive design

### Backend
- [x] FastAPI REST API with /api prefix
- [x] CRUD endpoints for game progress
- [x] MongoDB integration for persistence
- [x] Leaderboard endpoint

### Tech Stack
- React 19 + React Router
- FastAPI + Motor (async MongoDB)
- Tailwind CSS with custom theme
- Framer Motion animations
- @dnd-kit for drag-and-drop
- canvas-confetti for celebrations
- sonner for toasts

## P0 Features (Done)
- All 5 game levels functional
- Progress persistence
- Level unlocking system
- XP and badge system
- Educational content

## P1 Features (Backlog)
- Supabase cloud sync integration
- User accounts/authentication
- Global leaderboard display
- Additional sound effects library
- Character selection feature

## P2 Features (Future)
- More levels covering DeFi, NFTs
- Multiplayer mode
- Achievement sharing
- Parent dashboard
- Multi-language support

## Next Tasks
1. Deploy to Vercel production
2. Add Supabase for cloud persistence
3. Integrate more BlockQuest character assets
4. Add celebration animations on badge earn
