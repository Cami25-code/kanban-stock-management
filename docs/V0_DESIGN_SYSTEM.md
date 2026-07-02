# V0 Design System — Kanban Stock Management

> Référence **autoritaire** que v0 doit respecter pour produire l'UI mobile.
> Rappel de rôle (`AI_TEAM_GUIDE`) : **v0 propose** des composants UI isolés. **Claude Code intègre et adapte** au projet. v0 ne touche jamais à `main`.
> Couleurs **extraites de la démo réelle** + **valeurs confirmées dans le code** par Claude Code.
> À lire avec `RESPONSIVE_SPEC.md` (comportement écran par écran).

---

## 0. Stack & intégration (confirmé dans le code)

- **CSS vanilla** (Create React App). **Pas de Tailwind**, pas de CSS-in-JS.
- Les tokens sont des **CSS custom properties** dans `src/index.css` (`:root { --color-primary: … }`).
- **Police : `system-ui`** (stack CRA par défaut `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'…`). Aucune police custom chargée — l'aspect « Inter-like » de la démo vient de SF Pro (iOS) / Roboto (Android).
- **v0 doit livrer du HTML + CSS vanilla** (fichier `.css` + `className`), stylé via les **variables CSS** ci-dessous. Pas de classes Tailwind. Claude Code greffe sur les composants existants (`AppLayout`, `Topbar`, `Modal`, `DataPage`, `Availability`).

---

## 1. Couleurs

Déclarées comme variables CSS. Valeurs **grounded** (mesurées) recalées sur le **code réel**.

### 1.1 Marque / Primaire
| Variable | Hex | Usage |
|---|---|---|
| `--color-primary` | **`#3b5bdb`** | Boutons primaires, liens, état actif, focus |
| `--color-primary-hover` | `#324DBA` | État pressé/hover |
| `--color-primary-foreground` | `#FFFFFF` | Texte sur fond primaire |

