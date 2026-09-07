import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { siteUrl, contentUpdated, locales } from '../site.config.mjs';
import { seoCopy } from './seo-copy.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const evaluate = (file, names) => vm.runInNewContext(`${read(file)}\n;({${names}})`, {}, { filename: file });
const { I18N, LANG_ATTR, OG_LOCALE } = evaluate('js/i18n.js', 'I18N, LANG_ATTR, OG_LOCALE');
const { PRODUCTS, SPEC_LABELS } = evaluate('js/products.js', 'PRODUCTS, SPEC_LABELS');
const { JOURNALS } = evaluate('js/journal.js', 'JOURNALS');
for (const lang of Object.keys(locales)) Object.assign(I18N[lang], seoCopy[lang]);

const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const json = value => JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
const url = (lang, page) => `${siteUrl}${locales[lang].folder}${page === 'index.html' ? '' : page}`;
const prefix = lang => locales[lang].folder ? '../' : '';
const hash = file => createHash('sha256').update(read(file)).digest('hex').slice(0, 12);
const t = (key, lang) => {
  if (typeof I18N[lang][key] !== 'string') throw new Error(`Missing ${lang} translation: ${key}`);
  return I18N[lang][key];
};
const templates = Object.fromEntries(['home', 'product', 'journal'].map(k => [k, read(`templates/${k}.html`)]));
const outputs = new Map();
const pageUrls = [];

function productName(key, lang) {
  if (seoCopy[lang][`p.${key}.name`]) return t(`p.${key}.name`, lang);
  const name = PRODUCTS[key].name[lang];
  return { 'zh-TW': `${name} 16 吋折疊車`, en: `${name} 16-inch Folding Bike`, 'zh-CN': `${name} 16 英寸折叠车`, ja: `${name} 16インチ 折りたたみ自転車` }[lang];
}

function head(lang, page, meta) {
  const canonical = url(lang, page);
  const alternates = Object.entries(locales).map(([l, config]) => `  <link rel="alternate" hreflang="${config.hreflang}" href="${url(l, page)}">`).join('\n');
  return `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escape(meta.title)}</title>
  <meta name="description" content="${escape(meta.description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonical}">
${alternates}
  <link rel="alternate" hreflang="x-default" href="${url('zh-TW', page)}">
  <link rel="icon" type="image/jpeg" href="${siteUrl}logo.jpg">
  <link rel="apple-touch-icon" href="${siteUrl}logo.jpg">
  <meta property="og:type" content="${meta.type || 'website'}">
  <meta property="og:site_name" content="佰客 Beky">
  <meta property="og:locale" content="${OG_LOCALE[lang]}">
  <meta property="og:title" content="${escape(meta.title)}">
  <meta property="og:description" content="${escape(meta.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}${meta.image}">
  <meta property="og:image:alt" content="${escape(meta.imageAlt || meta.title)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(meta.title)}">
  <meta name="twitter:description" content="${escape(meta.description)}">
  <meta name="twitter:image" content="${siteUrl}${meta.image}">
  <script type="application/ld+json">${json(meta.schema)}</script>
  <link rel="stylesheet" href="${prefix(lang)}css/style.css?v=${hash('css/style.css')}">`;
}

function fillId(html, id, content) {
  const re = new RegExp(`(<([a-z][\\w-]*)\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?<\\/\\2>`);
  if (!re.test(html)) throw new Error(`Missing template id ${id}`);
  return html.replace(re, (_, open, tag) => `${open}${content}</${tag}>`);
}

// Read JPEG dimensions without modifying images or introducing a build dependency.
const sizes = new Map();
function dimensions(file) {
  if (sizes.has(file)) return sizes.get(file);
  const data = fs.readFileSync(path.join(root, file));
  let size = null;
  if (data[0] === 0xff && data[1] === 0xd8) {
    for (let pos = 2; pos + 9 < data.length;) {
      if (data[pos] !== 0xff) break;
      const marker = data[pos + 1];
      if ([0xc0, 0xc1, 0xc2].includes(marker)) {
        size = { height: data.readUInt16BE(pos + 5), width: data.readUInt16BE(pos + 7) };
        break;
      }
      if (marker === 0xda || marker === 0xd9) break;
      const length = data.readUInt16BE(pos + 2);
      if (length < 2) break;
      pos += length + 2;
    }
  }
  sizes.set(file, size);
  return size;
}

