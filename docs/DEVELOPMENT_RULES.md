# Development Rules — Kanban Stock Management

> Règles **autoritaires** pour Claude Code sur la mission mobile responsive.
> Objectif : un rendu « équipe expérimentée », sans jamais casser l'existant.
> À lire avec `RESPONSIVE_SPEC.md` (quoi construire) et `V0_DESIGN_SYSTEM.md` (avec quels tokens).

---

## 1. Règle d'or

**Ajouter le responsive sans modifier le comportement fonctionnel.**
Le backend Laravel, les API et la logique métier sont **validés et stables**. On habille l'interface ; on ne recâble rien.

---

## 2. Workflow Git

- **Jamais** de travail direct sur `main`.
- Branche de la mission : **`feature/mobile-responsive-v2`**.
- Tous les changements passent par cette branche.
- **Aucun merge sans validation du Product Owner (Ibou).**

```
main
  └─ feature/mobile-responsive-v2
        ↓ développement
        ↓ tests (build / desktop / mobile)
        ↓ validation PO
        └─ merge
```

- Commits petits, lisibles, à portée claire (un sujet par commit).

---

## 3. Rôles & collaboration

| Acteur | Responsabilité |
|---|---|
| **Ibou (PO)** | Vision, priorités, validation finale |
| **Claude** | Stratégie, architecture, documentation (ne touche pas au code) |
| **v0** | UI, UX, responsive, design system — composants **isolés** |
| **Claude Code** | Intégration, adaptation, optimisation, qualité, cohérence |

- Les composants de v0 **ne sont jamais copiés tels quels** dans `main`. Claude Code les **adapte** au style et à l'architecture existants.
- En cas de doute → **demander validation avant de modifier**.

---

## 4. Qualité de code (obligatoire)

Respecter l'existant :
- Conventions de **nommage** du projet.
- **Architecture** et structure de dossiers existantes.
- **Style de code** en place.
- **ESLint** : zéro erreur.
- **Prettier** : code formaté.
- Réutiliser les **composants existants** plutôt que d'en recréer.
- Design **cohérent** avec le reste de l'app.

Ne **jamais** ajouter :
- commentaires inutiles ;
- code mort ;
- abstractions superflues ;
- duplication ;
- dépendances inutiles.

---

## 5. Definition of Done (par écran / par PR)

Un changement n'est « terminé » que si **tout** est vrai :

- [ ] **Build OK** (aucune erreur de compilation)
- [ ] **Desktop OK** (comportement et rendu inchangés)
- [ ] **Mobile OK** (responsive conforme au `RESPONSIVE_SPEC`)
- [ ] **Aucun warning** (console, lint, build)
- [ ] **Aucun bug** introduit
- [ ] **Responsive testé** sur petit écran réel (cible iPhone mini / `<768px`)
- [ ] **Performances conservées** (pas de régression de chargement)
- [ ] **Aucune fonctionnalité existante cassée**
- [ ] Tokens du `V0_DESIGN_SYSTEM` respectés (pas de couleur/valeur hors palette)
- [ ] Cibles tactiles ≥ 44px, safe-area gérée pour les barres ancrées en bas

---

## 6. Garde-fous

- Toute barre ancrée en bas : `padding-bottom: env(safe-area-inset-bottom)`.
- Tableaux convertis en cartes selon le **pattern §4** du `RESPONSIVE_SPEC` (un seul motif, pas de variante par écran).
- Pas de `hover` comme seul moyen d'interaction.
- Pagination existante conservée (Prev/Next), pas de changement de logique.
- Le projet doit **toujours rester déployable**.
