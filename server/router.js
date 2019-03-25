const Router = require('koa-router');
const axios = require('axios');
const querystring = require('querystring');
const util = require('util');

const { CLIENT_ID, REDIRECT_URI } = process.env;

async function grant(ctx) {
    const query = querystring.stringify({
        response_type: 'code',
        redirect_uri: `${REDIRECT_URI}/auth`,
        client_id: CLIENT_ID,
    });

    await axios
        .request({
            url: `https://auth.tdameritrade.com/auth?${query}`,
            method: 'GET',
        })
        .then(result => {
            ctx.body = result;
        })
        .catch(err => {
            ctx.status = 500;
            ctx.body = `ERROR: ${err.message}\n${util.inspect(err.response)}`;
        });
}

async function auth(ctx) {
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
                code: ctx.request.code,
                client_id: CLIENT_ID,
                redirect_uri: REDIRECT_URI,
            }),
        })
        .then(result => {
            ctx.body = result;
        })
        .catch(err => {
            ctx.status = 500;
            ctx.body = `ERROR: ${err.message}\n${util.inspect(err.response)}`;
        });
}

const router = new Router();

router.get('/', grant);
router.get('/auth', auth);

module.exports = router;
