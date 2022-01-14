/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: {
        domains: ['cdn.tams.club', 'staging.cdn.tams.club', 'localhost'],
    },
    async redirects() {
        return [
            {
                source: '/events',
                destination: '/',
                permanent: true,
            },
        ];
    },
    experimental: {
        outputStandalone: true,
    },
};
