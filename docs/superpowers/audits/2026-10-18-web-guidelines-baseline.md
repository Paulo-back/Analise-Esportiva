# Auditoria de base: Web Interface Guidelines

Data: 2026-10-18 · Commit auditado: `5b47ea4` (antes do redesign)
Regras: vercel-labs/web-interface-guidelines (`command.md`), via skill `web-design-guidelines`.

São pontos de atenção para corrigir depois. Cada item indica se o redesign já o resolve, seguindo o
plano `docs/superpowers/plans/2026-10-18-redesign-visual.md`:

- **[plano T#]**: resolvido pela tarefa indicada do plano.
- **[fix]**: o plano não cobre; corrigir num fix à parte.

Fica de fora a regra "Title Case": ela é da língua inglesa, e o site usa a caixa normal do português.

## Resumo dos temas

| Tema | Ocorrências | Situação |
|---|---|---|
| Foco por teclado invisível em links, botões e select | 12 | parte no plano, resto [fix] |
| Estado ativo só por cor (sem `aria-pressed` / `aria-current`) | 3 | plano T3, T4 |
| Números sem `tabular-nums` | 7 | parte no plano, resto [fix] |
| Avisos com visual de erro | 2 | plano T2, T5 |
| Estado da visão (Geral/Casa/Fora…) fora da URL | 2 | [fix] |
| `aria-label` ignorado em `div` sem papel | 1 | [fix] |
| Sem link "pular para o conteúdo" | 1 | [fix] |
| Abreviações de tabela sem explicação para leitor de tela | 1 | [fix] |
| Escudos sem `loading="lazy"` | 1 | [fix] |
| Falta `theme-color` e `translate="no"` na marca | 2 | [fix] |

## app/layout.tsx

- app/layout.tsx:13 - falta link "pular para o conteúdo" apontando para `<main>` **[fix]**
- app/layout.tsx:16 - link da marca sem `focus-visible` nem `hover` **[plano T1 refaz o topo; incluir foco]**
- app/layout.tsx:17 - nome da marca sem `translate="no"` **[fix]**
- app/layout.tsx:9 - falta `themeColor` no metadata (deveria ser `#071317`, a cor da faixa) **[fix]**

## app/globals.css

- app/globals.css:20 - `color-scheme: dark` num site que passará a ser claro **[plano T1]**

## app/error.tsx

- app/error.tsx:8 - botão sem `focus-visible` e sem `hover` **[plano T2]**
- app/error.tsx:6 - título sem `text-balance` **[fix]**

## app/not-found.tsx

- app/not-found.tsx:7 - link sem `focus-visible` e sem `hover` **[plano T2]**

## app/liga/[id]/page.tsx

- app/liga/[id]/page.tsx:75 - legenda do mapa só em texto descrevendo cores; falta legenda visual **[plano T4]**
- app/liga/[id]/page.tsx:58 - `h1` sem `text-balance` **[fix]**

## app/time/[id]/vs/[rivalId]/page.tsx

- app/time/[id]/vs/[rivalId]/page.tsx:26 - "Comparação indisponível" é aviso, mas tem visual de erro (vermelho) **[plano T2]**
- app/time/[id]/vs/[rivalId]/page.tsx:31 - link sem `focus-visible` e sem `hover` **[plano T2; incluir foco]**

## components/CompareDashboard.tsx

- components/CompareDashboard.tsx:29 - botões de visão sem `aria-pressed`; o estado ativo só aparece pela cor **[plano T3/T6]**
- components/CompareDashboard.tsx:30 - botões de visão sem `focus-visible` e sem `hover` **[plano T3/T6]**
- components/CompareDashboard.tsx:52 - link do time A sem `focus-visible` **[plano T6; incluir foco]**
- components/CompareDashboard.tsx:59 - comparação em grade de `span`; números sem `tabular-nums` **[plano T6]**
- components/CompareDashboard.tsx:39 - visões de A e B em `useState`; não vão para a URL nem dá para compartilhar o link **[fix]**

## components/TeamDashboard.tsx

- components/TeamDashboard.tsx:61 - botões de visão sem `aria-pressed` **[plano T3/T5]**
- components/TeamDashboard.tsx:65 - botões de visão sem `focus-visible`; o inativo não tem `hover` **[plano T3/T5]**
- components/TeamDashboard.tsx:73 - link "Comparar" sem `focus-visible` e sem `hover` **[plano T5; incluir foco]**
- components/TeamDashboard.tsx:82 - aviso de amostra insuficiente com visual de erro **[plano T5]**
- components/TeamDashboard.tsx:30 - visão em `useState`; não vai para a URL (`?visao=casa`) **[fix]**

## components/KpiCard.tsx

- components/KpiCard.tsx:6 - valor sem `tabular-nums` **[plano T2]**

## components/LeaguePills.tsx

- components/LeaguePills.tsx:11 - links sem `focus-visible` **[plano T4]**
- components/LeaguePills.tsx:8 - liga ativa sem `aria-current="page"` **[plano T4]**

## components/RankingList.tsx

- components/RankingList.tsx:35 - link sem `focus-visible` **[fix]**
- components/RankingList.tsx:36 - valor sem `tabular-nums` **[plano T4]**

## components/StandingsTable.tsx

- components/StandingsTable.tsx:34 - colunas numéricas sem `tabular-nums` **[plano T4]**
- components/StandingsTable.tsx:39 - cabeçalhos "P", "J", "SG", "V-E-D" sem `<abbr title>` para leitor de tela **[fix]**
- components/StandingsTable.tsx:53 - link sem `focus-visible` **[fix]**
- components/StandingsTable.tsx:53 - `whitespace-nowrap` sem `truncate`/`min-w-0`; nome longo alarga a tabela **[fix]**

## components/StrengthHeatmap.tsx

- components/StrengthHeatmap.tsx:22 - notas sem `tabular-nums` **[plano T4]**
- components/StrengthHeatmap.tsx:40 - link sem `focus-visible` **[fix]**

## components/DimensionScores.tsx

- components/DimensionScores.tsx:39 - tooltip com `transition-opacity` sem `motion-reduce:transition-none` **[fix]**

## components/PercentileBar.tsx

- components/PercentileBar.tsx:7 - `aria-label` em `div` sem `role`; o leitor de tela ignora. Usar `role="img"` (ou `meter`) **[fix]**

## components/MonthlyGoalsChart.tsx

- components/MonthlyGoalsChart.tsx:17 - valores sem `tabular-nums` **[fix]**

## components/MetricList.tsx

- components/MetricList.tsx:10 - valores sem `tabular-nums` **[fix]**

## components/RivalSelect.tsx

- components/RivalSelect.tsx:12 - select sem `focus-visible` **[plano T6]**

## components/Crest.tsx

- components/Crest.tsx:12 - `<img>` sem `loading="lazy"`; a classificação carrega 20 escudos de uma vez **[fix]**

## Sem apontamentos

- components/Card.tsx ✓
- components/StrengthPills.tsx ✓
- components/UpdatedAt.tsx ✓ (formatação via `Intl.DateTimeFormat`, renderizado no servidor)

## Outras observações da Tarefa 0

- **Banco de teste vazio.** `leagues`, `teams`, `fixtures` e `team_profile_metrics` estão com 0 linhas
  (os testes fazem `TRUNCATE`). A conferência visual depende de outro banco: o `.env.local` do usuário ou uma carga de exemplo.
- **Regra de vencedor na comparação** (frente de dados): `LOWER_IS_BETTER` em
  `components/CompareDashboard.tsx:13` não inclui `xg_against`, `goals_against_1h` nem `goals_against_2h`.
  Por isso a comparação dá vitória a quem sofre mais. **[fix]**
