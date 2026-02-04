# meteo-aura

Application meteo complete et moderne, construite avec Next.js 16 et l'API Open-Meteo. Projet portfolio demonstrant une architecture propre, une UI soignee et les meilleures pratiques de developpement.

## Fonctionnalites

- Recherche de villes avec autocompletion et historique
- Meteo actuelle detaillee (temperature, ressenti, humidite, vent, pression, UV, etc.)
- Previsions horaires sur 48h avec graphiques interactifs
- Previsions sur 7 jours avec lever/coucher du soleil
- Systeme de favoris avec persistance locale
- Unites configurables (Celsius/Fahrenheit, km/h/mph)
- Format heure 24h/12h
- Theme clair/sombre/systeme
- Interface responsive mobile-first
- PWA installable avec mode offline
- Fond dynamique selon la meteo et le jour/nuit
- URL partageable avec parametres

## Stack technique

| Categorie | Technologies |
|-----------|--------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| Animations | Framer Motion |
| Graphiques | Recharts |
| Validation | Zod |
| API | Open-Meteo (gratuit, sans cle API) |
| Tests | Vitest, Testing Library, Playwright |
| Qualite | ESLint, Prettier |
| CI/CD | GitHub Actions |

## Installation

```bash
# cloner le repo
git clone https://github.com/kskerim/meteoweb.git
cd meteo-aura

# installer les dependances
npm install

# lancer en developpement
npm run dev
```

L'application sera disponible sur http://localhost:3000

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance le serveur de developpement |
| `npm run build` | Build de production |
| `npm run start` | Lance le serveur de production |
| `npm run lint` | Lint avec ESLint |
| `npm run format` | Formate avec Prettier |
| `npm run format:check` | Verifie le formatage |
| `npm run test` | Lance les tests unitaires |
| `npm run test:watch` | Tests en mode watch |
| `npm run test:e2e` | Lance les tests e2e |
| `npm run test:e2e:ui` | Tests e2e avec UI Playwright |

## Structure du projet

```
src/
  app/
    api/
      geocoding/route.ts    # api recherche villes
      weather/route.ts      # api meteo avec cache
    city/page.tsx           # page meteo ville
    favorites/page.tsx      # page favoris
    about/page.tsx          # page a propos
    layout.tsx              # layout principal
    page.tsx                # page accueil
  components/
    ui/                     # composants shadcn/ui
    providers/              # context providers
    *.tsx                   # composants metier
  lib/
    weather-codes.ts        # mapping codes WMO
    formatters.ts           # formatage donnees
    storage.ts              # helpers localStorage
    open-meteo.ts           # client API
    utils.ts                # utilitaires
  types/
    weather.ts              # types TypeScript
  tests/
    e2e/                    # tests Playwright
    *.test.ts               # tests unitaires
```

## Exemples d'URLs

- Accueil: `/`
- Ville: `/city?lat=48.8566&lon=2.3522&name=Paris&country=France`
- Favoris: `/favorites`
- A propos: `/about`

## API utilisees

Cette application utilise Open-Meteo, une API meteo gratuite et open source:

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

Aucune cle API n'est necessaire.

## Decisions techniques

1. **App Router**: utilisation du nouveau router Next.js pour beneficier des server components et du streaming
2. **Route handlers**: les appels API passent par des route handlers pour normaliser les donnees et gerer le cache
3. **localStorage**: les favoris et preferences sont stockes localement pour une experience sans compte utilisateur
4. **shadcn/ui**: composants accessibles et personnalisables plutot qu'une librairie complete
5. **Recharts**: librairie de graphiques declarative compatible React 19
6. **Framer Motion**: animations fluides avec support de prefers-reduced-motion

## Limites connues

- Les donnees dependent de la precision d'Open-Meteo
- Pas d'alertes meteo en temps reel
- Historique de recherche limite a 10 elements
- Les icones PWA sont des placeholders SVG

## Roadmap

- [ ] Carte interactive avec couches meteo
- [ ] Alertes et notifications push
- [ ] Widget meteo embarquable
- [ ] Mode comparaison de villes
- [ ] Donnees de qualite de l'air
- [ ] Support multilingue
- [ ] Widgets pour ecran d'accueil mobile

## Licence

MIT
