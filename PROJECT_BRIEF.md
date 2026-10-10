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

## Intégrations prévues

- **Réservation : 4escape**. Le client n’a pas encore les accès : la section réservation est un aperçu visuel fidèle à la maquette (non connecté), à remplacer par le widget 4escape.
- **Bande-annonce YouTube** : fenêtre vidéo prête, identifiant de la vidéo à fournir.

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
- À créer au fil de l’eau : mentions légales, CGV, politique de confidentialité, cookies. Les liens existent déjà dans le menu et le pied de page et mènent pour l’instant à la page 404 thématique.

Ne pas ajouter de vraies clés, mots de passe ou jetons au dépôt ; utiliser les secrets de l’hébergeur/CI lorsqu’une intégration sera décidée.
