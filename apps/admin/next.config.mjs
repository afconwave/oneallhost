/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@oneallhost/ui', '@oneallhost/config', '@oneallhost/db', '@oneallhost/payments'],
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
