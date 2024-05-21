import createNextIntlPlugin from "next-intl/plugin";

const API_URL = process.env.API_URL;

const withNextIntl = createNextIntlPlugin("./localization/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // If you want to use Babel instead of SWC

  async rewrites() {
    return [
      {
        source: "/en/api/:path*",
        destination: `${API_URL}/:path*`, // Proxy to Backend
      },
      {
        source: "/tr/api/:path*",
        destination: `${API_URL}/:path*`, // Proxy to Backend
      },
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`, // Proxy to Backend
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/:path*',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);