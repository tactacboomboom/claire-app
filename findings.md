# Findings & Decisions — Claire Sprint 2

## 🎯 Requirements & Contraintes

- Vercel déploie depuis main → ne jamais merger sans validation complète
- Next.js App Router (v16.2.4), React 19, TypeScript strict, Tailwind v4
- Anthropic claude-opus-4-7 pour les appels LLM
- Scoring déterministe : même contrat = même score (invariant fondamental)
- Pas d'auth, pas de persistence — scope MVP maintenu

---

## 🔍 Contradictions Spec (Gouvernance)

### C1 — 𝕮ₙ ≡ task_plan.md
Spec canonique dit `𝕮ₙ ≡ task_plan.md` (fichier PWF markdown). Claire implémente 𝕮₀ comme `SprintContract` (TypeScript). Résolution : 𝕮ₙ = objet logique abstrait. Les deux sont des implémentations.

### C2 — Collision symbole μ ✅ RÉSOLU
**Décision (2026-05-05) :** Garder μA/μV dans Claire.
**Distinction à documenter dans CONTRACTS.md :**
- μA / μV = métriques de scoring du contrat (ambiguïté / validation) — propres à Claire
- μₙ = morphisme d'instanciation du sprint dans la spec CPE canonique — hors scope Claire Sprint 1

### C3 — Double fichier 𝕍
`050_𝕍` (sprint 0) et `0150_𝕍` (sprint 1+) — même morphisme défini deux fois. Fusionner en `𝕍ₙ` générique.

### C4 — Périmètre Claire non documenté ✅ RÉSOLU
**Décision (2026-05-05) :** Documenté dans CONTRACTS.md section "Périmètre CPE" et "Notation μ".

### C5 — Numérotation incohérente clear-sky
Deux schémas : `010_` (3 chiffres) et `0100_` (4 chiffres). Renuméroter uniformément.

---

## 🗺 Pipeline CPE → Mapping Code Claire

| Symbole | Nature | Code | Statut |
|---------|--------|------|--------|
| 𝕀₀ | Objet | `string` GenerateRequest.intention | ✅ |
| φ₀ | Morphisme 𝕀→𝕮₀ | prompts.ts + route.ts | ✅ |
| 𝕮₀ | Objet | `SprintContract` | ✅ |
| 𝕍 | Morphisme 𝕮₀→scores | scoring.ts `scoreContract()` | ✅ |
| 𝕊₀ | Objet | `GenerateResponse` {contract, score} | ✅ |
| 𝕋ᴳ | Objet | champ `SprintContract.globalAttractor` | ✅ partiel |
| Δ₀ | Objet | non défini | ❌ |
| 𝕽 | Filtre | non défini | ❌ |
| ε₀ | Morphisme 𝕊₀→(𝕡₀,𝔸₀) | non implémenté | ❌ |
| τ₀ | Morphisme | non implémenté | ❌ |
| κ₀ | Morphisme | non implémenté | ❌ |
| 𝕮₁ | Objet | même type SprintContract | ❌ |

---

## 🛠 Décisions Techniques Sprint 1

| Décision | Rationnel |
| :--- | :--- |
| Scoring pur TypeScript (pas LLM) | Déterminisme — invariant fondamental |
| PROOF_REGEX flag g + groupes (?:...) | Éviter .test() stateful et inflation .match() |
| suppressHydrationWarning html + textarea | LanguageTool injecte des attributs DOM |
| text-black direct sur chaque élément | body text-gray-900 ne cascade pas (Tailwind v4 + browser defaults) |

---

## 🧠 Décisions Architecturales — Session 2026-05-06

### Insight fondamental : CPE doit être nilpotent
Le pipeline CPE converge vers 𝕋ᴳ (attracteur global) si et seulement si 𝕽 force l'écriture des décisions. Sans ça, il dégénère :
- Sans 𝕽 → **identité** (chaque sprint produit le même contrat, 𝕄ₙ vide)
- Sans 𝕋ᴳ → **circulaire** (sprints produisent des artefacts sans direction)
- Avec 𝕽 + 𝕋ᴳ + Δ₀ actifs → **nilpotent** (convergence réelle vers l'objectif)

### Décision A : 𝕽 = PWF → Claire automatise les fichiers
Claire doit générer/mettre à jour automatiquement `task_plan.md`, `findings.md`, `progress.md` après chaque sprint. C'est ce qui garantit que 𝕄ₙ s'enrichit réellement entre les cycles.
**Implication code :** nouvel endpoint ou action post-génération qui écrit les fichiers PWF.

### Décision B : Δ₀ = filtre per-prompt (capteur anti-dérive)
À chaque message humain, Claire évalue si la question est dans le périmètre du sprint actuel. Si hors-sprint, Claire répond : "cette question s'écarte du contrat en cours — revenir au sprint ou créer un nouveau sprint."
**Implication code :** system prompt inclut le contrat actuel comme référence, avec instruction de flagging.

### Décision C : 𝕋ᴳ = objet contraint (pas texte libre)
Le champ `globalAttractor` dans `SprintContract` est actuellement un `string` libre. Il doit devenir un objet structuré contraint par 𝕽, pour que κₙ puisse s'appuyer dessus formellement.
**Implication code :** nouveau type `GlobalAttractor { vision: string, constraints: string[], scope: string }` dans CONTRACTS.md.

---

## 🔭 Prochaine étape (Phase 1)

Sources à relire pour rétro-ingénierie :
- `vault/protocole/CPE/sources/clear-sky/` — 20 fiches spec (objets + morphismes du pipeline)
- `vault/protocole/CPE/sources/saas-traduction/` — templates PWF (task_plan, findings, progress)

Objectif : comprendre comment chaque élément CPE étend ou inclut Scrum/Agile (PSPO), et résoudre C1/C3/C5 dans les sources vault.

---

## ⚠️ Issues Résolus Sprint 1

| Problème | Résolution |
| :--- | :--- |
| EBADF -4083 npm sur Google Drive | Projet déplacé sur C:\ |
| React.FormEvent deprecated React 19 | React.SyntheticEvent<HTMLFormElement> |
| PROOF_REGEX A2 toujours 1 | (?:...) non-capturant + .match() |
