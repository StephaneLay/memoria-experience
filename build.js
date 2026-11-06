const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

function readSource(relativePath) {
  return fs.readFileSync(path.join(SRC, relativePath), 'utf8');
}

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

function loadSiteConfig() {
  const configPath = path.join(SRC, 'data', 'site.json');
  const defaults = { name: 'Memoria', siteUrl: '', defaultLanguage: 'fr', languages: ['fr'], tarifs: {} };
  if (!fs.existsSync(configPath)) return defaults;

  let config;
  try {
    config = { ...defaults, ...JSON.parse(fs.readFileSync(configPath, 'utf8')) };
  } catch (error) {
    throw new Error(`Configuration invalide dans src/data/site.json : ${error.message}`);
  }

  if (!Array.isArray(config.languages) || config.languages.length === 0
    || !config.languages.every((language) => /^[a-z]{2}$/.test(language))) {
    throw new Error('languages doit être une liste de codes de langue, par exemple ["fr", "en"].');
  }
  if (!config.languages.includes(config.defaultLanguage)) {
    throw new Error('defaultLanguage doit faire partie de languages.');
  }

  for (const [joueurs, prix] of Object.entries(config.tarifs)) {
    if (!/^\d+$/.test(joueurs) || typeof prix !== 'number' || prix <= 0) {
      throw new Error('tarifs doit associer un nombre de joueurs à un prix par personne, par exemple { "3": 49 }.');
    }
  }

  if (config.siteUrl) {
    let parsedUrl;
    try {
      parsedUrl = new URL(config.siteUrl);
    } catch {
      throw new Error('siteUrl doit être une URL absolue, par exemple https://exemple.fr.');
    }
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('siteUrl doit utiliser le protocole HTTP ou HTTPS.');
    }
    config.siteUrl = parsedUrl.href.replace(/\/+$/, '');
  }

  return config;
}

function flatten(object, prefix = '') {
  return Object.entries(object).reduce((result, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, fullKey));
    } else {
      result[fullKey] = String(value);
    }
    return result;
  }, {});
}

function loadTranslations(languages) {
  const translations = {};
  for (const language of languages) {
    const file = path.join(SRC, 'i18n', `${language}.json`);
    if (!fs.existsSync(file)) throw new Error(`Traductions introuvables : src/i18n/${language}.json`);
    try {
      translations[language] = flatten(JSON.parse(fs.readFileSync(file, 'utf8')));
    } catch (error) {
      throw new Error(`Traductions invalides dans src/i18n/${language}.json : ${error.message}`);
    }
  }

  const [reference, ...others] = languages;
  const referenceKeys = Object.keys(translations[reference]);
  for (const language of others) {
    const keys = Object.keys(translations[language]);
    const missing = referenceKeys.filter((key) => !keys.includes(key));
    const extra = keys.filter((key) => !referenceKeys.includes(key));
    if (missing.length || extra.length) {
      const details = [
        missing.length ? `absentes de ${language}.json : ${missing.join(', ')}` : '',
        extra.length ? `absentes de ${reference}.json : ${extra.join(', ')}` : '',
      ].filter(Boolean).join(' ; ');
      throw new Error(`Clés de traduction désynchronisées (${details}).`);
    }
  }

  return translations;
}

function assetVersions() {
  const versions = {};
  for (const file of ['css/style.css', 'js/main.js']) {
    const content = fs.readFileSync(path.join(SRC, file));
    versions[file] = crypto.createHash('sha256').update(content).digest('hex').slice(0, 10);
  }
  return versions;
}

