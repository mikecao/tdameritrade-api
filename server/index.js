const https = require('https');
const Koa = require('koa');
const serve = require('koa-static');
const router = require('./router');
const ssl = require('./ssl');
const { PORT } = process.env;

const app = new Koa();

app.use(serve(__dirname));
app.use(router.routes());
app.use(router.allowedMethods());

https
  .createServer(ssl, app.callback())
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
