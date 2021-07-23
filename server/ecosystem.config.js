module.exports = {
    apps: [
        {
            name: 'tcc-server',
            script: 'app.js',
            watch: '.',
            watch_delay: 5000,
        },
    ],
    env: {
        NODE_ENV: 'production',
    },
};
