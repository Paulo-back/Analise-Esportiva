import { Pool } from "pg";

// Remove `sslmode`: o parser do pg recria um objeto `ssl` a partir dele e sobrescreve o
// `rejectUnauthorized: false` abaixo (mesmo problema já resolvido no site).
function connectionStringWithoutSslMode(raw: string | undefined): string | undefined {
  if (!raw) return raw;
  try {
    const url = new URL(raw);
    url.searchParams.delete("sslmode");
    return url.toString();
  } catch {
    return raw;
  }
}

export const pool = new Pool({
  connectionString: connectionStringWithoutSslMode(process.env.DATABASE_URL),
  max: 5,
  ssl: { rejectUnauthorized: false },
});

// Sem listener, um erro de rede num cliente ocioso derruba o processo Node.
pool.on("error", (err) => {
  console.error("Erro inesperado em cliente Postgres ocioso:", err);
});
