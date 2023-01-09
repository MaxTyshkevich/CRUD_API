import { User } from './type';
import { v4 as uuidv4, validate } from 'uuid';

import http from 'node:http';
import { isValidNewUser } from './utils';

export const db: User[] = [
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

export const createUser = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
  newUser: User
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

export const updateUser = (
  req: http.IncomingMessage,
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

export const deleteUser = (
  req: http.IncomingMessage,
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
