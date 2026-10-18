# Redesign visual do Painel de Forças

Data: 2026-10-18 · Status: aprovado em brainstorming, aguardando revisão da spec

## Objetivo

Transformar o painel num dashboard visual em grade, no estilo do grid.is, com a identidade de cores do
TribunaStats (palpites-esportivos-site.vercel.app). Resolver quatro problemas do visual atual:

1. Falta de identidade: hoje parece um template genérico.
2. Hierarquia fraca: todos os blocos têm o mesmo peso.
3. Cor e contraste: o roxo saturado cansa, e o verde e o vermelho brigam com o fundo.
4. Polimento: espaçamento, estados de hover e foco, gráficos e celular.

## Fora de escopo

- Dados novos, queries, regras de `lib/`. Isso fica com a outra frente; `lib/` não é tocado.
- Gráficos novos (radar, forma recente). Podem vir depois, um por vez.
- Modo escuro. A base usa variáveis para ele entrar depois sem retrabalho.

## Decisões

| Tema | Decisão |
|---|---|
| Direção | "Híbrido": faixa escura no topo, conteúdo claro em grade de blocos |
| Paleta | Cores do Tribuna: `#071317`, teal `#02a0a0`, âmbar `#ffbd65`, degradê âmbar → teal |
| Mapa de forças | Verde/vermelho semântico, com o número sempre escrito na célula e legenda fraco → forte |
| Tema | Só claro |
| Alcance | Repaginar e reorganizar layouts, com os mesmos dados de hoje |
| Liga | "Forças em primeiro" |
| Time | "Perfil em primeiro" |
| Comparação | "Barras espelhadas" |

## 1. Fundação visual

### Cores (variáveis em `app/globals.css`)

| Variável | Valor | Uso |
|---|---|---|
| `page` | `#f2f6f6` | fundo da página |
| `surface` | `#ffffff` | blocos |
| `line` | `#dbe6e7` | bordas |
| `fg` | `#071317` | texto |
| `muted` | `#56706f` | texto secundário (5,3:1 no branco; 4,9:1 no fundo) |
| `band` | `#071317` | faixa do topo |
| `band-line` | `#1c343a` | borda e pílulas inativas na faixa |
| `band-muted` | `#6f8a8e` | texto secundário na faixa (5,1:1) |
| `brand-teal` | `#02a0a0` | barras, filetes, foco (só gráfico, 3,2:1) |
| `brand-teal-ink` | `#017a7a` | texto teal (5,2:1) |
| `brand-amber` | `#ffbd65` | degradê, destaque de pico |
| `brand-amber-ink` | `#b45309` | texto âmbar (5,0:1) |
| `team-a` | `#02a0a0` | time da página na comparação |
| `team-b` | `#f59e2b` | rival na comparação |
| `tier-5` | `#15803d`, texto branco (5,0:1) | forte (≥ 75) |
| `tier-4` | `#d3f5df`, texto `#0f5f30` (6,6:1) | bom (60–74) |
| `tier-3` | `#edf2f2`, texto `fg` | neutro |
| `tier-2` | `#fde0de`, texto `#9b1c1c` (6,6:1) | ruim (26–39) |
| `tier-1` | `#dc2626`, texto branco (4,8:1) | fraco (≤ 25) |

O degradê da marca é `linear-gradient(90deg, #ffbd65, #02a0a0)`, com texto `#071317` por cima (11,4:1 no âmbar).

As faixas de nota seguem `scoreTier` em `lib/profile.ts`, sem alteração.

### Tipografia

- Texto: **Barlow** (400, 500, 600, 700) via `next/font/google`.
- Títulos, rótulos de bloco e números grandes: **Barlow Condensed** (600, 700, 800), maiúsculas nos títulos.
- Números de tabela e KPI com `tabular-nums`.
- Sai a Outfit.

### Peças reutilizáveis

- **`Card`**: fundo `surface`, borda `line`, raio 14px, sombra leve (`0 1px 3px rgb(7 19 23 / .05)`).
  Título em Barlow Condensed maiúscula e subtítulo em `muted`. Ganha a prop `featured`, que aplica
  borda teal de 2px para o bloco estrela de cada página.
- **`KpiCard`**: filete vertical de 3px com o degradê da marca à esquerda; número em Barlow Condensed ~32px.
- **`Segmented`** (novo): controle segmentado para a visão (Total, Casa, Fora, 1º turno, 2º turno).
  É um `role="group"` com `aria-label` e botões com `aria-pressed`. A opção ativa fica em branco com texto em negrito.
  No celular rola na horizontal, sem empurrar a página.
- **Botão de ação** (ex.: "⇄ Comparar"): pílula com o degradê da marca e texto `fg`.
- **`MirrorBar`** (novo): uma linha de comparação (valor A, barra A, rótulo, barra B, valor B).
  O vencedor fica com cor cheia e o perdedor com opacidade reduzida; sem vencedor, as duas barras ficam em cinza.

### Topo e rodapé

- Topo: faixa `band` com o nome da marca (`BRAND_NAME`) escrito em degradê (texto com `background-clip`)
  e link para `/`.
- As pílulas de liga ficam na linha de título da página da liga, não na faixa global, porque o layout
  comum não carrega a lista de ligas.
- Rodapé: texto `muted`, centralizado, igual ao conteúdo de hoje.

### Interação

- Todo elemento clicável tem hover visível e foco por teclado com anel `brand-teal` (`focus-visible`).
- Links de time em tabelas e rankings mudam para `brand-teal-ink` no hover.

