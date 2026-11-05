# Questions à traiter avec le client

Rien de ce qui suit n’est bloquant pour avancer sur le design ; ce sont les contenus provisoires actuellement en ligne sur la préversion.

## Contenu final intégré le 5 novembre — reste à fournir

- [ ] **Fond animé du haut de l’accueil** : vidéo MP4 courte, sans son, en boucle (moins de 5 Mo), plutôt qu’un GIF
- [ ] **Bande-annonce** : lien YouTube
- [ ] **Pictogrammes de Hugo** pour « Votre expérience Memoria » : annoncés « fournis avec la fiche », absents du PDF et du dossier photos
- [ ] **Photos** : portraits de Sylvain et d’Alexis ; photo d’équipe ; croquis et plans ; régie technique et répétitions ; étapes 01 (l’étincelle), 02 (le scénario), 05 (la technique) et 06 (les comédiens) de la genèse ; photo « Aujourd’hui » de la chronologie (provisoire : les toits) ; 2 ou 3 photos pour l’histoire de l’accueil (5 emplacements reprennent pour l’instant des photos de la chronologie)
- [ ] **Vidéo du hero Team building**
- [ ] **Liens des réseaux sociaux**
- [ ] **Photo du hall (hero)** : filigrane d’un photographe → licence ou remplacement
- [ ] **Entrée et accès au bâtiment** (interphone, étage…) : la ligne « informations à venir » a été retirée de la page Contact faute d’information

## Décisions prises en intégrant la fiche (à valider)

- [ ] **« Signal de sécurité » partout** (Notre histoire, FAQ, CGV) : la fiche demandait « mot de sécurité » pour Notre histoire, mais la FAQ et les CGV fournies disent « geste ou signal » et la note de fin de fiche demande un seul terme
- [ ] Photo de classe « 1952-1953 » placée sur **1953** (fichier nommé « 1957 », coquille supposée) ; photo « bibliothèque » placée sur **1947** (le bureau de Lucie Fiammetta)
- [ ] Légendes des photos de la chronologie rédigées par nos soins
- [ ] Fin de Notre histoire : « Ce soir, le Pensionnat de la Liberté vous attend… » (la fiche indiquait « Sainte-Lucie », l’ancien nom)
- [ ] « Expérience immersive » déplacé sous le logo (il figurait déjà au-dessus : pas de doublon)
- [ ] Histoire de l’accueil : la dernière phrase (« Mais certaines vérités… ») prend la place de « Pourrez-vous découvrir la vérité ? », en rouge
- [ ] FAQ : question renommée « Le niveau « Jusqu’en enfer ! » est-il obligatoire ? » ; « Où se garer ? » sans « informations bientôt disponibles »
- [ ] Team building : titre ajouté au bloc capacité (« Une équipe de plus de 6 personnes ? »), intro « Deux formules… », liste du formulaire de devis alignée (option Privatisation retirée)
- [ ] Expérience sur mesure : options du formulaire alignées sur les six occasions (Entreprise retirée, « Autre demande » → « Demande spéciale »)
- [ ] Contact : stationnement sans adresse précise ; accès PMR aligné sur la FAQ
- [ ] Mentions légales : « Hugo Le Vaguerese » (donné en section 6) repris en section 4
- [ ] Mentions légales et CGV en anglais : traduction par nos soins, avec la mention « la version française prévaut »

## Incohérences relevées dans la fiche (laissées telles quelles)

- [ ] FAQ « retard » : « il n’y a ni briefing, ni accueil » ↔ CGV art. 11 et 14 (briefing de sécurité obligatoire, arrivée 5 minutes avant pour l’accueil et le briefing) et FAQ « signal présenté lors du briefing »
- [ ] Durée sur place : FAQ « environ 1h45 » ↔ CGV art. 3 « environ deux heures »
- [ ] CGV art. 17.1 : bons « par nombre de joueurs ou montant libre » ↔ décision du 2 novembre : bons par valeur

## Bloquant avant mise en ligne (pages légales, surligné sur les pages)

