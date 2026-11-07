/* ---------------------------------------------------------------
   site.js — themultivac.com page bootstrap (plain ESM, no build).
   Pages load it once at the end of <body>:
     <script type="module">
       import { initSite } from '/assets/js/site.js';
       initSite();
     </script>
   It marks the current nav link (each page also ships its own
   aria-current="page" in the HTML; this keeps the marker right for
   alternate URLs such as /about), runs the Deep Pearl page behaviors
   (accretion reveals, sheen, counters) and, where the markup exists,
   the hero Accretion pearl and the peer-matrix instrument — both
   ported from deeppearlai.com's Astro pages.
   --------------------------------------------------------------- */

import {
  pearlLUT,
  lutColor,
  makeNoise,
  makeSim,
  glowSprite,
  initPage,
} from '/assets/js/nacre.js';

/* ------------------------- current nav link ------------------- */

/* "/" ≡ "/index.html", "/judges/" ≡ "/judges/index.html",
   "/about.html" ≡ "/about" */
function normalizePath(pathname) {
  let p = pathname || '/';
  p = p.replace(/\/index\.html$/, '/');
  p = p.replace(/\.html$/, '');
  if (p.length > 1) p = p.replace(/\/+$/, '');
  return p || '/';
}

function initNav() {
  const here = normalizePath(location.pathname);
  document.querySelectorAll('.site-nav a[href]').forEach((a) => {
    let url;
    try {
      url = new URL(a.getAttribute('href'), location.href);
    } catch {
      return;
    }
    if (url.origin !== location.origin) return;
    if (normalizePath(url.pathname) === here) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });
}

/* ---------------- The Accretion — hero pearl ----------------
   Ported verbatim from src/pages/index.astro (deeppearlai.com). */

