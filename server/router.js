const Router = require('koa-router');
const axios = require('axios');
const querystring = require('querystring');
const util = require('util');

const { CLIENT_ID, REDIRECT_URI, ACCESS_TOKEN, REFRESH_TOKEN } = process.env;

async function auth(ctx) {
  const query = querystring.stringify({
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
  });

  ctx.redirect(`https://auth.tdameritrade.com/auth?${query}`);
}

async function callback(ctx) {
  await axios
    .request({
      url: 'https://api.tdameritrade.com/v1/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: querystring.stringify({
        grant_type: 'authorization_code',
        access_type: 'offline',
        code: ctx.request.query.code,
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
      }),
    })
    .then(result => {
      ctx.body = result.data;
    })
    .catch(err => {
      ctx.status = 500;
      ctx.body = `ERROR: ${err.message}\n${util.inspect(err.response)}`;
    });
}

async function refresh(ctx) {
  await axios
    .request({
      url: 'https://api.tdameritrade.com/v1/oauth2/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
        client_id: CLIENT_ID,
      }),
    })
    .then(result => {
      ctx.body = result.data;
    })
    .catch(err => {
      ctx.status = 500;
      ctx.body = `ERROR: ${err.message}\n${util.inspect(err.response)}`;
    });
}

async function test(ctx) {
  await axios
    .request({
      url: 'https://api.tdameritrade.com/v1/marketdata/SPY/quotes',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    })
    .then(result => {
      ctx.body = result.data;
    })
    .catch(err => {
      ctx.status = 500;
      ctx.body = `ERROR: ${err.message}\n${util.inspect(err.response)}`;
    });
}

const router = new Router();

router.get('/auth', auth);
router.get('/auth/callback', callback);
router.get('/auth/refresh', refresh);
router.get('/test', test);

module.exports = router;
