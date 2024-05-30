/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ["@nature-digital/constants"],
  sassOptions: {
    prependData: `@import "@nature-digital/web-styles/variables.scss"; @import "@nature-digital/web-styles/breakpoints.scss";`,
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_DRUPAL_URL.replace("https://", "")],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    MAPPROXY_URL: process.env.MAPPROXY_URL,
  },
  experimental: {
    isrMemoryCacheSize: 0,
  },
  async rewrites() {
    return [
      {
        source: "/(gebiet|wege|sehenswertes|zeitreise|arten|lebensraum)/:slug*",
        destination: "/articles/:slug*",
      },
    ];
  },
};
