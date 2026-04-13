/* ============================================================
   COMMUNE DE MARSASSOUM — Script principal
   js/script.js
   ============================================================ */

/* ── 1. DARK MODE ── */
(function initDarkMode() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  // Met à jour l'icône du bouton
  function updateIcon(theme) {
    const btn = document.getElementById('btn-darkmode');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  updateIcon(saved);

  // Exposée globalement pour le bouton onclick
  window.toggleDarkMode = function () {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  };
})();


/* ── 2. MENU MOBILE (hamburger) ── */
document.addEventListener('DOMContentLoaded', function () {

  const hamburger  = document.getElementById('btn-hamburger');
  const navMobile  = document.getElementById('nav-mobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navMobile.classList.toggle('show');
    });

    // Ferme le menu si on clique ailleurs
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
        hamburger.classList.remove('open');
        navMobile.classList.remove('show');
      }
    });
  }


  /* ── 3. LIEN ACTIF DANS LA NAVBAR ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });


  /* ── 4. BOUTON RETOUR EN HAUT ── */
  const btnTop = document.getElementById('btn-top');
  if (btnTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 350) {
        btnTop.classList.add('visible');
      } else {
        btnTop.classList.remove('visible');
      }
    });

    btnTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ── 5. ANIMATIONS AU SCROLL (Intersection Observer) ── */
  const elementsAnimes = document.querySelectorAll('.fade-in, .fade-left, .fade-right');

  if (elementsAnimes.length > 0) {
    const observerOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Délai optionnel via data-delay
          const delay = entry.target.dataset.delay || 0;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elementsAnimes.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* ── 6. BARRES DE PROGRESSION (projets) ── */
  const barres = document.querySelectorAll('.barre-fg');
  if (barres.length > 0) {
    const barreObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const barre  = entry.target;
          const valeur = barre.dataset.valeur || 0;
          barre.style.width = valeur + '%';
          barreObserver.unobserve(barre);
        }
      });
    }, { threshold: 0.4 });

    barres.forEach(function (barre) {
      barre.style.width = '0%';
      barreObserver.observe(barre);
    });
  }


  /* ── 7. VALIDATION DU FORMULAIRE DE CONTACT ── */
  const formContact = document.getElementById('form-contact');
  if (formContact) {
    formContact.addEventListener('submit', function (e) {
      e.preventDefault();
      validerFormulaireContact();
    });
  }

  // Formulaire de démarche (demande de documents)
  const formDemarche = document.getElementById('form-demarche');
  if (formDemarche) {
    formDemarche.addEventListener('submit', function (e) {
      e.preventDefault();
      validerFormulaireDemarche();
    });
  }


  /* ── 8. COMPTEUR ANIMÉ (stats accueil) ── */
  const compteurs = document.querySelectorAll('.chiffre[data-cible]');
  if (compteurs.length > 0) {
    const compteObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animerCompteur(entry.target);
          compteObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    compteurs.forEach(function (c) {
      compteObserver.observe(c);
    });
  }

}); // fin DOMContentLoaded


/* ============================================================
   FONCTIONS UTILITAIRES
   ============================================================ */

/**
 * Anime un compteur numérique
 * @param {HTMLElement} el - élément avec data-cible et data-suffix
 */
function animerCompteur(el) {
  const cible  = parseInt(el.dataset.cible, 10);
  const suffix = el.dataset.suffix || '';
  const duree  = 1800;
  const debut  = performance.now();

  function etape(maintenant) {
    const progres = Math.min((maintenant - debut) / duree, 1);
    const valeur  = Math.floor(easeOut(progres) * cible);
    el.textContent = valeur.toLocaleString('fr-FR') + suffix;
    if (progres < 1) requestAnimationFrame(etape);
  }
  requestAnimationFrame(etape);
}

/** Ease-out quadratic */
function easeOut(t) { return 1 - (1 - t) * (1 - t); }


/**
 * Valide un champ et affiche / masque le message d'erreur
 * @returns {boolean}
 */
function validerChamp(id, condition, msgId) {
  const champ = document.getElementById(id);
  const msg   = document.getElementById(msgId);
  if (!champ) return true;

  const valide = condition(champ.value.trim());
  champ.classList.toggle('erreur', !valide);
  champ.classList.toggle('valide', valide);
  if (msg) msg.classList.toggle('visible', !valide);
  return valide;
}


