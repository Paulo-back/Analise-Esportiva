# Plano de implementação — Redesign visual

Spec: `docs/superpowers/specs/2026-10-18-redesign-visual-design.md`

Regras gerais:

- `lib/` não é tocado. Só `app/`, `components/`, `tests/` e `app/globals.css`.
- Cada tarefa termina com `npm test` e `npm run typecheck` verdes e um commit próprio.
- O site precisa continuar utilizável entre tarefas. Por isso a Tarefa 1 mantém os nomes de cor antigos
  como apelidos dos novos, e a Tarefa 7 remove esses apelidos.
- Textos visíveis continuam em português e os testes existentes continuam válidos. Quando um texto muda,
  o teste muda no mesmo commit.

---

## Tarefa 0 — Linha de base

1. Rodar `npm test` e `npm run typecheck` e anotar o resultado (devem estar verdes).
2. Rodar a skill `web-design-guidelines` em `app/**/*.tsx` e `components/**/*.tsx`. Guardar os
   apontamentos em `.superpowers/audit-antes.md` (não versionado) para comparar na Tarefa 7.
3. Testar se o banco de `.env.test.local` tem dados de liga para a conferência visual
   (`npm run dev` com `DATABASE_URL` dele e abrir `/`). Se não tiver, combinar com o usuário o uso do `.env.local` dele.

Sem commit.

---

## Tarefa 1 — Cores, fontes, topo e rodapé

**Arquivos:** `app/globals.css`, `app/layout.tsx`

### `app/globals.css`

```css
@import "tailwindcss";

@theme inline {
  --color-page: #f2f6f6;
  --color-surface: #ffffff;
  --color-line: #dbe6e7;
  --color-fg: #071317;
  --color-muted: #56706f;
  --color-band: #071317;
  --color-band-line: #1c343a;
  --color-band-muted: #6f8a8e;
  --color-brand-teal: #02a0a0;
  --color-brand-teal-ink: #017a7a;
  --color-brand-amber: #ffbd65;
  --color-brand-amber-ink: #b45309;
  --color-brand-amber-soft: #fff4e3;
  --color-team-a: #02a0a0;
  --color-team-b: #f59e2b;
  --color-tier-5: #15803d;  --color-tier-5-fg: #ffffff;
  --color-tier-4: #d3f5df;  --color-tier-4-fg: #0f5f30;
  --color-tier-3: #edf2f2;  --color-tier-3-fg: #071317;
  --color-tier-2: #fde0de;  --color-tier-2-fg: #9b1c1c;
  --color-tier-1: #dc2626;  --color-tier-1-fg: #ffffff;
  --font-sans: var(--font-barlow);
  --font-display: var(--font-barlow-condensed);

  /* Apelidos temporários dos nomes antigos — removidos na Tarefa 7. */
  --color-bg: var(--color-page);
  --color-card: var(--color-surface);
  --color-card-inner: var(--color-tier-3);
  --color-accent: var(--color-brand-teal-ink);
  --color-strong: var(--color-tier-4-fg);
  --color-strong-bg: var(--color-tier-4);
  --color-weak: var(--color-tier-2-fg);
  --color-weak-bg: var(--color-tier-2);
}

@utility bg-brand-gradient {
  background-image: linear-gradient(90deg, var(--color-brand-amber), var(--color-brand-teal));
}

@utility text-brand-gradient {
  background-image: linear-gradient(90deg, var(--color-brand-amber), var(--color-brand-teal));
  background-clip: text;
  color: transparent;
}

:root { color-scheme: light; }

body {
  background: var(--color-page);
  color: var(--color-fg);
  font-family: var(--font-sans), system-ui, sans-serif;
}
```

Com os apelidos, `text-bg` em cima de `bg-accent` (pílulas ativas) continua legível: `#f2f6f6` sobre `#017a7a`.

### `app/layout.tsx`

- Trocar `Outfit` por `Barlow` (pesos 400, 500, 600, 700, variável `--font-barlow`) e
  `Barlow_Condensed` (600, 700, 800, variável `--font-barlow-condensed`), ambos `latin` e `latin-ext`.
- Topo: `<header className="border-b border-band-line bg-band">` com um container `max-w-7xl` e a marca
  `<Link href="/" className="font-display text-xl font-extrabold uppercase tracking-wide text-brand-gradient">`.
- Rodapé igual ao de hoje, com `text-muted`.

**Verificação:** testes e typecheck verdes; no navegador, o site fica claro com faixa escura e nada some.
**Commit:** `feat(ui): new palette, Barlow fonts and dark top band`

---

## Tarefa 2 — Peças base

