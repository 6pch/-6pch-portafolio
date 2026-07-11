/** @type {import('next').NextConfig} */
const securityHeaders = [
  // Evita que el navegador "adivine" tipos de contenido (mitiga ataques XSS por MIME sniffing)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Evita que el sitio se embeba en un <iframe> ajeno (mitiga clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // No filtra la URL completa de origen al navegar a otros sitios
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desactiva APIs del navegador que este sitio no necesita
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
