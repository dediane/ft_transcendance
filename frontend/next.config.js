/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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