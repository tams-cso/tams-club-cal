const fs = require('fs');

const BUILD_FOLDER = 'build';

// Remove and make the build folder
try {
    fs.rmSync(BUILD_FOLDER, { recursive: true, force: true });
} catch (error) {}
fs.mkdirSync(BUILD_FOLDER);

// Require sharp at the top of build script
fs.writeFileSync(`${BUILD_FOLDER}/app.js`, 'require("sharp")');

// Move package file to sharp file
fs.copyFileSync('subpackage.json', `${BUILD_FOLDER}/package.json`);

// Move .env
fs.copyFileSync('.env', `${BUILD_FOLDER}/.env`);

// Import environmental variables
require('dotenv').config();

// Load environmental variables to define object to use in build
const define = {};
for (const k in process.env) {
    define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

// Run the build script
require('esbuild')
    .build({
        entryPoints: ['app.ts'],
        platform: 'node',
        bundle: true,
        minify: true,
        outfile: 'build/app.js',
        loader: { '.node': 'file' },
        external: ['sharp'],
        define,
    })
    .catch(() => process.exit(1));
