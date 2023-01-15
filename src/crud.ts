import http from 'node:http';
import { v4 as uuidv4, validate } from 'uuid';

import { User } from './type';
import { isValidNewUser, isValidUpdate } from './utils';

let db: User[] = [
  {
    id: '555cd2c9-8488-4ab7-abbb-6314ef2121a6',
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

export const getAllUsers = (res: http.ServerResponse<http.IncomingMessage>) => {
  res.statusCode = 200;
  return res.end(JSON.stringify(db));
};

export const getUser = (
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

export const createUser = async (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  const newUser = await getRequestBody(req);

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

export const updateUser = async (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  id: string
) => {
  if (id && !validate(id)) {
    res.statusCode = 400;
    return res.end('Id is invalid');
  }

  const index = db.findIndex((user) => {
    return user.id === id;
  });
  console.log(index);
  if (index === -1) {
    res.statusCode = 404;
    res.end(`user with id:${id}, doesn't exist`);
  } else if (index !== -1) {
    const newUser = await getRequestBody(req);

    if (isValidUpdate(newUser)) {
      const updateUser: User = { ...db[index], ...newUser };
      db[index] = updateUser;
      console.log(updateUser);
      res.statusCode = 200;
      res.end(JSON.stringify(updateUser));
    } else {
      res.statusCode = 400;
      res.end(`{"error": "${http.STATUS_CODES[400]}"}`);
    }
  }
};

export const deleteUser = (
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
    res.statusCode = 204;
    res.end(`user been delete`);
  } else {
    res.statusCode = 404;
    res.end(`user with id:${id}, doesn't exist`);
  }
};

async function getRequestBody(req: http.IncomingMessage) {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  return JSON.parse(Buffer.concat(buffers).toString());
}
