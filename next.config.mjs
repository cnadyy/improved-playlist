/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    output: "export",
    distDir: "build-files",
};

export default nextConfig;
