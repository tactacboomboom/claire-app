# Task Plan: Claire — Sprint 2 Governance + Refactor

## 🎯 Goal
Refactoriser le repo Claire en appliquant la méthode PWF : corriger les contradictions de spec, mettre à jour CONTRACTS.md, puis implémenter le pipeline complet φ₀ + 𝕍 + ε₀ + κ₀.

## 📍 Current Phase
**Phase 1 — Gouvernance des specs**

## 🗓 Phases

### Phase 1 : Gouvernance des specs
- [ ] Résoudre C2 — collision symbole μ (μₙ exécution ≠ μA/μV scoring)
- [ ] Résoudre C1 — 𝕮ₙ ≡ task_plan.md → clarifier objet logique vs implémentation
- [ ] Résoudre C3 — fusionner les deux fichiers 𝕍 en 𝕍ₙ générique
- [ ] Résoudre C4 — documenter périmètre Claire : φ₀ + 𝕍 seulement (𝕊₀ hors scope Sprint 1)
- [ ] Résoudre C5 — renuméroter les fichiers clear-sky en schéma uniforme 3 chiffres
- [ ] Mettre à jour CONTRACTS.md avec les corrections
- [ ] Mettre à jour INTENTION.md avec attracteur global PSPO + personas
- **Status:** in_progress

### Phase 2 : Refactor CONTRACTS.md
- [ ] Renommer μA/μV en notation non-conflictuelle (décision à prendre)
- [ ] Ajouter type `FailingItem` pour ε₀ (objets (𝕡₀, 𝔸₀))
- [ ] Ajouter type `RefinementMessage` pour τ₀ → 𝕄₀
- [ ] Documenter périmètre explicitement dans CONTRACTS.md
- [ ] Vérification ontologique : intersection CONTRACTS.md × spec clear-sky
- **Status:** pending

### Phase 3 : Implémenter ε₀
- [ ] Créer `lib/diagnostics.ts` — extraire les checks qui tirent (A1/A2/A3/V1/V2/V3) par composant
- [ ] Retourner `FailingItem[]` depuis `scoreContract()` ou fonction séparée
- [ ] Tests unitaires sur cas de base
- **Status:** pending

### Phase 4 : Implémenter τ₀ + κ₀ (boucle de raffinement)
- [ ] Créer `lib/refine.ts` — construire les prompts ciblés par item failing
- [ ] Modifier `route.ts` — ajouter endpoint `/api/refine` ou loop dans `/api/generate`
- [ ] Scorer 𝕮₁, loop jusqu'à μA = 0 ou max 3 itérations
- **Status:** pending

### Phase 5 : UI sprint2
- [ ] Afficher les checks qui tirent (diagnostic visible par item)
- [ ] Ajouter onglet personas PSPO (Scrum Master, PO, Dev, QA, Stakeholder)
- [ ] Indicateur de progression du raffinement (n itérations, μA avant/après)
- **Status:** pending

### Phase 6 : PR main ← feat/sprint2-governance
- [ ] Tests manuels complets
- [ ] PR GitHub avec description
- [ ] Merge + déploiement Vercel
- **Status:** pending

---

## 🏹 Attracteur Global (𝕋ᴳ)
Claire est un outil de pilotage agile pour opérateurs solo qui jouent plusieurs rôles simultanément (COO/PO/dev). Il matérialise les personas PSPO (Scrum Master, Product Owner, Dev Team, QA, Stakeholder) comme agents de validation d'un sprint contract CPE. Si ça fonctionne en solo, ça fonctionne encore mieux en équipe réelle où les humains prennent les rôles des personas.

## ❓ Key Questions
1. Renommer μA/μV → quelle notation ? (αA/αV ? sA/sV ? garder μ en documentant la distinction ?)
2. Les personas PSPO sont-ils dans le system prompt ou dans un fichier de config séparé ?
3. ε₀ est-il un endpoint séparé ou intégré dans `/api/generate` ?

## 🛠 Decisions Made
| Décision | Rationnel |
| :--- | :--- |
| Branche feat/sprint2-governance | Protéger main/Vercel pendant le refactor |
| PWF dans le repo (committé) | Persistance entre sessions sans reconstruction |
| Personas PSPO comme attracteur v1 | Simple, standard, évolutif vers FdP réelles plus tard |

## 🚨 Errors Encountered
| Error | Attempt | Resolution |
| :--- | :--- | :--- |
| PWF absent pendant Sprint 1 | 1 | Créé rétroactivement dans la branche sprint2 |
| task_plan pas mis à jour après completion | 1 | Règle ajoutée : ajouter nouvelles phases, ne jamais arrêter PWF |

## 📝 Rappels
- Relire ce plan avant chaque décision majeure
- Résoudre les contradictions de spec AVANT de toucher le code
- Après 2 recherches → écrire dans findings.md
- Strike 3 : approche radicalement différente