function initHero() {
  const heroCanvas = document.getElementById('pearl-canvas');
  if (!heroCanvas || heroCanvas.dataset.init) return;
  heroCanvas.dataset.init = '1';

  const lut = pearlLUT(undefined, 256, 2.4);
  const { fbm } = makeNoise(7);

  const RINGS = 44;
  const light = glowSprite([240, 238, 232], 256, 0.5);
  const core = glowSprite(lut[40], 256, 0.9);
  const roLayer = document.getElementById('ro-layer');
  const roDr = document.getElementById('ro-dr');
  const roT = document.getElementById('ro-t');

  let px = -1;
  let py = -1;
  const hero = heroCanvas.closest('.hero');
  hero.addEventListener(
    'pointermove',
    (e) => {
      const r = heroCanvas.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
    },
    { passive: true }
  );
  hero.addEventListener('pointerleave', () => {
    px = -1;
    py = -1;
  });

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  let roTick = 0;

  function drawPearl(ctx, t, view, still) {
    const { W, H } = view;
    const narrow = W < 700;
    const cx = narrow ? W * 0.5 : W * 0.7;
    const cy = narrow ? H * 0.24 : H * 0.42;
    const R = Math.min(W, H) * (narrow ? 0.34 : 0.42);

    ctx.clearRect(0, 0, W, H);

    // light position: cursor, or slow autonomous orbit
    let lx, ly;
    if (px >= 0) {
      lx = px;
      ly = py;
    } else {
      lx = cx + Math.cos(t * 0.00012) * R * 0.8;
      ly = cy + Math.sin(t * 0.00009) * R * 0.6;
    }
    const aim = Math.atan2(ly - cy, lx - cx);

    const grown = still ? RINGS : Math.min(RINGS, easeOut(Math.min(1, t / 2600)) * RINGS);
    const segs = view.degraded ? 56 : 88;

    ctx.globalCompositeOperation = 'lighter';

    // pearl core
    const coreR = R * 0.5 * (grown / RINGS);
    ctx.globalAlpha = 0.5;
    ctx.drawImage(core, cx - coreR, cy - coreR, coreR * 2, coreR * 2);
    ctx.globalAlpha = 1;

    let lastAmp = 0;
    const n = Math.floor(grown);
    for (let i = 0; i < n; i++) {
      const br = R * Math.pow((i + 1) / RINGS, 0.92);
      const A = R * 0.05 * (0.4 + i / RINGS);
      lastAmp = A;
      ctx.beginPath();
      for (let s = 0; s <= segs; s++) {
        const th = (s / segs) * Math.PI * 2;
        const sway = px >= 0 || !still ? 1 + 0.45 * Math.cos(th - aim) : 1;
        const r =
          br +
          A *
            sway *
            fbm(
              Math.cos(th) * 1.6 + i * 0.31,
              Math.sin(th) * 1.6,
              (still ? 8000 : t) * 0.00012 + i * 0.07,
              2
            );
        const x = cx + Math.cos(th) * r;
        const y = cy + Math.sin(th) * r;
        s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = lutColor(
        lut,
        (i / RINGS + (still ? 0 : t * 0.00002)) % 1,
        0.13
      );
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // the light source
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.32;
    ctx.drawImage(light, lx - 170, ly - 170, 340, 340);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // instrument readout
    if (roLayer && ++roTick % 6 === 0) {
      roLayer.textContent = `${String(n).padStart(2, '0')}/${RINGS}`;
      roDr.textContent = `${lastAmp.toFixed(2)}px`;
      roT.textContent = `${(t / 1000).toFixed(1)}s`;
    }
  }

  makeSim(heroCanvas, {
    render: (ctx, t, dt, view) => drawPearl(ctx, t, view, false),
    renderStill: (ctx, view) => {
      drawPearl(ctx, 8000, view, true);
      if (roLayer) {
        roLayer.textContent = `${RINGS}/${RINGS}`;
        roDr.textContent = '2.20px';
        roT.textContent = '—';
      }
    },
  });
}

/* ---------------- FIG. 1 — the peer matrix instrument ----------
   Ported verbatim from src/pages/multivac.astro (deeppearlai.com).
   Reads the canvas's data-matrix JSON (rows = judges, columns =
   answerers, -1 = recused) and the .chip / .cellbtn markup. */

function initPeerMatrix() {
  const canvas = document.getElementById('peer-matrix-canvas');
  if (!canvas || canvas.dataset.init) return;
  canvas.dataset.init = '1';

  const N = 8;
  /* baked target heat-map — same JSON literal the markup was built from */
  const T = JSON.parse(canvas.dataset.matrix);
  const lut = pearlLUT(undefined, 256, 2.2);

  /* pre-rendered sprites — shadowBlur is banned */
  const moteSprite = glowSprite([240, 238, 232], 64, 1);
  const alertSprite = glowSprite([216, 160, 122], 48, 0.9); /* disagreement only */
  const headSprites = [30, 95, 160, 225].map((i) => glowSprite(lut[i], 48, 0.9));

  /* live state converging toward the baked target */
  const cur = T.map((row) => row.map(() => 0));
  const alertT = T.map((row) => row.map((v) => (v >= 0 && v < 0.4 ? (0.4 - v) * 0.8 : 0)));
  const alertCur = T.map((row) => row.map(() => 0));
  const flash = T.map((row) => row.map(() => 0));

  let seed = 0x9e3779b9;
  const rand = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    seed >>>= 0;
    return seed / 4294967296;
  };
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const qBez = (a, b, c, u) => (1 - u) * (1 - u) * a + 2 * (1 - u) * u * b + u * u * c;
  const hueFor = (t) => (0.62 + t * 0.55) % 1;

  let simT = 0;
  let nextRound = 700;
  let rounds = [];
  let staticLayer = null;

  /* static geometry (grid lines + recused diagonal) drawn once per resize */
  function buildStatic(view) {
    const { W, H, DPR } = view;
    const cw = W / N;
    const ch = H / N;
    staticLayer = document.createElement('canvas');
    staticLayer.width = Math.max(1, Math.round(W * DPR));
    staticLayer.height = Math.max(1, Math.round(H * DPR));
    const g = staticLayer.getContext('2d');
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.lineWidth = 1;
    g.strokeStyle = 'rgba(233,230,223,0.08)';
    g.beginPath();
    for (let i = 1; i < N; i++) {
      g.moveTo(Math.round(i * cw) + 0.5, 0);
      g.lineTo(Math.round(i * cw) + 0.5, H);
      g.moveTo(0, Math.round(i * ch) + 0.5);
      g.lineTo(W, Math.round(i * ch) + 0.5);
    }
    g.stroke();
    /* press-red X — the judge's seat for its own column never fills */
    g.strokeStyle = 'rgba(194,69,47,0.6)';
    for (let i = 0; i < N; i++) {
      const x = i * cw;
      const y = i * ch;
      g.strokeRect(x + 2.5, y + 2.5, cw - 5, ch - 5);
      g.beginPath();
      g.moveTo(x + 5, y + 5);
      g.lineTo(x + cw - 5, y + ch - 5);
      g.moveTo(x + cw - 5, y + 5);
      g.lineTo(x + 5, y + ch - 5);
      g.stroke();
    }
  }

  function drawCells(ctx, view, agg, alertAgg) {
    const cw = view.W / N;
    const ch = view.H / N;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (r === c) continue;
        const a = agg[r][c];
        if (a > 0.004) {
          ctx.fillStyle = lutColor(lut, hueFor(T[r][c]), Math.min(0.88, 0.03 + a * 0.78));
          ctx.fillRect(c * cw + 1, r * ch + 1, cw - 2, ch - 2);
        }
        const al = alertAgg[r][c];
        if (al > 0.005) {
          ctx.fillStyle = `rgba(216,160,122,${Math.min(0.45, al)})`;
          ctx.fillRect(c * cw + 1, r * ch + 1, cw - 2, ch - 2);
        }
      }
    }
  }

  function spawnRound(view) {
    const col = (rand() * N) | 0;
    const judges = [];
    for (let r = 0; r < N; r++) if (r !== col) judges.push(r);
    for (let i = judges.length - 1; i > 0; i--) {
      const j = (rand() * (i + 1)) | 0;
      [judges[i], judges[j]] = [judges[j], judges[i]];
    }
    const count = view.degraded ? 5 : 7; /* governor: drop ~30% */
    const arcs = judges.slice(0, count).map((r, i) => ({
      r,
      c: col,
      start: simT + 320 + i * 55,
      dur: 360 + rand() * 140,
      disagree: rand() < (T[r][col] < 0.4 ? 0.3 : 0.07),
      deposited: false,
      len: 0,
    }));
    const last = arcs[arcs.length - 1];
    rounds.push({ col, t0: simT, arcs, end: last.start + last.dur + 220 });
  }

  function deposit(a) {
    const tv = T[a.r][a.c];
    const jit = Math.max(0, 1 - simT / 45000); /* settles into target by ~45s */
    cur[a.r][a.c] = clamp01(cur[a.r][a.c] + (tv - cur[a.r][a.c]) * 0.4 + (rand() - 0.5) * 0.22 * jit);
    flash[a.r][a.c] = Math.min(1, flash[a.r][a.c] + 0.8);
    if (a.disagree) {
      alertCur[a.r][a.c] = Math.min(0.55, alertCur[a.r][a.c] + 0.08 + alertT[a.r][a.c] * 0.45);
    }
  }

  function render(ctx, t, dt, view) {
    simT += dt;
    const { W, H } = view;
    const cw = W / N;
    const ch = H / N;

    ctx.clearRect(0, 0, W, H);
    if (staticLayer) ctx.drawImage(staticLayer, 0, 0, W, H);

    /* slow relaxation toward the baked matrix */
    const k = 1 - Math.exp(-dt * 0.000025);
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (r === c) continue;
        cur[r][c] += (T[r][c] - cur[r][c]) * k;
        alertCur[r][c] += (alertT[r][c] - alertCur[r][c]) * k;
        flash[r][c] = flash[r][c] > 0.02 ? flash[r][c] * Math.exp(-dt / 240) : 0;
      }
    }

    drawCells(ctx, view, cur, alertCur);

    /* one evaluation round every ~900ms */
    if (simT >= nextRound) {
      if (rounds.length < 3) spawnRound(view);
      nextRound = simT + 860 + rand() * 180;
    }

    ctx.globalCompositeOperation = 'lighter';

    /* verdict deposit flashes */
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const f = flash[r][c];
        if (f <= 0.02) continue;
        ctx.globalAlpha = f * 0.5;
        ctx.drawImage(
          moteSprite,
          c * cw + cw / 2 - cw * 0.7,
          r * ch + ch / 2 - ch * 0.7,
          cw * 1.4,
          ch * 1.4
        );
      }
    }
    ctx.globalAlpha = 1;

    for (const R of rounds) {
      const cx = R.col * cw + cw / 2;

      /* the answerer column under examination */
      const env = Math.min(1, (simT - R.t0) / 180) * clamp01((R.end - simT) / 300);
      if (env > 0) {
        ctx.globalAlpha = 0.06 * env;
        ctx.fillStyle = 'rgb(240,238,232)';
        ctx.fillRect(R.col * cw + 1, 0, cw - 2, H);
        ctx.globalAlpha = 1;
      }

      /* question mote drops into the column */
      const dp = (simT - R.t0) / 300;
      if (dp <= 1) {
        const my = -18 + (ch * 0.55 + 18) * easeOut(clamp01(dp));
        ctx.globalAlpha = 0.9;
        ctx.drawImage(moteSprite, cx - 11, my - 11, 22, 22);
        ctx.globalAlpha = 1;
      }

      /* judgment arcs fan from the judges' recused seats into the column */
      for (const a of R.arcs) {
        if (simT < a.start) continue;
        const overEnd = simT - (a.start + a.dur);
        if (overEnd >= 0 && !a.deposited) {
          a.deposited = true;
          deposit(a);
        }
        if (overEnd >= 160) continue;

        const p = clamp01((simT - a.start) / a.dur);
        const u = easeOut(p);
        const sx = a.r * cw + cw / 2;
        const sy = a.r * ch + ch / 2;
        const tx = a.c * cw + cw / 2;
        const cpx = (sx + tx) / 2;
        const cpy = sy - ch * 0.95;

        if (!a.len) {
          let L = 0;
          let lx = sx;
          let ly = sy;
          for (let i = 1; i <= 10; i++) {
            const uu = i / 10;
            const x = qBez(sx, cpx, tx, uu);
            const y = qBez(sy, cpy, sy, uu);
            L += Math.hypot(x - lx, y - ly);
            lx = x;
            ly = y;
          }
          a.len = Math.max(8, L);
        }

        const fade = overEnd > 0 ? 1 - overEnd / 160 : 1;
        const alpha = 0.7 * fade;
        ctx.strokeStyle = a.disagree
          ? `rgba(216,160,122,${alpha})`
          : lutColor(lut, (0.08 + a.r * 0.118) % 1, alpha);
        ctx.lineWidth = 1.2;
        ctx.setLineDash([a.len, a.len]);
        ctx.lineDashOffset = a.len * (1 - u);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(cpx, cpy, tx, sy);
        ctx.stroke();
        ctx.setLineDash([]);

        if (overEnd < 0) {
          const hx = qBez(sx, cpx, tx, u);
          const hy = qBez(sy, cpy, sy, u);
          const spr = a.disagree ? alertSprite : headSprites[a.r % headSprites.length];
          ctx.drawImage(spr, hx - 8, hy - 8, 16, 16);
        }
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    rounds = rounds.filter((R) => simT < R.end + 200);
  }

  /* composed end-state: fully converged mosaic + struck diagonal */
  function renderStill(ctx, view) {
    ctx.clearRect(0, 0, view.W, view.H);
    if (!staticLayer) buildStatic(view);
    ctx.drawImage(staticLayer, 0, 0, view.W, view.H);
    drawCells(ctx, view, T, alertT);
  }

  makeSim(canvas, {
    init: (view) => buildStatic(view),
    render,
    renderStill,
  });

  /* ---------------- cell inspector tooltip ---------------- */
  const plate = canvas.closest('.plate');
  const tip = document.getElementById('matrix-tip');
  const cellsWrap = document.getElementById('matrix-cells');

  function showTip(btn) {
    tip.textContent = btn.dataset.tip;
    tip.hidden = false;
    const pr = plate.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    let x = br.left - pr.left + br.width / 2 - tw / 2;
    x = Math.max(6, Math.min(pr.width - tw - 6, x));
    let y = br.top - pr.top - th - 8;
    if (y < 4) y = br.bottom - pr.top + 8;
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
  }

  cellsWrap.addEventListener('pointerover', (e) => {
    const b = e.target.closest('.cellbtn');
    if (b) showTip(b);
  });
  cellsWrap.addEventListener('pointerout', (e) => {
    if (!e.relatedTarget || !cellsWrap.contains(e.relatedTarget)) tip.hidden = true;
  });
  cellsWrap.addEventListener('focusin', (e) => {
    const b = e.target.closest('.cellbtn');
    if (b) showTip(b);
  });
  cellsWrap.addEventListener('focusout', (e) => {
    if (!e.relatedTarget || !cellsWrap.contains(e.relatedTarget)) tip.hidden = true;
  });

  /* redact chips — click toggles the lift for touch users */
  document.querySelectorAll('.matrix .chip').forEach((b) => {
    b.addEventListener('click', () => b.classList.toggle('lifted'));
  });
}

/* ------------------------- bootstrap -------------------------- */

export function initSite() {
  initNav();
  initPage();
  initHero();
  initPeerMatrix();
}
