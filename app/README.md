# The Multivac UI - Static Deployment

## Overview
This is a static React-based UI for The Multivac AI Evaluation Command Center, optimized for GitHub Pages deployment.

## Quick Deploy (5 minutes)

### Step 1: Copy the `/app` folder to your repo

```bash
# Clone your repo (if not already)
git clone https://github.com/themultivac/themultivac.github.io.git
cd themultivac.github.io

# Copy the app folder (assuming you downloaded it)
# Place the /app folder in the root of your repo
```

### Step 2: Verify structure
Your repo should look like:
```
themultivac.github.io/
├── index.html          # Your existing homepage
├── about.html          # Your existing about page
├── app/                # NEW - The Multivac UI
│   └── index.html      # The complete React app
└── README.md
```

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Add Multivac UI at /app"
git push origin main
```

### Step 4: Access
- Main site: https://themultivac.com
- UI App: https://themultivac.com/app

---

## Architecture

### Tech Stack
- **React 18** (via unpkg CDN)
- **Babel** (in-browser JSX transformation)
- **Pure CSS** (no external framework)
- **Zero build step** - works directly in browser

### Design System
- **Fonts**: Ailerons (headers), JetBrains Mono (data)
- **Colors**: Pure black (#000) + Electric purple (#8B5CF6)
- **Borders**: Zero radius everywhere
- **Effects**: Purple glow on hover/focus

### Pages Included
1. **Dashboard** - Stats, recent evals, leaderboard
2. **New Evaluation** - Category selection, model pool
3. **Results** - Winner card, 10×10 peer matrix
4. **History** - Filterable evaluation list
5. **Analytics** - Charts, win rates, judge metrics
6. **Models** - Model cards, API key management
7. **Profile** - User settings, usage stats

---

## Customization

### Update Your Evaluation Data

Edit the data constants at the top of the `<script>` section in `app/index.html`:

```javascript
// Around line 450
const SAMPLE_EVALS = [
  { id: 'META-009', question: 'Your question here', category: 'Meta', date: 'Jan 22', winner: 'Winner Model', score: 9.2 },
  // Add your evaluations...
];

const LEADERBOARD = [
  { model: 'Grok 4.1 Fast', score: 91.2, color: '#8B5CF6' },
  // Update with your rankings...
];
```

### Add Models

```javascript
const MODELS = [
  { id: 'new-model', name: 'Model Name', provider: 'Provider', costIn: '$X.XX/M', costOut: '$X.XX/M', icon: '◈' },
  // ...
];
```

---

## Phase 2: Dynamic Data (Future)

When ready to load real JSON data:

```javascript
// Add this to load external evaluation files
const [evaluations, setEvaluations] = useState([]);

useEffect(() => {
  fetch('/app/data/evaluations/tracker.json')
    .then(r => r.json())
    .then(data => setEvaluations(data.evaluations));
}, []);
```

Directory structure for dynamic data:
```
app/
├── index.html
└── data/
    └── evaluations/
        ├── tracker.json       # Master list
        ├── eval-001.json      # Individual evaluation results
        ├── eval-002.json
        └── ...
```

---

## Troubleshooting

### Fonts not loading?
CDN fonts require internet. If offline, replace with system fonts.

### React errors in console?
Babel in-browser transformation may show warnings. These don't affect functionality.

### Page not updating?
Clear browser cache or hard refresh (Ctrl+Shift+R).

---

## Credits

Built for **The Multivac** by Yash Darji
- Website: https://themultivac.com
- GitHub: https://github.com/themultivac

Peer-to-peer AI model evaluation through blind assessment protocol.
