import http from 'node:http';

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from './crud.js';
import { getID, valideURL } from './utils.js';

export const HandlerServer = async (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>
) => {
  const { method, url } = req;

  res.setHeader('Content-Type', 'application/json');

  if (!valideURL(url)) {
  }

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
        await createUser(req, res);
        break;
      }
      case 'PUT': {
        await updateUser(req, res, userID);
        break;
      }
      case 'DELETE': {
        deleteUser(res, userID);
        break;
      }

      default:
        res.statusCode = 404;

        res.end('Route not found');
    }
  } catch (error: any) {
    res.statusCode = 500;

    res.end('Internal Server Error');
  }
};
