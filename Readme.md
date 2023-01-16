# Getting Started crud-api

## Getting Started

You need to add any missing dependencies

**npm install**

### `start:dev`

Runs the app in the development mode.
Open http://localhost:8000 to view it in your browser.

The page will reload when you make changes.
Change port in file .env

### `start:prod`

Builds the app for production to the dist folder.

### `start:multi`

Runs the app in the development mode. with ClusterAPI

## Accessible paths:

- GET api/users
- GET api/users/{userId}
- POST api/users
- PUT api/users/{userId}
- DELETE api/users/{userId}

### Users are stored as objects that have following properties:

- id — unique identifier (string, uuid) generated on server side
- username — user's name (string, required)
- age — user's age (number, required)
- hobbies — user's hobbies (array of strings or empty array, required)
