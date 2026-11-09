/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  async redirects() {
    return [
      { source: "/admin", destination: "/login", permanent: false },
      { source: "/admin/forgot", destination: "/login/forgot", permanent: false },
      { source: "/admin/reset", destination: "/login/reset", permanent: false },
    ];
  },
  serverExternalPackages: ["@electric-sql/pglite"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