function versionAssets(html, versions) {
  return html.replace(/(["'])((?:\.\.\/)*)(css\/style\.css|js\/main\.js)\1/g,
    (match, quote, root, file) => `${quote}${root}${file}?v=${versions[file]}${quote}`);
}

function outputPath(language, config, name) {
  return language === config.defaultLanguage ? name : `${language}/${name}`;
}

function publicUrl(config, relativePath) {
  return `${config.siteUrl}/${relativePath.replace(/(^|\/)index\.html$/, '$1')}`;
}

function attribute(text) {
  return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function plainText(html, tokens = {}) {
  let text = String(html);
  for (const [token, value] of Object.entries(tokens)) text = text.replaceAll(token, value);
  return text.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#8239;|\u202f/g, ' ').replace(/&amp;/g, '&')
    .replace(/\u00ad/g, '').replace(/\s+([.,;:!?»)])/g, (match, sign) => (/[;:!?»]/.test(sign) ? ` ${sign}` : sign))
    .replace(/\s+/g, ' ').trim();
}

function templateKey(template, pattern) {
  const match = template.match(pattern);
  return match ? match[1] : null;
}

function structuredData(config, language, name, template, strings) {
  const business = config.etablissement;
  if (!business) return null;
  const site = config.siteUrl;
  const prices = priceTokens(config, language);
  const home = publicUrl(config, outputPath(language, config, 'index.html'));
  const url = publicUrl(config, outputPath(language, config, name));
  const locale = strings['meta.ogLocale'].replace('_', '-');
  const titleKey = templateKey(template, /<title>\{\{t:([\w.-]+)\}\}<\/title>/);
  const descriptionKey = templateKey(template, /<meta name="description" content="\{\{t:([\w.-]+)\}\}">/);
  const businessId = `${site}/#etablissement`;
  const amounts = Object.values(config.tarifs);

  const establishment = {
    '@type': business.types,
    '@id': businessId,
    name: business.nom,
    alternateName: business.autresNoms,
    legalName: business.nomLegal,
    description: plainText(strings['meta.description']),
    slogan: plainText(strings['hero.accroche']),
    url: home,
    logo: `${site}/${business.logo}`,
    image: business.images.map((image) => `${site}/${image}`),
    telephone: business.telephone,
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.adresse.rue,
      postalCode: business.adresse.codePostal,
      addressLocality: business.adresse.ville,
      addressRegion: business.adresse.region,
      addressCountry: business.adresse.pays,
    },
    geo: { '@type': 'GeoCoordinates', latitude: business.latitude, longitude: business.longitude },
    hasMap: business.plan,
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: business.ouverture.jours,
      opens: business.ouverture.debut,
      closes: business.ouverture.fin,
    }],
    priceRange: `${Math.min(...amounts)} € – ${Math.max(...amounts)} €`,
    currenciesAccepted: 'EUR',
    paymentAccepted: business.paiements,
    areaServed: { '@type': 'City', name: business.adresse.ville },
    knowsLanguage: config.languages,
    isAccessibleForFree: false,
    publicAccess: true,
    vatID: business.tva,
    identifier: { '@type': 'PropertyValue', propertyID: 'SIRET', value: business.siret },
    makesOffer: Object.entries(config.tarifs).map(([players, price]) => ({
      '@type': 'Offer',
      name: plainText(strings[`packCadeau.formules.session${players}`] || `${players}`),
      price: price * Number(players),
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price,
        priceCurrency: 'EUR',
        referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'C62' },
      },
      availability: 'https://schema.org/InStock',
      url: `${home}#reservation`,
    })),
    potentialAction: {
      '@type': 'ReserveAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${home}#reservation`, inLanguage: locale },
      result: { '@type': 'Reservation', name: plainText(strings['nav.reserverSession']) },
    },
  };
  if (business.reseaux.length) establishment.sameAs = business.reseaux;

  const graph = [
    establishment,
    {
      '@type': 'WebSite',
      '@id': `${site}/#site`,
      url: `${site}/`,
      name: config.name,
      inLanguage: config.languages.map((code) => code === language ? locale : code),
      publisher: { '@id': businessId },
    },
  ];

  const page = {
    '@type': (config.typesDePage || {})[name] || 'WebPage',
    '@id': `${url}#page`,
    url,
    name: titleKey ? plainText(strings[titleKey]) : config.name,
    inLanguage: locale,
    isPartOf: { '@id': `${site}/#site` },
    about: { '@id': businessId },
  };
  if (descriptionKey) page.description = plainText(strings[descriptionKey]);

  const crumbKey = (config.filAriane || {})[name];
  if (crumbKey) {
    page.breadcrumb = { '@id': `${url}#fil` };
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#fil`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: plainText(strings['meta.filAccueil']), item: home },
        { '@type': 'ListItem', position: 2, name: plainText(strings[crumbKey]), item: url },
      ],
    });
  }

  if (page['@type'] === 'FAQPage') {
    const questions = [...template.matchAll(/\{\{t:(faq\.[\w]+)\.q(\d+)\}\}/g)];
    page.mainEntity = questions.map(([, group, number]) => ({
      '@type': 'Question',
      name: plainText(strings[`${group}.q${number}`], prices),
      acceptedAnswer: { '@type': 'Answer', text: plainText(strings[`${group}.r${number}`], prices) },
    }));
  }

  if ((config.services || []).includes(name)) {
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: plainText(strings[crumbKey]),
      serviceType: plainText(strings[crumbKey]),
      description: descriptionKey ? plainText(strings[descriptionKey]) : undefined,
      provider: { '@id': businessId },
      areaServed: { '@type': 'City', name: business.adresse.ville },
      url,
    });
  }

  graph.push(page);
  return { '@context': 'https://schema.org', '@graph': graph };
}

