const https = require('https');
const Koa = require('koa');
const router = require('./router');
const ssl = require('./ssl');
const { PORT } = process.env;

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

https
  .createServer(ssl, app.callback())
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
