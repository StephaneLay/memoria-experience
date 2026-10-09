# Brief projet — expérience immersive d’horreur

## Objectif

Créer un site vitrine statique pour une expérience d’horreur immersive dont l’ouverture est prochaine. Le projet démarre sans contenu client confirmé ni identifiants d’intégration ; le site actuel est donc volontairement une base temporaire et éditable.

## Principes techniques

- HTML, CSS et JavaScript minimal ; aucune dépendance d’exécution côté serveur.
- Sources modifiables dans `src/`, site généré dans `dist/`.
- `node build.js` assemble les pages et injecte les fragments partagés de navigation et de pied de page.
- `src/data/site.json` centralise le nom et l’URL publique. Tant que l’URL n’est pas renseignée, aucun sitemap avec domaine fictif n’est généré.
- Le build tourne localement ou dans l’intégration continue ; l’hébergement reçoit uniquement des fichiers statiques.

## Éléments à confirmer plus tard

- Nom définitif de l’expérience et identité visuelle
- Ville, adresse, dates et horaires d’ouverture
- Public cible, âge minimum, accessibilité et avertissements de contenu
- Durée, déroulé, capacité, tarifs, réservation et coordonnées
- Réseaux sociaux, photos/vidéos, mentions légales et politique de confidentialité
- Hébergeur, domaine, méthode de déploiement, analytics ou autres intégrations

Ne pas ajouter de vraies clés, mots de passe ou jetons au dépôt ; utiliser les secrets de l’hébergeur/CI lorsqu’une intégration sera décidée.
