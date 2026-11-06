# Site vitrine — Memoria, expérience immersive d’horreur

Site 100 % statique et bilingue (français / anglais), sur l’architecture de `le-dome`. Le contexte projet complet est dans [PROJECT_BRIEF.md](PROJECT_BRIEF.md), les points en attente côté client dans [QUESTIONS_CLIENT.md](QUESTIONS_CLIENT.md).

## Principe

```
src/  = les sources (ce qu'on édite)        ← jamais déployé
dist/ = le site généré (ce qu'on déploie)   ← jamais édité à la main
```

`node build.js` lit `src/`, assemble chaque page dans chaque langue et écrit le résultat dans `dist/`. **`dist/` est entièrement effacé et régénéré à chaque build.** Il ajoute aussi une empreinte aux liens vers `css/style.css` et `js/main.js` (`style.css?v=…`) : à chaque modification, les navigateurs (et le cache de 10 minutes de GitHub Pages) chargent forcément la nouvelle version, sans mélange entre une page récente et un ancien style.

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

- `src/pages/` : gabarits de pages (`index.html`, `notre-histoire.html`, `pack-cadeau.html`, `pack-personnalise.html`, `presse.html`, `team-building.html`, `faq.html`, `contact.html`, `mentions-legales.html`, `cgv.html`, `confidentialite.html`, `cookies.html`, `404.html`)
- `src/partials/` : en-tête (navigation, réseaux, langues) et pied de page (+ onglet « Réserver »)
- `src/i18n/` : textes FR / EN
- `src/css/style.css`, `src/js/main.js` : style et comportements (sans dépendance)
- `src/images/`, `src/videos/`, `src/fonts/` : médias et polices auto-hébergées (Metamorphous, Gemunu Libre)
- `src/data/site.json` : nom, URL publique, langues
- `src/racine/` : fichiers copiés à la racine (`.htaccess`…)
- `maquette/` : exports de la maquette Figma (captures, éléments sources) — **ignoré par git**, référence de travail uniquement

## Tarifs

Les prix par personne font foi et ne se modifient qu’à **un seul endroit** : `tarifs` dans `src/data/site.json` (nombre de joueurs → prix par personne). Le build les injecte partout, formatés selon la langue (« 49 € » / « €49 ») :

- `{{PRIX_3}}` … `{{PRIX_6}}` : prix par personne (grille tarifaire de l’accueil, formules du pack cadeau)
- `{{TOTAL_3}}` … `{{TOTAL_6}}` : prix de la session complète (prix × nombre de joueurs), utilisé pour la valeur des bons cadeaux

Ne jamais écrire un prix en dur dans une page ou un fichier de traduction.

## Où brancher les éléments attendus

