/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@oneallhost/ui', '@oneallhost/config', '@oneallhost/db', '@oneallhost/payments'],
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
