// core.js: motor compartilhado das skills de animação.
// Cada template chama E.register({ defaults, setup, draw }).
// Regra de ouro: tudo é função do tempo t (segundos). Sem timers, sem estado entre quadros,
// sem Math.random (use E.rng(seed)). Assim o mesmo t sempre gera o mesmo quadro.
(function () {
  const W = 1080, H = 1920, FPS = 30;
  const base = document.currentScript.src.replace(/core\.js(\?.*)?$/, '');

  // ---------- fontes ----------
  const faces = [['Inter', 400], ['Inter', 500], ['Inter', 600], ['Inter', 700], ['Poppins', 600], ['Poppins', 700], ['Poppins', 800], ['Silkscreen', 400]];
  const css = faces.map(([f, w]) => `@font-face{font-family:${f};font-weight:${w};src:url(${base}fonts/${f.toLowerCase()}-${w}.woff2) format('woff2')}`).join('\n');
  const st = document.createElement('style');
  st.textContent = css + `
    html,body{margin:0;background:#111;height:100%}
    body{display:flex;align-items:center;justify-content:center}
    canvas{display:block;height:min(100vh,177.78vw);aspect-ratio:9/16}
    body.render canvas{height:1920px;width:1080px}`;
  document.head.appendChild(st);

  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; cv.id = 'c';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(cv));
  const ctx = cv.getContext('2d');

  // ---------- utilidades ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const eout = t => 1 - Math.pow(1 - t, 3);
  const eout5 = t => 1 - Math.pow(1 - t, 5);
  const eback = t => { const c1 = 1.1, c3 = c1 + 1; return t >= 1 ? 1 : 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
  function circle(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); }
  function T(c, s, x, y, font, col, al = 'left', bl = 'alphabetic') { c.font = font; c.fillStyle = col; c.textAlign = al; c.textBaseline = bl; c.fillText(s, x, y); }
  function tw(c, s, font) { c.font = font; return c.measureText(s).width; }

  function lines(c, text, maxW, font) {
    c.font = font; const out = []; let line = '';
    for (const w of String(text).split(' ')) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }
    if (line) out.push(line); return out;
  }
  function wrap(c, text, x, y, maxW, lh, font, col, al = 'left') { const ls = lines(c, text, maxW, font); ls.forEach((l, i) => T(c, l, x, y + i * lh, font, col, al)); return y + ls.length * lh; }
  function hex(h) { const m = /^rgba?\(([^)]+)\)/.exec(h); if (m) return m[1].split(',').slice(0, 3).map(Number); h = h.replace('#', ''); if (h.length === 3) h = [...h].map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
  function mix(a, b, t) { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')})`; }
  function alpha(h, a) { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; }

  // números no idioma do spec (pt-BR por padrão)
  let LOCALE = 'pt-BR';
  const num = (v, d = 0) => new Intl.NumberFormat(LOCALE, { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
  const money = (v, cur, d) => new Intl.NumberFormat(LOCALE, { style: 'currency', currency: cur, minimumFractionDigits: d, maximumFractionDigits: d }).format(v);

  // etiqueta "/comando" no canto superior
  function tag(c, text, dark, accent = '#e8845c') {
    if (!text) return;
    const f = '500 34px Inter', w = tw(c, text, f);
    rr(c, 60, 230, w + 84, 64, 32); c.fillStyle = dark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)'; c.fill();
    circle(c, 96, 262, 9); c.fillStyle = accent; c.fill();
    T(c, text, 118, 274, f, accent);
  }

  // zonas cobertas pela interface do Reels/TikTok/Shorts (aprox.): cabeçalho, legenda e botões
  const SAFE = { top: 220, bottom: 380, left: 60, right: 140 };
  function drawSafe(c) {
    c.save(); c.fillStyle = 'rgba(255,0,60,0.28)';
    c.fillRect(0, 0, W, SAFE.top); c.fillRect(0, H - SAFE.bottom, W, SAFE.bottom);
    c.fillRect(W - SAFE.right, SAFE.top, SAFE.right, H - SAFE.top - SAFE.bottom); c.fillRect(0, SAFE.top, SAFE.left, H - SAFE.top - SAFE.bottom);
    c.restore();
  }

  function merge(a, b) {
    if (Array.isArray(b) || typeof b !== 'object' || b === null) return b === undefined ? a : b;
    const o = { ...(a || {}) }; for (const k in b) o[k] = (a && typeof a[k] === 'object' && !Array.isArray(a[k]) && a[k] !== null) ? merge(a[k], b[k]) : b[k]; return o;
  }

  const E = { W, H, FPS, ctx, clamp, lerp, prog, eio, eout, eout5, eback, rng, rr, circle, T, tw, lines, wrap, mix, alpha, num, money, tag, SAFE, drawSafe, merge };

  E.register = (skill) => {
    // spec: injetado pelo render.mjs, ou na URL da prévia (template.html#{"title":"..."}), ou os padrões da skill
    let fromHash = {};
    try { if (location.hash.length > 1) fromHash = JSON.parse(decodeURIComponent(location.hash.slice(1))); } catch (e) { console.warn('spec inválido na URL', e); }
    const spec = merge(skill.defaults, window.__SPEC__ || fromHash);
    LOCALE = spec.locale || 'pt-BR';
    const state = skill.setup ? skill.setup(spec, E) || {} : {};
    const D = spec.duration;
    window.FILM = { W, H, FPS, DURATION: D };
    window.SPEC = spec;
    window.seek = (t) => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; skill.draw(ctx, clamp(t, 0, D), spec, state, E); };
    window.__safe = () => drawSafe(ctx);
    (async () => {
      await Promise.all(faces.map(([f, w]) => document.fonts.load(`${w} 20px ${f}`, 'Aáçã0')));
      await document.fonts.ready;
      if (skill.afterFonts) skill.afterFonts(spec, state, E);
      window.seek(0);
      window.ready = true;
      if (window.__RENDER__) { document.body.classList.add('render'); return; }
      // pré-visualização no navegador: espaço pausa, setas avançam um quadro, R reinicia
      let t0 = performance.now(), paused = false, cur = 0;
      const loop = (now) => { if (!paused) { cur = ((now - t0) / 1000) % (D + .6); window.seek(Math.min(cur, D)); } requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
      addEventListener('keydown', e => {
        if (e.key === ' ') { paused = !paused; t0 = performance.now() - cur * 1000; }
        if (e.key === 'r') { t0 = performance.now(); paused = false; }
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { paused = true; cur = clamp(cur + (e.key === 'ArrowRight' ? 1 : -1) / FPS, 0, D); window.seek(cur); }
      });
    })();
  };
  window.E = E;
})();