- **Réservation 4escape** : widget catalogue (`.forescape-catalog`) et panier (`.forescape-cart`) dans la section `#reservation` de `src/pages/index.html`, avec les identifiants fournis par 4escape (`data-widget-id`, `data-settings` = `b64.` + `{"domain":"memoria-experience.4escape.io"}` encodé en base 64). `data-redirect-route` ouvre directement la room « Session classique » au lieu de passer par le catalogue (moins d’entrées dans l’historique du navigateur) : à retirer si d’autres expériences sont ajoutées au catalogue. Le script et la feuille de 4escape (`widgets.4escape.app/main.js` et `main.css`) sont chargés par `src/js/main.js` uniquement sur les pages qui contiennent un widget, et seulement quand celui-ci approche de l’écran. La langue suit la page (`data-lng="{{LANG}}"`). Le parcours (joueurs → date → créneau → panier → paiement), les créneaux, les prix et les libellés se règlent dans l’admin 4escape, pas dans le site. Habillage : variables `--f-*` du bloc `html .forescape` de `src/css/style.css` (la feuille 4escape est entièrement limitée à `.forescape`, elle ne touche pas au reste du site). Ne jamais placer un widget dans un élément avec `transform`, `filter`, `clip-path`, `contain` ou `z-index` : ses panneaux fixes (panier, paiement) y seraient rognés ou masqués. C’est pour cela que le papier déchiré est un calque séparé (`.reservation__decor`). Le module réécrit l’adresse en `index.html#/room/…` (routage par ancre) : c’est normal. Le texte « Chargement des disponibilités… » et le lien de secours vers la billetterie 4escape restent affichés si le script est bloqué.
- **Pages légales** : textes dans la rubrique `legal` des traductions (une entrée `sN.titre` / `sN.contenu` par section, HTML autorisé ; le sommaire et les sections des gabarits suivent le nombre de sections). Mentions légales (15 sections) et CGV (30 articles + annexe) : textes fournis par le client le 4 novembre, convertis tels quels en HTML (tableau des tarifs de l’article 5 alimenté par `{{PRIX_n}}` / `{{TOTAL_n}}`), avec une date de mise à jour propre (`legal.mentions.miseAJour`, `legal.cgv.miseAJour`) et sans encart provisoire ; versions anglaises traduites par nos soins, précédées d’une mention « la version française prévaut » (`legal.commun.traduction`, vide en français). Confidentialité et cookies : rédigés par nos soins, encart provisoire conservé. Les éléments à compléter sont balisés `<span class="a-completer">[…]</span>` (surlignés à l’écran) : en les remplaçant, retirer aussi la balise.
- **Page Contact** : formulaire général (9 sujets) avec **panneau de confirmation** après envoi (« Merci, Prénom »). Un lien `contact.html?sujet=accessibilite#formulaire` présélectionne le sujet (valeurs : `reservation`, `modification`, `bon-cadeau`, `pack-personnalise`, `team-building`, `presse`, `technique`, `accessibilite`, `autre`). Téléphone, adresse et horaires reprennent les textes de l’accueil (rubrique `infos`) : une seule source.
- **FAQ** : ajouter une question = ajouter une paire `qN` / `rN` dans la catégorie voulue de `src/i18n/fr.json` et `en.json` (rubrique `faq`), puis un bloc `<details class="question" data-question>` (réponse dans `<div class="question__reponse">`) dans `src/pages/faq.html`. Les réponses sont du HTML : paragraphes `<p>`, listes `<ul>`, liens et jetons de prix (`{{PRIX_3}}`…). La recherche et le sommaire fonctionnent automatiquement.
- **Niveaux d’intensité** : Demi-pensionnaire / Pensionnaire / Jusqu’en enfer ! (Day Boarder / Boarder / Straight to Hell!), textes communs (rubrique `intensite` des traductions), affichés à l’identique sur l’accueil et la page Team building ; les mêmes noms sont repris dans la FAQ et les CGV.
- **Vidéo du hero (accueil)** : fournie par le client le 6 novembre (`contenu-client/photos/HERO SECTION V1.mp4`, 4K, 30 s, 288 Mo, hors git), encodée sans le son en `src/videos/hero-accueil-1080.mp4` (5 Mo) et `hero-accueil-720.mp4` (2,5 Mo, servie jusqu’à 1024 px de large), avec l’image d’attente `src/images/hero-accueil-poster.webp`. Pour réencoder une nouvelle version : `ffmpeg -i source.mp4 -an -vf "scale=1920:-2:flags=lanczos" -c:v libx264 -preset slow -crf 30 -profile:v high -pix_fmt yuv420p -movflags +faststart hero-accueil-1080.mp4` (même commande avec `scale=1280:-2` pour la version 720). Assombrissement réglé dans `.hero__video` ; la vidéo est mise en pause si le visiteur a demandé à réduire les animations.
- **Vidéo du hero Team building** : déposer la vidéo dans `src/videos/` (ex. `team-building.mp4`, idéalement H.264, 10 à 20 s en boucle, sans son, moins de 5 Mo) puis ajouter dans la balise `<video data-video-fond>` de `src/pages/team-building.html` : `<source src="{{ROOT}}videos/team-building.mp4" type="video/mp4">`. En attendant, la photo du hall s’affiche à sa place. La vidéo est mise en pause si le visiteur a demandé à réduire les animations.
- **Bande-annonce** : renseigner l’identifiant YouTube dans `data-youtube=""` (balise `<dialog>` en bas de `src/pages/index.html`). Sans identifiant, la fenêtre affiche « La bande-annonce sera dévoilée très bientôt ».
- **Réseaux sociaux** : liens `href="#"` dans `src/partials/header.html` et dans la colonne Contact de `src/pages/index.html`.
- **Formulaires** (contact, team building, pack personnalisé, presse) : envoyés par `src/scripts/formulaire.php` (PHP 7.4 à 8.x, sans dépendance) vers contact@memoria-experience.fr, avec l’adresse du visiteur en « Répondre à ». Chaque `<form>` porte `action="{{ROOT}}scripts/formulaire.php"` et deux champs cachés : `formulaire` (type, qui fixe la liste des champs, les obligatoires et l’objet de l’e-mail dans le tableau `$FORMULAIRES` du script) et `langue`. Ajouter un champ = l’ajouter dans la page **et** dans `$FORMULAIRES`, sinon il n’apparaît pas dans l’e-mail. Le JavaScript envoie sans recharger la page et affiche les messages `data-message-envoi` / `-succes` / `-erreur` (rubrique `formulaire` des traductions) ; sans JavaScript, le script redirige vers la page avec `?envoi=ok`. Protections : champ piège invisible (`site_web`), consentement et e-mail vérifiés côté serveur, en-têtes protégés contre l’injection, **5 envois par heure et par adresse IP** (l’hébergement gratuit OVH limite `mail()` à 10 e-mails par heure ; au-delà, OVH les met en file d’attente). Expéditeur : `site@memoria-experience.fr` (OVH exige une adresse du domaine rattaché à l’hébergement). **Le PHP ne s’exécute pas sur GitHub Pages** : la préversion affiche alors le message d’aperçu (`data-message`). Pour tester en local : `php -S 127.0.0.1:8000 -t dist`. Le formulaire du Pack cadeau (sans `action`) reste un démonstrateur, en attendant le widget 4escape.
- **Bon cadeau** : bons **par nombre de joueurs** (3 à 6, prix de la grille tarifaire), sans montant libre (décision du 5 novembre). Les formules (`.formule`), le formulaire `[data-bon-cadeau]` et l’aperçu du bon (« Valable pour N joueurs », `data-joueurs`) sont un démonstrateur visuel. 4escape sait vendre des bons cadeaux (produit de type « bon cadeau » affiché par un widget catalogue dédié), mais aucun n’est encore créé dans le compte. Dès que l’identifiant du widget bon cadeau existe : dans `src/pages/pack-cadeau.html`, remplacer le formulaire par `<div class="forescape-catalog" data-widget-id="…" data-settings="…" data-lng="{{LANG}}"></div>` suivi de `<div class="forescape-cart" data-settings="…" data-lng="{{LANG}}"></div>` (même `data-settings` que l’accueil), puis retirer la partie « bon cadeau » de `src/js/main.js`. Chargement et habillage sont alors automatiques.
- **Bouton « Réserver »** : onglet vertical fixé à droite sur toutes les pages, toujours visible (masqué uniquement quand le menu mobile est ouvert), avec une lueur rouge pulsée (`.onglet-reservation`).
- **Photos du client (5 et 6 novembre)** : recadrées (coins blancs ou crème retirés) et converties en WebP dans `src/images/` : `souvenir-*` (accueil), `pensionnat-1904` … `pensionnat-1951` (chronologie), `genese-lieu`, `genese-decors`, `genese-technique`, `fondateur-1` et `fondateur-2` (portraits de Sylvain et d’Alexis), `coulisses-*`. Les photos iPhone (HEIC) sont converties avec libheif ; leurs métadonnées (dont la position GPS) disparaissent à l’export WebP. Emplacements encore « Photo à venir » (`.photo-attente`) : étapes 01, 02 et 06 de la genèse, et trois cases de la galerie des coulisses (équipe, croquis et plans, régie et répétitions). Le bureau de Lucie Fiammetta (`souvenir-bureau`) est parmi les photos de l’accueil et la photo de femme (`pensionnat-1947`) sur 1947. « Aujourd’hui » reste sans photo jusqu’à réception de la bonne. Photo provisoire : `.souvenir--6` de l’accueil reprend encore la photo de 1926 de la chronologie.
- **Photos de l’histoire (accueil)** : douze photos éparpillées (`.souvenir--1` à `--12` dans `src/css/style.css` : position, taille et rotation, calées sur une largeur maximale de 1728 px ; volontairement sans parallaxe). Elles ne doivent pas recouvrir la colonne de texte : vérifier à 1280, 1440 et 1920 px après tout changement de photo ou de texte. Version allégée en dessous de 1280 px et bande de photos à droite sur mobile.
- **Pictogrammes** de « Votre expérience Memoria » (accueil) et des chiffres de Team building : créés par Hugo Le Vaguerese (6 novembre), `picto-duree`, `picto-surface`, `picto-immersion` et `picto-niveaux` (variante dorée ; la variante rouge des niveaux, fournie aussi, n’est pas utilisée). Ils sont alignés dans une boîte de même hauteur dont la largeur est plafonnée (`max-width` + `object-fit: contain`), pour que la montre, très large, ne paraisse pas plus grosse que les autres.
- **Reflet du logotype** : éclat qui balaie « MEMORIA » toutes les 7 s (`.hero__titre::after`, animation `reflet`).
- **Parallaxe** : réservé aux bandeaux photo de transition (deux sur l’accueil, un sur Notre histoire, un sur Team building), dont les photos seront fournies par le client ; le bandeau Team building est sans photo en attendant. Sur ordinateur, effet « fenêtre » façon Panik Room : la photo reste fixe et le bandeau la découvre en défilant (prévoir des photos d’au moins 1920 px de large). Sur mobile, la photo défile plus lentement que la page (`data-parallax`). Pour changer une photo, remplacer l’image dans `.bandeau__media`.

