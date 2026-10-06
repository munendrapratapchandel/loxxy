const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'mc-heads.net' },
      { protocol: 'https', hostname: 'minotar.net' },
      { protocol: 'https', hostname: 'crafatar.com' },
      { protocol: 'https', hostname: 'textures.minecraft.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.imgur.com' }
    ],
  },
};

module.exports = nextConfig;
