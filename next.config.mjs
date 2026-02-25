/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d537127951692c7fbd38ff662fb21b1c.cdn.bubble.io"
      }
    ]
  }
};

export default nextConfig;
