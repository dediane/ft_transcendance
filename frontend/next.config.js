/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_42: process.env.NEXT_PUBLIC_API_42,
  }
}

module.exports = {
  ...nextConfig,

  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*',
  //       destination: '/404',
  //       permanent: true,
  //     },
  //   ]
  // }
}