## 2. Layout das páginas

Grade de 12 colunas a partir de `lg`. Abaixo disso, uma coluna, na mesma ordem.

### Liga (`app/liga/[id]/page.tsx`)

1. Título: escudo, nome da liga em Condensed e linha "Temporada X · dados atualizados em DD/MM/AAAA".
   O `UpdatedAt` sobe do rodapé da página para cá. `LeaguePills` à direita.
2. 3 KPIs (4 colunas cada): Partidas, Gols, Média de gols.
3. Mapa de forças com `featured` (8 colunas) + Destaques, com o líder de cada dimensão (4 colunas).
   O mapa ganha uma legenda visual fraco → forte com as 5 cores, no lugar do subtítulo em texto.
4. Classificação (7 colunas) + Gols por mês (5 colunas), com o mês de maior valor em âmbar.
5. Melhores ataques, Melhores defesas e Mais indisciplinados (4 colunas cada).

### Time (`components/TeamDashboard.tsx`)

1. Título: escudo, nome, link da liga · posição · jogos. À direita, `Segmented` com as 5 visões e o botão "⇄ Comparar".
2. Aviso de amostra insuficiente: faixa âmbar suave (fundo âmbar claro, texto `brand-amber-ink`), não vermelha.
3. Nota por dimensão com `featured` (8 colunas): os 5 blocos são preenchidos com a cor da escala (`tier-1…5`),
   como no mapa da liga. O botão "!" com a explicação é mantido.
   Ao lado, Pontos fortes · fracos (4 colunas), em duas listas de pílulas.
   Quando a amostra é insuficiente, esta linha some, como hoje.
4. 4 KPIs: Campanha, Gols pró, Gols sofridos, Sem sofrer gol.
5. Métricas com barras de percentil (7 colunas) + Gols por mês (5 colunas).
6. Gols por tempo + Gols por minuto (6 colunas cada).

Nos gráficos de gols, marcados ficam em `brand-teal` e sofridos em `tier-1`; os subtítulos passam a dizer
"marcados (teal) · sofridos (vermelho)".

### Comparação (`components/CompareDashboard.tsx`)

1. Cabeçalho VS: escudo e nome de cada lado, com anel `team-a` e `team-b`. Embaixo de cada nome, o seu `Segmented`.
   `RivalSelect` vai para o canto do cabeçalho.
2. Placar: "{time A} vence N de M dimensões", contando as dimensões em que as duas notas existem e são
   diferentes. Empate: "Empate em dimensões (N a N)". Sem notas comparáveis: a linha não aparece.
3. Bloco Dimensões: `MirrorBar` com escala fixa de 0 a 100.
4. Bloco Métricas: `MirrorBar` agrupado por dimensão. A barra é proporcional ao maior valor da linha.
   O vencedor vem de `compareWinner`, sem mudança. Métricas de estilo aparecem sem vencedor (cinza).
   Valor ausente: "—" e barra vazia.
5. No celular (< `sm`), o rótulo da métrica sobe para cima das barras.

## 3. Arquivos

| Arquivo | Mudança |
|---|---|
| `app/globals.css` | variáveis novas; os nomes antigos (`accent`, `card`, `card-inner`, `strong`, `weak`…) saem |
| `app/layout.tsx` | fontes, faixa do topo, rodapé |
| `app/liga/[id]/page.tsx` | grade nova |
| `app/error.tsx`, `app/not-found.tsx` | visual novo |
| `components/Card.tsx` | visual + prop `featured` |
| `components/KpiCard.tsx` | filete e número |
| `components/Segmented.tsx` | novo |
| `components/MirrorBar.tsx` | novo |
| `components/tierClass.ts` | aponta para `tier-1…5` |
| `components/TeamDashboard.tsx` | grade nova + `Segmented` |
| `components/CompareDashboard.tsx` | VS, placar, `MirrorBar`, `Segmented` |
| `components/DimensionScores.tsx` | blocos preenchidos pela escala |
| `components/MonthlyGoalsChart.tsx` | cores novas + opção de destacar o pico |
| `StrengthHeatmap`, `StandingsTable`, `RankingList`, `LeaguePills`, `PercentileBar`, `StrengthPills`, `RivalSelect`, `UpdatedAt`, `Crest` | só classes |

`lib/` não muda.

## 4. Verificação

1. `npm test` e `npm run typecheck` a cada etapa; `npm run build` no fim.
2. Testes novos:
   - `Segmented`: clicar troca a visão e `aria-pressed` acompanha.
   - `MirrorBar`: o vencedor certo é destacado, inclusive em "menor é melhor"; as métricas de estilo ficam sem vencedor.
   - Comparação: o texto do placar em vitória, empate e sem dados.
   Os testes existentes olham texto e comportamento, não classes; os que dependem de textos alterados
   (legendas dos gráficos) são atualizados junto.
3. Auditoria com a skill `web-design-guidelines` nos arquivos alterados, antes e depois; os apontamentos são corrigidos.
4. Conferência no navegador (`npm run dev`) das três páginas em 1280px e 375px, sem rolagem horizontal.
   Requer banco com dados: usar o de teste se tiver dados; senão, o usuário roda com o seu `.env.local`.
5. Commits por etapa: fundação → liga → time → comparação → polimento da auditoria.

## Referências

- Mockups do brainstorming: `.superpowers/brainstorm/1683-1792292683/content/` (não versionado).
- Paleta de origem: CSS de palpites-esportivos-site.vercel.app (`--pe-bg`, `--pe-primary`, `--pe-accent`…).
