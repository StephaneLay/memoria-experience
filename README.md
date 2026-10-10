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

- `src/pages/` : gabarits de pages (`index.html`, `notre-histoire.html`, `pack-cadeau.html`, `pack-personnalise.html`, `presse.html`, `404.html`)
- `src/partials/` : en-tête (navigation, réseaux, langues) et pied de page (+ onglet « Réserver »)
- `src/i18n/` : textes FR / EN
- `src/css/style.css`, `src/js/main.js` : style et comportements (sans dépendance)
- `src/images/`, `src/fonts/` : médias et polices auto-hébergées (Metamorphous, Gemunu Libre)
- `src/data/site.json` : nom, URL publique, langues
- `src/racine/` : fichiers copiés à la racine (`.htaccess`…)
- `maquette/` : exports de la maquette Figma (captures, éléments sources) — **ignoré par git**, référence de travail uniquement

## Tarifs

Les prix par personne font foi et ne se modifient qu’à **un seul endroit** : `tarifs` dans `src/data/site.json` (nombre de joueurs → prix par personne). Le build les injecte partout, formatés selon la langue (« 49 € » / « €49 ») :

- `{{PRIX_3}}` … `{{PRIX_6}}` : prix par personne (grille tarifaire de l’accueil, formules du pack cadeau)
- `{{TOTAL_3}}` … `{{TOTAL_6}}` : prix de la session complète (prix × nombre de joueurs), utilisé pour la valeur des bons cadeaux

Ne jamais écrire un prix en dur dans une page ou un fichier de traduction.

## Où brancher les éléments attendus

- **Réservation 4escape** : tout le contenu du `<form class="reservation__widget">` dans `src/pages/index.html` est un aperçu visuel (calendrier mercredi → dimanche, créneaux d’exemple). Le remplacer par le code d’intégration 4escape quand les accès seront disponibles, puis retirer la partie « réservation » de `src/js/main.js`.
- **Bande-annonce** : renseigner l’identifiant YouTube dans `data-youtube=""` (balise `<dialog>` en bas de `src/pages/index.html`). Sans identifiant, la fenêtre affiche « La bande-annonce sera dévoilée très bientôt ».
- **Réseaux sociaux** : liens `href="#"` dans `src/partials/header.html` et dans la colonne Contact de `src/pages/index.html`.
- **Formulaires** (pack personnalisé, presse, bon cadeau) : champs, validation et champ anti-spam invisible (`site_web`) sont prêts. Tant que la balise `<form>` n’a pas d’attribut `action`, l’envoi affiche un message d’attente. Pour les activer : ajouter `action` + `method="post"` vers le script d’envoi retenu (script PHP comme sur le-dome si l’hébergeur le permet, ou service de formulaires), et le JavaScript laissera alors le formulaire partir normalement.
- **Bon cadeau** : les formules (`.formule`) et l’aperçu du bon sont un démonstrateur visuel ; l’achat réel passera par 4escape (remplacer le bouton « Offrir MEMORIA » par le lien ou le widget 4escape).
- **Bouton « Réserver »** : onglet vertical fixé à droite sur toutes les pages, toujours visible (masqué uniquement quand le menu mobile est ouvert), avec une lueur rouge pulsée (`.onglet-reservation`).
- **Emplacements photo** : les cadres « Photo à venir » de la page Notre histoire (`.photo-attente`, variantes `--croquis` et `--chantier`) sont à remplacer par des `<img>` quand l’équipe, les croquis et les photos de chantier seront fournis.
- **Photos de l’histoire** : composition reprise du calque de photos d’archives de la maquette (12 photos, `.souvenir--1` à `--12` dans `src/css/style.css` : position, taille et rotation, calées sur une largeur maximale de 1728 px comme la maquette ; volontairement sans parallaxe). Version allégée en dessous de 1280 px et bande de photos à droite sur mobile.
- **Lampe torche** : bouton en bas à gauche, affiché dès que le visiteur dispose d’une souris ou d’un pavé tactile (masqué sur écrans uniquement tactiles). Il assombrit légèrement la page, ajoute une petite lueur chaude autour du curseur et fait briller les lettres de « MEMORIA » survolées ; le choix est mémorisé dans le navigateur du visiteur. Réglages dans `.lampe-ombre`, `.lampe-lueur` et `.hero__eclat`.
- **Reflet du logotype** : éclat qui balaie « MEMORIA » toutes les 7 s (`.hero__titre::after`, animation `reflet`).
- **Parallaxe** : réservé aux deux bandeaux photo (« Osez franchir le seuil », « Sainte-Lucie · 1953 »). Sur ordinateur, effet « fenêtre » façon Panik Room : la photo reste fixe et le bandeau la découvre en défilant (prévoir des photos d’au moins 1920 px de large). Sur mobile, la photo défile plus lentement que la page (`data-parallax`). Pour changer une photo, remplacer l’image dans `.bandeau__media`.

## Mise en ligne

Le workflow GitHub Pages construit le site à chaque push sur `main` (préversion non indexée). Pour l’hébergement définitif, publier le contenu de `dist/` et, avant cela, renseigner `siteUrl` dans `src/data/site.json` (active canonical, `hreflang` et `sitemap.xml`).

Le code source ne contient volontairement aucun commentaire : le suivi du projet se fait dans ce fichier, `PROJECT_BRIEF.md` et `QUESTIONS_CLIENT.md`.
