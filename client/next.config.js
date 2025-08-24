/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
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
