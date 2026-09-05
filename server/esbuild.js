const fs = require('fs');
const path = require('path');

const SERVER_DIR = __dirname;
const BUILD_FOLDER = path.join(SERVER_DIR, 'build');
const OUT_FILE = path.join(BUILD_FOLDER, 'app.js');
const ENV_PATH = path.join(SERVER_DIR, '.env');
const SUBPACKAGE_PATH = path.join(SERVER_DIR, 'subpackage.json');

// Remove and recreate the build folder
try {
    fs.rmSync(BUILD_FOLDER, { recursive: true, force: true });
} catch (error) {}
fs.mkdirSync(BUILD_FOLDER, { recursive: true });

// Move subpackage file to build/package.json
if (fs.existsSync(SUBPACKAGE_PATH)) {
    fs.copyFileSync(SUBPACKAGE_PATH, path.join(BUILD_FOLDER, 'package.json'));
}

// Move .env if present
if (fs.existsSync(ENV_PATH)) {
    fs.copyFileSync(ENV_PATH, path.join(BUILD_FOLDER, '.env'));
    require('dotenv').config({ path: ENV_PATH });
}

// Load environment variables for esbuild define
const define = {};
for (const k in process.env) {
    define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

// Run the esbuild compilation
require('esbuild')
    .build({
        entryPoints: [path.join(SERVER_DIR, 'app.ts')],
        platform: 'node',
        bundle: true,
        minify: true,
        outfile: OUT_FILE,
        loader: { '.node': 'file' },
        external: ['sharp'],
        define,
    })
    .then(() => {
        // Prepend require("sharp") AFTER esbuild outputs the bundle
        const content = fs.readFileSync(OUT_FILE, 'utf8');
        fs.writeFileSync(OUT_FILE, `require("sharp");\n${content}`);
        console.log('Backend built successfully to server/build!');
    })
    .catch((err) => {
        console.error('esbuild failed:', err);
        process.exit(1);
    });