- [ ] Mentions légales : siège social « [à confirmer sur le Kbis actualisé] »
- [ ] Mentions légales, section 13 : récépissé d’entrepreneur de spectacles vivants, s’il existe
- [ ] CGV art. 17.4 : « [Modalité du solde des bons à confirmer avec 4escape avant publication.] »
- [ ] Confidentialité : délégué à la protection des données, transferts hors UE (Google, 4escape), durée des journaux de l’hébergeur ; retirer l’encart provisoire une fois validé
- [ ] Cookies : traceurs du paiement, à relever lors du premier paiement test
- [ ] Relecture juridique

## Encore à trancher

- [ ] **Montants des bons cadeaux** (par valeur, 12 mois, envoi par e-mail) : la page Offrir Memoria présente encore des formules par nombre de joueurs, à refaire au branchement du widget 4escape
- [ ] **Adresse presse@** pour le formulaire presse ?

## Réservation — réglages dans l’admin 4escape (client)

Le widget est intégré sur l’accueil. Aide officielle : https://help.4escape.io/fr/ (voir notamment « Checklist de mise en production »).

**Bloquant pour la mise en ligne (à lancer tout de suite, délais de validation)**

- [ ] **4escape Pay** : sans lui, le bloc de paiement ne se charge pas (erreur « Invalid Payment Store Data »). Procédure (article « Mise en place 4escape Pay (onboarding) ») : demander l’activation au support → Admin → Paramétrage → 4escape Pay (intégration) → onglet « Mes informations » → « Créer mon compte » → onboarding (SIRET, n° de TVA, pièces d’identité, RIB, deux documents à signer) → prévenir l’équipe 4escape → **validation sous 48 à 96 h**
- [ ] **Mailjet** : sans lui, aucun e-mail n’est envoyé (confirmations, bons cadeaux). Le client crée un compte Mailjet et transmet ses clés au support 4escape via `paste.4escape.io` ; nous ajouterons ensuite les enregistrements DNS de Mailjet chez OVH

**Fiche de la session « Session classique » (Menu → Rooms → la room → Modifier)**

- [ ] **Créneaux** : durée 90 min + pause 30 min = un créneau toutes les 2 h. Fixer la vraie pause entre deux groupes, puis générer le planning réel (onglet « Planning & Prix », jours et heures d’ouverture)
- [ ] **Date d’ouverture des réservations** : à renseigner si Memoria ouvre à une date précise, pour qu’on ne puisse pas réserver avant
- [ ] **Arrivée des joueurs** : « Demander l’arrivée X min avant » → 5 (CGV art. 14 et page Contact)
- [ ] **Adresse** de la salle (rue, code postal, ville) : vide → 45 cours de la Liberté, 69003 Lyon
- [ ] **URL de la page vitrine** → `https://memoria-experience.fr/` ; **URL publique de réservation (widget)** → `https://memoria-experience.fr/#reservation`
- [ ] **Nom affiché sur le web** (« Session classique ») et **image de la room** (format 16:9, remplace l’image de coffre-fort) ; vidéo YouTube quand elle existe
- [x] **Groupes de 2 et jusqu’à 8 joueurs** : règles de la description de la room désormais sur le site (FAQ, CGV art. 4, Team building) ; la description de la room peut être réécrite
- [ ] **Paiement partagé** : la FAQ annonce que chaque participant peut régler sa part → cocher « Autoriser le paiement partagé » sur la room
- [ ] **Conditions de paiement** (total en ligne / sur place / acompte) et options **paiement partagé** et **empreinte bancaire** : à trancher, puis compléter l’article 3 des CGV
- [ ] **Niveau d’intensité** : onglet « Variations » de la room → variation « Niveau d’intensité », type Personnalisé, champ radio, « à choisir » + « choix obligatoire », valeurs Demi-pensionnaire / Pensionnaire / Jusqu’en enfer ! (Pensionnaire par défaut). L’affichage dans le widget demande ensuite une intervention de 4escape
- [ ] Idée : une variation obligatoire « Je confirme que tous les participants ont au moins 12 ans et ont lu les contre-indications » (l’aide présente cet usage)

**Ailleurs dans l’admin**