**Arquivos:** `components/Card.tsx`, `components/KpiCard.tsx`, `components/tierClass.ts`,
`components/Crest.tsx`, `app/error.tsx`, `app/not-found.tsx`, `app/time/[id]/vs/[rivalId]/page.tsx`
(só o quadro "Comparação indisponível").

- `Card`: nova prop `featured?: boolean`.
  Classes: `rounded-[14px] border bg-surface p-4 shadow-[0_1px_3px_rgb(7_19_23/0.05)]`, com
  `border-line` no normal e `border-2 border-brand-teal` no `featured`.
  Título: `font-display text-base font-bold uppercase tracking-wide`. Subtítulo: `text-xs text-muted mb-3`.
- `KpiCard`: `Card` com `relative overflow-hidden pl-5` e um `<span aria-hidden>` absoluto de 3px à
  esquerda com `bg-gradient-to-b from-brand-amber to-brand-teal`. Valor em
  `font-display text-[32px] font-bold leading-none tabular-nums`.
- `tierClass.ts`:
  ```ts
  export const TIER_CLASS: Record<ScoreTier, string> = {
    strong: "bg-tier-5 text-tier-5-fg",
    good: "bg-tier-4 text-tier-4-fg",
    neutral: "bg-tier-3 text-tier-3-fg",
    poor: "bg-tier-2 text-tier-2-fg",
    weak: "bg-tier-1 text-tier-1-fg",
  };
  ```
- `Crest`: o marcador sem imagem passa a usar `bg-tier-3`.
- `error.tsx`: botão com `bg-brand-gradient text-fg font-bold`, foco
  `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal`. Título em `font-display uppercase`.
- `not-found.tsx`: o link vira o mesmo botão em degradê.
- "Comparação indisponível": `Card` com fundo `bg-brand-amber-soft`, borda âmbar e texto `text-brand-amber-ink`
  (é aviso, não erro).

**Verificação:** testes e typecheck.
**Commit:** `feat(ui): restyle Card, KpiCard, tier scale and error pages`

---

## Tarefa 3 — `Segmented` (TDD)

**Arquivos:** `components/Segmented.tsx` (novo), `tests/components/segmented.test.tsx` (novo)

### Teste primeiro

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Segmented } from "@/components/Segmented";

const options = [
  { value: "all", label: "Geral" },
  { value: "home", label: "Casa" },
] as const;

