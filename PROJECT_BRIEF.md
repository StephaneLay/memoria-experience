# Brief projet — Memoria

## Objectif

Site vitrine statique et bilingue (FR / EN) pour **Memoria**, une expérience immersive d’horreur qui ouvre prochainement à Lyon : le pensionnat Sainte-Lucie, abandonné en 1953. Durée 1h30, 200 m², comédiens, 3 niveaux d’intensité, de 3 à 6 joueurs.

## Références de design

- **Maquette Figma** (référence principale, fichier dupliqué dans le compte Figma de l’agence) : page d’accueil desktop + version mobile. Exports locaux dans `maquette/` (hors git).
- **panikroom.fr** — inspiration majeure, que le client veut voir suivie de près : univers très sombre, bandeaux photo en pleine largeur avec effet de **parallaxe** au défilement et titres en capitales très espacées.
- **deepinsideparis.fr** — inspiration pour le **header** (transparent en haut de page, puis barre noire compacte avec filet doré au défilement) et surtout la **section hero** (grand titre centré, surtitre réparti, pastille ovale de la ville).

## Choix de design retenus

- Polices de la maquette, auto-hébergées : Metamorphous (titres) et Gemunu Libre (texte).
- Palette : noir texturé (fond grunge + grain de film), rouge sang `#8a1316`, rouge vif `#c31c20`, or `#f0c05e` / filet `#a9851a`, titres argentés texturés.
- Page d’accueil : hero (photo du hall, logotype doré, poussière en suspension, léger vacillement de la lumière) → bande-annonce → l’expérience (4 pictos) → bandeau parallaxe → tarifs → réservation (papier déchiré) → bandeau parallaxe → histoire (photos d’archives éparpillées) → infos pratiques.
- Onglet vertical « Réserver » fixé à droite (repris de la maquette mobile), masqué sur le hero et la section réservation.
- Accessibilité : contrastes des textes rouges relevés (`#e0383c`), navigation clavier, animations coupées si l’utilisateur le demande.

## Principes techniques

- HTML, CSS et JavaScript sans dépendance ; aucune exécution côté serveur.
- Sources dans `src/`, site généré dans `dist/` par `node build.js` (partials, traductions, `robots.txt`, `sitemap.xml` multilingue).
- Une seule source par page, textes dans `src/i18n/*.json`, build bloquant si une traduction manque.
- Préversion sur GitHub Pages (non indexée) ; hébergeur définitif à confirmer.

## Intégrations

- **Réservation : 4escape**, intégrée sur l’accueil (widget catalogue + panier, habillé aux couleurs du site). Compte `memoria-experience.4escape.io` en phase de test : paiement 4escape Pay en mode test, créneaux d’essai. Détails techniques dans le README, réglages restants dans QUESTIONS_CLIENT.
- **Bande-annonce YouTube** : fenêtre vidéo prête, identifiant de la vidéo à fournir.
- **Domaine et hébergement** : `memoria-experience.fr` chez OVH, hébergement « Free hosting » (100 Mo, PHP 8.2, centre de données de Gravelines, dépôt des fichiers par FTP) ; messagerie chez Google (contact@ passe par Gmail).

Inventaire des éléments du site liés à 4escape (au 2 novembre 2026) :

| Élément du site | Solution |
| --- | --- |
| Réservation (accueil, onglet « Réserver », bouton du hero, liens de la FAQ) | Widget catalogue → « Session classique » : **fait** |
| Bons cadeaux (page Pack cadeau, bouton « Offrir MEMORIA ») | Produit « bon cadeau » + widget catalogue dédié, **à créer dans 4escape** ; le démonstrateur actuel sera remplacé par ce widget |
| Utilisation d’un bon lors de la réservation | Gérée par 4escape au paiement (code), rien à faire côté site |
| Choix du niveau d’intensité à la réservation (FAQ, CGV) | Option à créer sur la room dans 4escape (emplacement déjà prévu par le widget) |
| Paiement partagé entre joueurs (FAQ) | Option « paiement partagé » de 4escape, désactivée pour l’instant |
| E-mails de confirmation, factures, avoirs, reçus | 4escape (Mailjet à configurer avec Andrea, templates à compléter) |
| Formulaires contact, devis team building, pack personnalisé, presse | **Pas de widget 4escape** : script PHP du site sur l’hébergement OVH, envoi vers contact@ : **fait** (testé en local) ; les devis sont ensuite édités dans 4escape |
| Prochains créneaux libres (optionnel) | Widget « disponibilités » de 4escape, existant |