/** Validation du formulaire de contact */
function validerFormulaireContact() {
  const ok1 = validerChamp('contact-nom',     v => v.length >= 2,          'err-nom');
  const ok2 = validerChamp('contact-email',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'err-email');
  const ok3 = validerChamp('contact-sujet',   v => v.length >= 3,          'err-sujet');
  const ok4 = validerChamp('contact-message', v => v.length >= 10,         'err-message');

  const alerte = document.getElementById('alerte-contact');
  if (ok1 && ok2 && ok3 && ok4) {
    if (alerte) { alerte.textContent = '✅ Votre message a bien été envoyé ! Nous vous répondrons sous 48h.'; alerte.className = 'alerte succes'; }
    document.getElementById('form-contact').reset();
    // Enlève les classes de validation
    document.querySelectorAll('#form-contact .form-control').forEach(el => el.classList.remove('valide'));
  } else {
    if (alerte) { alerte.textContent = '❌ Veuillez corriger les champs en rouge avant d\'envoyer.'; alerte.className = 'alerte echec'; }
  }
}


/** Validation du formulaire de démarche */
function validerFormulaireDemarche() {
  const ok1 = validerChamp('dem-prenom', v => v.length >= 2, 'err-prenom');
  const ok2 = validerChamp('dem-nom',    v => v.length >= 2, 'err-dem-nom');
  const ok3 = validerChamp('dem-type',   v => v !== '',      'err-type');

  const alerte = document.getElementById('alerte-demarche');
  if (ok1 && ok2 && ok3) {
    if (alerte) { alerte.textContent = '✅ Demande enregistrée ! Vous recevrez une confirmation.'; alerte.className = 'alerte succes'; }
    document.getElementById('form-demarche').reset();
    document.querySelectorAll('#form-demarche .form-control').forEach(el => el.classList.remove('valide'));
  } else {
    if (alerte) { alerte.textContent = '❌ Veuillez remplir tous les champs obligatoires.'; alerte.className = 'alerte echec'; }
  }
}