describe("Segmented", () => {
  it("marca a opção ativa com aria-pressed e avisa a troca", () => {
    const onChange = vi.fn();
    render(<Segmented label="Visão" options={options} value="all" onChange={onChange} />);
    expect(screen.getByRole("group", { name: "Visão" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Geral" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Casa" })).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: "Casa" }));
    expect(onChange).toHaveBeenCalledWith("home");
  });
});
```

### Componente

```tsx
export function Segmented<T extends string>({
  label, options, value, onChange, size = "md",
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  // Com 5 visões não cabe no celular: rola dentro de si em vez de empurrar a página.
  return (
    <div role="group" aria-label={label}
      className="flex max-w-full gap-0.5 overflow-x-auto rounded-full bg-tier-3 p-0.5">
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}
          className={`shrink-0 whitespace-nowrap rounded-full ${size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs"} ${
            o.value === value ? "bg-surface font-bold shadow-sm" : "text-muted hover:text-fg"
          } focus-visible:outline-2 focus-visible:outline-brand-teal`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
```

**Commit:** `feat(ui): add Segmented control`

---

## Tarefa 4 — Página da liga ("Forças em primeiro")

**Arquivos:** `app/liga/[id]/page.tsx`, `components/StrengthHeatmap.tsx`, `components/StandingsTable.tsx`,
`components/RankingList.tsx`, `components/LeaguePills.tsx`, `components/MonthlyGoalsChart.tsx`,
`components/UpdatedAt.tsx`, `tests/components/basics.test.tsx`

- `MonthlyGoalsChart`: nova prop `highlightMax?: boolean`. Quando ligada, a barra `primary` de maior valor
  fica `bg-brand-amber` e as demais `bg-brand-teal`. A barra `secondary` usa `bg-tier-1`.
  Teste novo: com `highlightMax`, a maior barra recebe `data-peak="true"` (atributo só para o teste e
  leitura, sem depender de classe).
- `StrengthHeatmap`: células com `TIER_CLASS` (já resolvido na Tarefa 2), números `tabular-nums`, links
  `hover:text-brand-teal-ink`. Ganha a legenda abaixo da tabela: "fraco" + 5 quadrados `tier-1…5` + "forte",
  com `aria-hidden` nos quadrados.
- `StandingsTable`: linhas zebradas com `even:bg-page`, pontos em `font-bold tabular-nums`, links `hover:text-brand-teal-ink`.
- `RankingList`: o valor vira `rounded-full bg-tier-3 px-2 text-xs font-bold tabular-nums` (sai o fundo acento).
- `LeaguePills`: ativa com `bg-brand-gradient text-fg font-bold`, inativa com `border-line bg-surface hover:border-brand-teal`,
  e foco visível. Adicionar `aria-current="page"` na ativa.
- `UpdatedAt`: nova prop `className` (padrão o de hoje) para poder aparecer alinhado à esquerda no título.
- Página:
  ```
  título (escudo 40 + h1 font-display text-3xl uppercase + "Temporada X · <UpdatedAt>")  | LeaguePills
  grid gap-4 lg:grid-cols-12
    KpiCard ×3 → lg:col-span-4
    Card featured "Mapa de forças" → lg:col-span-8 min-w-0
    Card "Destaques" → lg:col-span-4
    Card "Classificação" → lg:col-span-7 min-w-0
    Card "Gols por mês" (highlightMax) → lg:col-span-5
    Card ataques / defesas / indisciplinados → lg:col-span-4 cada
  ```
  O título não fica mais dentro de um card: fica solto sobre o fundo `page`, como no mockup.
  O `UpdatedAt` do fim da página sai.

**Verificação:** testes, typecheck e conferência no navegador em 1280px e 375px.
**Commit:** `feat(ui): league page with strength map first`

---

## Tarefa 5 — Página do time ("Perfil em primeiro")

**Arquivos:** `components/TeamDashboard.tsx`, `components/DimensionScores.tsx`, `components/StrengthPills.tsx`,
`components/PercentileBar.tsx`, `components/MetricList.tsx`, `app/time/[id]/page.tsx`, `tests/components/team.test.tsx`

- Título: escudo 48, `h1` em `font-display text-3xl uppercase`, linha da liga/posição. À direita,
  `Segmented label="Visão" options={VENUE_LABELS…}` e o botão "⇄ Comparar" em `bg-brand-gradient`.
  Os testes atuais procuram `button` "Casa", "Fora", "1º turno" e `link` /comparar/: continuam válidos.
- Aviso de amostra: `rounded-xl border border-brand-amber bg-brand-amber-soft p-3 text-sm text-brand-amber-ink`.
- Grade `lg:grid-cols-12`:
  ```
  Card featured "Nota por dimensão" → lg:col-span-8   (só se enough)
  Card "Pontos fortes · fracos" → lg:col-span-4       (só se enough)
  KpiCard ×4 → sm:col-span-6 lg:col-span-3
  Card "Métricas" → lg:col-span-7
  Card "Gols por mês" → lg:col-span-5
  Card "Gols por tempo" / "Gols por minuto" → lg:col-span-6 cada
  ```
- `DimensionScores`: cada bloco usa `TIER_CLASS[scoreTier(score)]` (sem nota: `bg-tier-3`), número em
  `font-display text-3xl`. O botão "!" ganha borda e texto `currentColor` com opacidade, para funcionar sobre
  verde e vermelho cheios. Tooltip com `bg-surface border-line shadow-lg`.
- `StrengthPills`: duas listas empilhadas, "Fortes" e "Fracos", cada uma com rótulo em `font-display uppercase text-xs text-muted`.
  Pílulas `bg-tier-4 text-tier-4-fg` e `bg-tier-2 text-tier-2-fg`. O texto continua o mesmo, então os testes passam.
- `PercentileBar`: trilho `bg-tier-3`; preenchimento `bg-tier-5` (forte), `bg-tier-1` (fraco) ou `bg-brand-teal`;
  marcador da mediana `bg-fg/50`.
- `MetricList`: rótulos de dimensão em `font-display`, bloco "Estilo" com `border-line bg-page`.
- Subtítulos dos gráficos: "marcados (verde)" vira "marcados (teal)". Nenhum teste depende desse texto hoje;
  confirmar com `grep` antes do commit.
- `app/time/[id]/page.tsx`: o `UpdatedAt` passa para o fim, com `text-center`, como hoje.

**Verificação:** testes, typecheck e navegador em 1280px e 375px, incluindo uma visão com amostra insuficiente.
**Commit:** `feat(ui): team page with profile first`

---

## Tarefa 6 — Comparação com barras espelhadas (TDD)

**Arquivos:** `components/MirrorBar.tsx` (novo), `components/CompareDashboard.tsx`, `components/RivalSelect.tsx`,
`tests/components/compare.test.tsx`

### `MirrorBar`

```tsx
export function MirrorBar({
  label, a, b, aText, bText, max, winner,
}: {
  label: string;
  a: number | null; b: number | null;
  aText: string; bText: string;
  max: number;              // 100 nas dimensões; maior valor da linha nas métricas
  winner: "a" | "b" | null; // null = sem vencedor (empate, estilo ou falta de dado)
}) { … }
```

- Layout: `grid grid-cols-[3rem_1fr_3rem] sm:grid-cols-[3rem_1fr_9rem_1fr_3rem]`. No celular, o rótulo vai
  numa linha própria acima (`col-span-full text-center`) e as duas barras dividem a coluna do meio.
- Barra A cresce da direita para a esquerda (`justify-end`) em `bg-team-a`; barra B da esquerda para a direita em `bg-team-b`.
- Perdedor com `opacity-35`; `winner === null` deixa as duas em `bg-tier-3`, e para manter o contraste o valor fica em `text-muted`.
- Valor vencedor em negrito, com `text-brand-teal-ink` (A) ou `text-brand-amber-ink` (B).
- Acessibilidade: cada linha tem `aria-label` "{label}: {aText} × {bText}" e as barras são `aria-hidden`.
- Largura: `width: ${(v / max) * 100}%`, com `max` 0 tratado como sem barra.

Testes novos em `compare.test.tsx`:

- `MirrorBar` com `winner="a"` marca o valor A com `data-winner="true"` e o B não.
- `MirrorBar` com `winner={null}` não marca nenhum.
- `MirrorBar` com valor `null` mostra "—".

### Placar

Função exportada em `CompareDashboard.tsx` (pura, testável):

```ts
export function dimensionTally(sa: DimensionScores, sb: DimensionScores) {
  let a = 0, b = 0;
  for (const d of JUDGED_DIMENSIONS) {
    const x = sa[d], y = sb[d];
    if (x === null || y === null || x === y) continue;
    if (x > y) a++; else b++;
  }
  return { a, b, total: a + b };
}
```

Texto:

- `total === 0` → nada.
- `a > b` → "{A} vence {a} de {total} dimensões".
- `b > a` → "{B} vence {b} de {total} dimensões".
- empate → "Empate em dimensões ({a} a {b})".

Testes: os três casos de texto e o caso vazio, via `dimensionTally`.

### `CompareDashboard`

1. Cabeçalho VS (`Card`): grade `[1fr_auto_1fr]` com escudo (anel `ring-2 ring-team-a` / `ring-team-b`) e nome
   em `font-display text-2xl uppercase`. O nome A continua sendo link para `/time/{id}`. Embaixo de cada nome,
   `Segmented size="sm"` com `label="Visão de {nome}"`. "VS" no meio em `font-display text-muted`.
   Placar centralizado abaixo. `RivalSelect` no canto superior direito (no celular, abaixo do cabeçalho).
2. `Card featured "Dimensões"`: um `MirrorBar` por dimensão, com `max=100`, `aText/bText` = nota arredondada.
3. `Card "Métricas"`: agrupar `Object.keys(METRIC_INFO)` pela `dimension` da linha encontrada (A ou B),
   na ordem `JUDGED_DIMENSIONS`, depois "style" e "timing"; título do grupo com `DIMENSION_LABELS`.
   `max = Math.max(|a|, |b|)` da linha; `winner = compareWinner(…)` como hoje; `aText/bText = formatMetric`.
   O teste existente ("1,78 (18)" e "2,04 (20)") continua válido.
- `RivalSelect`: `rounded-full border border-line bg-surface px-3 py-1 text-sm`, foco visível.

**Verificação:** testes, typecheck e navegador em 1280px e 375px (sem rolagem horizontal).
**Commit:** `feat(ui): mirrored-bar team comparison`

---

## Tarefa 7 — Limpeza, auditoria e build

1. Remover os apelidos temporários de `globals.css`. Procurar sobras com
   `grep -rnE "\b(bg|text|border|ring|from|to)-(bg|card|card-inner|accent|strong|strong-bg|weak|weak-bg)\b" app components`
   e trocar cada uma pelo nome novo.
2. Rodar a skill `web-design-guidelines` nos mesmos arquivos da Tarefa 0 e corrigir os apontamentos.
   Comparar com `.superpowers/audit-antes.md`.
3. `npm test`, `npm run typecheck` e `npm run build`.
4. Conferência final no navegador: liga, time e comparação, em 1280px e 375px.

**Commit:** `chore(ui): drop legacy color aliases and fix guideline findings`

---

## Observação fora de escopo (para a frente de dados)

Em `compareWinner`, `LOWER_IS_BETTER` não inclui `xg_against`, `goals_against_1h` nem `goals_against_2h`.
Hoje a comparação marca como vencedor quem tem **mais** xG sofrido e mais gols sofridos por tempo.
Com as barras espelhadas isso fica bem visível. O plano não muda essa regra; vale a frente de dados
decidir e corrigir.
