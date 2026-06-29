# Product Roadmap — Kanban Stock Management

> **Brouillon de travail** — le séquencement et les choix de monétisation relèvent du Product Owner (Ibou).
> 🟢 acquis · 🔵 en cours · 🟡 proposé (à valider) · ⚪ à cadrer
> Deux objectifs parallèles (cf. `PROJECT_CONTEXT`) :
> 1. **Portfolio** professionnel de niveau international.
> 2. **SaaS** pour les PME de l'UEMOA, puis international.

---

## Constat de départ (important)

Le produit est **fonctionnel mais pas encore aligné sur le marché cible** :
- Interface en **anglais** → la cible UEMOA est **francophone**.
- Prix en **`$` (USD)** → la cible utilise le **FCFA (XOF)**.
- Pas (encore) de **multi-entreprise** ni de **paiement local** → prérequis d'un vrai SaaS.

Ces écarts structurent les phases ci-dessous.

---

## Phase 0 — Acquis 🟢
- Version desktop stable.
- Backend Laravel, API et logique métier validés.
- Déploiement Railway + Vercel opérationnel.

## Phase 1 — Mobile responsive 🔵 *(mission en cours)*
- Responsive mobile professionnel (`feature/mobile-responsive-v2`).
- Réfs : `RESPONSIVE_SPEC.md`, `V0_DESIGN_SYSTEM.md`, `DEVELOPMENT_RULES.md`.
- **Objectif portfolio** : rendu « équipe expérimentée » sur mobile.
- Comportement fonctionnel inchangé.

## Phase 2 — Localisation marché (UEMOA) 🟡
*Rendre le produit utilisable par la cible réelle.*
- **i18n** : français par défaut (architecture multilingue dès le départ).
- **Devise FCFA (XOF)** + formats locaux (nombres, dates).
- Vérifier la cohérence terminologique métier en français.
- *Décision PO : avant ou après les fondations SaaS ? (Phase 3)*

## Phase 3 — Fondations SaaS 🟡
*Passer d'une app mono-utilisateur à un produit multi-clients.*
- **Multi-tenant** : isolation des données par entreprise.
- **Rôles & permissions** (propriétaire, gérant, employé…).
- **Onboarding** d'un nouveau compte entreprise.
- **Abonnements** : structure de plans (modèle à définir par le PO).

## Phase 4 — Paiement & distribution locale 🟡
- Intégration **mobile money** (Wave, Orange Money…) — clé pour l'UEMOA.
- Facturation récurrente, gestion des plans.
- *Modèle tarifaire à définir (freemium ? paliers ?).*

## Phase 5 — International ⚪
- Multi-devises, multi-langues étendus.
- Scaling infra, conformité, support.

---

## Décisions à cadrer (Product Owner)
> **Décision actée** : le séquencement post-mobile (Phase 2 vs Phase 3) est **différé jusqu'à la livraison de la Phase 1**. On tranche sur la base du résultat mobile réel, pas en amont.

- [ ] **Séquencement** : Localisation (Ph.2) avant Fondations SaaS (Ph.3), ou l'inverse ? → *à trancher après Phase 1*
- [ ] **Horizon** : poussée portfolio rapide, ou construction SaaS sur plusieurs mois ?
- [ ] **Monétisation** : freemium, paliers, prix d'ancrage en FCFA ?
- [ ] **Cible pilote** : un secteur PME précis pour le premier déploiement réel ?
- [ ] **Dates/jalons** : à poser une fois le séquencement validé.

> Les phases sont volontairement **sans dates** tant que le séquencement n'est pas validé.
