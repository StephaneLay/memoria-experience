(function () {
  var racine = document.documentElement;
  var langue = racine.lang || 'fr';
  var reduireAnimations = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = document.querySelector('[data-header]');
  var burger = document.querySelector('[data-menu-toggle]');
  var nav = document.getElementById('site-nav');

  function fermerMenu() {
    if (!header || !header.classList.contains('menu-ouvert')) return;
    basculerMenu(false);
  }

  function basculerMenu(ouvert) {
    var libelle = burger.querySelector('[data-label-open]');
    header.classList.toggle('menu-ouvert', ouvert);
    document.body.classList.toggle('sans-defilement', ouvert);
    burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    libelle.textContent = libelle.getAttribute(ouvert ? 'data-label-close' : 'data-label-open');
  }

  if (header && burger && nav) {
    burger.addEventListener('click', function () {
      basculerMenu(!header.classList.contains('menu-ouvert'));
    });

    nav.addEventListener('click', function (evenement) {
      if (evenement.target.closest('a')) fermerMenu();
    });

    window.matchMedia('(min-width: 1100px)').addEventListener('change', fermerMenu);
  }

  var sousMenus = document.querySelectorAll('[data-sous-menu]');
  sousMenus.forEach(function (groupe) {
    var bouton = groupe.querySelector('button');
    bouton.addEventListener('click', function () {
      bouton.setAttribute('aria-expanded', bouton.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    });
    groupe.addEventListener('focusout', function (evenement) {
      if (!groupe.contains(evenement.relatedTarget) && window.innerWidth >= 1100) {
        bouton.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', function (evenement) {
    sousMenus.forEach(function (groupe) {
      if (!groupe.contains(evenement.target) && window.innerWidth >= 1100) {
        groupe.querySelector('button').setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', function (evenement) {
    if (evenement.key !== 'Escape') return;
    fermerMenu();
    sousMenus.forEach(function (groupe) {
      groupe.querySelector('button').setAttribute('aria-expanded', 'false');
    });
  });

  var pageCourante = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a[href]').forEach(function (lien) {
    if (lien.getAttribute('href') !== pageCourante) return;
    lien.setAttribute('aria-current', 'page');
    var groupe = lien.closest('[data-sous-menu]');
    if (groupe) groupe.querySelector('button').classList.add('est-courant');
  });

  document.querySelectorAll('[data-langue]').forEach(function (lien) {
    if (lien.getAttribute('data-langue') === langue) lien.setAttribute('aria-current', 'true');
  });

  document.querySelectorAll('[data-annee]').forEach(function (annee) {
    annee.textContent = String(new Date().getFullYear());
  });

  if (!reduireAnimations && 'IntersectionObserver' in window) {
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          entree.target.classList.add('est-visible');
          observateur.unobserve(entree.target);
        }
      });
    }, { rootMargin: '0px 0px -60px', threshold: 0.08 });

    document.querySelectorAll('[data-reveal]').forEach(function (bloc) {
      var freres = Array.prototype.filter.call(bloc.parentElement.children, function (enfant) {
        return enfant.hasAttribute('data-reveal');
      });
      var rang = freres.indexOf(bloc);
      if (rang > 0) bloc.style.setProperty('--delai', Math.min(rang * 110, 440) + 'ms');
      bloc.classList.add('reveal');
      observateur.observe(bloc);
    });
  }

  var parallaxes = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var heroMedia = document.querySelector('[data-hero-media]');
  var heroContenu = document.querySelector('[data-hero-contenu]');
  var defilementPrevu = false;

  function majDefilement() {
    defilementPrevu = false;
    var y = window.scrollY;
    var hauteur = window.innerHeight;

    if (header) header.classList.toggle('is-compact', y > 40);
    if (reduireAnimations) return;

    if (heroMedia && y < hauteur * 1.3) {
      heroMedia.style.transform = 'translate3d(0, ' + (y * 0.5).toFixed(1) + 'px, 0)';
      if (heroContenu) {
        heroContenu.style.transform = 'translate3d(0, ' + (y * 0.28).toFixed(1) + 'px, 0)';
        heroContenu.style.opacity = Math.max(0, 1 - y / (hauteur * 0.7)).toFixed(3);
      }
    }

    parallaxes.forEach(function (element) {
      var parent = element.parentElement;
      var cadre = parent.getBoundingClientRect();
      if (cadre.bottom < -200 || cadre.top > hauteur + 200) return;
      var vitesse = parseFloat(element.getAttribute('data-parallax')) || 0;
      var decalage = (cadre.top + cadre.height / 2 - hauteur / 2) * -vitesse;
      var marge = (element.offsetHeight - parent.offsetHeight) / 2;
      if (marge > 0) decalage = Math.max(-marge, Math.min(marge, decalage));
      element.style.transform = 'translate3d(0, ' + decalage.toFixed(1) + 'px, 0)';
    });
  }

  function prevoirDefilement() {
    if (!defilementPrevu) {
      defilementPrevu = true;
      window.requestAnimationFrame(majDefilement);
    }
  }

  window.addEventListener('scroll', prevoirDefilement, { passive: true });
  window.addEventListener('resize', prevoirDefilement);
  majDefilement();

  var toile = document.querySelector('[data-poussiere]');
  if (toile && toile.getContext && !reduireAnimations) {
    var contexte = toile.getContext('2d');
    var particules = [];
    var largeur = 0;
    var hauteurToile = 0;
    var active = false;

    var dimensionner = function () {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      largeur = toile.offsetWidth;
      hauteurToile = toile.offsetHeight;
      toile.width = Math.round(largeur * ratio);
      toile.height = Math.round(hauteurToile * ratio);
      contexte.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    var creerParticule = function (partout) {
      return {
        x: Math.random() * largeur,
        y: partout ? Math.random() * hauteurToile : hauteurToile + 10,
        rayon: Math.random() * 1.5 + 0.35,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(Math.random() * 0.22 + 0.04),
        opacite: Math.random() * 0.45 + 0.12,
        phase: Math.random() * Math.PI * 2
      };
    };

    var dessiner = function (temps) {
      if (!active) return;
      contexte.clearRect(0, 0, largeur, hauteurToile);
      contexte.fillStyle = '#f4e6c8';
      particules.forEach(function (particule, index) {
        particule.x += particule.vx + Math.sin(temps / 2800 + particule.phase) * 0.09;
        particule.y += particule.vy;
        if (particule.y < -10) particules[index] = creerParticule(false);
        contexte.globalAlpha = particule.opacite * (0.55 + 0.45 * Math.sin(temps / 700 + particule.phase));
        contexte.beginPath();
        contexte.arc(particule.x, particule.y, particule.rayon, 0, Math.PI * 2);
        contexte.fill();
      });
      window.requestAnimationFrame(dessiner);
    };

    dimensionner();
    for (var i = 0, total = largeur < 700 ? 34 : 70; i < total; i++) particules.push(creerParticule(true));
    window.addEventListener('resize', dimensionner);

    new IntersectionObserver(function (entrees) {
      var visible = entrees[0].isIntersecting && !document.hidden;
      if (visible && !active) {
        active = true;
        window.requestAnimationFrame(dessiner);
      } else if (!visible) {
        active = false;
      }
    }).observe(toile);
  }

  var interrupteur = document.querySelector('[data-lampe-interrupteur]');
  var couchesLampe = document.querySelectorAll('[data-lampe-ombre], [data-lampe-lueur]');
  var eclat = document.querySelector('[data-eclat]');
  if (interrupteur && couchesLampe.length && window.matchMedia('(any-hover: hover)').matches) {
    var cibleX = window.innerWidth / 2;
    var cibleY = window.innerHeight / 2;
    var lampeX = cibleX;
    var lampeY = cibleY;
    var suiviPrevu = null;

    var placerHalo = function () {
      var position = 'translate3d(' + lampeX.toFixed(1) + 'px, ' + lampeY.toFixed(1) + 'px, 0)';
      couchesLampe.forEach(function (couche) {
        couche.style.transform = position;
      });
      if (eclat) {
        var cadreEclat = eclat.getBoundingClientRect();
        eclat.style.setProperty('--lampe-x', (lampeX - cadreEclat.left).toFixed(1) + 'px');
        eclat.style.setProperty('--lampe-y', (lampeY - cadreEclat.top).toFixed(1) + 'px');
      }
    };

    var suivre = function () {
      lampeX += (cibleX - lampeX) * (reduireAnimations ? 1 : 0.2);
      lampeY += (cibleY - lampeY) * (reduireAnimations ? 1 : 0.2);
      placerHalo();
      var enMouvement = Math.abs(cibleX - lampeX) > 0.5 || Math.abs(cibleY - lampeY) > 0.5;
      suiviPrevu = enMouvement ? window.requestAnimationFrame(suivre) : null;
    };

    var viser = function (x, y) {
      cibleX = x;
      cibleY = y;
      if (!suiviPrevu) suiviPrevu = window.requestAnimationFrame(suivre);
    };

    var lampeAllumee = function () {
      return racine.classList.contains('lampe-active');
    };

    var basculerLampe = function (allumee) {
      racine.classList.toggle('lampe-active', allumee);
      interrupteur.setAttribute('aria-pressed', allumee ? 'true' : 'false');
      try {
        window.localStorage.setItem('memoria-lampe', allumee ? '1' : '0');
      } catch (erreur) {}
    };

    interrupteur.addEventListener('click', function (evenement) {
      if (!lampeAllumee() && evenement.clientX) {
        lampeX = cibleX = evenement.clientX;
        lampeY = cibleY = evenement.clientY;
        placerHalo();
      }
      basculerLampe(!lampeAllumee());
    });

    document.addEventListener('pointermove', function (evenement) {
      if (lampeAllumee()) viser(evenement.clientX, evenement.clientY);
    }, { passive: true });

    window.addEventListener('scroll', function () {
      if (lampeAllumee() && eclat) placerHalo();
    }, { passive: true });

    document.addEventListener('focusin', function (evenement) {
      if (!lampeAllumee() || evenement.target === interrupteur) return;
      var cadreFocus = evenement.target.getBoundingClientRect();
      viser(cadreFocus.left + cadreFocus.width / 2, cadreFocus.top + cadreFocus.height / 2);
    });

    placerHalo();
    try {
      if (window.localStorage.getItem('memoria-lampe') === '1') basculerLampe(true);
    } catch (erreur) {}
  } else if (interrupteur) {
    interrupteur.hidden = true;
  }

  var dialogue = document.querySelector('[data-video]');
  if (dialogue && typeof dialogue.showModal === 'function') {
    var cadreVideo = dialogue.querySelector('[data-video-cadre]');
    var contenuInitial = cadreVideo.innerHTML;

    document.querySelectorAll('[data-video-ouvrir]').forEach(function (bouton) {
      bouton.addEventListener('click', function () {
        var identifiant = dialogue.getAttribute('data-youtube');
        if (identifiant) {
          cadreVideo.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(identifiant)
            + '?autoplay=1&rel=0" title="' + dialogue.getAttribute('aria-label')
            + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
        }
        dialogue.showModal();
      });
    });

    dialogue.querySelector('[data-video-fermer]').addEventListener('click', function () {
      dialogue.close();
    });
    dialogue.addEventListener('click', function (evenement) {
      if (evenement.target === dialogue) dialogue.close();
    });
    dialogue.addEventListener('close', function () {
      cadreVideo.innerHTML = contenuInitial;
    });
  }

  var afficherConfirmation = function (formulaireEnvoye, confirmation) {
    var prenom = formulaireEnvoye.querySelector('[data-prenom]');
    var emplacementPrenom = confirmation.querySelector('[data-confirmation-prenom]');
    if (emplacementPrenom) {
      emplacementPrenom.textContent = prenom && prenom.value.trim() ? ', ' + prenom.value.trim() : '';
    }
    formulaireEnvoye.hidden = true;
    confirmation.hidden = false;
    confirmation.focus({ preventScroll: true });
    confirmation.scrollIntoView({ block: 'center', behavior: reduireAnimations ? 'auto' : 'smooth' });
  };

  document.querySelectorAll('[data-confirmation-retour]').forEach(function (bouton) {
    bouton.addEventListener('click', function () {
      var confirmation = bouton.closest('.confirmation');
      var formulaireLie = document.querySelector('[data-confirmation-cible="' + confirmation.id + '"]');
      formulaireLie.reset();
      confirmation.hidden = true;
      formulaireLie.hidden = false;
      var premierChamp = formulaireLie.querySelector('input, select, textarea');
      if (premierChamp) premierChamp.focus();
    });
  });

  var champSujet = document.querySelector('[data-sujet]');
  if (champSujet) {
    var sujetDemande = (new URLSearchParams(window.location.search).get('sujet') || '').replace(/[^a-z-]/g, '');
    if (sujetDemande && champSujet.querySelector('option[value="' + sujetDemande + '"]')) champSujet.value = sujetDemande;
  }

  document.querySelectorAll('[data-formulaire]').forEach(function (formulaireContact) {
    formulaireContact.addEventListener('submit', function (evenement) {
      if (formulaireContact.getAttribute('action')) return;
      evenement.preventDefault();
      var confirmationCible = document.getElementById(formulaireContact.getAttribute('data-confirmation-cible') || '');
      if (confirmationCible) {
        afficherConfirmation(formulaireContact, confirmationCible);
        return;
      }
      var statut = formulaireContact.querySelector('[data-formulaire-statut]');
      statut.textContent = formulaireContact.getAttribute('data-message');
      statut.classList.add('est-active');
    });
  });

  var faq = document.querySelector('[data-faq]');
  if (faq) {
    var recherche = faq.querySelector('[data-faq-recherche]');
    var aucunResultat = faq.querySelector('[data-faq-aucun]');
    var normaliser = function (texte) {
      return texte.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    var questions = Array.prototype.map.call(faq.querySelectorAll('[data-question]'), function (question) {
      return { element: question, texte: normaliser(question.textContent) };
    });

    recherche.addEventListener('input', function () {
      var termes = normaliser(recherche.value.trim()).split(/\s+/).filter(Boolean);
      var trouvees = 0;
      questions.forEach(function (question) {
        var visible = termes.every(function (terme) {
          return question.texte.indexOf(terme) !== -1;
        });
        question.element.hidden = !visible;
        question.element.open = termes.length > 0 && visible;
        if (visible) trouvees++;
      });
      faq.querySelectorAll('[data-categorie]').forEach(function (categorie) {
        categorie.hidden = !categorie.querySelector('[data-question]:not([hidden])');
      });
      aucunResultat.hidden = trouvees > 0;
    });

    var liensCategories = faq.querySelectorAll('.faq-sommaire__lien');
    if ('IntersectionObserver' in window) {
      var observateurCategories = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (entree) {
          if (!entree.isIntersecting) return;
          liensCategories.forEach(function (lien) {
            lien.classList.toggle('est-actif', lien.getAttribute('href') === '#' + entree.target.id);
          });
        });
      }, { rootMargin: '-35% 0px -55% 0px' });
      faq.querySelectorAll('[data-categorie]').forEach(function (categorie) {
        observateurCategories.observe(categorie);
      });
    }
  }

  var choixFormule = document.querySelector('[data-formule-devis]');
  document.querySelectorAll('[data-choisir-formule]').forEach(function (lien) {
    lien.addEventListener('click', function () {
      if (choixFormule) choixFormule.value = lien.getAttribute('data-choisir-formule');
    });
  });

  if (reduireAnimations) {
    document.querySelectorAll('[data-video-fond]').forEach(function (video) {
      video.removeAttribute('autoplay');
      video.pause();
    });
  }

  var bonCadeau = document.querySelector('[data-bon-cadeau]');
  if (bonCadeau) {
    var formatEuros = new Intl.NumberFormat(langue, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    var montantLibre = bonCadeau.querySelector('[data-montant-libre]');
    var formules = bonCadeau.querySelectorAll('input[name="formule"]');
    var apercu = function (nom) {
      return bonCadeau.querySelector('[data-bon="' + nom + '"]');
    };

    var majFormule = function () {
      var choisie = bonCadeau.querySelector('input[name="formule"]:checked');
      bonCadeau.querySelectorAll('.formule').forEach(function (carte) {
        carte.classList.toggle('est-choisie', carte.contains(choisie));
      });
      if (!choisie) return;
      var montant = choisie.getAttribute('data-montant');
      if (!montant) montant = formatEuros.format(Math.max(10, Number(montantLibre.value) || 10));
      apercu('formule').textContent = choisie.getAttribute('data-libelle');
      apercu('montant').textContent = montant;
    };

    formules.forEach(function (formule) {
      formule.addEventListener('change', majFormule);
    });

    ['focus', 'input'].forEach(function (type) {
      montantLibre.addEventListener(type, function () {
        bonCadeau.querySelector('input[name="formule"][value="libre"]').checked = true;
        majFormule();
      });
    });

    bonCadeau.querySelectorAll('[data-bon-champ]').forEach(function (champ) {
      champ.addEventListener('input', function () {
        var cible = apercu(champ.getAttribute('data-bon-champ'));
        cible.textContent = champ.value.trim() || cible.getAttribute('data-defaut');
      });
    });

    majFormule();
  }

  var formulaire = document.querySelector('[data-reservation]');
  if (formulaire) {
    var calendrier = formulaire.querySelector('[data-calendrier]');
    var grille = calendrier.querySelector('[data-grille]');
    var libelleMois = calendrier.querySelector('[data-mois-libelle]');
    var precedent = calendrier.querySelector('[data-mois="-1"]');
    var aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);
    var premierMois = new Date(aujourdHui.getFullYear(), aujourdHui.getMonth(), 1);
    var dernierMois = new Date(aujourdHui.getFullYear(), aujourdHui.getMonth() + 6, 1);
    var moisAffiche = new Date(premierMois);
    var dateChoisie = null;
    var formatMois = new Intl.DateTimeFormat(langue, { month: 'long', year: 'numeric' });
    var formatJour = new Intl.DateTimeFormat(langue, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    var formatInitiale = new Intl.DateTimeFormat(langue, { weekday: 'narrow' });

    var joursSemaine = calendrier.querySelector('[data-jours-semaine]');
    for (var jour = 0; jour < 7; jour++) {
      var initiale = document.createElement('span');
      initiale.textContent = formatInitiale.format(new Date(2024, 0, 1 + jour));
      joursSemaine.appendChild(initiale);
    }

    var estOuvert = function (date) {
      return date.getDay() !== 1 && date.getDay() !== 2;
    };

    var afficherMois = function () {
      var annee = moisAffiche.getFullYear();
      var mois = moisAffiche.getMonth();
      libelleMois.textContent = formatMois.format(moisAffiche);
      precedent.disabled = moisAffiche <= premierMois;
      calendrier.querySelector('[data-mois="1"]').disabled = moisAffiche >= dernierMois;
      grille.innerHTML = '';

      for (var vide = (new Date(annee, mois, 1).getDay() + 6) % 7; vide > 0; vide--) {
        grille.appendChild(document.createElement('span'));
      }

      for (var numero = 1, total = new Date(annee, mois + 1, 0).getDate(); numero <= total; numero++) {
        var date = new Date(annee, mois, numero);
        var bouton = document.createElement('button');
        var etiquette = formatJour.format(date);
        bouton.type = 'button';
        bouton.className = 'calendrier__jour';
        bouton.textContent = String(numero);
        bouton.setAttribute('data-date', String(date.getTime()));
        if (date < aujourdHui || !estOuvert(date)) {
          bouton.disabled = true;
          if (!estOuvert(date)) etiquette += ' (' + calendrier.getAttribute('data-ferme') + ')';
        }
        if (date.getTime() === aujourdHui.getTime()) bouton.classList.add('est-aujourdhui');
        bouton.setAttribute('aria-label', etiquette);
        bouton.setAttribute('aria-pressed', dateChoisie && dateChoisie.getTime() === date.getTime() ? 'true' : 'false');
        grille.appendChild(bouton);
      }
    };

    grille.addEventListener('click', function (evenement) {
      var bouton = evenement.target.closest('.calendrier__jour');
      if (!bouton || bouton.disabled) return;
      dateChoisie = new Date(Number(bouton.getAttribute('data-date')));
      grille.querySelectorAll('.calendrier__jour').forEach(function (autre) {
        autre.setAttribute('aria-pressed', autre === bouton ? 'true' : 'false');
      });
    });

    calendrier.querySelectorAll('[data-mois]').forEach(function (navigation) {
      navigation.addEventListener('click', function () {
        moisAffiche = new Date(moisAffiche.getFullYear(), moisAffiche.getMonth() + Number(navigation.getAttribute('data-mois')), 1);
        afficherMois();
      });
    });

    var creneaux = formulaire.querySelectorAll('.creneau');
    creneaux.forEach(function (creneau) {
      creneau.addEventListener('click', function () {
        creneaux.forEach(function (autre) {
          autre.setAttribute('aria-pressed', autre === creneau ? 'true' : 'false');
        });
      });
    });

    formulaire.addEventListener('submit', function (evenement) {
      evenement.preventDefault();
      var note = formulaire.querySelector('[data-reservation-note]');
      note.textContent = formulaire.getAttribute('data-message');
      note.classList.add('est-active');
    });

    afficherMois();
  }
})();
