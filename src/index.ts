import * as dotenv from 'dotenv';
import { v4 as uuidv4, validate } from 'uuid';

import http from 'node:http';
import cluster from 'node:cluster';
import { cpus } from 'node:os';
import { User } from './type';

dotenv.config();

const numCPUs = cpus().length;
const PORT = process.env.PORT || 3000;

let db: User[] = [
  {
    id: '90447443-599a-41f2-a779-6fb64929db4c',
    username: 'Alex',
    age: 28,
    hobbies: ['eat', 'sleep'],
  },
  {
    id: 'f34ccebe-8fbc-476c-981d-e58c3a0bb424',
    username: 'Max',
    age: 25,
    hobbies: ['watch tv'],
  },
];

const getAllUsers = (res: http.ServerResponse<http.IncomingMessage>) => {
  res.statusCode = 200;
  return res.end(JSON.stringify(db));
};

const getUser = (
  res: http.ServerResponse<http.IncomingMessage>,
  id: string
) => {
  if (id && !validate(id)) {
    res.statusCode = 400;
    return res.end('Id is invalid');
  }

  const user = db.filter((elem) => elem.id === id);

  if (user.length) {
    res.statusCode = 200;
    res.end(JSON.stringify(user));
  } else {
    res.statusCode = 404;
    res.end(`user with id:${id}, doesn't exist`);
  }
};

const createUser = (
  res: http.ServerResponse<http.IncomingMessage>,
  newUser: any
) => {
  if (isValidNewUser(newUser)) {
    newUser.id = uuidv4();
    db.push(newUser);
    res.statusCode = 201;
    res.end(JSON.stringify(newUser));
  } else {
    res.statusCode = 400;
    res.end(`{"error": "${http.STATUS_CODES[400]}"}`);
  }
};

const updateUser = (
  res: http.ServerResponse<http.IncomingMessage>,
  id: string,
  newUser: User
) => {
  if (id && !validate(id)) {
    res.statusCode = 400;
    return res.end('Id is invalid');
  }

  const index = db.findIndex((user) => {
    return user.id === id;
  });

  if (index === -1) {
    res.statusCode = 404;
    res.end(`user with id:${id}, doesn't exist`);
  } else {
    const updateUser: User = { ...newUser, id: db[index].id };
    db[index] = updateUser;

    res.statusCode = 200;
    res.end(JSON.stringify(updateUser));
  }
};

const deleteUser = (
  res: http.ServerResponse<http.IncomingMessage>,
  id: string
) => {
  if (id && !validate(id)) {
    res.statusCode = 400;
    return res.end('userId is invalid');
  }

  const newDb = db.filter((elem) => elem.id !== id);

  if (newDb.length !== db.length) {
    db = newDb;
    res.statusCode = 200;
    res.end(`user been delete`);
  } else {
    res.statusCode = 404;
    res.end(`user with id:${id}, doesn't exist`);
  }
};
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

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  const requestBody = await getRequestBody(req);

  console.log('valideURL(url)', valideURL(url));
  res.setHeader('Content-Type', 'application/json');

  if (valideURL(url)) {
    try {
      const userID = getID(url);

      switch (method) {
        case 'GET': {
          if (userID) {
            getUser(res, userID);
          } else {
            getAllUsers(res);
          }
          break;
        }
        case 'POST': {
          createUser(res, requestBody);
          break;
        }
        case 'PUT': {
          updateUser(res, userID, requestBody);
          break;
        }
        case 'DELETE': {
          deleteUser(res, userID);
          break;
        }

        default:
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end('Route not found');
      }
    } catch (error: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end('Internal Server Error');
    }
  }
});

server.listen(PORT, () => {
  console.log('PORT', PORT);
});

async function getRequestBody(req: http.IncomingMessage) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  return JSON.parse(Buffer.concat(buffers).toString());
}

function valideURL(url: string = '') {
  let arrayURL = url?.split('/').filter(Boolean);
  if (arrayURL.length > 3) throw new Error('bed bed request =(');

  if (`${arrayURL[0]}/${arrayURL[1]}` === 'api/users') {
    return true;
  }
  return false;
}

function getID(url: string = '') {
  let arrayURL = url?.split('/').filter(Boolean);

  return arrayURL[2] ?? null;
}

function isValidNewUser(user: User) {
  if (Object.keys(user).length !== 3) return false;
  return (
    typeof user.username === 'string' &&
    typeof user.age === 'number' &&
    Array.isArray(user.hobbies)
  );
}
