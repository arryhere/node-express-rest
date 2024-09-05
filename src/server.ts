import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { config } from './configs/config.js';
import { mongodb } from './db/mongodb.js';
import type Exception from './helpers/error.helper.js';
import { log_error, log_info } from './helpers/log.helper.js';
import { respose_helper } from './helpers/response.helper.js';
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

    /* error handling */
    app.use((error: Exception, req: Request, res: Response, next: NextFunction) => {
      respose_helper(res, error.status_code, error.message, error.data);
    });

    /* start */
    app.listen(port, () => {
      log_info(`🚀 server running at: http://localhost:${port}`);
    });
  } catch (error: unknown) {
    log_error('server error', { error_name: (error as Exception)?.name, error_message: (error as Exception)?.message, error });
  }
}

server();
