import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import type Exception from './common/error/exception.error.js';
import { log_error, log_info } from './common/helper/log.helper.js';
import { config } from './config/config.js';
import { mongodb } from './db/mongodb.js';

import { respose_helper } from './common/helper/response.helper.js';
import { router } from './routes/route.js';

async function main() {
  try {
    /* init */
    const app = express();
    const port = config.app.port;

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
    app.use((error: Exception, req: Request, res: Response, next: NextFunction) => {
      return respose_helper({
        res,
        status_code: error.status_code,
        responseType: { success: false, message: error.message, data: error.data },
      });
    });

    /* start */
    app.listen(port, () => {
      log_info(`🚀 server running at: http://localhost:${port}`);
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
