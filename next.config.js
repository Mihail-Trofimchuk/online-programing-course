/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript:{
    ignoreBuildErrors:true,
  },
  images: {
    domains: [
      "utfs.io"
    ]
  }
}

module.exports = nextConfig
