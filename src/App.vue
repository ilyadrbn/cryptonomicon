<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div
      v-if="loadingState"
      class="w-100 h-100 fixed inset-0 z-50 flex items-center justify-center bg-purple-800 opacity-80"
    >
      <svg
        class="-ml-1 mr-3 h-12 w-12 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>

    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700">Тикер</label>
            <div class="relative mt-1 rounded-md shadow-md">
              <input
                type="text"
                name="wallet"
                id="wallet"
                class="mb-1 block w-full rounded-md border-gray-300 p-2 text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-gray-500"
                placeholder="Например DOGE"
                v-model="ticker"
                @keydown.enter="add"
                @input="findCoin(), (showException = false)"
              />
            </div>
            <div class="flex flex-wrap rounded-md bg-white p-1 shadow-md" v-if="ticker">
              <!-- <span
                class="m-1 inline-flex cursor-pointer items-center rounded-md bg-gray-300 px-2 text-xs font-medium text-gray-800"
                v-for="p in pattern"
                :key="p"
                @click="addPattern(p)"
              > -->
              <span
                class="m-1 inline-flex cursor-pointer items-center rounded-md bg-gray-300 px-2 text-xs font-medium text-gray-800"
                v-for="(p, idx) in pattern"
                :key="idx"
                @click="addPattern(p)"
              >
                {{ p }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="showException" class="text-sm text-red-600">Такой тикер уже добавлен</div>
        <button
          type="button"
          @click="add()"
          class="my-4 inline-flex items-center rounded-full border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium leading-4 text-white shadow-sm transition-colors duration-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
      </section>

      <template v-if="tickers.length">
        <hr class="my-4 w-full border-t border-gray-600" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            class="cursor-pointer overflow-hidden rounded-lg border-solid border-purple-800 bg-white shadow"
            v-for="t in tickers"
            :key="t.name"
            :class="{
              'border-2': selected === t
            }"
            @click="selected = t"
          >
            <div class="px-4 py-5 text-center sm:p-6">
              <dt class="truncate text-sm font-medium text-gray-500">
                {{ t.name.toUpperCase() }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ t.price }}</dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              class="text-md flex w-full items-center justify-center bg-gray-100 px-4 py-4 font-medium text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-600 hover:opacity-20 focus:outline-none sm:px-6"
              @click.stop="removeCard(t)"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Удалить
            </button>
          </div>
        </dl>
        <hr class="my-4 w-full border-t border-gray-600" />
      </template>
      <section class="relative" v-if="selected && tickers.length">
        <h3 class="my-8 text-lg font-medium leading-6 text-gray-900">
          {{ selected.name.toUpperCase() }} - USD
        </h3>
        <div class="flex h-64 items-end border-b border-l border-gray-600">
          <!-- <div
            class="bg-purple-800 border w-10 h-24"
            v-for="state in graphStates"
            :key="state"
          ></div> -->
          <div
            class="min-h-14 w-10 border bg-purple-800"
            v-for="(graph, index) in normalizeGraph()"
            :key="index"
            :style="`height: ${graph}px`"
          ></div>
        </div>
        <button type="button" class="absolute right-0 top-0" @click="selected = null">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      loadingState: true,
      showException: false,
      ticker: null, // поле ввода
      pattern: [], // список доступных тикеров в шаблонах под инпутом
      tickers: [], // массив, в которых пушим все цены
      selected: null, // выбранный тикер
      graphStates: [], // состояния графика
      fetchCoins: null
    };
  },
  created() {
    this.fetchCoins = (async () => {
      const data = await fetch(`https://min-api.cryptocompare.com/data/all/coinlist?summary=true`);
      const coins = await data.json();
      this.loadingState = false;
      return coins.Data;
    })();

    const tickersData = localStorage.getItem('cryptonomicon-list');
    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach(ticker => { 
        this.subscribeToUpdates(ticker.name);
      })
    }
  },
  methods: {
    subscribeToUpdates(tickerName) {
      setInterval(async () => {
        await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD`)
          .then((res) => res.json())
          .then((data) => {
            this.tickers.find((t) => t.name === tickerName).price = data.USD;
            this.graphStates.push(data.USD);
          });
      }, 3000);
    },

    findCoin() {
      this.fetchCoins.then((coins) => {
        for (const key in coins) {
          if (coins[key].Symbol.startsWith(this.ticker.toUpperCase(), 0)) {
            this.pattern.push(coins[key].Symbol);
            if (this.pattern.length > 4) this.pattern.shift();
          }
        }
      });
    },
    findInTable() {
      return this.tickers.find((t) => t.name.toUpperCase() === this.ticker.toUpperCase());
    },
    add() {
      if (this.ticker && !this.findInTable()) {
        const currentTicker = {
          name: this.ticker,
          price: 0
        };
        this.tickers.push(currentTicker);

        localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers));

        this.subscribeToUpdates(currentTicker.name);

        this.ticker = null;
        this.showException = false;
      } else if (this.findInTable) {
        this.showException = true;
      }
    },

    /**
     * Normalize the graph states based on the maximum and minimum values.
     *
     * @return {Array} An array of normalized graph states.
     */
    normalizeGraph() {
      const maxValue = Math.max(...this.graphStates);
      const minValue = Math.min(...this.graphStates);
      return maxValue === minValue
        ? this.graphStates.map(() => 56)
        : this.graphStates.map((state) => ((state - minValue) * 256) / (maxValue - minValue)); // формула нормализации данных
    },
    addPattern(pattern) {
      this.ticker = pattern;
      this.add();
    },
    removeCard(t) {
      this.tickers.splice(this.tickers.indexOf(t), 1);
      this.selected = null;
    }
  }
};
</script>

<!-- <style src="./app.css"></style> -->
