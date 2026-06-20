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

- PHP 8.1+ et Composer
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
| Authentification | `POST /api/register`, `POST /api/login`, `POST /api/logout` |
| Catégories | `GET/POST /api/categories`, `PUT/DELETE /api/categories/{id}` |
| Produits | `GET/POST /api/products`, `GET/PUT/DELETE /api/products/{id}` |
| Fournisseurs | `GET/POST /api/suppliers`, `GET/PUT/DELETE /api/suppliers/{id}` |
| Commandes | `GET/POST /api/orders`, `PUT /api/orders/{id}` |
| Magasins | `GET/POST /api/stores`, `GET/PUT/DELETE /api/stores/{id}` |
| Tableau de bord / Stats | `GET /api/dashboard`, `GET /api/stats/...` |

Toutes les routes, sauf l'authentification, requièrent un token Bearer valide.

---

## Licence

Projet personnel réalisé par Ibrahima Camara.
