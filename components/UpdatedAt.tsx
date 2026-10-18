export function UpdatedAt({
  date, className = "text-center text-xs text-muted",
}: { date: Date | null; className?: string }) {
  if (!date) return null;
  const formatted = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(date);
  return <p className={className}>Dados atualizados em {formatted}</p>;
}
