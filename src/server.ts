import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';
import { logger } from './log';
import { PORT } from './constants';
import router from './routers/main';

dotenv.config({ path: '.env.config' });

async function startListening(app: express.Express): Promise<http.Server> {
    return new Promise<http.Server>(resolve => {
        const server = app.listen(PORT, () => {
            logger.info(`Server listening on http://localhost:${PORT}`);
            console.log(`Server listening on http://localhost:${PORT}`);

            resolve(server);
        });
    });
}

function setupRouting(app: express.Application) {
    app.use(router);

    app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
}

function setupMiddlewares(app: express.Application) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
}

export async function startExpressServer(): Promise<{ app: express.Application; server: http.Server }> {
    const app = express();

    setupMiddlewares(app);

    setupRouting(app);

    return { server: await startListening(app), app };
}
