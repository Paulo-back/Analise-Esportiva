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

---

# Situação após o redesign (2026-10-18)

Auditoria refeita depois das Tarefas 1–7 do plano. As linhas abaixo apontam o código **atual**.

## Resolvidos pelo redesign

- Todos os itens **[plano T#]** da lista acima.
- Também foram resolvidos 5 itens que estavam como **[fix]**, porque os arquivos foram reescritos:
  foco visível em `RankingList`, `StandingsTable` e `StrengthHeatmap`; `tabular-nums` em `MonthlyGoalsChart` e `MetricList`.

## Pendências do fix (resolvidas em 2026-10-18)

Todas as 11 pendências acima foram corrigidas:
- link "Pular para o conteúdo" no `app/layout.tsx`, apontando para `<main id="conteudo">`;
- `PercentileBar` com `role="img"`;
- siglas da classificação (#, P, J, V-E-D, SG) em `<abbr title>`;
- tooltip das dimensões com `motion-reduce:transition-none`;
- visão na URL (`?visao=casa`; na comparação também `?visao_rival=`), via `lib/useVenueParam.ts`. O hook lê
  `window.location` depois de montar, então as páginas continuam estáticas (ISR);
- `text-balance` nos `h1`;
- nome do time na classificação quebra linha em vez de alargar a tabela;
- `themeColor` no `viewport`, `translate="no"` na marca, escudos com `loading="lazy"`.

## Problemas encontrados durante a implementação

### Alta prioridade
- ~~**next.config.ts:14 - CSP quebra o `npm run dev`.**~~ Resolvido: `'unsafe-eval'` só em desenvolvimento. O `script-src` não tem `'unsafe-eval'`, e o modo de
  desenvolvimento do Next usa `eval`. O navegador bloqueia (`EvalError … 'unsafe-eval' is not an allowed source`),
  o React nunca hidrata e **nenhum botão funciona em desenvolvimento** (Geral/Casa/Fora, "!", seletor de rival).
  Produção não é afetada: confirmado com `next build` + `next start`, onde a página hidrata e o clique funciona.
  Correção sugerida: acrescentar `'unsafe-eval'` ao `script-src` só quando `NODE_ENV === "development"`.
- **components/CompareDashboard.tsx:17 - vencedor invertido na comparação** (frente de dados).
  `LOWER_IS_BETTER` não inclui `xg_against`, `goals_against_1h` nem `goals_against_2h`. Visto com dados reais:
  em "Gols sofridos no 1º tempo", Chapecoense (1,00) aparece como melhor que Atletico Paranaense (0,68).

### Ambiente
- **`.env.local` está com o usuário admin (`postgres`).** A senha da `dashboard_readonly` no Postgres de
  produção (porta 21786) não confere. Voltar para a role somente-leitura assim que a senha for acertada.
- O banco de teste fica vazio entre execuções (os testes fazem `TRUNCATE`); não serve para conferência visual.

### Dados (frente de dados, só observado)
- Premier League: "Intensidade" sem nota ("—") para 6 times (Arsenal, Brighton, Chelsea, Brentford, Aston Villa, Tottenham).
- xG, xG sofrido e gols evitados aparecem como "—" no Brasileirão.
- "Gols por minuto" mostra "0 jogos com minuto dos gols" para o Atletico Paranaense.

### Polimento visual (baixa prioridade)
- No celular, os KPIs ficam um por linha (3 na liga, 4 no time) e ocupam muita altura; dá para usar 2 ou 3 colunas compactas.
- No celular, as opções "1º turno" e "2º turno" do seletor de visão ficam escondidas na rolagem horizontal,
  sem nenhuma indicação de que há mais opções (dá para usar um degradê na borda).
- No desktop, o bloco "Nota por dimensão" fica com espaço vazio embaixo quando a lista de fortes e fracos ao lado é longa.
