import cors from 'cors';
import express, { type Request, type Response, type NextFunction } from 'express';
import { config } from './configs/config.js';
import { router } from './routes/route.js';

const app = express();
const port = config.app.port;

async function server() {
  try {
    /* middlewares */
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(cors());

    /* app router */
    app.use(router);

    /* start */
    app.listen(port, () => {
      console.log(`🚀 server running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.log('server error');
  }
}

server();
