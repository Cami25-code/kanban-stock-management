# Responsive Specifications — Kanban Stock Management

> Document de référence pour la version **mobile responsive** (mission `feature/mobile-responsive-v2`).
> Règle absolue : **le comportement fonctionnel reste identique au desktop**. On ne touche qu'à la mise en page, la densité et les cibles tactiles.
> Statut : 🟢 validé · 🟡 en cours de validation · ⚪ à faire

---

## 0. Base globale 🟢

### 0.1 Breakpoints (alignés Tailwind)
| Cible | Largeur | Statut |
|---|---|---|
| Mobile | `< 768px` | cible de la mission |
| Tablette | `768px – 1024px` | adaptation légère |
| Desktop | `≥ 1024px` | existant, **inchangé** |

Approche **mobile-first**. Le desktop reste la référence de comportement.

### 0.2 Contrainte d'environnement
L'app tourne comme **web app dans le navigateur mobile** (Safari/Chrome), pas en natif. La barre du navigateur occupe le bas de l'écran.
- Toute barre ancrée en bas **doit** utiliser `padding-bottom: env(safe-area-inset-bottom)`.
- Vérifier qu'on n'empile pas deux barres collées qui mangent l'écran.
- Prévoir le rendu en mode « ajouté à l'écran d'accueil » (standalone) où la barre navigateur disparaît.

