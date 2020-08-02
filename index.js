const globalConfig = require('./globalConfig');

const PORT = 3000;

const mysqlx = require('mysqlx');
const express = require('express');

const app = express();

app.post('/', async (request, response, next) => {
  const dbSession = await mysqlx
    .getSession({
      host: globalConfig.mysql.host,
      port: globalConfig.mysql.port,
      user: globalConfig.mysql.user,
      password: globalConfig.mysql.password,
    })
    .then(async (dbSession) => {
      try {
        await dbSession
          .getSchema('example')
          .getTable('users')
          .select([])
          .execute()
          .then((res) => {
            response.send(res.getObjects());
          });
      } catch (error) {
        console.log(error);
      }

      return dbSession;
    })
    .catch((e) => {
      response.send('Could not do query');
    });
});

app.listen(PORT || process.env.PORT, () => {
  console.log(`Server is listening at port ${process.env.PORT || PORT}!`);
});