- [ ] **Profil → Société → Site internet** : `http://memoria-experience.fr/` → `https://memoria-experience.fr`
- [ ] **Bon cadeau** (test du 2 novembre) : produit « Bon cadeau memoria » créé (ID `6ae8a098aa0dcf48cd98d57c`, envoi par e-mail, 147 € pour 3 joueurs). **Aucun widget spécial n’est nécessaire** : le widget de réservation l’ouvre directement (`data-redirect-route="/product/6ae8a098aa0dcf48cd98d57c"`), avec quantité, mode d’envoi (j’imprime / envoi au destinataire), « Offert par », « Pour », message (80 caractères) et e-mail du destinataire. Il manque le **modèle PDF** du bon (Admin → Paramétrages → PDF - Gestion des PDF → « Bon cadeau ») : sans lui, « Ajouter au panier » reste bloqué. Modèle retenu par le client : `maquette/bon-cadeau-memoria.pdf` (A5, 123 Ko ; source `maquette/bon-cadeau-memoria.html`). **Décidé le 2 novembre** : bon **par valeur** (pas par nombre de joueurs ; montants à fixer), **validité 12 mois**, **envoi par e-mail** uniquement. La page Pack cadeau du site devra suivre (formules par montant). L’envoi du bon par e-mail passe par Mailjet et deux workflows « gift-voucher:booked »
- [ ] **Annulation** : modification réglée à 48 h dans 4escape, comme sur le site ; aligner le délai d’annulation (72 h sur le site)
- [ ] **Templates** facture, avoir, devis, reçu : informations légales
- [ ] **CGV et confidentialité au paiement** : le widget affiche déjà une case « Je confirme avoir pris connaissance et accepté les CGV et la Politique de confidentialité » ; renseigner les textes ou liens (`/cgv.html`, `/confidentialite.html`) dans Admin → Société → Confidentialité (RGPD), une fois les pages légales finalisées
- [ ] **Logo** de la billetterie 4escape (il ne s’affiche pas sur memoria-experience.4escape.io)
- [x] **Prix** vérifiés le 2 novembre : 147 / 172 / 195 / 210 € pour 3 à 6 joueurs, TVA 20 % incluse
- Retour après paiement : pas de redirection possible vers une page du site (choix de 4escape, voir l’article « Tracking Widget ») ; le widget affiche sa propre confirmation. Le suivi des ventes passe par Google Tag Manager si besoin

## Demandes au prestataire 4escape

C’est le client qui écrit à 4escape (décidé le 2 novembre). Aucun nouveau widget à demander.

