import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/templates", destination: "/divisions", permanent: true },
      { source: "/templates/:slug", destination: "/divisions/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
