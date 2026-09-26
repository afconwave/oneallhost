/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@oneallhost/ui', '@oneallhost/config', '@oneallhost/db', '@oneallhost/payments'],
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
