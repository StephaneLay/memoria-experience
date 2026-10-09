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
  if (!fs.existsSync(configPath)) return { name: 'Expérience immersive', siteUrl: '' };

  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    throw new Error(`Configuration invalide dans src/data/site.json : ${error.message}`);
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

function build() {
  const pagesDirectory = path.join(SRC, 'pages');
  if (!fs.existsSync(pagesDirectory)) throw new Error('Répertoire src/pages introuvable.');

  const pageNames = fs.readdirSync(pagesDirectory)
    .filter((name) => name.endsWith('.html'))
    .sort();
  if (pageNames.length === 0) throw new Error('Aucune page HTML trouvée dans src/pages.');

  const config = loadSiteConfig();
  const replacements = {
    '{{HEADER}}': readSource('partials/header.html'),
    '{{FOOTER}}': readSource('partials/footer.html'),
  };
  const renderedPages = pageNames.map((name) => {
    let html = fs.readFileSync(path.join(pagesDirectory, name), 'utf8');
    for (const [token, replacement] of Object.entries(replacements)) {
      html = html.replaceAll(token, () => replacement);
    }
    const unresolved = html.match(/\{\{[A-Z_]+\}\}/);
    if (unresolved) throw new Error(`Jeton non remplacé (${unresolved[0]}) dans src/pages/${name}.`);
    return { name, html };
  });

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  for (const { name, html } of renderedPages) {
    fs.writeFileSync(path.join(DIST, name), html);
    console.log(`  ✓ ${name}`);
  }

  for (const directory of ['css', 'js', 'images', 'fonts', 'scripts']) {
    const sourceDirectory = path.join(SRC, directory);
    if (fs.existsSync(sourceDirectory)) {
      copyDirectory(sourceDirectory, path.join(DIST, directory));
    }
  }

  const rootFiles = path.join(SRC, 'racine');
  if (fs.existsSync(rootFiles)) copyDirectory(rootFiles, DIST);

  const robotsLines = ['User-agent: *', 'Allow: /'];
  if (config.siteUrl) {
    const sitemapUrls = renderedPages
      .filter(({ html }) => !/name=["']robots["']\s+content=["']noindex["']/i.test(html))
      .map(({ name }) => `${config.siteUrl}/${name === 'index.html' ? '' : name}`);
    const sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...sitemapUrls.map((url) => `  <url><loc>${url}</loc></url>`),
      '</urlset>',
      '',
    ].join('\n');
    fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
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
