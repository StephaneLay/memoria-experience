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
    var statut = formulaireContact.querySelector('[data-formulaire-statut]');
    var bouton = formulaireContact.querySelector('[type="submit"]');
    var confirmationCible = document.getElementById(formulaireContact.getAttribute('data-confirmation-cible') || '');

    var afficherStatut = function (attribut) {
      statut.textContent = formulaireContact.getAttribute(attribut);
      statut.classList.add('est-active');
    };

    formulaireContact.addEventListener('submit', function (evenement) {
      evenement.preventDefault();
      var action = formulaireContact.getAttribute('action');
      if (!action) {
        if (confirmationCible) afficherConfirmation(formulaireContact, confirmationCible);
        else afficherStatut('data-message');
        return;
      }

      bouton.disabled = true;
      afficherStatut('data-message-envoi');
      fetch(action, { method: 'POST', body: new FormData(formulaireContact), headers: { Accept: 'application/json' } })
        .then(function (reponse) {
          if (reponse.status === 404 || reponse.status === 405) return 'apercu';
          return reponse.json().then(function (resultat) { return resultat.ok ? 'envoye' : 'erreur'; });
        })
        .catch(function () { return 'erreur'; })
        .then(function (issue) {
          bouton.disabled = false;
          if (issue === 'envoye') {
            if (confirmationCible) {
              afficherConfirmation(formulaireContact, confirmationCible);
              statut.textContent = '';
            } else {
              afficherStatut('data-message-succes');
            }
            formulaireContact.reset();
            return;
          }
          afficherStatut(issue === 'apercu' ? 'data-message' : 'data-message-erreur');
        });
    });
  });

  var sommaireLegal = document.querySelector('[data-sommaire-legal]');
  if (sommaireLegal) {
    var ecranLarge = window.matchMedia('(min-width: 901px)');
    var ajusterSommaire = function () {
      sommaireLegal.open = ecranLarge.matches;
    };
    ajusterSommaire();
    ecranLarge.addEventListener('change', ajusterSommaire);

    var liensArticles = sommaireLegal.querySelectorAll('.legal__sommaire-liste a');
    if ('IntersectionObserver' in window) {
      var observateurArticles = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (entree) {
          if (!entree.isIntersecting) return;
          liensArticles.forEach(function (lien) {
            lien.classList.toggle('est-actif', lien.getAttribute('href') === '#' + entree.target.id);
          });
        });
      }, { rootMargin: '-25% 0px -65% 0px' });
      document.querySelectorAll('.legal__section').forEach(function (section) {
        observateurArticles.observe(section);
      });
    }
  }

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

  var modules4escape = document.querySelectorAll('.forescape-catalog, .forescape-cart');
  if (modules4escape.length) {
    var charger4escape = function () {
      var feuille = document.createElement('link');
      feuille.rel = 'stylesheet';
      feuille.href = 'https://widgets.4escape.app/main.css';
      feuille.crossOrigin = 'anonymous';
      document.head.appendChild(feuille);
      var script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://widgets.4escape.app/main.js';
      document.body.appendChild(script);
    };

    if ('IntersectionObserver' in window) {
      var observateur4escape = new IntersectionObserver(function (entrees) {
        if (entrees.some(function (entree) { return entree.isIntersecting; })) {
          observateur4escape.disconnect();
          charger4escape();
        }
      }, { rootMargin: '900px 0px' });
      modules4escape.forEach(function (module) { observateur4escape.observe(module); });
    } else {
      charger4escape();
    }
  }
})();
