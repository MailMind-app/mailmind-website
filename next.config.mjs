/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed in fase 3, once the old pages (and their framer-motion type errors) are gone.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/login",
        destination: "https://dashboard.mailmind.nl/accounts/login/",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
