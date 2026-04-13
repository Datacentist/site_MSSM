# Site Web — Commune de Marsassoum

## Structure du projet

```
site-mairie/
├── index.html          # Accueil
├── mairie.html         # La Mairie & équipe municipale
├── demarches.html      # Démarches administratives
├── actualites.html     # Actualités & événements
├── territoire.html     # Carte interactive (Leaflet) + statistiques (Chart.js)
├── projets.html        # Projets de développement
├── contact.html        # Formulaire de contact + localisation
│
├── css/
│   └── style.css       # Feuille de style principale (variables CSS, dark mode, responsive)
│
├── js/
│   └── script.js       # JavaScript : dark mode, menu mobile, animations, carte Leaflet, graphiques
│
└── assets/
    ├── images/         # Placer ici les photos de la commune
    └── icons/          # Icônes personnalisées si nécessaire
```

## Bibliothèques utilisées (CDN)
- **Bootstrap Icons 1.11** — icônes vectorielles
- **Leaflet 1.9.4** — carte interactive GeoJSON
- **Chart.js 4.4** — graphiques statistiques
- **Google Fonts** — Playfair Display, Raleway, Source Serif 4

## Fonctionnalités
- Dark mode persistant (localStorage)
- Menu responsive avec hamburger
- Animations au scroll (Intersection Observer)
- Compteurs animés
- Barres de progression animées
- Validation de formulaires
- Carte Leaflet avec couches GeoJSON
- Graphiques statistiques (population, infrastructures, budget)
- Mini-carte de localisation (contact.html)
- Bouton "retour en haut"
