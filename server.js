const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json'); // The path to the db.json file
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(5000, () => {
  console.log('JSON Server is running at http://localhost:5000');
});
