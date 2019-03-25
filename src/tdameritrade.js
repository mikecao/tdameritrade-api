/* eslint-disable no-unused-vars */
const axios = require('axios');
const ensureArray = require('ensure-array');
const querystring = require('querystring');

const API_ENDPOINT = 'https://api.tdameritrade.com/v1/';

function parseSymbols(symbols) {
  return ensureArray(symbols).join(',');
}

function parseQuery(url, params) {
  const query =
    params &&
    querystring.stringify(
      Object.keys(params).reduce((values, key) => {
        if (params[key] !== undefined) {
          values[key] = params[key];
        }
        return values;
      }, {})
    );
  return query ? `${url}?${query}` : url;
}

function parseData(data) {
  return typeof data === 'object'
    ? querystring.stringify(data)
    : querystring.parse(data);
}

class TDAmeritrade {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  // region HTTP
  config() {
    return {
      baseURL: API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json',
      },
    };
  }

  get(url, params, config = {}) {
    return axios.request({
      method: 'get',
      url: parseQuery(url, params),
      ...this.config(),
      ...config,
    });
  }

  post(url, data, config = {}) {
    return axios.request({
      method: 'post',
      url,
      data: parseData(data),
      ...this.config(),
      ...config,
    });
  }

  put(url, data, config = {}) {
    return axios.request({
      method: 'put',
      url,
      data: parseData(data),
      ...this.config(),
      ...config,
    });
  }

  delete(url, config = {}) {
    return axios.request({
      method: 'delete',
      url,
      ...this.config(),
      ...config,
    });
  }
  // endregion
}

module.exports = TDAmeritrade;