function headLinks(config, language, name, root, template, translations) {
  const strings = translations[language];
  const lines = [
    ...(name === '404.html' ? [`<base href="/${path.posix.dirname(outputPath(language, config, name)).replace(/^\.$/, '').replace(/(.)$/, '$1/')}">`] : []),
    `<link rel="apple-touch-icon" href="${root}images/apple-touch-icon.png">`,
    `<link rel="manifest" href="${root}site.webmanifest">`,
  ];
  const indexable = !/<meta name="robots"/i.test(template);
  if (!indexable || !config.siteUrl) return lines.join('\n  ');
  lines.push('<meta name="robots" content="index, follow, max-image-preview:large">');

  const url = publicUrl(config, outputPath(language, config, name));
  lines.push(
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:site_name" content="${attribute(config.name)}">`,
  );
  const place = config.etablissement;
  if (place && place.latitude && place.longitude) {
    lines.push(
      `<meta name="geo.placename" content="${attribute(place.adresse.ville)}">`,
      `<meta name="geo.position" content="${place.latitude};${place.longitude}">`,
      `<meta name="ICBM" content="${place.latitude}, ${place.longitude}">`,
    );
  }
  for (const alternate of config.languages) {
    if (alternate !== language) lines.push(`<meta property="og:locale:alternate" content="${translations[alternate]['meta.ogLocale']}">`);
  }
  const share = (config.partage || {})[language];
  if (share) {
    lines.push(
      `<meta property="og:image" content="${config.siteUrl}/${share}">`,
      '<meta property="og:image:width" content="1200">',
      '<meta property="og:image:height" content="630">',
      `<meta property="og:image:alt" content="${attribute(strings['meta.partageAlt'])}">`,
      '<meta name="twitter:card" content="summary_large_image">',
    );
  }
  if (config.languages.length > 1) {
    for (const alternate of config.languages) {
      lines.push(`<link rel="alternate" hreflang="${alternate}" href="${publicUrl(config, outputPath(alternate, config, name))}">`);
    }
    lines.push(`<link rel="alternate" hreflang="x-default" href="${publicUrl(config, outputPath(config.defaultLanguage, config, name))}">`);
  }
  const data = structuredData(config, language, name, template, strings);
  if (data) lines.push(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);
  return lines.join('\n  ');
}

function priceTokens(config, language) {
  const locales = { fr: 'fr-FR', en: 'en-GB' };
  const format = new Intl.NumberFormat(locales[language] || language, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const tokens = {};
  for (const [joueurs, prix] of Object.entries(config.tarifs)) {
    tokens[`{{PRIX_${joueurs}}}`] = format.format(prix);
    tokens[`{{TOTAL_${joueurs}}}`] = format.format(prix * Number(joueurs));
  }
  return tokens;
}

function renderPage(template, { name, language, config, partials, strings, translations }) {
  const root = language === config.defaultLanguage ? '' : '../';
  let html = template;
  for (const [token, partial] of Object.entries(partials)) {
    html = html.replaceAll(token, () => partial);
  }

  html = html.replace(/\{\{t:([a-zA-Z0-9_.-]+)\}\}/g, (token, key) => {
    if (!(key in strings)) throw new Error(`Traduction manquante « ${key} » (${language}) dans src/pages/${name}.`);
    return strings[key];
  });

  const systemTokens = {
    '{{ROOT}}': root,
    '{{LANG}}': language,
    '{{HEAD_LINKS}}': headLinks(config, language, name, root, template, translations),
    ...priceTokens(config, language),
  };
  for (const alternate of config.languages) {
    systemTokens[`{{HREF_${alternate.toUpperCase()}}}`] = root + outputPath(alternate, config, name);
  }
  for (const [token, value] of Object.entries(systemTokens)) {
    html = html.replaceAll(token, () => value);
  }

  html = html.replace(/href="((?:\.\.\/)*(?:[a-z]{2}\/)?)index\.html(?=[#"])/g, (match, prefix) => `href="${prefix || './'}`);

  const unresolved = html.match(/\{\{[^{}]+\}\}/);
  if (unresolved) throw new Error(`Jeton non remplacé (${unresolved[0]}) dans src/pages/${name} (${language}).`);
  return html;
}

