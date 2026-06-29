# V0 Design System — Kanban Stock Management

> Référence **autoritaire** que v0 doit respecter pour produire l'UI mobile.
> Rappel de rôle (`AI_TEAM_GUIDE`) : **v0 propose** des composants UI isolés. **Claude Code intègre et adapte** au projet. v0 ne touche jamais à `main`.
> Toutes les valeurs ci-dessous sont **extraites de la démo réelle** (couleurs échantillonnées au pixel), pas inventées.
> À lire avec `RESPONSIVE_SPEC.md`, qui définit le comportement écran par écran.

---

## 1. Couleurs

Couche **sémantique** (à utiliser) mappée sur des valeurs **grounded** (mesurées) + équivalent Tailwind pour usage direct.

### 1.1 Marque / Primaire
| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | **`#314ED3`** | Boutons primaires, liens, état actif, focus |
| `--color-primary-hover` | `#2840B8` | État pressé/hover du primaire |
| `--color-primary-foreground` | `#FFFFFF` | Texte sur fond primaire |

→ Couleur **custom**. ⚠️ **Le projet n'utilise pas Tailwind** (aucun `tailwind.config`, CSS vanilla uniquement). Les tokens sont déclarés comme **CSS custom properties** dans `src/index.css` (`:root { --color-primary: #314ED3; … }`). Le code existant utilise `#3b5bdb` (bleu légèrement différent) — la migration vers `--color-primary` se fait progressivement lors de l'intégration mobile. Le logo KANBAN utilise un bleu cyan + une coche verte : **décoratif, réservé au logo**, pas un token d'UI.

### 1.2 Neutres
| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| `--bg` | `#FFFFFF` | white | Fond de page |
| `--surface` | `#FFFFFF` | white | Fond des cartes (+ bordure) |
| `--border` | `#E5E7EB` | gray-200 | Bordures cartes/champs |
| `--text` | `#111827` | gray-900 | Texte principal |
| `--text-muted` | `#6B7280` | gray-500 | Labels, sous-titres |
| `--text-placeholder` | `#9CA3AF` | gray-400 | Placeholders |

### 1.3 Statuts (badges — voir §4.4 du RESPONSIVE_SPEC)
Badge = **fond pâle + texte foncé** de la même teinte.

| Sens | Texte | Fond | Tailwind | Mots-clés |
|---|---|---|---|---|
| Positif | `#15803D` | `#DCFCE7` | green-700 / green-100 | In stock, Delivered, Taking return |
| Attention | `#B45309` | `#FEF3C7` | amber-700 / amber-100 | Low stock, Out for delivery, Confirmed |
| Négatif | `#B91C1C` | `#FEE2E2` | red-700 / red-100 | Out of stock, Not taking return, Returned, Delayed |

*(Teintes mesurées dans la démo : vert ~`#006030`, ambre ~`#D8A848`/`#904800`, rouge ~`#C01818`. Les valeurs Tailwind ci-dessus les normalisent.)*

---

## 2. Typographie

