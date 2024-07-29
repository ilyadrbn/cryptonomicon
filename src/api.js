const API_KEY = 'd3bbe919bf07cff37ac0ea6d81c1bfd010ed648112dc7061b8f3c5898e56aa79';

export const loadCoins = (coinName) => {
  return fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${coinName}&tsyms=USD&api_key=${API_KEY}`
  ).then((res) => res.json());
};