function finish(html, lang, page, meta) {
  html = html.replace('<html lang="zh-Hant">', `<html lang="${LANG_ATTR[lang]}">`);
  html = html.replace(/<([a-z][\w-]*)\b([^>]*\bdata-i18n="([^"]+)"[^>]*)>[\s\S]*?<\/\1>/g,
    (_, tag, attrs, key) => `<${tag}${attrs}>${escape(t(key, lang))}</${tag}>`);
  html = html.replace(/<button class="lang__btn"[^>]*data-lang="([^"]+)"[^>]*>[\s\S]*?<\/button>/g, (_, l) => {
    const relative = `${prefix(lang)}${locales[l].folder}${page === 'index.html' ? 'index.html' : page}`;
    return `<a class="lang__btn${lang === l ? ' is-active' : ''}" href="${relative}" lang="${LANG_ATTR[l]}" hreflang="${locales[l].hreflang}" aria-label="${locales[l].name}"${lang === l ? ' aria-current="page"' : ''}>${locales[l].label}</a>`;
  });
  html = html.replace(/product\.html\?model=([a-z]+)/g, '$1.html')
    .replace(/journal\.html\?id=summer-breeze/g, 'summer-breeze.html');
  html = html.replace(/<a\b[^>]*\bdata-line\b[^>]*>/g, tag => tag.replace('href="#"', 'href="https://line.me/R/ti/p/@265ovlim"'));
  html = html.replace(/<img\b[^>]*>/g, tag => {
    const src = tag.match(/(?:data-)?src="(assets\/[^"]+\.jpg)"/);
    if (!src || /\bwidth=/.test(tag)) return tag;
    const size = dimensions(src[1]);
    return size ? tag.replace('<img', `<img width="${size.width}" height="${size.height}"`) : tag;
  });
  // Shared assets stay in the project root, page links stay in the current locale.
  html = html.replace(/(src|data-src|href)="((?:assets|css|js)\/[^"#]+)"/g, (_, attr, value) => `${attr}="${prefix(lang)}${value}"`);
  html = html.replace('{{HEAD}}', head(lang, page, meta))
    .replace('{{SCRIPTS}}', `<script src="${prefix(lang)}js/main.js?v=${hash('js/main.js')}" defer></script>`);
  if (/\{\{[A-Z]+\}\}/.test(html)) throw new Error(`Unfilled template slot: ${lang}/${page}`);
  outputs.set(`${locales[lang].folder}${page}`, html.trimEnd() + '\n');
  pageUrls.push(url(lang, page));
}

function comparison(lang) {
  return `<section class="section section--soft selection" id="compare">
    <h2 class="label" data-i18n="compare.title"></h2>
    <p class="section__lead" data-i18n="compare.lead"></p>
    <div class="grid grid--3">${['youth', 'skyline', 'nano'].map(key => `<article>
      <h3>${escape(PRODUCTS[key].name[lang])}</h3>
      <p data-i18n="compare.${key}"></p>
      <a class="link" href="${key}.html" data-i18n="compare.view"></a>
    </article>`).join('')}</div>
    <p class="selection__note" data-i18n="compare.note"></p>
  </section>`;
}

