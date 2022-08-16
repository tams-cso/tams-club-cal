import { Request, Response } from 'express';

require('dotenv').config();

import express from 'express';
const app = express();
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import mongoose, { ConnectOptions } from 'mongoose';
import { checkEnv, sendError } from './functions/util';

// Import routers
import authRouter from './routes/authRouter';
import eventsRouter from './routes/eventsRouter';
import clubsRouter from './routes/clubsRouter';
import volunteeringRouter from './routes/volunteeringRouter';
import historyRouter from './routes/historyRouter';
import feedbackRouter from './routes/feedbackRouter';
import adminRouter from './routes/adminRouter';
import textDataRouter from './routes/textDataRouter';
import usersRouter from './routes/usersRouter';

// Check for the correct environmental variables
if (process.env.NODE_ENV !== 'production') checkEnv();
console.log(`Running with NODE_ENV set to ${process.env.NODE_ENV}`);

// Use middleware to recieve calls and log
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// Trust proxy
app.set('trust proxy', true);

// Log output with morgan
app.use(
    morgan((tokens, req, res) => {
        return [
            chalk.green(chalk.bold(tokens.method(req, res))),
            tokens.url(req, res),
            chalk.blue(tokens.status(req, res)),
            chalk.yellow(tokens['response-time'](req, res) + 'ms'),
            chalk.grey(JSON.stringify(req.body)),
        ].join(' ');
    })
);

// Parse every request here first
app.use(function (req: Request, res: Response, next) {
    // Add CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    // Check for correct referer origin
    // Set this in the .env file as ORIGIN
    // This will return as an error if no referer in headers OR if the origin does not match the expected referer
    // The block will be skipped if no ORIGIN environmental variable is defined
    if (
        process.env.NODE_ENV === 'production' &&
        process.env.ORIGIN !== undefined &&
        !process.env.NO_ORIGIN_CHECK &&
        req.path !== '/auth/login'
    ) {
        if (req.headers.referer === undefined || req.headers.referer.indexOf(process.env.ORIGIN) === -1) {
            sendError(res, 401, 'Invalid request origin.');
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
app.use('/events', eventsRouter);
app.use('/clubs', clubsRouter);
app.use('/volunteering', volunteeringRouter);
app.use('/history', historyRouter);
app.use('/feedback', feedbackRouter);
app.use('/admin', adminRouter);
app.use('/text-data', textDataRouter);
app.use('/users', usersRouter);

// Start express server
app.listen(process.env.PORT || 5000, () => console.log(`Listening on port ${process.env.PORT || 5000}`));

// Start mongoose
const mongoUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/data?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions);

// Callbacks for db connections
const db = mongoose.connection;
db.on('error', (error) => {
    console.error(error);
    process.exit(1);
});
db.once('open', () => console.log('Connected to mongodb database!'));
