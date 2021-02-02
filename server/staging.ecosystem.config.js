module.exports = {
    apps: [
        {
            name: 'staging-tams-club-cal',
            script: 'src/app.js',
            watch: '.',
            watch_delay: 5000,
            ignore_watch: ['node_modules', 'src/cache'],
        },
    ],
    env: {
        NODE_ENV: 'production',
    },
};
