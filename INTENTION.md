# INTENTION — Claire App

## Ce que Claire doit faire (immuable)

Claire est une interface web qui prend une intention brute en entrée
et retourne un sprint contract CPE complet et scoré en sortie.

## Flux exact (φ₀)

1. L'utilisateur saisit son intention brute (𝕀₀) dans un textarea
2. Il clique "Générer"
3. Claire appelle le LLM avec un prompt CPE structuré
4. Le LLM retourne un sprint contract : Goal + Backlog + DoD
5. Claire calcule les scores μA et μV pour chaque composant
6. Claire affiche le contrat + les scores + la décision PASS/FAIL
7. L'utilisateur peut copier le contrat

## Ce que Claire ne fait PAS (dans ce sprint)

- Pas d'authentification
- Pas de persistance (pas de base de données)
- Pas de simulation de rôles
- Pas de chaînage κₙ → 𝕮ₙ₊₁
- Pas d'attracteur global persistant

## Invariants comportementaux

- Le scoring est calculé côté serveur (pas côté client)
- Un contrat avec μA(C) ≥ 0.5 affiche explicitement FAIL en rouge
- Le LLM reçoit toujours le prompt CPE complet (Goal + Backlog + DoD en une seule passe)
- L'interface est en français
