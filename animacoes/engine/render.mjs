#!/usr/bin/env node
// Renderiza uma skill em vídeo vertical 1080x1920.
//
//   node engine/render.mjs <skill> [spec.json] [opções]
//
// Opções:
//   --out arquivo.mp4   saída (padrão: ./animacoes-out/<skill>.mp4)
//   --sheet             gera só a folha de contato (1 quadro a cada 0,5 s) com a zona segura marcada
//   --still <t>         gera só um PNG no tempo t (segundos)
//   --gif               gera também um GIF 540px a 15 fps
//   --no-mp4            não gera o MP4 (útil com --gif)
//
// Variáveis: CHROME_PATH=/caminho/do/chrome para usar um Chrome/Chromium já instalado.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const flag = (n) => { const i = argv.indexOf(n); if (i < 0) return false; argv.splice(i, 1); return true; };
const opt = (n) => { const i = argv.indexOf(n); if (i < 0) return null; const v = argv[i + 1]; argv.splice(i, 2); return v; };

const sheet = flag('--sheet'), gif = flag('--gif'), noMp4 = flag('--no-mp4');
const still = opt('--still'); let out = opt('--out');
const [skill, specFile] = argv;
const skills = fs.readdirSync(path.join(ROOT, 'skills')).filter(d => fs.existsSync(path.join(ROOT, 'skills', d, 'template.html')));
if (!skill || !skills.includes(skill)) {
  console.error(`uso: node engine/render.mjs <skill> [spec.json] [--sheet|--still t|--gif|--out arquivo.mp4]\nskills: ${skills.join(', ')}`);
  process.exit(1);
}
const spec = specFile ? JSON.parse(fs.readFileSync(specFile, 'utf8')) : {};
if (!out) { fs.mkdirSync('animacoes-out', { recursive: true }); out = path.join('animacoes-out', `${skill}.mp4`); }
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
const stem = out.replace(/\.(mp4|png|gif)$/i, '');

const run = (cmd, args, input) => new Promise((res, rej) => {
  const p = spawn(cmd, args, { stdio: [input ? 'pipe' : 'ignore', 'inherit', 'inherit'] });
  p.on('error', rej); p.on('close', c => c ? rej(new Error(`${cmd} saiu com código ${c}`)) : res());
  if (input) input(p.stdin);
});

const t0 = Date.now();
const launch = { args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--allow-file-access-from-files'] };
if (process.env.CHROME_PATH) launch.executablePath = process.env.CHROME_PATH;
const browser = await chromium.launch(launch);
try {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('[erro na página]', e.message));
  await page.addInitScript(s => { window.__SPEC__ = s; window.__RENDER__ = true; }, spec);
  await page.goto(pathToFileURL(path.join(ROOT, 'skills', skill, 'template.html')).href);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 30000 });
  const { DURATION, FPS } = await page.evaluate(() => window.FILM);
  const grab = async (t, safe = false) => Buffer.from((await page.evaluate(([t, safe]) => {
    window.seek(t); if (safe) window.__safe(); return document.getElementById('c').toDataURL('image/png');
  }, [t, safe])).split(',')[1], 'base64');

  if (still !== null) {
    const f = stem + '.png'; fs.writeFileSync(f, await grab(parseFloat(still))); console.log('ok', f);
  } else if (sheet) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'anim-sheet-'));
    const times = []; for (let t = 0; t <= DURATION + 1e-6; t += .5) times.push(Math.min(t, DURATION - 1 / FPS));
    for (const [i, t] of times.entries()) fs.writeFileSync(path.join(tmp, `s${String(i).padStart(3, '0')}.png`), await grab(t, true));
    const f = stem + '-sheet.png';
    await run('ffmpeg', ['-v', 'error', '-y', '-framerate', '1', '-i', path.join(tmp, 's%03d.png'), '-vf',
      `scale=270:480,drawtext=text='%{eif\\:n/2\\:d}.%{eif\\:mod(n\\,2)*5\\:d}s':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x${Math.ceil(times.length / 6)}:padding=4:color=white`, '-frames:v', '1', f]);
    fs.rmSync(tmp, { recursive: true });
    console.log('ok', f, '(faixas vermelhas = zona coberta pela interface do app; nada importante deve ficar ali)');
  } else {
    const N = Math.round(DURATION * FPS);
    const encoders = [];
    let gifTmp = null;
    if (gif) gifTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'anim-gif-'));
    let ff = null;
    if (!noMp4) ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = 0; f < N; f++) {
      const buf = await grab(f / FPS);
      if (ff && !ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (gifTmp && f % 2 === 0) fs.writeFileSync(path.join(gifTmp, `g${String(f / 2).padStart(4, '0')}.png`), buf);
      if (f % 60 === 0) process.stdout.write(`\rquadro ${f}/${N}`);
    }
    process.stdout.write(`\rquadro ${N}/${N}\n`);
    if (ff) { ff.stdin.end(); await new Promise(r => ff.on('close', r)); console.log('ok', out); }
    if (gifTmp) {
      const g = stem + '.gif';
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS / 2), '-i', path.join(gifTmp, 'g%04d.png'), '-vf',
        'scale=540:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=160[p];[b][p]paletteuse=dither=sierra2_4a', '-loop', '0', g]);
      fs.rmSync(gifTmp, { recursive: true }); console.log('ok', g);
    }
  }
} finally {
  await browser.close();
}
console.log(`tempo: ${((Date.now() - t0) / 1000).toFixed(1)} s`);
