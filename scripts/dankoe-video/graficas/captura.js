const { chromium } = require('playwright');
(async () => {
  const [html, out, modo] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + html); await p.evaluate(() => document.fonts.ready);
  const dur = await p.evaluate(() => window.DUR);
  const claves = await p.evaluate(() => window.CLAVES || null);
  const ts = modo === 'claves' ? (claves || Array.from({ length: 9 }, (_, i) => +(dur * (i + 0.5) / 9).toFixed(2))) : Array.from({ length: Math.round(dur * 24) }, (_, i) => i / 24);
  for (let i = 0; i < ts.length; i++) {
    await p.evaluate(t => window.pintar(t), ts[i]);
    await p.screenshot({ path: `${out}/${String(i).padStart(4, '0')}.png`, omitBackground: true });
  }
  await b.close(); console.log(ts.length, 'cuadros', dur);
})();
