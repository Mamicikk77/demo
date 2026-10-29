const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const n of ['menu-tr','menu-en','menu-ru','tabela']) {
    await p.goto('file://' + path.join(dir, n + '.html'));
    await p.evaluate(() => document.fonts.ready);
    const of = await p.evaluate(() => [...document.querySelectorAll('.col')].map((c,i)=>[i,c.scrollHeight-c.clientHeight, [...c.querySelectorAll('.nm')].filter(x=>x.parentElement.scrollWidth>x.parentElement.clientWidth+1).length]).filter(x=>x[1]>0||x[2]>0));
    const fonts = await p.evaluate(() => [...document.fonts].filter(f=>f.status==='loaded').length);
    console.log(n, 'overflow', JSON.stringify(of), 'fontsLoaded', fonts);
    await p.pdf({ path: path.join(dir, 'out', n + '.pdf'), preferCSSPageSize: true, printBackground: true });
  }
  await b.close();
})();
