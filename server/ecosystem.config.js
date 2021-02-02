module.exports = {
    apps: [
        {
            name: 'tams-club-cal-server',
            script: 'src/app.js',
            watch: '.',
            watch_delay: 5000,
            ignore_watch: ['node_modules', 'src/cache', 'src/logs'],
        },
    ],
    env: {
        NODE_ENV: 'production',
    },
};
