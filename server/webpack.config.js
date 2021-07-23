const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'app.js',
    },
    externals: {
        sharp: 'commonjs sharp',
        mongoose: 'commonjs mongoose',
    },
    plugins: [new Dotenv()],
    target: 'node',
    mode: 'production',
};
