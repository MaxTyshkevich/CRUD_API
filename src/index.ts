import dotenv from 'dotenv';

import http from 'node:http';
import cluster from 'node:cluster';
import { cpus } from 'node:os';
import { HandlerServer } from './server.js';

dotenv.config();

const isCluster = process.argv[2] === '--cluster';

const numCPUs = cpus().length;
const PORT = Number(process.env.PORT) || 3000;

if (isCluster) {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork({ PORT: PORT + i });
    }

    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    http.createServer(HandlerServer).listen(PORT, () => {
      console.log(`Server started ob port: ${PORT}`);
    });

    console.log(`Worker ${process.pid} started`);
  }
} else {
  http.createServer(HandlerServer).listen(PORT, () => {
    console.log(`Server started ob port: ${PORT}`);
  });
}
