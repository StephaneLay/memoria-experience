<?php

$DESTINATAIRE = 'contact@memoria-experience.fr';
$EXPEDITEUR = 'Site Memoria <site@memoria-experience.fr>';
$ENVOIS_PAR_HEURE = 5;

$FORMULAIRES = array(
    'contact' => array(
        'titre' => 'Message',
        'objet' => 'sujet',
        'obligatoires' => array('prenom', 'nom', 'email', 'sujet', 'message'),
        'champs' => array(
            'prenom' => 'Prénom',
            'nom' => 'Nom',
            'email' => 'E-mail',
            'telephone' => 'Téléphone',
            'sujet' => 'Sujet',
            'message' => 'Message',
        ),
    ),
    'team-building' => array(
        'titre' => 'Demande de devis team building',
        'objet' => 'entreprise',
        'obligatoires' => array('prenom', 'nom', 'entreprise', 'email', 'participants', 'formule'),
        'champs' => array(
            'prenom' => 'Prénom',
            'nom' => 'Nom',
            'entreprise' => 'Entreprise',
            'email' => 'E-mail',
            'telephone' => 'Téléphone',
            'participants' => 'Participants',
            'periode' => 'Date ou période',
            'formule' => 'Formule',
            'privatisation' => 'Privatisation',
            'cocktail' => 'Cocktail',
            'budget' => 'Budget',
            'demandes' => 'Demandes particulières',
            'message' => 'Message',
        ),
    ),
    'pack-personnalise' => array(
        'titre' => 'Pack personnalisé',
        'objet' => 'type',
        'obligatoires' => array('nom', 'type', 'email', 'demande'),
        'champs' => array(
            'nom' => 'Nom et prénom',
            'type' => 'Événement',
            'email' => 'E-mail',
            'telephone' => 'Téléphone',
            'date' => 'Date souhaitée',
            'participants' => 'Participants',
            'budget' => 'Budget',
            'demande' => 'Demande',
            'infos' => 'Informations supplémentaires',
        ),
    ),
    'presse' => array(
        'titre' => 'Demande presse',
        'objet' => 'societe',
        'obligatoires' => array('nom', 'societe', 'email', 'type', 'message'),
        'champs' => array(
            'nom' => 'Nom et prénom',
            'societe' => 'Média ou société',
            'email' => 'E-mail',
            'telephone' => 'Téléphone',
            'type' => 'Type de demande',
            'date' => 'Date souhaitée',
            'lien' => 'Lien',
            'message' => 'Demande',
        ),
    ),
);

$LIBELLES = array(
    'reservation' => 'Question sur une réservation',
    'modification' => 'Modification ou annulation',
    'bon-cadeau' => 'Bon cadeau',
    'pack-personnalise' => 'Pack personnalisé',
    'team-building' => 'Team building',
    'presse' => 'Presse ou influenceur',
    'technique' => 'Problème technique',
    'accessibilite' => 'Accessibilité',
    'autre' => 'Autre demande',
    'experience' => 'Expérience seule',
    'experience-cocktail' => 'Expérience et cocktail',
    'privatisation' => 'Privatisation',
    'evenement' => 'Événement personnalisé',
    'devis' => 'Demande de devis',
    'informations' => 'Demande d’informations',
    'oui' => 'Oui',
    'non' => 'Non',
    'a-definir' => 'À définir',
);

function repondre($ok, $code, $erreur = '')
{
    $accepte = isset($_SERVER['HTTP_ACCEPT']) ? $_SERVER['HTTP_ACCEPT'] : '';
    if (strpos($accepte, 'application/json') !== false) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array('ok' => $ok, 'erreur' => $erreur));
        exit;
    }
    $retour = '/';
    if (!empty($_SERVER['HTTP_REFERER'])) {
        $origine = parse_url($_SERVER['HTTP_REFERER']);
        if (isset($origine['host'], $origine['path'], $_SERVER['HTTP_HOST']) && $origine['host'] === preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'])) {
            $retour = $origine['path'];
        }
    }
    header('Location: ' . $retour . '?envoi=' . ($ok ? 'ok' : $erreur), true, 303);
    exit;
}

