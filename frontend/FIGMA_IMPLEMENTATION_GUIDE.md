# Figma Design Implementation Guide

This guide contains all the components needed to implement the Figma design for the ScienceDAO dashboard.

## Components to Create

### 1. Header.tsx (layout/)
- Logo with "ScienceDAO" text
- Navigation: Dashboard, Hypotheses, Papers, Agents
- Right side: "Log in" + "Try it free" button

### 2. Sidebar.tsx (layout/)
- Fixed 240px width sidebar
- Navigation items with icons (Server, Tools, etc.)
- Active state with colored left border

### 3. Footer.tsx (layout/)
- Logo + social icons (Facebook, Instagram, Twitter)
- 4 columns: Resources, Community, Company, Contact

### 4. DashboardHeader.tsx (dashboard/)
- "ScienceDAO Command Center" title with dropdown
- Active status indicator (green dot)
- Profile avatars
- Tab navigation: Overview, Hypotheses, Papers, Agents

### 5. MetricCards.tsx (dashboard/)
- 4 cards: Papers Analyzed, Hypotheses Generated, Active Proposals, Total Funding
- Trend indicators (+5%, +3%, etc.)
- Three-dot menu on each card

### 6. ChartCards.tsx (dashboard/)
- 2 line charts: Papers Analyzed & Hypotheses Generated over time
- Using Recharts library
- Gridlines and gradient fills

### 7. mockData.ts (utils/)
- Generate time-series data for last 30 days
- Mock trend calculations

## File Structure

```
frontend/src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          ✨ NEW
│   │   ├── Sidebar.tsx         ✨ NEW
│   │   └── Footer.tsx          ✨ NEW
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx ✨ NEW
│   │   ├── MetricCards.tsx     ✨ NEW
│   │   └── ChartCards.tsx      ✨ NEW
│   ├── StatsCards.tsx          📝 KEEP
│   ├── AgentStats.tsx          📝 KEEP
│   ├── HypothesisList.tsx      📝 KEEP
│   ├── ActivityFeed.tsx        📝 KEEP
│   ├── PaperList.tsx           📝 KEEP
│   └── Dashboard.tsx           🔄 UPDATE
├── utils/
│   └── mockData.ts             ✨ NEW
└── types/
    └── index.ts                🔄 UPDATE
```

## Implementation Steps

1. ✅ Update tailwind.config.js with Figma colors
2. ✅ Update index.css with fonts
3. ✅ Install lucide-react
4. ⏳ Create all layout components (Header, Sidebar, Footer)
5. ⏳ Create dashboard components (DashboardHeader, MetricCards, ChartCards)
6. ⏳ Create mockData utility
7. ⏳ Update Dashboard.tsx with tab system
8. ⏳ Test and polish

## Next: Run the implementation script

All component code will be created in the next steps. Each component follows the Figma design with the new color palette and typography.
