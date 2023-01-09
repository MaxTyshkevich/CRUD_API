import { v4 as uuidv4 } from 'uuid';
import { User } from './type';

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
