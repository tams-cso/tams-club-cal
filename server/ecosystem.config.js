module.exports = {
  apps : [{
    name: 'tams-club-cal-server',
    script: 'src/app.js',
    watch: '.',
    watch_delay: 1000,
    ignore_watch: ['node_modules'],
  }],
  env: {
    NODE_ENV: "production",
  }
};
