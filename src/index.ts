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
    id: uuidv4(),
    username: 'Alex',
    age: 28,
    hobbies: ['eat', 'sleep'],
  },
  {
    id: uuidv4(),
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
    return res.end(`{"error": "userId is invalid"}`);
  }

  const user = db.filter((elem) => elem.id === id);

  if (user) {
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
  if (isValidNewUser(newUser)) {
    const findUser = db.filter((item) => item.id === id);
    if (findUser) {
      let updateUser;
      db.map((item) => {
        if (item.id === id) {
          updateUser = { ...item, newUser };
          return updateUser;
        }
        return item;
      });
    } else {
    }

    res.statusCode = 201;
    res.end(JSON.stringify(newUser));
  }
};

const deleteUser = (
  res: http.ServerResponse<http.IncomingMessage>,
  id: string
) => {
  if (id && !validate(id)) {
    res.statusCode = 400;
    return res.end(`{"error": "userId is invalid"}`);
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
          res.end(`bed request =(`);
      }
    } catch (error: any) {
      if (error.message == 'bed request =(') {
        console.log(error.message);
        res.end(`bed request =(`);
      } else {
        res.statusCode = 500;
        res.end(`Errors on the server side`);
      }
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
