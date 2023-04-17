/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/__/auth/handler',
        destination: 'https://frontend-core-bfc4e.firebaseapp.com/__/auth/handler',
      },
    ]
  },
}

module.exports = nextConfig