## Mise en ligne

Le workflow GitHub Pages construit le site à chaque push sur `main` (préversion non indexée). Pour l’hébergement définitif (hébergement OVH du domaine `memoria-experience.fr`), publier le contenu de `dist/`.

Check-list de mise en ligne et de référencement (la fiche Google Business Profile est faite par le client) :

- [ ] Renseigner `siteUrl` (`https://memoria-experience.fr`) dans `src/data/site.json` : active canonical, `og:url`, `hreflang` et `sitemap.xml`
- [ ] Vérifier que le `robots.txt` publié autorise l’indexation (celui de la préversion l’interdit) et pointe vers le sitemap
- [ ] Ajouter une image de partage (`og:image` 1200 × 630, adresse absolue) et `twitter:card`
- [ ] Ajouter les données structurées JSON-LD de l’établissement (nom, adresse, coordonnées GPS, téléphone, horaires, prix, réseaux sociaux) sur l’accueil et la page Contact
- [ ] Relire titres et descriptions de chaque page avec les textes définitifs ; textes alternatifs des vraies photos
- [ ] Ajouter un `apple-touch-icon`
- [x] HTTPS forcé et redirection 301 de `www.memoria-experience.fr` vers `memoria-experience.fr` (dans `src/racine/.htaccess` ; certificats Let’s Encrypt déjà actifs sur les deux adresses)
- [ ] Déclarer le domaine dans Google Search Console (enregistrement TXT dans la zone DNS OVH) et y soumettre `sitemap.xml` ; Bing Webmaster Tools en option
- [ ] Ajouter l’adresse du site dans les réglages de 4escape et dans la fiche Google Business (lien « Réserver » vers `https://memoria-experience.fr/#reservation`)
- [ ] Tester sur le serveur : réservation de bout en bout (paiement réel une fois 4escape Pay activé), formulaires, page 404, versions FR / EN

Le code source ne contient volontairement aucun commentaire : le suivi du projet se fait dans ce fichier, `PROJECT_BRIEF.md` et `QUESTIONS_CLIENT.md`.
