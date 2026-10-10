# Site vitrine — Memoria, expérience immersive d’horreur

Site 100 % statique et bilingue (français / anglais), sur l’architecture de `le-dome`. Le contexte projet complet est dans [PROJECT_BRIEF.md](PROJECT_BRIEF.md), les points en attente côté client dans [QUESTIONS_CLIENT.md](QUESTIONS_CLIENT.md).

## Principe

```
src/  = les sources (ce qu'on édite)        ← jamais déployé
dist/ = le site généré (ce qu'on déploie)   ← jamais édité à la main
```

`node build.js` lit `src/`, assemble chaque page dans chaque langue et écrit le résultat dans `dist/`. **`dist/` est entièrement effacé et régénéré à chaque build.**

Prérequis : Node.js 18 ou plus récent, aucune dépendance npm.

## Workflow quotidien

1. Modifier les fichiers dans `src/`
2. `node build.js`
3. Vérifier en local avec `npx serve dist` (ou `python3 -m http.server --directory dist`) : les polices ne se chargent pas toujours en ouvrant le fichier directement
4. `git add -A && git commit`, le push sur `main` déploie la préversion GitHub Pages (non indexée)

## Bilingue : comment ça marche

- Une page = un seul gabarit HTML dans `src/pages/`. Les textes n’y sont jamais écrits en dur : on écrit `{{t:histoire.titre}}`.
- Les textes sont dans `src/i18n/fr.json` et `src/i18n/en.json` (mêmes clés, HTML simple autorisé : `<br>`, `<sup>`…).
- Le français est généré à la racine (`index.html`), l’anglais dans `en/` (`en/index.html`).
- **Le build s’arrête** si une clé existe dans une langue et pas dans l’autre, ou si un jeton `{{…}}` n’est pas remplacé : impossible de publier une page à moitié traduite.
- Jetons système disponibles dans les pages et les partials :
  - `{{ROOT}}` : chemin vers la racine du site, à utiliser pour les fichiers (`{{ROOT}}images/…`, `{{ROOT}}css/…`)
  - `{{LANG}}` : code de la langue
  - `{{HREF_FR}}` / `{{HREF_EN}}` : la même page dans l’autre langue (sélecteur de drapeaux)
  - `{{HEAD_LINKS}}` : canonical, `og:url` et `hreflang`, générés seulement quand `siteUrl` est renseigné
- Les liens entre pages d’une même langue restent relatifs (`index.html#tarifs`, `faq.html`).
- Ajouter une langue : l’ajouter dans `src/data/site.json` (`languages`) et créer `src/i18n/<code>.json`.

## Structure

- `src/pages/` : gabarits de pages (`index.html`, `404.html`)
- `src/partials/` : en-tête (navigation, réseaux, langues) et pied de page (+ onglet « Réserver »)
- `src/i18n/` : textes FR / EN
- `src/css/style.css`, `src/js/main.js` : style et comportements (sans dépendance)
- `src/images/`, `src/fonts/` : médias et polices auto-hébergées (Metamorphous, Gemunu Libre)
- `src/data/site.json` : nom, URL publique, langues
- `src/racine/` : fichiers copiés à la racine (`.htaccess`…)
- `maquette/` : exports de la maquette Figma (captures, éléments sources) — **ignoré par git**, référence de travail uniquement

## Où brancher les éléments attendus

- **Réservation 4escape** : tout le contenu du `<form class="reservation__widget">` dans `src/pages/index.html` est un aperçu visuel (calendrier mercredi → dimanche, créneaux d’exemple). Le remplacer par le code d’intégration 4escape quand les accès seront disponibles, puis retirer la partie « réservation » de `src/js/main.js`.
- **Bande-annonce** : renseigner l’identifiant YouTube dans `data-youtube=""` (balise `<dialog>` en bas de `src/pages/index.html`). Sans identifiant, la fenêtre affiche « La bande-annonce sera dévoilée très bientôt ».
- **Réseaux sociaux** : liens `href="#"` dans `src/partials/header.html` et dans la colonne Contact de `src/pages/index.html`.
- **Photos de l’histoire** : composition reprise du calque de photos d’archives de la maquette (12 photos, `.souvenir--1` à `--12` dans `src/css/style.css` : position, taille et rotation, calées sur une largeur maximale de 1728 px comme la maquette). Version allégée en dessous de 1280 px et bande de photos à droite sur mobile.
- **Lampe torche** : bouton en bas à gauche, affiché dès que le visiteur dispose d’une souris ou d’un pavé tactile (masqué sur écrans uniquement tactiles). Il assombrit légèrement la page, ajoute une petite lueur chaude autour du curseur et fait briller les lettres de « MEMORIA » survolées ; le choix est mémorisé dans le navigateur du visiteur. Réglages dans `.lampe-ombre`, `.lampe-lueur` et `.hero__eclat`.
- **Reflet du logotype** : éclat qui balaie « MEMORIA » toutes les 7 s (`.hero__titre::after`, animation `reflet`).
- **Parallaxe** : tout élément portant `data-parallax="0.22"` se déplace plus lentement que la page (valeur = vitesse relative). Pour un bandeau, remplacer simplement l’image dans `.bandeau__media`. Désactivé automatiquement si le visiteur a demandé à réduire les animations.

## Mise en ligne

Le workflow GitHub Pages construit le site à chaque push sur `main` (préversion non indexée). Pour l’hébergement définitif, publier le contenu de `dist/` et, avant cela, renseigner `siteUrl` dans `src/data/site.json` (active canonical, `hreflang` et `sitemap.xml`).

Le code source ne contient volontairement aucun commentaire : le suivi du projet se fait dans ce fichier, `PROJECT_BRIEF.md` et `QUESTIONS_CLIENT.md`.
