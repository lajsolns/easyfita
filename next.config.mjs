/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['jose'], // For Vercel Edge compatibility with jose
};

export default nextConfig;
