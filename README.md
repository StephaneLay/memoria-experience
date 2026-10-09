# Site vitrine — expérience immersive

Site 100 % statique, inspiré de l’architecture de `le-dome` : seules les sources de `src/` sont éditées ; `dist/` est généré par le build et ne doit jamais être modifié à la main.

## Prérequis

Node.js 18 ou plus récent. Aucune dépendance npm n’est nécessaire.

## Développement

1. Modifier les pages dans `src/pages/`, les éléments communs dans `src/partials/`, et le style/comportement dans `src/css/` et `src/js/`.
2. Lancer `node build.js` à la racine du projet.
3. Prévisualiser `dist/index.html` dans un navigateur, ou lancer `npx serve dist` pour une prévisualisation via HTTP.

Le build efface et recrée entièrement `dist/`. Les pages HTML reçoivent automatiquement les fragments communs `{{HEADER}}` et `{{FOOTER}}`. Les fichiers placés dans `src/racine/` sont copiés à la racine de `dist/` (configuration d’hébergement, page 404, etc.).

## Structure

- `src/pages/` : pages HTML source
- `src/partials/` : en-tête et pied de page partagés
- `src/css/`, `src/js/` : styles et JavaScript léger
- `src/images/`, `src/fonts/` : médias et polices auto-hébergés
- `src/data/site.json` : identité et URL publique (à renseigner)
- `src/racine/` : fichiers à publier à la racine du site
- `build.js` : assemblage et génération de `robots.txt` / `sitemap.xml`

## Mise en ligne

Le workflow GitHub Pages construit le site à chaque push sur `main`. La préversion est configurée pour ne pas être indexée. Pour un autre hébergeur statique, publier le contenu de `dist/`.

Avant la mise en ligne, renseigner l’URL réelle dans `src/data/site.json`, vérifier les réglages d’hébergement et remplacer les textes provisoires. Aucun identifiant, secret ou formulaire connecté n’est requis ou inclus à ce stade.
