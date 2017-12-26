const EXCHANGES = {
  exmo: {
    getTickers: 'https://api.exmo.com/v1/ticker/'
  }
};

const request = (exchange, method) => {
  return fetch(EXCHANGES[exchange][method])
    .then((response) => {
      return response.json();
    });
};

const getTickers = (exchange) => {
  return request(exchange, 'getTickers', function (json) {
    return json;
  });
};

export { getTickers };