- [ ] **4escape Pay** : activation et calendrier de validation (via Andrea)
- [ ] **Mailjet** : intégration (via Andrea)
- [ ] **Variation « Niveau d’intensité »** : l’afficher dans le widget de la room (préciser la room et le nom de la variation)
- [ ] **Anglais** : activer la langue sur le compte (sur demande au support), puis traduire room, catégorie de joueurs, variation et produits
- [ ] **Bon cadeau** : pas de widget à demander (le produit s’ouvre dans le widget existant). Reste à faire configurer avec Mailjet les e-mails d’envoi du bon (workflows « gift-voucher:booked », envoi à l’acheteur et au destinataire)
- [ ] **Traductions personnalisées** en erreur (« Can't parse fr custom translations ») ; ensuite renommer « Ajouter au panier » en « Réserver »
- Historique du navigateur : deux entrées ajoutées à l’ouverture du widget (le bouton « Retour » demande trois clics pour quitter la page) ; gêne mineure, retirée du message du client le 2 novembre
- Pages légales : plus de question à poser. `forescapeAnalytics` mémorise utm_source / utm_medium / gclid (lu dans le code du widget) ; plateforme et widgets hébergés chez OVHcloud à Gravelines (adresses IP) ; traceurs du paiement à relever nous-mêmes lors du premier paiement test
- [ ] Optionnel : check-in en ligne (décharge signée) et « Manage your booking » : réservés à l’abonnement WEB PREMIUM d’après l’aide ; quel abonnement a le client ?

## Formulaires et e-mails du domaine

Les formulaires (contact, devis team building, pack personnalisé, presse) sont branchés sur un script PHP du site, hébergé chez OVH. Ils seront actifs dès la mise en ligne.

- [ ] **Adresse de réception** : tout arrive sur contact@memoria-experience.fr. Faut-il une autre adresse pour la presse (presse@ est affichée sur la page Presse) ou pour les devis ?

## Authentification des e-mails du domaine (zone DNS OVH)

Ces réglages concernent l’**envoi** d’e-mails au nom de `@memoria-experience.fr` (la réception passe par l’entrée MX `smtp.google.com`, déjà correcte). Ils prouvent aux messageries des destinataires que l’expéditeur est autorisé ; sans eux, les e-mails partent en spam. Trois expéditeurs sont concernés : Gmail (contact@), les formulaires du site (OVH) et 4escape (Mailjet).

Dans l’espace OVH : Web Cloud → Noms de domaine → memoria-experience.fr → Zone DNS.

- [x] **SPF** corrigé le 2 novembre 2026 : `v=spf1 include:_spf.google.com include:mx.ovh.com ~all` (Gmail et OVH autorisés), une seule entrée, publiée sur les serveurs OVH
- [x] **DMARC** ajouté le 2 novembre 2026 : TXT `_dmarc` = `v=DMARC1; p=none`
- [ ] **DKIM Google** : sur admin.google.com → Applications → Google Workspace → Gmail → Authentifier les e-mails → générer l’enregistrement (2048 bits, préfixe `google`) ; l’ajouter chez OVH en TXT, sous-domaine `google._domainkey` ; puis « Commencer l’authentification » côté Google. Nécessite l’accès administrateur Google Workspace du client
- En ligne de commande, depuis l’OVHcloud Shell de l’espace client (déjà authentifié, outil `ovhcloud`) :
  ```sh
  ovhcloud domain-zone record list memoria-experience.fr -o json
  ovhcloud domain-zone record create memoria-experience.fr --field-type TXT --sub-domain google._domainkey --target "VALEUR_FOURNIE_PAR_GOOGLE"
  ovhcloud domain-zone refresh memoria-experience.fr
  ```
  `ovhcloud domain-zone record update` échoue (« failed to validate spec ») : pour modifier une entrée, en créer une nouvelle avec `create`, supprimer l’ancienne avec `record delete <zone> <id>`, puis `refresh` (rien n’est publié avant le `refresh`).
- [ ] **Mailjet (4escape)**, quand Andrea le configure : ajouter `include:spf.mailjet.com` au SPF (`v=spf1 include:_spf.google.com include:mx.ovh.com include:spf.mailjet.com ~all`) et l’enregistrement DKIM fourni par Mailjet
- [ ] **Vérifier** : envoyer un e-mail depuis Gmail vers une autre adresse, puis « Afficher l’original » → SPF, DKIM et DMARC : PASS
- Ne pas toucher : entrées A / AAAA, MX `smtp.google.com`, TXT `google-site-verification`, TXT `1|www…` et `3|welcome` (marqueurs OVH), entrées `ovhmo-selector-*._domainkey` (signature DKIM des e-mails envoyés par OVH). Les entrées héritées de la messagerie OVH (`autoconfig`, `autodiscover`, `imap`, `pop3`, `smtp`, `mail`, `_imaps._tcp`, `_submission._tcp`, `_autodiscover._tcp`) sont sans effet sur Gmail : à laisser pour l’instant. Ne pas lancer l’assistant e-mail OVH, qui remettrait le MX chez OVH

## Hébergement et domaine OVH

- [ ] **Accès FTP** (onglet « FTP - SSH » de l’hébergement) : noter serveur et identifiant, réinitialiser le mot de passe si besoin ; le conserver hors du dépôt
- [ ] Onglet « Multisite » : `memoria-experience.fr` et `www.memoria-experience.fr` → dossier `www`, SSL actif (déjà le cas vu de l’extérieur)
- [ ] Onglet « Scripts e-mail » : statut « Actif »
- [ ] Nom de domaine : renouvellement automatique activé, date d’expiration vérifiée
- [ ] **Après la mise en ligne** : un message de test depuis chaque formulaire, reçu dans Gmail

## Divers

- [ ] Âge minimum et avertissements (grossesse, problèmes cardiaques, épilepsie…), accessibilité PMR : les afficher aussi près des tarifs sur l’accueil, comme sur Panik Room ?
- Mesure d’audience : pas prévue pour l’instant (décision du 2 novembre) ; si elle est ajoutée plus tard, prévoir un bandeau cookies
