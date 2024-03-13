/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    output: 'export',
    distDir: 'build-files',
};

export default nextConfig;
