/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/", headers: [{ key: "Vary", value: "Accept" }] }]
  },
  async redirects() {
    return [
      { source: "/login", destination: "https://dashboard.mailmind.nl/accounts/login/", permanent: true },
      { source: "/pricing", destination: "/prijzen", permanent: true },
      { source: "/security", destination: "/veiligheid", permanent: true },
      { source: "/about", destination: "/over", permanent: true },
    ]
  },
}

export default nextConfig
