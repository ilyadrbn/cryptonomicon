const API_KEY = 'd3bbe919bf07cff37ac0ea6d81c1bfd010ed648112dc7061b8f3c5898e56aa79';

const coinsHandlers = new Map(); // ! список функций, которые будут срабатывать при добавлении монетки

const loadCoins = () => {
  if (coinsHandlers.size === 0) {
    return;
  }
  return fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...coinsHandlers.keys()].join(
      ','
    )}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((res) => {
      return res.json();
    })
    .then((rawData) => {
      /*
       ** rawData = {
       **   DOGE: {
       **     USD: 1000
       **   }
       ** }
       **   => return  { DOGE: 1000 } where 1000 is price in USD
       */
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );
      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = coinsHandlers.get(currency) || [];
        handlers.forEach((cb) => cb(newPrice));
      });
    });
};

export const subscribeToCoinUpdates = (coin, cb) => {
  const existingSubscribers = coinsHandlers.get(coin) || []; // ! получаем список раннее добавленных функций cb или []
  coinsHandlers.set(coin, [...existingSubscribers, cb]); // ! добавляет к coin новый "cb" в довесок к уже имеющимся функциям existingSubscribers
};

export const unsubscribeFromCoinUpdates = (coin) => {
  coinsHandlers.delete(coin.toUpperCase());
  // const existingSubscribers = coinsHandlers.get(coin) || []; // ! получаем список раннее добавленных функций cb или []
  // coinsHandlers.set(
  //   coin,
  //   existingSubscribers.filter((sub) => sub !== cb) // ! фильтруем для coin колбэки отличные от колбэка "cb"
  // );
};

setInterval(loadCoins, 5000);
