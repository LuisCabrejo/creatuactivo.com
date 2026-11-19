const { chromium } = require('playwright');
(async () => {
  const [html, out, modo] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + html); await p.evaluate(() => document.fonts.ready);
  const dur = await p.evaluate(() => window.DUR);
  const ts = modo === 'claves' ? [1.0, 3.0, 4.4, 6.5, 7.5, 9.3, 11.5, 12.8, 13.6] : Array.from({ length: Math.round(dur * 24) }, (_, i) => i / 24);
  for (let i = 0; i < ts.length; i++) {
    await p.evaluate(t => window.pintar(t), ts[i]);
    await p.screenshot({ path: `${out}/${String(i).padStart(4, '0')}.png`, omitBackground: true });
  }
  await b.close(); console.log(ts.length, 'cuadros', dur);
})();