/* ── CARTE LEAFLET (territoire.html) ── */
window.initialiserCarte = function () {
  if (typeof L === 'undefined' || !document.getElementById('carte-territoire')) return;

  /* Centre approximatif de Marsassoum (Sédhiou, Sénégal) */
  const centre = [12.8275, -15.9806];
  const zoom   = 10;

  const carte = L.map('carte-territoire', {
    center: centre,
    zoom: 14,
    zoomControl: true,
    scrollWheelZoom: false
  });

  /* Fonds de carte */
  const fonds = {
    'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 18
    }),
    'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '© Esri',
      maxZoom: 18
    }),
    'Topographique': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap',
      maxZoom: 17
    })
  };
  fonds['OpenStreetMap'].addTo(carte);
  L.control.layers(fonds).addTo(carte);

  /* ── Icônes personnalisées ── */
  function iconeCircle(couleur, emoji) {
    return L.divIcon({
      html: `<div style="
        background:${couleur};
        width:36px;height:36px;
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:1.1rem;
        border:3px solid #fff;
        box-shadow:0 2px 8px rgba(0,0,0,.3);
      ">${emoji}</div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });
  }

  const iconeEcole     = iconeCircle('#2563a8', '🏫');
  const iconeSante     = iconeCircle('#e53e3e', '🏥');
  const iconeMairie    = iconeCircle('#c9a84c', '🏛️');
  const iconeMarche    = iconeCircle('#2e8b57', '🏪');
  const iConeMosquee   = iconeCircle('#6b46c1', '🕌');

  /* ── Données GeoJSON : Points d'intérêt ── */
  const donneesEcoles = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-15.6589, 12.8317] },
        properties: { nom: 'École Élémentaire de Marsassoum', type: 'école', info: 'Cycle élémentaire · 6 classes · ~480 élèves' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-15.6620, 12.8340] },
        properties: { nom: 'CEM Marsassoum', type: 'collège', info: 'Collège d\'Enseignement Moyen · ~620 élèves' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-15.6558, 12.8295] },
        properties: { nom: 'École de Saré Boïré', type: 'école', info: 'École de quartier · 3 classes' } }
    ]
  };

  const donneesSante = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-15.6600, 12.8330] },
        properties: { nom: 'Poste de Santé de Marsassoum', type: 'santé', info: 'Consultations, maternité, vaccinations' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-15.6570, 12.8310] },
        properties: { nom: 'Pharmacie Communautaire', type: 'pharmacie', info: 'Ouverte 7j/7 de 8h à 20h' } }
    ]
  };

  const donneesEquipements = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-15.6595, 12.8320] },
        properties: { nom: 'Mairie de Marsassoum', type: 'mairie', info: 'Hôtel de ville · Ouvert Lun-Ven 8h-16h' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-15.6605, 12.8345] },
        properties: { nom: 'Marché Municipal', type: 'marché', info: 'Marché hebdomadaire chaque lundi' } },
      { type: 'Feature', geometry: { type: 'Point', coordinates: [-15.6580, 12.8328] },
        properties: { nom: 'Grande Mosquée', type: 'mosquée', info: 'Lieu de culte principal de la commune' } }
    ]
  };

  /* ── Route principale (exemple GeoJSON LineString) ── */
  const routePrincipale = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-15.6700, 12.8270],
        [-15.6640, 12.8295],
        [-15.6570, 12.8320],
        [-15.6500, 12.8350]
      ]
    },
    properties: { nom: 'Route Nationale (RN4)', type: 'route' }
  };

  /* ── Périmètre communal (exemple) ── */
  const perimetre = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-15.6800, 12.8150],
        [-15.6800, 12.8500],
        [-15.6400, 12.8500],
        [-15.6400, 12.8150],
        [-15.6800, 12.8150]
      ]]
    },
    properties: { nom: 'Territoire communal de Marsassoum' }
  };

  /* ── Ajout à la carte ── */
  // Périmètre
  L.geoJSON(perimetre, {
    style: { color: '#2563a8', weight: 2.5, dashArray: '8 4', fillColor: '#2563a8', fillOpacity: 0.06 }
  }).bindPopup('<strong>Commune de Marsassoum</strong><br>Département de Sédhiou').addTo(carte);

  // Route
  L.geoJSON(routePrincipale, {
    style: { color: '#c9a84c', weight: 4, opacity: .85 }
  }).bindPopup('<strong>Route Nationale 4</strong><br>Axe principal de desserte').addTo(carte);

  // Écoles
  const coucheEcoles = L.geoJSON(donneesEcoles, {
    pointToLayer: function (f, latlng) { return L.marker(latlng, { icon: iconeEcole }); },
    onEachFeature: popupFeature
  }).addTo(carte);

  // Santé
  const coucheSante = L.geoJSON(donneesSante, {
    pointToLayer: function (f, latlng) {
      const icone = f.properties.type === 'pharmacie' ? iconeCircle('#38a169', '💊') : iconeSante;
      return L.marker(latlng, { icon: icone });
    },
    onEachFeature: popupFeature
  }).addTo(carte);

  // Équipements
  const coucheEquip = L.geoJSON(donneesEquipements, {
    pointToLayer: function (f, latlng) {
      const icons = { mairie: iconeMairie, marché: iconeMarche, mosquée: iConeMosquee };
      return L.marker(latlng, { icon: icons[f.properties.type] || iconeMairie });
    },
    onEachFeature: popupFeature
  }).addTo(carte);

  /* Contrôle couches */
  L.control.layers({}, {
    'Écoles': coucheEcoles,
    'Santé': coucheSante,
    'Équipements': coucheEquip
  }).addTo(carte);

  function popupFeature(feature, layer) {
    if (feature.properties) {
      layer.bindPopup(`
        <div style="font-family:'Raleway',sans-serif;min-width:180px">
          <strong style="color:#1a3a5c;font-size:.95rem">${feature.properties.nom}</strong><br>
          <span style="font-size:.8rem;color:#555">${feature.properties.info || ''}</span>
        </div>
      `);
    }
  }
};

/* ── GRAPHIQUES Chart.js (territoire.html) ── */
window.initialiserGraphiques = function () {
  if (typeof Chart === 'undefined') return;

  // Palette
  const bleu   = '#2563a8';
  const vert   = '#2e8b57';
  const or     = '#c9a84c';
  const rouge  = '#e53e3e';

  // Options communes
  const optsCommunes = {
    responsive: true,
    plugins: {
      legend: { labels: { font: { family: 'Raleway', size: 12 } } }
    }
  };

  /* Graphique 1 : Évolution de la population */
  const ctx1 = document.getElementById('graph-population');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['2000','2004','2008','2012','2016','2020','2024'],
        datasets: [{
          label: 'Population',
          data: [4200, 4850, 5500, 6100, 6900, 7600, 8500],
          borderColor: bleu,
          backgroundColor: 'rgba(37,99,168,.08)',
          borderWidth: 3,
          pointBackgroundColor: bleu,
          pointRadius: 5,
          tension: 0.4,
          fill: true
        }]
      },
      options: { ...optsCommunes, scales: { y: { beginAtZero: false, min: 3000 } } }
    });
  }

  /* Graphique 2 : Répartition des infrastructures */
  const ctx2 = document.getElementById('graph-infras');
  if (ctx2) {
    new Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: ['Écoles','Santé','Routes (km)','Forages','Marchés'],
        datasets: [{
          data: [5, 3, 28, 8, 2],
          backgroundColor: [bleu, rouge, or, vert, '#9b59b6'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: optsCommunes
    });
  }

  /* Graphique 3 : Budget communal */
  const ctx3 = document.getElementById('graph-budget');
  if (ctx3) {
    new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: ['Éducation','Santé','Infrastructures','Agriculture','Administration','Autres'],
        datasets: [{
          label: 'Budget alloué (en millions FCFA)',
          data: [45, 32, 78, 25, 30, 15],
          backgroundColor: [bleu, rouge, or, vert, '#6b46c1', '#718096'],
          borderRadius: 6
        }]
      },
      options: { ...optsCommunes, scales: { y: { beginAtZero: true } } }
    });
  }
};
