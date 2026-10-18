import type { NextConfig } from "next";

// O modo de desenvolvimento do Next usa eval; sem isso o React não hidrata no `npm run dev`.
const scriptSrc = process.env.NODE_ENV === "development" ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src ${scriptSrc}; font-src 'self' data:`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
