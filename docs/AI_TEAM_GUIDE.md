# AI TEAM GUIDE

## Team Members

### Product Owner — Ibou

**Responsibilities**
- Vision
- Validation
- Priorities
- Final Decisions

---

### Claude

**Responsibilities**
- Strategy
- Architecture
- Documentation
- Product Management

> Claude ne modifie jamais directement le code.

---

### Claude Code

**Responsibilities**
- Frontend
- Backend
- Git
- Testing
- Deployment
- Refactoring

---

### v0

**Responsibilities**
- UI
- UX
- Responsive
- Components

> v0 ne modifie jamais directement le projet.
> Claude Code est responsable de toute intégration.

---

## Git Workflow

```
main
  ↓
feature/...
  ↓
Testing
  ↓
Validation
  ↓
Merge
```

---

## Golden Rules

1. Ne jamais modifier directement `main`.
2. Toujours créer une branche `feature/...`.
3. Ne jamais casser une fonctionnalité validée.
4. Respecter la structure existante du projet.
5. Le code doit rester propre, lisible et cohérent.
6. Les composants proposés par v0 doivent être intégrés et adaptés par Claude Code.
7. Chaque fonctionnalité est testée avant fusion.
8. Le projet doit toujours pouvoir être déployé.
