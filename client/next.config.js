/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    // Allow importing shared TypeScript source from the top-level shared/ folder
    experimental: {
        externalDir: true,
    },
    images: {
        domains: ['cdn.tams.club', 'staging.cdn.tams.club', 'localhost'],
    },
    output: 'standalone',
    async redirects() {
        return [
            {
                source: '/events',
                destination: '/',
                permanent: true,
            },
        ];
    },
};
