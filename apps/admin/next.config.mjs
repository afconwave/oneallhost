/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@oneallhost/ui', '@oneallhost/config', '@oneallhost/db', '@oneallhost/payments'],
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
