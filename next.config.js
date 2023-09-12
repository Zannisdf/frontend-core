/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://app.sobrecupos.com/sobrecupos',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: "/__/auth/handler",
        destination:
          "https://frontend-core-bfc4e.firebaseapp.com/__/auth/handler",
      },
      {
        source: "/__/auth/handler.js",
        destination:
          "https://frontend-core-bfc4e.firebaseapp.com/__/auth/handler.js",
      },
      {
        source: "/__/auth/experiments.js",
        destination:
          "https://frontend-core-bfc4e.firebaseapp.com/__/auth/experiments.js",
      },
      {
        source: "/__/auth/iframe",
        destination:
          "https://frontend-core-bfc4e.firebaseapp.com/__/auth/iframe",
      },
      {
        source: "/__/auth/iframe.js",
        destination:
          "https://frontend-core-bfc4e.firebaseapp.com/__/auth/iframe.js",
      },
    ];
  },
};

module.exports = nextConfig;
