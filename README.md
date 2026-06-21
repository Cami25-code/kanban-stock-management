# Kanban Stock — Application de gestion de stock

Application web de gestion de stock de type Kanban : inventaire, fournisseurs, commandes d'approvisionnement, gestion multi-magasins, tableau de bord et rapports. Le back-end expose une API REST sécurisée, le front-end est une application monopage (SPA) réactive.

**Auteur :** Ibrahima Camara — [@Cami25-code](https://github.com/Cami25-code) · ibrahima.dev@proton.me

---

## Aperçu fonctionnel

- **Authentification** : inscription, connexion et déconnexion sécurisées par token.
- **Inventaire** : catégories et produits, avec suivi de la disponibilité (en stock / stock faible / rupture) selon la quantité et le seuil d'alerte.
- **Fournisseurs** : gestion complète des fournisseurs et de leurs produits.
- **Commandes** : commandes d'approvisionnement et mise à jour automatique du stock à la réception.
- **Multi-magasins** : répartition du stock par magasin via une relation pivot.
- **Tableau de bord** : indicateurs clés et graphiques de synthèse (ventes, achats, commandes).
- **Rapports** : meilleures catégories, produits les plus vendus, évolution du chiffre d'affaires et du profit.

## Stack technique

| Côté | Technologies |
|------|--------------|
| Front-end | React, React Router, Recoil (état global), Axios, Recharts, Sonner (notifications), CSS |
| Back-end | Laravel (API REST), Laravel Sanctum (authentification par token Bearer) |
| Base de données | MySQL |
| Déploiement | Docker, Docker Compose, Nginx |

## Architecture du dépôt

```
.
├── backend/            # API Laravel
├── frontend/           # Application React
├── docker-compose.yml  # Orchestration des 3 services (frontend, backend, db)
└── README.md
```

---

## Prérequis

- PHP 8.2+ et Composer
- Node.js 16+ et npm
- MySQL 5.7+ (ou via Docker)
- Docker & Docker Compose (pour le déploiement conteneurisé)

## Installation en local

### 1. Back-end (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Renseigner la connexion à la base dans `.env` (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`), puis :

```bash
php artisan migrate
php artisan serve        # API disponible sur http://localhost:8000
```

### 2. Front-end (React)

```bash
cd frontend
npm install
cp .env.example .env     # définir REACT_APP_API_URL=http://localhost:8000/api
npm start                # interface disponible sur http://localhost:3000
```

Créer un compte via la page d'inscription, puis se connecter pour accéder à l'application.

---

## Déploiement avec Docker

L'application se déploie via trois conteneurs (front-end React + Nginx, back-end Laravel, base MySQL).

```bash
docker-compose up -d --build
docker-compose exec backend php artisan migrate --force
```

Vérifier que les services tournent :

```bash
docker-compose ps
```

- Front-end : `http://<adresse-du-serveur>:3000`
- API : `http://<adresse-du-serveur>:8000/api`

Créer le compte administrateur via la page d'inscription une fois l'application en ligne.

> En production, penser à fournir une `APP_KEY` et à configurer le CORS de Laravel pour autoriser le domaine du front-end. Un reverse proxy (Nginx ou Traefik) et un certificat SSL (Let's Encrypt) peuvent être ajoutés pour servir l'application sur un nom de domaine.

---

## Aperçu des endpoints API

| Ressource | Routes |
|-----------|--------|
| Authentification | `POST /api/register`, `POST /api/login`, `POST /api/logout`, `GET /api/user` |
| Catégories | `GET /api/categories`, `POST /api/categories` |
| Produits | `GET /api/products`, `GET /api/products/{id}`, `POST /api/products`, `PUT /api/products/{id}`, `DELETE /api/products/{id}` |
| Fournisseurs | `GET /api/suppliers`, `GET /api/suppliers/{id}`, `POST /api/suppliers`, `PUT /api/suppliers/{id}`, `DELETE /api/suppliers/{id}` |
| Commandes | `GET /api/orders`, `GET /api/orders/{id}`, `POST /api/orders`, `PUT /api/orders/{id}`, `DELETE /api/orders/{id}` |
| Magasins | `GET /api/stores`, `POST /api/stores`, `PUT /api/stores/{id}` |
| Ventes | `POST /api/sales` |
| Tableau de bord | `GET /api/dashboard`, `GET /api/stats/sales-vs-purchases`, `GET /api/stats/orders-summary`, `GET /api/stats/top-products`, `GET /api/stats/low-stock` |
| Rapports | `GET /api/reports/overview`, `GET /api/reports/best-categories`, `GET /api/reports/profit-vs-revenue`, `GET /api/reports/best-products` |

Toutes les routes, sauf l'authentification, requièrent un token Bearer valide.

---

## Communication front-end ↔ back-end

- **URL de base** : `frontend/src/api/axios.js` définit une instance Axios unique (`REACT_APP_API_URL`, par défaut `http://localhost:8000/api`). Toutes les requêtes passent par cette instance, jamais par `axios` directement.
- **Authentification** : après connexion, le token Sanctum est stocké dans l'atom Recoil `authTokenState` (persisté en `localStorage` via un effet d'atome). Un intercepteur de requête y attache automatiquement l'en-tête `Authorization: Bearer ...`. Un intercepteur de réponse détecte les `401` sur une requête authentifiée, vide la session et redirige vers `/login` avec un toast.
- **Organisation des fichiers** :
  - `src/api/` — un fichier par ressource (`products.js`, `suppliers.js`, `orders.js`...), chacun n'exportant que de simples fonctions qui retournent une promesse Axios.
  - `src/state/` — les atomes Recoil globaux (auth).
  - `src/components/` — composants réutilisables (layout, modals de formulaire).
  - `src/pages/` — une page par route, qui orchestre les appels API et les composants.
- **Chargement des données** : chaque page déclenche ses appels `GET` dans un `useEffect` au montage. Les pages combinant plusieurs sources (Dashboard, Reports) utilisent `Promise.all` pour paralléliser les requêtes plutôt que de les enchaîner.
- **Retour utilisateur** : succès et erreurs sont systématiquement notifiés via Sonner (`toast.success`/`toast.error`). Les erreurs de validation (422) affichent le premier message renvoyé par Laravel.

---

## Licence

Projet personnel réalisé par Ibrahima Camara.
