import cors from 'cors';
import express, { type NextFunction, type Request, type Response, type ErrorRequestHandler } from 'express';
import type { Exception } from './common/error/exception.error.js';
import { log_error, log_info } from './common/helper/log.helper.js';
import { config } from './config/config.js';
import { mongodb } from './db/mongodb.js';

import { response_helper } from './common/helper/response.helper.js';
import { router } from './routes/route.js';

async function main() {
  try {
    /* init */
    const app = express();

    /* db */
    await mongodb();

    /* middlewares */
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(
      cors({
        credentials: true,
        methods: ['HEAD,GET,POST,PUT,PATCH,DELETE'],
        origin: [],
      })
    );

    /* app router */
    app.use(router);

    /* error handling */
    const error_handler: ErrorRequestHandler = (error: Exception, req: Request, res: Response, next: NextFunction) => {
      response_helper({
        res,
        status_code: error.status_code || 500,
        response_type: { success: false, message: error.message, data: error.data },
      });
      return;
    };
    app.use(error_handler);

    /* start */
    app.listen(config.app.port, () => {
      log_info(`server running at: 🚀 http://localhost:${config.app.port} 🚀`);
    });
  } catch (error: unknown) {
    log_error('server error', {
      error_name: (error as Exception)?.name,
      error_message: (error as Exception)?.message,
      error,
    });
  }
}

main();
