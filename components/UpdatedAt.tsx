export function UpdatedAt({ date }: { date: Date | null }) {
  if (!date) return null;
  const formatted = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(date);
  return <p className="text-center text-xs text-muted">Dados atualizados em {formatted}</p>;
}
