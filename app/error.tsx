"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-20 text-center">
      <h1 className="font-display text-3xl font-extrabold uppercase">Não foi possível carregar os dados agora</h1>
      <p className="mt-2 text-muted">Tente novamente em alguns instantes.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-brand-gradient px-5 py-2 font-bold text-fg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
      >
        Tentar de novo
      </button>
    </div>
  );
}
