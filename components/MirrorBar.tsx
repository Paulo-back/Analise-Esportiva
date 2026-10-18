// Uma linha do confronto: A cresce do centro para a esquerda, B do centro para a direita.
// winner = null (empate, métrica de estilo ou valor ausente) deixa as duas barras neutras.
export function MirrorBar({
  label, a, b, aText, bText, max, winner,
}: {
  label: string;
  a: number | null;
  b: number | null;
  aText: string;
  bText: string;
  max: number;
  winner: "a" | "b" | null;
}) {
  const width = (v: number | null) => (v === null || max <= 0 ? 0 : Math.min(100, (Math.abs(v) / max) * 100));
  const bar = (side: "a" | "b") => {
    if (winner === null) return "bg-muted/40";
    const color = side === "a" ? "bg-team-a" : "bg-team-b";
    return winner === side ? color : `${color} opacity-35`;
  };
  const value = (side: "a" | "b") =>
    winner === side ? `font-bold ${side === "a" ? "text-brand-teal-ink" : "text-brand-amber-ink"}` : winner ? "text-muted" : "";

  // role="img" + aria-label: o leitor de tela ouve a linha inteira uma vez, sem os pedaços visuais duplicados.
  return (
    <div
      role="img"
      aria-label={`${label}: ${aText} × ${bText}`}
      className="grid grid-cols-[5.5rem_1fr_1fr_5.5rem] items-center gap-x-2 gap-y-0.5 py-1 text-xs sm:grid-cols-[6.5rem_1fr_9rem_1fr_6.5rem]"
    >
      <span aria-hidden className="col-span-4 text-center text-muted sm:hidden">{label}</span>
      <span aria-hidden data-winner={winner === "a" || undefined} className={`text-right tabular-nums ${value("a")}`}>{aText}</span>
      <div aria-hidden className="flex h-2.5 justify-end">
        <div className={`h-full rounded-l-full ${bar("a")}`} style={{ width: `${width(a)}%` }} />
      </div>
      <span aria-hidden className="hidden text-center text-muted sm:block">{label}</span>
      <div aria-hidden className="flex h-2.5">
        <div className={`h-full rounded-r-full ${bar("b")}`} style={{ width: `${width(b)}%` }} />
      </div>
      <span aria-hidden data-winner={winner === "b" || undefined} className={`tabular-nums ${value("b")}`}>{bText}</span>
    </div>
  );
}
