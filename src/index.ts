import { startExpressServer } from './server';
import * as PgDB from './config/db';

(async function index() {
    const { server, app } = await startExpressServer();

    await PgDB.default.setup();
})();
