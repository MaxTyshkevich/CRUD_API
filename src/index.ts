import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import http from 'node:http';
import cluster from 'node:cluster';
import { cpus } from 'node:os';
import { User } from './type';

dotenv.config();

const numCPUs = cpus().length;
const PORT = process.env.PORT || 3000;

/* if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end('hello world\n');
    })
    .listen(PORT, () => {
      console.log('PORT', PORT);
    });

  console.log(`Worker ${process.pid} started`);
}
 */

const db: User[] = [
  {
    id: uuidv4(),
    username: 'Max',
    age: 28,
    hobbies: ['learn nodeJS', 'sleep'],
  },
];

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(method, url);
  console.log(url?.split('/').filter(Boolean));

  if (method === 'GET' && url === '/api/users') {
    res.statusCode = 200;

    res.end(JSON.stringify(db));
  } else if (method === 'POST' && url === '/api/users') {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const newUser = JSON.parse(Buffer.concat(buffers).toString());

    if (isValidNewUser(newUser)) {
      console.log('valid');
      newUser.id = uuidv4();
      db.push(newUser);
      res.statusCode = 201;
      res.end(JSON.stringify(newUser));
    } else {
      res.statusCode = 400;
    }
  } else {
    const userId = url?.replace('/api/users/', '');
    console.log('my id:', userId);
    if (method === 'GET') {
      const user = db.filter((elem) => elem.id === userId);

      res.statusCode = 200;

      res.end(JSON.stringify(user));
    }
  }
});

server.listen(PORT, () => {
  console.log('PORT', PORT);
});

function isValidNewUser(user: User) {
  if (Object.keys(user).length !== 3) return false;
  return (
    typeof user.username === 'string' &&
    typeof user.age === 'number' &&
    Array.isArray(user.hobbies)
  );
}