### 0.3 Conventions globales (héritées partout)
- Cibles tactiles **≥ 44px**.
- Tableaux desktop → **cartes empilées** sur mobile (règle centrale, voir §3).
- Actions principales accessibles **au pouce** (bas d'écran).
- Jamais de `hover` comme **seul** moyen d'interaction.
- Champs de formulaire : hauteur **≥ 48px**, label visible (pas seulement placeholder).
- Pas d'alerte bloquante pour les erreurs : message **inline** sous le champ.

---

## 1. Shell & Navigation 🟢

### 1.1 Remplacement du drawer
État actuel : navigation par **drawer hamburger** (☰ en haut à gauche) listant Dashboard, Inventory, Reports, Suppliers, Orders, Manage Store + Settings, Log Out.
Cible : **bottom tab bar** fixe, le drawer est supprimé.

### 1.2 Bottom tab bar
4 entrées, fixes, ancrées en bas (avec safe-area) :

| Onglet | Destination |
|---|---|
| **Dashboard** | Tableau de bord |
| **Inventory** | Products |
| **Orders** | Orders |
| **Plus** | Feuille listant : Suppliers · Reports · Manage Store |

- Icône + label court sous chaque onglet.
- État actif visible (couleur primaire + indicateur).

### 1.3 Compte / réglages
Les actions de compte **ne vont pas** dans la tab bar. Elles sont accessibles via l'**avatar en haut à droite** → feuille : Profile · Settings · Log Out.
→ Séparation claire : la tab bar = **modules**, l'avatar = **compte**.

---

## 2. Authentication — Login 🟢

Pas de tab bar (écran avant login). Une seule colonne, centrée.

- **Structure** : logo KANBAN → titre « Log in to your account » → sous-titre → champs → bouton → liens.
- **Champs** : pleine largeur, ≥ 48px, label visible, toggle afficher/masquer le mot de passe.
- **Bouton « Sign in »** : pleine largeur, dans la zone du pouce.
- **Boutons/liens secondaires** conservés dans le flux **scrollable** : « Sign in with Google », « Forgot password », « Don't have an account? Sign up ».
- **Clavier ouvert** : le bouton ne doit jamais être masqué (form scrollable, pas de hauteur figée).
- **Erreurs** : inline sous le champ, en rouge.
- **États** : bouton en loading (spinner + désactivé) pendant la requête, anti double-submit.
- **Comportement fonctionnel** : identique au desktop (Face ID iOS inclus, déclenché par le navigateur).

---

## 3. Dashboard 🟢

Écran le plus dense. Ordre des sections conservé ; chaque bloc devient une **carte** pleine largeur empilée.

### 3.1 Top bar
- **Gauche** : titre de l'écran (« Dashboard »). Plus de ☰ (nav en bas).
- **Recherche** : repliée en **icône loupe** qui ouvre un champ plein écran au tap (gain de hauteur). *(point à valider — voir bas de §3)*
- **Droite** : avatar → feuille Profile / Settings / Log Out.
- **Action principale** : bouton **« Record a Sale »** sous le titre. *(point à valider : bouton header vs FAB)*

### 3.2 Cartes de synthèse (stats)
Chaque groupe = une carte contenant une **grille 2 colonnes** de tuiles (valeur en gros, label en petit/muted) :

| Carte | Tuiles |
|---|---|
| Sales Overview | Sales · Revenue · Profit · Cost (2×2) |
| Inventory Summary | Quantity in Hand · To be received (2×1) |
| Purchase Overview | Purchase · Cost · Cancel · Return (2×2) |
| Product Summary | Number of Suppliers · Number of Categories (2×1) |

- Valeurs monétaires ne doivent **jamais** être tronquées (`$1,000.00` doit tenir).
- Conserver les accents de couleur existants.

### 3.3 Graphiques
Chacun dans sa carte, **largeur 100%**, hauteur ~220–260px :
- **Sales & Purchase** (barres, Jan→Jun, légende Purchase/Sales).
- **Order Summary** (courbe, Delivered/Ordered).
- Légende **sous** le graphe.
- **Tooltip au tap** (pas au hover) — ex. « Apr · Delivered 3 · Ordered 3 ».
- **Aucun scroll horizontal** : si trop de labels d'axe, réduire la densité sur mobile (1 label sur 2).

### 3.4 Top Selling Stock → cartes
Tableau actuel (Name / Sold Quantity / Remaining Quantity / Price) converti en **carte par produit** :
- Ligne 1 : nom du produit (gras, wrap autorisé).
- Ligne 2 : trois mini-stats inline — `Vendu` · `Restant` · `Prix`.

### 3.5 Low Quantity Stock → cartes
Déjà proche d'une liste. Carte par produit :
- Nom (wrap propre, pas de troncature brutale).
- `Remaining Quantity: X`.
- **Badge** statut (« Low stock » jaune / « Out of stock » rouge) aligné à droite.

### 3.6 Record a Sale → feuille plein écran
Le bouton ouvre une **feuille modale** (slide depuis le bas) :
- Champs : Product (select) · Store optional (select) · Quantity.
- Boutons **Discard / Record a Sale** épinglés en bas (zone pouce).
- Fermeture par X ou swipe-down.

---

## 4. Pattern — Liste de données (table → cartes) 🟢

Motif **unique** réutilisé par Inventory, Suppliers, Orders et Reports. Aucun écran ne réimplémente sa propre version.

### 4.1 En-tête de liste
- Titre de l'écran à gauche.
- Action(s) à droite : bouton primaire contextuel (« Add Product », « Add Order »…). Mêmes règles que « Record a Sale » : bouton dans l'en-tête, pas de FAB.
- Recherche : héritée du top bar (icône loupe → champ plein écran).

### 4.2 Carte de ligne
Une ligne de tableau = **une carte tappable** :
- **Haut** : libellé primaire (nom, gras, wrap autorisé) + à droite **badge de statut** OU valeur primaire.
- **Corps** : champs secondaires en paires `label : valeur`, empilées ou en grille 2 colonnes selon le nombre.
- **Bas (optionnel)** : rangée d'actions (boutons ≥ 44px) quand la ligne en a (cas Orders).
- **Tap** : déclenche l'action que le lien déclenche déjà sur desktop (détail/édition). Comportement **identique** au desktop.

### 4.3 Contrôles de liste
- **Pagination** : conserver la logique existante (`Previous` / `Next`, `Page X of Y`). Restylée en contrôles tactiles ≥ 44px, centrés sous la liste. **Décision figée** : on garde Prev/Next (zéro changement de logique métier), pas de « Load more » ni d'infinite scroll.
- **État vide** : message court + icône, jamais une page blanche.
- **Chargement** : skeletons de cartes (pas de spinner plein écran).

### 4.4 Badges de statut (vocabulaire commun)
| Sens | Couleur |
|---|---|
| Positif (In stock, Delivered, Taking return) | vert |
| Attention (Low stock, Out for delivery, Confirmed) | jaune/ambre |
| Négatif (Out of stock, Not taking return, Returned) | rouge |

---

## 5. Inventory — Products 🟢

Application du pattern §4. Tableau actuel : Products / Buying Price / Quantity / Threshold Value / Expiry Date / **Availability** (badge) + pagination « Page 1 of 2 ».

### 5.1 En-tête
- Titre « Products » + bouton **« Add Product »**.

### 5.2 Carte produit
- **Haut** : nom du produit (gras, tappable) + **badge Availability** à droite (In stock / Low stock / Out of stock — §4.4).
- **Corps** (grille 2 colonnes) :
  - `Buying Price` · `Quantity`
  - `Threshold` · `Expiry`
- **Tap** : ouvre le détail/édition produit (comme le lien desktop).

### 5.3 Liste
- Pagination Prev/Next tactile (§4.3).
- Recherche du top bar filtre la liste (logique existante).

### 5.4 Add Product (form long)
Feuille plein écran, une colonne, champs pleine largeur ≥ 48px, dans l'ordre desktop : Product ID · Category (select) · Buying Price · Selling Price · Quantity · Unit · Expiry Date · Threshold Value · Store (select).
- Boutons **Discard / Add Product** épinglés en bas (zone pouce).
- Validation inline par champ.

---

## 6. Orders 🟢

Le plus chargé des écrans de liste. Tableau actuel : Products / Order Value / Quantity / Order ID / **Status** (badge) / **Actions** (2 boutons). En-tête desktop : `Add Order`, `Order History`, toggle `Show Pending`. Pagination « Page 1 of 1 ».

### 6.1 En-tête (3 contrôles à caser)
Trop de contrôles pour une seule rangée mobile. Répartition :
- **Rangée 1** : titre « Orders » + bouton primaire **« Add Order »**.
- **Rangée 2** (sous le titre) : un **toggle segmenté** `Tous / En attente` (= `Show Pending`) + entrée **« Order History »**.
- Aucune logique modifiée : on repositionne, c'est tout. *(point à valider)*

### 6.2 Carte commande (pattern §4 + actions)
- **Haut** : nom du produit (gras) + **badge Status** à droite (Out for delivery ambre · Confirmed ambre · Delayed rouge · Delivered vert — §4.4).
- **Corps** (grille 2 colonnes) : `Order Value` · `Quantity`. `Order ID` en pied de carte, discret (petit, muted).
- **Bas — rangée d'actions** : `Mark as Delivered` / `Mark as Returned`, deux boutons côte à côte (~50% chacun, ≥ 44px).
  - Les boutons n'apparaissent **que si l'action est pertinente** (même condition que desktop ; une commande déjà livrée/retournée n'affiche pas les boutons).

### 6.3 Liste
- Pagination Prev/Next tactile (§4.3).
- Le toggle `Tous / En attente` filtre la liste (logique existante).

### 6.4 Add Order (form court)
Feuille plein écran, une colonne : Product (select) · Quantity · Expected Delivery.
- Boutons **Discard / Add Order** épinglés en bas.

---

## 7. Suppliers 🟢

Application directe du pattern §4. Tableau actuel : Supplier Name / Product / Contact Number / Email / **Type** (badge) / On the way.

### 7.1 En-tête
- Titre « Suppliers » + bouton **« Add Supplier »**.

### 7.2 Carte fournisseur
- **Haut** : Supplier Name (gras) + **badge Type** à droite (Taking return vert / Not taking return rouge — §4.4).
- **Corps** (grille 2 colonnes) :
  - `Product` · `On the way`
  - `Contact` · `Email`
- **Email** : troncature propre par ellipsis (souvent long). Tappable `mailto:` et contact tappable `tel:` (affordance de lien, aucune logique métier changée).
- **Tap** : ouvre le détail/édition (comme desktop).

### 7.3 Add Supplier (form avec image)
Feuille plein écran, une colonne : zone image · Supplier Name · Contact Number · Email · Type (toggle).
- **Zone image** : le « Drag image here » desktop devient sur mobile **« Toucher pour choisir / prendre une photo »** (le glisser-déposer n'existe pas au tactile) → ouvre le sélecteur de fichiers / l'appareil photo.
- Boutons **Discard / Add Supplier** épinglés en bas.

---

## 8. Reports 🟢

Réutilise tout l'existant : cartes de stats (§3.2), graphique (§3.3), pattern liste (§4). Aucun motif nouveau.

### 8.1 Overview (stats)
Carte(s) à grille 2 colonnes reprenant §3.2. Métriques : Total Profit · Revenue · Sales (cost) · Net purchase value · Net sales value · MoM Profit.
- `MoM Profit` affiché avec flèche + couleur (vert si positif).
- Valeurs monétaires jamais tronquées.

### 8.2 Profit & Revenue (graphique)
Carte pleine largeur, courbe Profit/Revenue (Aug→Jun), règles §3.3 : légende sous le graphe, tooltip au tap, pas de scroll horizontal.

### 8.3 Best selling category → cartes
Tableau (Category / Turn Over / Increase By) en cartes légères :
- Nom de catégorie (gras) + `Turn Over`.
- `Increase By` en accent coloré avec flèche (vert ↑ / rouge ↓).

### 8.4 Best selling product → cartes
Tableau (Product / Product ID / Category / Remaining Quantity) en cartes :
- Nom produit (gras) + `Remaining Quantity` à droite.
- `Category` au corps ; `Product ID` discret en pied.

---

## 9. Manage Store 🟢

Déjà proche d'une liste de cartes dans la démo. On standardise sur le pattern §4, sans tout refondre.

### 9.1 En-tête
- Titre « Manage Store » + bouton **« Add Store »**.

### 9.2 Carte magasin
- **Haut** : nom du magasin (gras).
- **Corps** : adresse (multi-lignes autorisées) · téléphone (tappable `tel:`).
- **Action** : bouton **« Edit »** ≥ 44px (aligné à droite ou en pied de carte).

### 9.3 Add Store (form court)
Feuille plein écran : Store Name · Address · Phone. Boutons **Discard / Add Store** épinglés en bas.

---

## 10. Formulaires & Profile 🟢

### 10.1 Conventions de formulaire (communes)
Tous les formulaires de création/édition (Record a Sale, Add Product, Add Order, Add Supplier, Add Store, Profile) suivent le **même motif**, défini une seule fois :
- Feuille **plein écran**, une colonne, champs pleine largeur ≥ 48px, label visible.
- Boutons **Discard / [action primaire]** épinglés en bas, dans la zone du pouce.
- Validation **inline** par champ.
- Le bouton primaire ne doit jamais être masqué par le clavier (zone scrollable).
- Zones image : `tap pour choisir / prendre une photo` (pas de glisser-déposer tactile).

### 10.2 Profile
Une colonne, trois sections empilées :
- **Profile** : Name · Email · bouton **Save Changes** (pleine largeur).
- **Change Password** : Current · New · Confirm · bouton **Update Password** (pleine largeur).
- **About / Contact** : bloc d'information statique, lisible (liens tappables).

---

## Annexe — Inventaire des écrans (depuis la démo)

| Écran | Type | Travail principal | Statut spec |
|---|---|---|---|
| Login | Form | Mise en page tactile | 🟢 |
| Dashboard | Dense (stats+charts+tables) | Cartes + charts + 2 tables→cartes | 🟢 |
| Inventory (Products) | Table large | Pattern §4 + cartes produit | 🟢 |
| Orders | Table large + actions | Pattern §4 + rangée d'actions, en-tête 3 contrôles | 🟢 |
| Suppliers | Table large | Pattern §4, image→tap/caméra | 🟢 |
| Reports | Stats + charts + tables | §3.2 + §3.3 + §4 | 🟢 |
| Manage Store | Liste de blocs | Pattern §4 (déjà proche) | 🟢 |
| Tous les formulaires | Forms | Conventions communes §10.1 | 🟢 |
| Profile | Form | §10.2 | 🟢 |
