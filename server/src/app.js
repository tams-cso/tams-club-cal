require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { checkEnv, sendError } = require('./functions/util');

// Import routers
const authRouter = require('./routes/authRouter');

// Check for the correct environmental variables
checkEnv();

// Use middleware to recieve calls and log
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// Trust proxy
app.set('trust proxy', true);

// Parse every request here first
app.use(function (req, res, next) {
    // Add CORS headers
    req.header('Access-Control-Allow-Origin', '*');
    req.header('Access-Control-Allow-Headers', 'X-Requested-With');

    // Check for correct origin
    // Set this in the .env file as ORIGIN
    // This will return as an error if no origin in headers OR if the origin does not match the expected origin
    // The block will be skipped if no ORIGIN environmental variable is defined
    if (process.env.ORIGIN !== undefined && req.path !== '/auth/login') {
        if (req.headers.origin === undefined || req.headers.origin.indexOf(process.env.ORIGIN) === -1) {
            sendError(res, 403, 'Invalid request origin.');
            return;
        }
    }

    // Continue looking for path matches
    next();
});

// Default path
app.get('/', (req, res, next) => {
    res.send({
        hi: 'idk how you got here but uh welcome!',
        key: "Either you're a developer, or we have some security issues to fix :))",
        github: 'https://github.com/MichaelZhao21/tams-club-cal/',
        documentation: 'https://docs.tams.club/',
        website: 'https://tams.club/',
    });
});

// API main routes
app.use('/auth', authRouter);

// Start express server
app.listen(process.env.PORT | 5000, () => console.log(`Listening on port ${process.env.PORT | 5000}`));

// Start mongoose
const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/data?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Callbacks for db connections
const db = mongoose.connection;
db.on('error', (error) => {
    console.error(error);
    process.exit(1);
});
db.once('open', () => console.log('Connected to mongodb database!'));