function buildSitemap(config, renderedPages) {
  const indexable = renderedPages.filter(({ html }) => !/name=["']robots["']\s+content=["']noindex["']/i.test(html));
  const names = [...new Set(indexable.map(({ name }) => name))];
  const multilingual = config.languages.length > 1;
  const entries = [];
  for (const name of names) {
    for (const language of config.languages) {
      if (!indexable.some((page) => page.name === name && page.language === language)) continue;
      const alternates = multilingual
        ? [...config.languages, 'x-default'].map((alternate) => `\n    <xhtml:link rel="alternate" hreflang="${alternate}" href="${publicUrl(config, outputPath(alternate === 'x-default' ? config.defaultLanguage : alternate, config, name))}"/>`).join('')
        : '';
      const url = publicUrl(config, outputPath(language, config, name));
      const { html } = indexable.find((page) => page.name === name && page.language === language);
      const images = [...new Set([...html.matchAll(/<img\b[^>]*>/g)]
        .map(([tag]) => [tag.match(/\ssrc="([^"]+)"/), tag.match(/\salt="([^"]+)"/)])
        .filter(([src, alt]) => src && alt && !src[1].endsWith('.svg'))
        .map(([src]) => new URL(src[1], url).href))]
        .map((image) => `\n    <image:image><image:loc>${image}</image:loc></image:image>`).join('');
      entries.push(`  <url>\n    <loc>${url}</loc>${alternates}${images}\n  </url>`);
    }
  }
  const namespaces = [
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    multilingual ? 'xmlns:xhtml="http://www.w3.org/1999/xhtml"' : '',
    'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
  ].filter(Boolean).join(' ');
  return ['<?xml version="1.0" encoding="UTF-8"?>', `<urlset ${namespaces}>`, ...entries, '</urlset>', ''].join('\n');
}

function build() {
  const pagesDirectory = path.join(SRC, 'pages');
  if (!fs.existsSync(pagesDirectory)) throw new Error('Répertoire src/pages introuvable.');

  const pageNames = fs.readdirSync(pagesDirectory)
    .filter((name) => name.endsWith('.html'))
    .sort();
  if (pageNames.length === 0) throw new Error('Aucune page HTML trouvée dans src/pages.');

  const config = loadSiteConfig();
  const translations = loadTranslations(config.languages);
  const partials = {
    '{{HEADER}}': readSource('partials/header.html'),
    '{{FOOTER}}': readSource('partials/footer.html'),
  };

  const versions = assetVersions();
  const renderedPages = [];
  for (const name of pageNames) {
    const template = fs.readFileSync(path.join(pagesDirectory, name), 'utf8');
    for (const language of config.languages) {
      const html = versionAssets(renderPage(template, { name, language, config, partials, strings: translations[language], translations }), versions);
      renderedPages.push({ name, language, file: outputPath(language, config, name), html });
    }
  }

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  for (const { file, html } of renderedPages) {
    fs.mkdirSync(path.dirname(path.join(DIST, file)), { recursive: true });
    fs.writeFileSync(path.join(DIST, file), html);
    console.log(`  ✓ ${file}`);
  }

  for (const directory of ['css', 'js', 'images', 'videos', 'fonts', 'scripts']) {
    const sourceDirectory = path.join(SRC, directory);
    if (fs.existsSync(sourceDirectory)) {
      copyDirectory(sourceDirectory, path.join(DIST, directory));
    }
  }

  const rootFiles = path.join(SRC, 'racine');
  if (fs.existsSync(rootFiles)) copyDirectory(rootFiles, DIST);

  const robotsLines = ['User-agent: *', 'Allow: /', 'Disallow: /scripts/'];
  if (config.siteUrl) {
    fs.writeFileSync(path.join(DIST, 'sitemap.xml'), buildSitemap(config, renderedPages));
    robotsLines.push('', `Sitemap: ${config.siteUrl}/sitemap.xml`);
  }
  fs.writeFileSync(path.join(DIST, 'robots.txt'), `${robotsLines.join('\n')}\n`);

  console.log(`\nBuild terminé → ${DIST}`);
}

try {
  build();
} catch (error) {
  console.error(`\nÉchec du build : ${error.message}`);
  process.exitCode = 1;
}
