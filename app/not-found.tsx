import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-balance font-display text-3xl font-extrabold uppercase">Página não encontrada</h1>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brand-gradient px-5 py-2 font-bold text-fg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