→ Valeur **canonique = `#3b5bdb`** (celle déjà utilisée dans le code ; l'échantillon `#314ED3` en était une approximation au pixel). Une seule source de vérité, **aucune migration de couleur** sur le desktop. Le logo KANBAN (bleu cyan + coche verte) est **décoratif**, pas un token d'UI.

### 1.2 Neutres
| Variable | Hex | Usage |
|---|---|---|
| `--bg` | `#FFFFFF` | Fond de page |
| `--surface` | `#FFFFFF` | Fond des cartes (+ bordure) |
| `--border` | `#E5E7EB` | Bordures cartes/champs |
| `--text` | `#111827` | Texte principal |
| `--text-muted` | `#6B7280` | Labels, sous-titres |
| `--text-placeholder` | `#9CA3AF` | Placeholders |

### 1.3 Statuts (badges)
Badge = **fond pâle + texte foncé**. **Déjà implémenté** dans `styles/Availability.css` (`.availability--in / --low / --out`) — à réutiliser tel quel, conforme au §4.4 du `RESPONSIVE_SPEC`.

| Sens | Texte | Fond | Mots-clés |
|---|---|---|---|
| Positif | `#15803D` | `#DCFCE7` | In stock, Delivered, Taking return |
| Attention | `#B45309` | `#FEF3C7` | Low stock, Out for delivery, Confirmed |
| Négatif | `#B91C1C` | `#FEE2E2` | Out of stock, Not taking return, Returned, Delayed |

*(Teintes mesurées : vert ~`#006030`, ambre ~`#D8A848`/`#904800`, rouge ~`#C01818`.)*

---

## 2. Typographie

**Police confirmée : `system-ui`** (voir §0). Échelle **mobile-first** :

| Rôle | Taille | Poids |
|---|---|---|
| Titre d'écran / H1 login | 28–30px | 700 |
| Valeur de stat (gros chiffres) | 20–24px | 700 |
| Titre de section (H2) | 16–18px | 600 |
| Corps / champs | 14–16px | 400–500 |
| Label / légende (muted) | 12–13px | 400–500 |
| Texte de badge | 12px | 500 |

Poids : 400 / 500 / 600 / 700. Pas d'autres graisses.

---

## 3. Espacement, rayons, élévation

### 3.1 Espacement (base 4px)
- Padding horizontal d'écran : **16px**
- Padding interne carte : **16px**
- Gap entre cartes : **12–16px**
- Gap entre champs de formulaire : **16px**

### 3.2 Rayons
| Élément | Rayon |
|---|---|
| Boutons, champs, selects | 8px |
| Cartes (stat & liste) | 12px |
| Badges | pleine (pill) |

### 3.3 Élévation (box-shadow CSS)
- Cartes : bordure `--border` + `box-shadow: 0 1px 2px rgba(0,0,0,.05)`.
- Feuilles / modales : `box-shadow: 0 -8px 24px rgba(0,0,0,.18)`.
- Bottom tab bar : bordure haute fine, pas d'ombre lourde.

### 3.4 Cibles tactiles
- Minimum interactif : **44px**. Boutons & champs : **48px**.

---

## 4. Composants

Livrés par v0 **isolés**, en HTML + CSS vanilla, stylés avec les variables §1.

### 4.1 Button
| Variante | Fond | Texte | Bordure |
|---|---|---|---|
| Primary | `--color-primary` | blanc | — |
| Secondary | blanc | `--text` | `--border` |
| Ghost | transparent | `--color-primary` | — |
| Danger | `#B91C1C` | blanc | — |
- Hauteur 48px, rayon 8px, label centré 14–16px/600.
- Formulaires : **pleine largeur**. États `loading` (spinner + disabled) et `disabled` requis.

### 4.2 Input / Select
- Hauteur 48px, bordure `--border`, rayon 8px, texte 14–16px.
- **Label au-dessus** (visible).
- Focus : anneau `--color-primary`.
- Erreur : bordure rouge + message inline `#B91C1C` sous le champ.

### 4.3 Card
- Fond blanc, bordure `--border`, rayon 12px, padding 16px, ombre légère (§3.3).
- Usages : **carte de stat** (grille 2 colonnes valeur/label) et **carte de liste** (§4.2 du RESPONSIVE_SPEC).

### 4.4 Badge
- Pill, fond pâle + texte foncé (§1.3), 12px/500, padding `2px 8px`.
- Réutiliser les classes existantes `Availability.css`.

### 4.5 Bottom Tab Bar *(composant neuf)*
- Fixe en bas, fond blanc, bordure haute `--border`.
- 4 items (Dashboard · Inventory · Orders · Plus), icône + label court.
- **Item actif** en `--color-primary`.
- `padding-bottom: env(safe-area-inset-bottom)` **obligatoire**.

### 4.6 Sheet / Modal (formulaires plein écran)
- **Étend le `Modal.jsx` existant** (overlay + conteneur), ne le recrée pas.
- Glisse depuis le bas, plein écran sur mobile.
- Header : titre + fermer (X) ; fermeture aussi par swipe-down.
- Corps scrollable (champs en une colonne).
- Footer **épinglé** : Discard / [action primaire], zone du pouce, safe-area.
- Les 5 modales (`AddProduct`, `AddOrder`, `AddSupplier`, `AddStore`, `RecordSale`) héritent automatiquement.

### 4.7 Conteneur de graphique
- Carte pleine largeur, hauteur 220–260px.
- Légende **sous** le graphe. **Tooltip au tap** (jamais hover seul).
- Aucun scroll horizontal : réduire la densité des labels d'axe sur mobile.

---

## 5. Règles pour v0

1. **Variables CSS uniquement** : couleurs et valeurs via les tokens §1/§3, **aucune valeur en dur** hors échelle.
2. **CSS vanilla**, pas de Tailwind, pas de CSS-in-JS.
3. **Mobile-first** : breakpoints du `RESPONSIVE_SPEC` (`<768 / 768–1024 / ≥1024`), desktop inchangé.
4. **Comportement** : v0 habille, ne recâble jamais la logique fonctionnelle.
5. **Composants isolés** : prêts à être adaptés par Claude Code, jamais intégrés dans `main`. Réutiliser l'existant (`Modal`, `Availability`…) plutôt que recréer.
6. **Accessibilité** : cibles ≥ 44px, contrastes suffisants, info jamais portée par la seule couleur (badge = couleur **+** texte).

---

## Annexe — Sources & confirmations
| Élément | Valeur |
|---|---|
| Primaire canonique (code) | `#3b5bdb` |
| Primaire (échantillon démo) | `#314ED3` (approx.) |
| Police (code) | `system-ui` (stack CRA) |
| Badges | déjà dans `styles/Availability.css` |
| Stack | CRA + CSS vanilla, tokens dans `src/index.css` |
