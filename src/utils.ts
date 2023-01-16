import { User } from './type';

export function valideURL(url: string = '') {
  let arrayURL = url?.split('/').filter(Boolean);
  if (arrayURL.length > 3) throw new Error('bed bed request =(');

  if (`${arrayURL[0]}/${arrayURL[1]}` === 'api/users') {
    return true;
  }
  return false;
}

export function getID(url: string = '') {
  let arrayURL = url?.split('/').filter(Boolean);

  return arrayURL[2] ?? null;
}

export function isValidNewUser(user: User) {
  if (Object.keys(user).length !== 3) return false;
  return (
    typeof user.username === 'string' &&
    typeof user.age === 'number' &&
    Array.isArray(user.hobbies) &&
    user.hobbies.every((etem) => typeof etem === 'string')
  );
}

export function isValidUpdate(userUpdete: User) {
  const VALID_PROPERTIES = [
    ['id', 'String'],
    ['username', 'String'],
    ['age', 'Number'],
    ['hobbies', 'Array'],
  ];
  const parseUserUpdete = Object.entries(userUpdete);
  const AllProps = parseUserUpdete.length;
  let count = 0;

  for (let i = 0; i < AllProps; i += 1) {
    let key = parseUserUpdete[i][0];
    let value = parseUserUpdete[i][1];
    let typeValue = getType(value);

    const validPropIndex =
      VALID_PROPERTIES.findIndex(([validKey, validType]) => {
        if (
          Array.isArray(value) &&
          value.length &&
          (parseUserUpdete[i][1] as any[]).every(
            (item: any) => typeof item !== 'string'
          )
        ) {
          return false;
        }

        return validKey === key && validType === typeValue;
      }) + 1;

    if (validPropIndex) {
      count += 1;
    }
  }

  return count === AllProps;
}

function getType(elem: any) {
  return Object.prototype.toString.call(elem).slice(8, -1);
}
