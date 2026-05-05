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

### C2 — Collision symbole μ
Spec : μₙ = morphisme d'instanciation du sprint. Claire : μA/μV = métriques de scoring. Même lettre, deux concepts distincts. Options : renommer en αA/αV, ou documenter la distinction.

### C3 — Double fichier 𝕍
`050_𝕍` (sprint 0) et `0150_𝕍` (sprint 1+) — même morphisme défini deux fois. Fusionner en `𝕍ₙ` générique.

### C4 — Périmètre Claire non documenté
Claire implémente φ₀ + 𝕍 uniquement. 𝕊₀ (sprint execution) hors scope Sprint 1. À documenter dans CONTRACTS.md.

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

## ⚠️ Issues Résolus Sprint 1

| Problème | Résolution |
| :--- | :--- |
| EBADF -4083 npm sur Google Drive | Projet déplacé sur C:\ |
| React.FormEvent deprecated React 19 | React.SyntheticEvent<HTMLFormElement> |
| PROOF_REGEX A2 toujours 1 | (?:...) non-capturant + .match() |
