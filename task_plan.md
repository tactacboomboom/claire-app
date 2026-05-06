# Task Plan: Claire — Sprint 2 Governance + Refactor

## 🎯 Goal
Comprendre la méthode CPE en entier (rétro-ingénierie) avant de coder quoi que ce soit. Ensuite refactoriser le repo avec le pipeline complet φ₀ + 𝕍 + ε₀ + κ₀ + personas PSPO.

## 📍 Current Phase
**Phase 1 — Rétro-ingénierie CPE (priorité absolue, multi-sessions)**

## 🗓 Phases

### Phase 1 : Rétro-ingénierie de la méthode CPE ← PRIORITÉ 1
Objectif : relire, comprendre et mapper chaque fiche spec avant tout refactor.
Sources à couvrir :
- `vault/protocole/CPE/sources/clear-sky/` — 20 fiches (objets + morphismes)
- `vault/protocole/CPE/sources/saas-traduction/` — templates PWF

- [ ] Lire chaque fiche clear-sky une par une
- [ ] Pour chaque fiche : rôle dans la chaîne, équivalent Scrum/PSPO, ambiguïtés
- [ ] Lire les templates saas-traduction et comprendre leur rôle dans la méthode
- [ ] Produire une table CPE ↔ Scrum officiel (PSPO)
- [ ] Résoudre C1, C3, C5 dans les fiches sources (vault, pas dans le repo Claire)
- [ ] Valider la compréhension globale avant de toucher le code
- **Status:** pending (plusieurs jours)

### Phase 2 : Gouvernance specs — contradictions résolues
- [x] C2 — collision μ → garder μA/μV, distinction documentée dans CONTRACTS.md
- [x] C4 — périmètre Claire → documenté dans CONTRACTS.md (φ₀ + 𝕍 seulement)
- [ ] C1 — 𝕮ₙ ≡ task_plan.md → après rétro-ingénierie Phase 1
- [ ] C3 — double fichier 𝕍 → fusionner dans vault (pas dans repo Claire)
- [ ] C5 — numérotation incohérente clear-sky → renuméroter dans vault
- **Status:** in_progress

### Phase 3 : HTML Repo Navigator sur Vercel
- [ ] Page `/specs` listant toutes les fiches (symbole, type objet/morphisme, statut implémenté)
- [ ] Cliquable, visuel — avoir le repo sous les yeux dans le navigateur
- [ ] Rester sur feat/sprint2-governance, ne pas toucher main
- **Status:** pending (après Phase 1)

### Phase 4 : Refactor CONTRACTS.md + nouveaux types
- [ ] Ajouter type `FailingItem` pour ε₀
- [ ] Ajouter type `RefinementMessage` pour τ₀ → 𝕄₀
- [ ] Remplacer `globalAttractor: string` par `GlobalAttractor { vision, constraints[], scope }` — Décision C
- [ ] Vérification ontologique CONTRACTS.md × spec clear-sky
- **Status:** pending (après Phase 3)

### Phase 5 : Implémenter ε₀ + κ₀ + 𝕽 (boucle de raffinement + PWF automatique)
- [ ] `lib/diagnostics.ts` — checks A1/A2/A3/V1/V2/V3 par item
- [ ] `lib/refine.ts` — prompts ciblés par item failing
- [ ] Loop jusqu'à μA = 0 ou max 3 itérations
- [ ] **PWF auto-write** : après chaque génération, écrire task_plan / findings / progress — Décision A
- [ ] **Δ₀ per-prompt** : system prompt inclut le contrat actuel, Claire flague les questions hors-sprint — Décision B
- **Status:** pending

### Phase 6 : UI sprint2 + personas PSPO
- [ ] Afficher les checks qui tirent (diagnostic par item)
- [ ] Onglet personas PSPO (Scrum Master, PO, Dev, QA, Stakeholder)
- [ ] Indicateur raffinement (n itérations, μA avant/après)
- **Status:** pending

### Phase 7 : PR main ← feat/sprint2-governance
- [ ] Tests manuels complets
- [ ] PR GitHub + merge + déploiement Vercel
- **Status:** pending

---

## 🏹 Attracteur Global (𝕋ᴳ)
Claire est un outil de pilotage agile pour opérateurs solo jouant plusieurs rôles (COO/PO/dev). Les personas PSPO (Scrum Master, PO, Dev Team, QA, Stakeholder) sont les agents de validation du sprint contract CPE. Solo d'abord → équipe réelle ensuite (les humains remplacent les personas IA).

## ❓ Key Questions
1. Les personas PSPO : dans le system prompt ou fichier de config séparé ?
2. ε₀ : endpoint `/api/refine` séparé ou loop dans `/api/generate` ?
3. HTML specs navigator : Next.js page ou fichier HTML statique dans `/public` ?

## 🛠 Decisions Made
| Décision | Rationnel |
| :--- | :--- |
| Branche feat/sprint2-governance | Protéger main/Vercel pendant le refactor |
| PWF dans le repo (committé) | Persistance entre sessions sans reconstruction |
| Personas PSPO v1 | Standard, simple, évolutif vers FdP réelles |
| Garder μA/μV (C2) | Notations établies — distinction documentée dans CONTRACTS.md |
| Rétro-ingénierie avant code | Éviter d'avancer à l'aveugle sur une méthode développée il y a mois |

## 🚨 Errors Encountered
| Error | Attempt | Resolution |
| :--- | :--- | :--- |
| PWF absent pendant Sprint 1 | 1 | Créé rétroactivement dans la branche sprint2 |
| task_plan pas mis à jour après completion | 1 | Règle : ajouter nouvelles phases, ne jamais arrêter PWF |
| Refactor lancé avant compréhension complète | 1 | Stop — rétro-ingénierie Phase 1 obligatoire d'abord |

## 📝 Rappels
- Relire ce plan avant chaque décision majeure
- Rétro-ingénierie = PHASE 1, pas optionnelle
- Sources CPE : clear-sky (fiches) + saas-traduction (templates)
- Résoudre les contradictions de spec AVANT de toucher le code
- Strike 3 : approche radicalement différente