## Contenu final du client (4-5 novembre 2026)

Le client a fourni une fiche de contenus (`contenu-client/Contenu Site MEMORIA EXPERIENCE.pdf`, hors git) et 20 photos (`contenu-client/photos/`). Tout a été intégré le 5 novembre en FR / EN : nouveau nom du lieu (**Pensionnat de la Liberté**, à la place de Sainte-Lucie), nouvelle histoire et chronologie (1877 → aujourd’hui), deux fondateurs (Sylvain, Alexis), niveaux d’intensité renommés, horaires (7 j/7, 10 h – 00 h), transports, FAQ réécrite, deux formules team building, six occasions sur mesure, ressources presse simplifiées, mentions légales et CGV définitives (médiateur CM2C). Les écarts et décisions sont suivis dans QUESTIONS_CLIENT.

## Pages

- Page d’accueil : faite (FR / EN).
- Notre histoire : faite (FR / EN), textes provisoires rédigés par nos soins en attendant ceux du client. Partie I « La véritable histoire » (les trois associés, la genèse en six chapitres, les valeurs, les coulisses en images), puis, bien séparée par un bandeau, Partie II « Le récit » : la chronique fictive du pensionnat Sainte-Lucie de 1902 à aujourd’hui.
- Nos services (sous-menu du header), trois pages faites (FR / EN), textes provisoires :
  - **Pack cadeau** : formules, configurateur avec aperçu du bon en direct, fonctionnement, FAQ (validité, conditions, réservation), bouton « Offrir MEMORIA » ;
  - **Pack personnalisé** : occasions (anniversaire, EVJF/EVG, demande en mariage, privatisation, surprise, entreprise, demande spéciale), facteurs, étapes, formulaire « Créer mon expérience » ;
  - **Presse, tournages & influenceurs** : publics, concept en chiffres, offres, conditions d’accueil, confidentialité, ressources (dossier de presse, logos, photos autorisées), formulaire « Contacter notre équipe ».
- **Team building** : faite (FR / EN), textes fournis par le client (mis en forme et complétés). Hero vidéo (emplacement prêt), présentation commerciale, bénéfices, « Choisir une activité qui se démarque », trois niveaux d’intensité (faible / standard / extrême) avec la garantie qu’aucun participant n’est forcé, privatisation, cocktail & moment convivial, trois formules sur devis, formulaire « Demander un devis » (les boutons des formules présélectionnent la formule).
- **FAQ** : faite (FR / EN), 32 questions en 4 catégories (L’expérience, Intensité & peur, Réservation, Informations pratiques), questions dépliables, recherche instantanée et sommaire des catégories.
- L’accueil affiche aussi les trois niveaux d’intensité (mêmes textes que la page Team building), avec un lien vers la FAQ.
- **Nous contacter** : faite (FR / EN). Coordonnées (téléphone, e-mail, adresse, horaires, réseaux), formulaire de contact (prénom, nom, e-mail, téléphone facultatif, sujet parmi 9, message, consentement) avec message de confirmation, et « Venir à Memoria » : plan, itinéraire, transports, stationnement, accès. Le menu « Nous contacter » mène désormais à cette page.
- **Pages légales** (pied de page) : mentions légales, CGV, politique de confidentialité, politique cookies — faites en FR / EN sous forme de modèles complets, avec les éléments à fournir surlignés `[entre crochets]` et un encart « document provisoire ». Toutes les pages du menu et du pied de page existent désormais.

Ne pas ajouter de vraies clés, mots de passe ou jetons au dépôt ; utiliser les secrets de l’hébergeur/CI lorsqu’une intégration sera décidée.
