import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { siteUrl } from '../site.config.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const folderLanguages = { '': 'zh-Hant', 'en/': 'en', 'zh-cn/': 'zh-Hans', 'ja/': 'ja' };
const products = ['youth', 'skyline', 'nano', 'city', 'travel', 'boundless'];
const files = Object.keys(folderLanguages).flatMap(folder => ['index', ...products, 'summer-breeze'].map(page => `${folder}${page}.html`));
const canonical = html => html.match(/rel="canonical" href="([^"]+)"/)[1];
const entities = text => text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

test('generated pages exactly match source templates and dictionaries', () => {
  execFileSync(process.execPath, ['scripts/build.mjs', '--check'], { cwd: root });
});

test('sitemap lists all 32 unique static canonicals, not legacy query URLs', () => {
  const sitemap = read('sitemap.xml');
  const listed = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert.equal(listed.length, 32);
  assert.equal(new Set(listed).size, 32);
  assert.deepEqual(new Set(listed), new Set(files.map(f => canonical(read(f)))));
  assert.ok(!sitemap.includes('?model='));
});

for (const file of files) {
  test(`${file}: complete initial HTML, language alternates and real local links`, () => {
    const html = read(file);
    const folder = file.includes('/') ? `${file.split('/')[0]}/` : '';
    const filename = path.basename(file);
    assert.ok(html.includes(`<html lang="${folderLanguages[folder]}">`));
    assert.equal(canonical(html), `${siteUrl}${file.replace(/index\.html$/, '')}`);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(!/<h1[^>]*>\s*<\/h1>/.test(html));
    assert.ok(!html.includes('{{'));
    assert.ok(!html.includes('href="#"'));
    assert.ok(!html.includes('src=""'));
    assert.ok(!html.includes('navigator.language'));
    assert.ok(!html.includes('localStorage'));
    assert.ok(!html.includes('js/i18n.js'));
    assert.ok(!html.includes('js/products.js'));
    assert.ok(html.includes('class="logo">beky</a>'));

    const alternates = [...html.matchAll(/rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
    assert.equal(alternates.length, 5);
    for (const [, language, destination] of alternates) {
      assert.ok(destination.startsWith(siteUrl));
      const target = destination.slice(siteUrl.length);
      const targetFile = target.endsWith('/') || target === '' ? `${target}index.html` : target;
      const other = read(targetFile);
      assert.equal(canonical(other), destination);
      assert.equal(path.basename(targetFile), filename);
      if (language !== 'x-default') assert.ok(other.includes(`<html lang="${language}">`));
      assert.ok(other.includes(`href="${canonical(html)}"`), 'reciprocal alternate link');
    }

    for (const match of html.matchAll(/\b(?:href|src|data-src)="([^"]+)"/g)) {
      const ref = entities(match[1]);
      if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
      const [filePart, fragment] = ref.split('#');
      const target = path.resolve(root, path.dirname(file), filePart.split('?')[0] || filename);
      assert.ok(target.startsWith(root), `unsafe link ${ref}`);
      assert.ok(fs.existsSync(target), `missing local link ${ref}`);
      if (fragment && target.endsWith('.html')) {
        assert.ok(fs.readFileSync(target, 'utf8').includes(`id="${fragment}"`), `missing fragment ${ref}`);
      }
    }

    const structured = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const nodes = structured['@graph'] || [structured];
    if (products.includes(filename.replace('.html', ''))) {
      const product = nodes.find(n => n['@type'] === 'Product');
      const name = entities(html.match(/<h1 id="pName">([\s\S]*?)<\/h1>/)[1].replace(/<[^>]*>/g, ''));
      assert.equal(product.name, name);
      assert.equal(product.url, canonical(html));
      assert.ok(!product.offers && !product.aggregateRating);
      assert.ok(html.includes(`<span class="en" id="pEn">`));
      assert.ok(!/<(?:dl|div) [^>]*id="p(?:Specs|Colors)"[^>]*>\s*<\//.test(html));
    }
  });
}

test('launch model names, dimensions and swatches are present before JavaScript', () => {
  const expectations = { youth: ['青春 16 吋折疊車', 8], skyline: ['天際 Skyline 18 吋寬胎折疊車', 3], nano: ['NANO 14 吋折疊車', 3] };
  for (const [key, [name, count]] of Object.entries(expectations)) {
    const html = read(`${key}.html`);
    assert.equal(entities(html.match(/<h1 id="pName">([\s\S]*?)<\/h1>/)[1].replace(/<[^>]*>/g, '')), name);
    assert.equal((html.match(/class="color"/g) || []).length, count);
    assert.ok(!html.includes('linear-gradient'));
    assert.ok(html.match(/<img width="\d+" height="\d+" id="pImg"/));
  }
});

test('legacy shared links redirect only known model/article identifiers', () => {
  for (const [file, parameter, keys] of [['product.html', 'model', products], ['journal.html', 'id', ['summer-breeze']]]) {
    const code = read(file).match(/<script>([\s\S]*?)<\/script>/)[1];
    for (const key of [...keys, 'https://example.org', '../nope', '']) {
      let destination;
      vm.runInNewContext(code, { URLSearchParams, location: { search: `?${parameter}=${encodeURIComponent(key)}`, hash: '#details', replace: value => { destination = value; } } });
      assert.equal(destination, keys.includes(key) ? `${key}.html#details` : undefined);
    }
  }
});

test('verification file is preserved and unconfirmed venue placeholders are absent', () => {
  assert.equal(read('google08232ef49f98033b.html').trim(), 'google-site-verification: google08232ef49f98033b.html');
  for (const folder of Object.keys(folderLanguages)) {
    const html = read(`${folder}index.html`);
    assert.ok(!/地址整理中|台北旗艦店|Taipei Flagship|11:00 – 20:00/.test(html));
    assert.ok(html.includes('https://www.facebook.com/groups/1825120122235095'));
    assert.ok(html.includes('https://line.me/R/ti/p/@265ovlim'));
  }
});
