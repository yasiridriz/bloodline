/** @type {import('next').NextConfig} */

const nextConfig = {
   reactStrictMode: true,
   i18n: {
      locales: ["en-US", "mk-MK", "sq-AL"],
      defaultLocale: "en-US",
   },
}

module.exports = nextConfig
