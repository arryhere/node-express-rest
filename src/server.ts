import cors from 'cors';
import express from 'express';
import { config } from './configs/config.js';
import { mongodb } from './db/mongodb.js';
import { log_error, log_info } from './helpers/log.helper.js';
import { router } from './routes/route.js';

const app = express();
const port = config.app.port;

async function server() {
  try {
    /* db */
    await mongodb();

    /* middlewares */
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(cors());

    /* app router */
    app.use(router);

    /* start */
    app.listen(port, () => {
      log_info(`🚀 server running at: http://localhost:${port}`);
    });
  } catch (error: any) {
    log_error('server error', { error_name: error.name, message: error.message, error });
  }
}

server();
