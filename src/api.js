const API_KEY = 'd3bbe919bf07cff37ac0ea6d81c1bfd010ed648112dc7061b8f3c5898e56aa79';

const coinsHandlers = new Map(); // ! список функций, которые будут срабатывать при добавлении монетки
const webSocket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

webSocket.addEventListener('message', (event) => {
  const { TYPE: type, FROMSYMBOL: currencyCoin, PRICE: price } = JSON.parse(event.data);
  if (type !== '5') {
    return;
  }
  const handlers = coinsHandlers.get(currencyCoin) || [];
  handlers.forEach((cb) => cb(price));
});

const sendToWS = (message) => {
  const stringifiedMessage = JSON.stringify(message);

  if (webSocket.readyState === WebSocket.OPEN) {
    webSocket.send(stringifiedMessage);
    return;
  }

  webSocket.addEventListener(
    'open',
    () => {
      webSocket.send(stringifiedMessage);
    },
    { once: true }
  );
};

const subscribeToCoinWS = (coin) => {
  sendToWS({
    action: 'SubAdd',
    subs: [`5~CCCAGG~${coin}~USD`]
  });
};

const unsubscribeFromCoinWS = (coin) => {
  sendToWS({
    action: 'SubRemove',
    subs: [`5~CCCAGG~${coin}~USD`]
  });
};

export const subscribeToCoinUpdates = (coin, cb) => {
  const existingSubscribers = coinsHandlers.get(coin) || []; // ! получаем список раннее добавленных функций cb или []
  coinsHandlers.set(coin, [...existingSubscribers, cb]); // ! добавляет к coin новый "cb" в довесок к уже имеющимся функциям existingSubscribers
  subscribeToCoinWS(coin);
};

export const unsubscribeFromCoinUpdates = (coin) => {
  coinsHandlers.delete(coin.toUpperCase());
  unsubscribeFromCoinWS(coin.toUpperCase());
};
