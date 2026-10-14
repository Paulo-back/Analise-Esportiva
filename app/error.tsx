"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold">Não foi possível carregar os dados agora</h1>
      <p className="mt-2 text-muted">Tente novamente em alguns instantes.</p>
      <button onClick={reset} className="mt-4 rounded-full bg-accent px-4 py-2 font-bold text-bg">
        Tentar de novo
      </button>
    </div>
  );
}
