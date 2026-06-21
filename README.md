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
├── backend/            # API Laravel (+ Dockerfile, docker/ : vhost Apache, entrypoint)
├── frontend/           # Application React (+ Dockerfile, nginx.conf)
├── docker-compose.yml  # Orchestration des 3 services (frontend, backend, db)
├── .env.example        # Variables pour docker-compose
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

L'application se déploie via trois conteneurs : front-end React servi par Nginx (build multi-stage), back-end Laravel sur PHP-Apache, et MySQL. Orchestration via `docker-compose.yml` à la racine.

> **Note** : cette configuration n'a pas pu être testée par un `docker-compose up` réel sur la machine de développement (macOS 12 Monterey) — Docker y nécessite `colima` + `qemu`, et la compilation de `qemu` depuis les sources (aucune bottle précompilée pour cette version de macOS) s'est heurtée à un bug Homebrew après plusieurs heures de compilation. Les Dockerfile et `docker-compose.yml` ont été relus attentivement (et un bug réel a été corrigé : la désactivation des scripts Composer empêchait la découverte automatique des packages Laravel, ce qui aurait cassé Sanctum). Un VPS Linux n'a pas ce problème : Docker s'y installe nativement (`apt install docker.io docker-compose`), sans virtualisation imbriquée. À tester en priorité là, ou sur une machine où Docker fonctionne déjà.

### 1. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Renseigner dans `.env` : `DB_PASSWORD`, `DB_ROOT_PASSWORD`, et l'URL publique du serveur (`APP_URL`, `FRONTEND_URL`, `REACT_APP_API_URL` — voir l'avertissement ci-dessous). Générer ensuite une `APP_KEY` :

```bash
docker-compose run --rm backend php artisan key:generate --show
```

Copier la valeur affichée dans `APP_KEY=` du `.env`.

> **Important — `REACT_APP_API_URL`** : React étant une application statique exécutée dans le navigateur de l'utilisateur (pas dans le réseau Docker), cette variable doit être l'URL **publique** du back-end (ex. `http://<IP-du-VPS>:8000/api` ou `https://api.mondomaine.com`), jamais un nom de service Docker interne comme `http://backend` — celui-ci n'est résolvable qu'entre conteneurs, pas depuis le navigateur. Cette valeur est figée au moment du build de l'image front-end : toute modification nécessite de reconstruire l'image (`docker-compose build frontend`).

### 2. Construire et démarrer

```bash
docker-compose up -d --build
docker-compose exec backend php artisan migrate --force
```

(Pas de seeders : créer le compte utilisateur via la page d'inscription une fois l'application en ligne.)

Vérifier que les services tournent :

```bash
docker-compose ps
```

- Front-end : `http://<adresse-du-serveur>:3000`
- API : `http://<adresse-du-serveur>:8000/api/ping` (test de connectivité)

### 3. Persistance et mises à jour

- Les données MySQL sont conservées dans le volume nommé `db_data`, le contenu de `storage/` Laravel dans `backend_storage` : un `docker-compose down` (sans `-v`) ne les efface pas.
- Après un nouveau `git pull` sur le serveur : `docker-compose up -d --build` reconstruit les images modifiées, puis `docker-compose exec backend php artisan migrate --force` applique les nouvelles migrations.

> En production, le port MySQL n'est volontairement pas exposé à l'extérieur (seuls les conteneurs du réseau Docker Compose y accèdent). Un reverse proxy (Nginx ou Traefik) et un certificat SSL (Let's Encrypt) peuvent être ajoutés devant les conteneurs `frontend`/`backend` pour servir l'application sur un nom de domaine en HTTPS.

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
