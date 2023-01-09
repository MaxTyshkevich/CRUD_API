import { User } from './type';

export function isValidNewUser(user: User) {
  if (Object.keys(user).length !== 3) return false;
  return (
    typeof user.username === 'string' &&
    typeof user.age === 'number' &&
    Array.isArray(user.hobbies)
  );
}

export function valideURL(url: string = '') {
  let arrayURL = url?.split('/').filter(Boolean);

  if (`${arrayURL[0]}/${arrayURL[1]}` === 'api/users') {
    return true;
  }
  return false;
}

export function getID(url: string = '') {
  let arrayURL = url?.split('/').filter(Boolean);

  return arrayURL[2] ?? null;
}