for (const lang of Object.keys(locales)) {
  const organization = {
    '@type': 'Organization', '@id': `${siteUrl}#organization`, name: '佰客 Beky', alternateName: ['佰客', 'Beky', '佰客折疊車'],
    url: siteUrl, logo: `${siteUrl}logo.jpg`, sameAs: ['https://www.facebook.com/groups/1825120122235095', 'https://line.me/R/ti/p/@265ovlim'],
  };
  let home = templates.home.replace('{{COMPARISON}}', comparison(lang));
  // Give the product photos useful, localized alternate text.
  home = home.replace(/(<img\b[^>]*src="assets\/img\/bikes\/([a-z]+)\.jpg"[^>]*alt=")[^"]*(")/g,
    (_, start, key, end) => `${start}${escape(productName(key, lang))}${end}`);
  finish(home, lang, 'index.html', {
    title: t('meta.title', lang), description: t('meta.desc', lang), image: 'assets/img/scene/hero.jpg',
    schema: { '@context': 'https://schema.org', '@graph': [organization,
      { '@type': 'WebSite', '@id': `${siteUrl}#website`, url: siteUrl, name: '佰客 Beky', alternateName: ['佰客', 'Beky'], inLanguage: Object.values(locales).map(l => l.hreflang), publisher: { '@id': organization['@id'] } },
      { '@type': 'WebPage', url: url(lang, 'index.html'), name: t('meta.title', lang), inLanguage: LANG_ATTR[lang], isPartOf: { '@id': `${siteUrl}#website` } },
    ] },
  });

  for (const [key, p] of Object.entries(PRODUCTS)) {
    const name = productName(key, lang);
    const page = `${key}.html`;
    let html = templates.product.replace('<img id="pImg" src="" alt=""', `<img id="pImg" src="${p.img}" alt="${escape(name)}"`);
    for (const [id, content] of Object.entries({
      pEn: escape(p.en), pName: `${escape(p.name[lang])} <span class="product-hero__type">${escape(name.slice(p.name[lang].length).trim())}</span>`, pDesc: escape(p.desc[lang]), pPrice: escape(p.price || t('pd.price.tba', lang)),
      pColors: p.colors.map(([swatches, names]) => `<span class="color"><span class="color__swatches" aria-hidden="true">${(Array.isArray(swatches) ? swatches : [swatches]).map(value => `<i style="background:${escape(value)}"></i>`).join('')}</span>${escape(names[lang])}</span>`).join(''),
      pSpecs: p.specs.map(([k, value]) => `<div><dt>${escape(SPEC_LABELS[k][lang])}</dt><dd>${escape(value)}</dd></div>`).join(''),
      pOthers: Object.keys(PRODUCTS).filter(k => k !== key).slice(0, 3).map(k => `<a href="${k}.html" class="card card--sm"><div class="card__img card__img--bike"><img src="${PRODUCTS[k].img}" alt="${escape(productName(k, lang))}" loading="lazy" decoding="async"></div><span class="card__title">${escape(PRODUCTS[k].name[lang])}</span></a>`).join(''),
    })) html = fillId(html, id, content);
    finish(html, lang, page, {
      title: `${name}｜佰客 Beky`, description: `${name}${lang === 'en' ? '. ' : '。'}${p.desc[lang]}`, type: 'product', image: p.img, imageAlt: name,
      schema: { '@context': 'https://schema.org', '@graph': [
        { '@type': 'Product', name, description: p.desc[lang], image: `${siteUrl}${p.img}`, url: url(lang, page), model: p.en, brand: { '@type': 'Brand', name: '佰客 Beky' },
          additionalProperty: p.specs.filter(([, value]) => value !== '—').map(([k, value]) => ({ '@type': 'PropertyValue', name: SPEC_LABELS[k][lang], value })) },
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('sec.products', lang), item: url(lang, 'index.html') },
          { '@type': 'ListItem', position: 2, name, item: url(lang, page) },
        ] },
      ] },
    });
  }

  for (const [key, j] of Object.entries(JOURNALS)) {
    const title = t(j.title, lang);
    const image = (file, eager = false) => `<img src="${file}" alt="${escape(title)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"${eager ? ' fetchpriority="high"' : ''}>`;
    const body = j.blocks.map((b, index) => {
      if (b[0] === 'full') return `<figure class="jb jb--full">${image(b[1], index === 0)}</figure>`;
      if (b[0] === 'pair') return `<div class="jb jb--pair ${b[3] || 'r34'}"><figure>${image(b[1])}</figure><figure>${image(b[2])}</figure></div>`;
      if (b[0] === 'single') return `<figure class="jb jb--single ${b[2] || 'r34'}">${image(b[1])}</figure>`;
      if (b[0] === 'text') return `<p class="jb jb--text">${escape(t(b[1], lang))}</p>`;
      throw new Error(`Unknown journal block ${b[0]}`);
    }).join('\n');
    let html = templates.journal;
    for (const [id, value] of Object.entries({ jKicker: escape(t(j.kicker, lang)), jTitle: escape(title), jLead: escape(t(j.lead, lang)), jBody: body, jProduct: escape(t(j.product.label, lang)) })) html = fillId(html, id, value);
    html = html.replace('id="jProduct" href="#"', `id="jProduct" href="${j.product.model}.html"`);
    finish(html, lang, `${key}.html`, {
      title: `${title}｜佰客 Beky`, description: t(j.lead, lang).replace(/\s+/g, ' '), image: j.cover, type: 'article',
      schema: { '@context': 'https://schema.org', '@type': 'Article', headline: title, description: t(j.lead, lang), image: `${siteUrl}${j.cover}`, inLanguage: LANG_ATTR[lang], mainEntityOfPage: url(lang, `${key}.html`), author: organization, publisher: organization },
    });
  }
}

// GitHub Pages cannot issue per-query HTTP redirects. Keep existing shared URLs
// working with a constrained client redirect and usable no-JavaScript links.
for (const [file, parameter, keys] of [['product.html', 'model', Object.keys(PRODUCTS)], ['journal.html', 'id', Object.keys(JOURNALS)]]) {
  outputs.set(file, `<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>佰客 Beky 折疊車｜頁面已更新</title>
<script>
(() => {
  const key = new URLSearchParams(location.search).get('${parameter}');
  const pages = ${JSON.stringify(keys)};
  if (pages.includes(key)) location.replace(key + '.html' + location.hash);
})();
</script></head><body>
<h1>佰客 Beky 折疊車</h1><p>頁面已更新，請選擇下列連結繼續瀏覽。</p>
<ul>${keys.map(k => `<li><a href="${k}.html">${escape(PRODUCTS[k] ? productName(k, 'zh-TW') : t(JOURNALS[k].title, 'zh-TW'))}</a></li>`).join('')}</ul>
<p><a href="index.html">返回佰客官網</a></p></body></html>\n`);
}

outputs.set('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageUrls.map(page => `  <url><loc>${escape(page)}</loc><lastmod>${contentUpdated}</lastmod></url>`).join('\n')}\n</urlset>\n`);
const check = process.argv.includes('--check');
const changed = [];
for (const [file, content] of outputs) {
  const destination = path.join(root, file);
  if (fs.existsSync(destination) && fs.readFileSync(destination, 'utf8') === content) continue;
  changed.push(file);
  if (!check) {
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
  }
}
if (check && changed.length) {
  console.error(`Generated files are out of date: ${changed.join(', ')}`);
  process.exitCode = 1;
} else console.log(`${check ? 'Verified' : 'Built'} ${pageUrls.length} localized static pages; ${changed.length} files ${check ? 'out of date' : 'updated'}.`);
