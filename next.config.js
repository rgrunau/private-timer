/** @type {import('next').NextConfig} */
const nextConfig = {};

const withPWA = require('next-pwa')({
  dest: "public",
  register: true,
  skipWaiting: true,        // Auto-activate new service worker
  clientsClaim: true,       // Take control immediately
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60 * 7, // 7 days
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 24 * 60 * 60 * 365, // 365 days
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /\/_next\/static.+\.js$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-js-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /\/_next\/static.+\.css$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-css-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60 * 30, // 30 days
        },
      },
    },
  ],
  buildExcludes: [/app-build-manifest\.json$/],
  publicExcludes: ['!robots.txt', '!sitemap.xml'],
  fallbacks: {
    document: '/offline',
  },
});

module.exports = withPWA(nextConfig);
