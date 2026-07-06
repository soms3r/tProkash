/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@tprokash/types",
    "@tprokash/utils",
    "@tprokash/ui",
    "@tprokash/config",
    "@tprokash/validation",
  ],
};

export default nextConfig;