function tronquer($texte, $longueur)
{
    return preg_match('/^.{0,' . $longueur . '}/su', $texte, $debut) ? $debut[0] : substr($texte, 0, $longueur);
}

function lire($nom)
{
    if (!isset($_POST[$nom]) || !is_string($_POST[$nom])) {
        return '';
    }
    $valeur = trim(str_replace(array("\0", "\r\n", "\r"), array('', "\n", "\n"), $_POST[$nom]));
    return tronquer($valeur, 5000);
}

function surUneLigne($texte)
{
    return trim((string) preg_replace('/\s+/u', ' ', $texte));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    repondre(false, 405, 'methode');
}

if (lire('site_web') !== '') {
    repondre(true, 200);
}

$type = lire('formulaire');
if (!isset($FORMULAIRES[$type])) {
    repondre(false, 400, 'champs');
}
$formulaire = $FORMULAIRES[$type];

$valeurs = array();
foreach ($formulaire['champs'] as $champ => $libelle) {
    $valeurs[$champ] = lire($champ);
}
foreach ($formulaire['obligatoires'] as $champ) {
    if ($valeurs[$champ] === '') {
        repondre(false, 422, 'champs');
    }
}
if (lire('consentement') === '' || !filter_var($valeurs['email'], FILTER_VALIDATE_EMAIL)) {
    repondre(false, 422, 'champs');
}

$adresse = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'inconnue';
$journal = rtrim(sys_get_temp_dir(), '/') . '/memoria-formulaires-' . md5($adresse);
$maintenant = time();
$envois = array();
if (is_file($journal)) {
    foreach (explode("\n", (string) @file_get_contents($journal)) as $horodatage) {
        if ((int) $horodatage > $maintenant - 3600) {
            $envois[] = (int) $horodatage;
        }
    }
}
if (count($envois) >= $ENVOIS_PAR_HEURE) {
    repondre(false, 429, 'limite');
}

date_default_timezone_set('Europe/Paris');

$lignes = array();
foreach ($formulaire['champs'] as $champ => $libelle) {
    $valeur = $valeurs[$champ];
    if ($valeur === '') {
        continue;
    }
    if (isset($LIBELLES[$valeur])) {
        $valeur = $LIBELLES[$valeur];
    }
    $lignes[] = strpos($valeur, "\n") === false
        ? $libelle . ' : ' . $valeur
        : $libelle . " :\n" . $valeur . "\n";
}

$langue = lire('langue') === 'en' ? 'anglaise' : 'française';
$corps = implode("\n", $lignes) . "\n\n"
       . "--\n"
       . 'Formulaire « ' . $formulaire['titre'] . ' » du site memoria-experience.fr (version ' . $langue . "),\n"
       . 'envoyé le ' . date('d/m/Y à H:i') . ' depuis l’adresse IP ' . $adresse . ".\n"
       . 'Pour répondre, utilisez simplement « Répondre » : le message partira vers ' . $valeurs['email'] . '.';

$precision = $valeurs[$formulaire['objet']];
if (isset($LIBELLES[$precision])) {
    $precision = $LIBELLES[$precision];
}
$sujet = '[Site Memoria] ' . $formulaire['titre'] . ' — ' . tronquer(surUneLigne($precision), 120);

$entetes = 'From: ' . $EXPEDITEUR . "\r\n"
         . 'Reply-To: ' . $valeurs['email'] . "\r\n"
         . "MIME-Version: 1.0\r\n"
         . "Content-Type: text/plain; charset=utf-8\r\n"
         . "Content-Transfer-Encoding: 8bit\r\n";

$envoye = @mail($DESTINATAIRE, '=?UTF-8?B?' . base64_encode($sujet) . '?=', $corps, $entetes);

if (!$envoye) {
    repondre(false, 500, 'envoi');
}

$envois[] = $maintenant;
@file_put_contents($journal, implode("\n", $envois));

repondre(true, 200);
