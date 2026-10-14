export function MonthlyGoalsChart({
  series,
}: { series: { label: string; primary: number; secondary?: number }[] }) {
  if (!series.length) return <p className="text-sm text-muted">Sem jogos finalizados ainda.</p>;
  const max = Math.max(1, ...series.flatMap((s) => [s.primary, s.secondary ?? 0]));
  return (
    <div className="flex h-36 items-end gap-2">
      {series.map((s) => (
        <div key={s.label} className="flex h-full flex-1 flex-col items-center justify-end text-[10px]">
          <div className="flex h-full w-full items-end gap-0.5">
            <div className="flex-1 rounded-t bg-accent" style={{ height: `${(s.primary / max) * 100}%` }} />
            {s.secondary !== undefined && (
              <div className="flex-1 rounded-t bg-weak" style={{ height: `${(s.secondary / max) * 100}%` }} />
            )}
          </div>
          <span className="mt-1">{s.label}</span>
          <span className="text-muted">
            {s.secondary !== undefined ? `${s.primary} · ${s.secondary}` : s.primary}
          </span>
        </div>
      ))}
    </div>
  );
}