> ✅ **Police confirmée (Claude Code, 2026-06-29)** : stack système CRA par défaut déclarée dans `src/index.css` — `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', ...`, soit effectivement **system-ui**. Aucune police custom chargée (pas de Google Fonts, pas d'Inter explicite). Le rendu correspond bien à SF Pro sur iOS/macOS et Roboto sur Android, ce qui explique l'aspect "Inter-like" observé dans la démo.

Échelle **mobile** (mobile-first) :

| Rôle | Taille | Poids |
|---|---|---|
| Titre d'écran / H1 login | 28–30px | 700 |
| Valeur de stat (gros chiffres) | 20–24px | 700 |
| Titre de section (H2, ex. « Sales Overview ») | 16–18px | 600 |
| Corps / champs | 14–16px | 400–500 |
| Label / légende (muted) | 12–13px | 400–500 |
| Texte de badge | 12px | 500 |

Poids utilisés : 400 (regular), 500 (medium), 600 (semibold), 700 (bold). Pas d'autres graisses.

---

## 3. Espacement, rayons, élévation

### 3.1 Espacement (base 4px — échelle Tailwind)
- Padding horizontal d'écran : **16px**
- Padding interne carte : **16px**
- Gap entre cartes empilées : **12–16px**
- Gap entre champs de formulaire : **16px**

### 3.2 Rayons
| Élément | Rayon | Tailwind |
|---|---|---|
| Boutons, champs, selects | 8px | rounded-lg |
| Cartes (stat & liste) | 12px | rounded-xl |
| Badges | pleine | rounded-full |

### 3.3 Élévation
- Cartes : bordure `--border` + ombre **très légère** (`shadow-sm`).
- Feuilles / modales : ombre marquée (`shadow-xl`) + fond.
- Bottom tab bar : bordure haute fine, pas d'ombre lourde.

### 3.4 Cibles tactiles
- Hauteur minimale interactive : **44px**.
- Boutons & champs : **48px**.

---

## 4. Composants

Chaque composant est livré par v0 **isolé**, stylé avec les tokens ci-dessus.

### 4.1 Button
| Variante | Fond | Texte | Bordure |
|---|---|---|---|
| Primary | `--color-primary` | blanc | — |
| Secondary | blanc | `--text` | `--border` |
| Ghost | transparent | `--color-primary` | — |
| Danger | `#B91C1C` | blanc | — |
- Hauteur 48px, rounded-lg, label centré 14–16px/600.
- Dans les formulaires : **pleine largeur**. État `loading` (spinner + disabled) et `disabled` requis.

### 4.2 Input / Select
- Hauteur 48px, bordure `--border`, rounded-lg, texte 14–16px.
- **Label au-dessus** (visible, pas seulement placeholder).
- Focus : anneau `--color-primary`.
- Erreur : bordure rouge + message inline `#B91C1C` sous le champ.

### 4.3 Card
- Fond blanc, bordure `--border`, rounded-xl, padding 16px, `shadow-sm`.
- Deux usages : **carte de stat** (grille 2 colonnes de tuiles valeur/label) et **carte de liste** (cf. §4.2 du RESPONSIVE_SPEC).

### 4.4 Badge
- Pill, fond pâle + texte foncé (§1.3), 12px/500, padding `px-2 py-0.5`.

### 4.5 Bottom Tab Bar
- Fixe en bas, fond blanc, bordure haute `--border`.
- 4 items (Dashboard · Inventory · Orders · Plus), icône + label court.
- **Item actif** : icône + label en `--color-primary`.
- `padding-bottom: env(safe-area-inset-bottom)` **obligatoire**.

### 4.6 Sheet / Modal (formulaires plein écran)
- Glisse depuis le bas, plein écran.
- **Header** : titre + bouton fermer (X) ; fermeture aussi par swipe-down.
- **Corps** scrollable (champs en une colonne).
- **Footer épinglé** en bas : Discard / [action primaire], zone du pouce, safe-area.

### 4.7 Conteneur de graphique
- Carte pleine largeur, hauteur 220–260px.
- Légende **sous** le graphe.
- **Tooltip au tap** (jamais au hover seul).
- Aucun scroll horizontal : réduire la densité des labels d'axe sur mobile.

---

## 5. Règles pour v0

1. **Tokens uniquement** : aucune couleur hors palette §1, aucune valeur magique hors échelle §3.
2. **Mobile-first** : respecter les breakpoints du `RESPONSIVE_SPEC` (`<768 / 768–1024 / ≥1024`), desktop inchangé.
3. **Comportement** : v0 ne change jamais la logique fonctionnelle — il habille, il ne recâble pas.
4. **Composants isolés** : livrés prêts à être adaptés par Claude Code, jamais intégrés directement dans `main`.
5. **Markup propre** : pas de duplication, pas de styles inline arbitraires, classes Tailwind cohérentes avec l'échelle.
6. **Accessibilité** : cibles ≥ 44px, contrastes suffisants, pas d'info portée par la seule couleur (badge = couleur **+** texte).

---

## Annexe — Valeurs sources (échantillonnées)
| Élément | Mesuré |
|---|---|
| Bouton primaire (« Sign in ») | `#314ED3` |
| Badge négatif (texte/borure) | `#C01818` |
| Badge positif (texte) | `#006030` |
| Badge attention | `#D8A848` / `#904800` |
| Logo (décoratif) | bleu cyan + coche verte |
