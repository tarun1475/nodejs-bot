const { Ticker } = require("./ticker");
const { Candlestick } = require("./candlestick");
const randomstring = require("randomstring");
const colors = require("colors/safe");
const { Exchange } = require("./exchange");
const { Factory } = require("./strategy");

/**
 * TradingBot interface and implementation.
 */

class TradingBot {
  /**
   * Constructs the TradingBot instance.
   *
   * @param {string} pair - pair in which we want to run our trading simulation e.g BTC-USD.
   * @param {int} funds is the total funds to be spent for a trade.
   * @param {interval} Interval in seconds for candlestick
   */
  constructor({ pair, funds, strategy, isLive, interval }) {
    this.isLive = isLive || false;
    this.totalFunds = funds || 50000;
    this.exchange = new Exchange({ isLive: this.isLive, pair: pair });
    this.ticker = new Ticker({
      pair,
      onTick: async tick => {
        await this.onTick(tick);
      }
    });
    this.interval = interval;
    this.strategyType = strategy;
    this.strategy = Factory.create(this.strategyType, {
      onBuySignal: x => {
        this.onBuySignal(x);
      },
      onSellSignal: x => {
        this.onSellSignal(x);
      }
    });
    this.pair = pair;
    this.sticks = [];
  }

  /**
   * Initialise the simulation from here.
   * it sets the initial candle to null and starts the ticker.
   */
  async init() {
    this.currentCandle = null;
    this.ticker.init();
  }

  /**
   * onTick is called on every tick we recieved from the bitfinex websocket client.
   * @param {Object} tick is provided as:-

    {"event":"info","version":2,"serverId":"2352efbe-d851-4b56-ae0a-70d69454867c","platform":{"status":1}}
    {"event":"subscribed","channel":"ticker","chanId":264867,"symbol":"tBTCUSD","pair":"BTCUSD"}
    [264867,[7348.6,48.23130606,7348.7,33.207850629999996,28.2,0.0039,7348.6,4818.53458907,7385,7141]]

   * we will parse this ticker to get volume and price.
   */
  async onTick(tick) {
    let price, volume;
    tick = JSON.parse(tick);

    if (tick.event === undefined) {
      if (tick[1] !== undefined) {
        // tick[1] =  [7348.6,48.23130606,7348.7,33.207850629999996,28.2,0.0039,7348.6,4818.53458907,7385,7141]
        let ticker = tick[1];

        price = parseFloat(ticker[6]);
        volume = parseFloat(ticker[7]);

        if (!isNaN(price) && !isNaN(volume)) {
          console.log(
            `Last Traded Price: ${price.toFixed(
              2
            )} USD , Last Traded Volume: ${volume.toFixed(2)} BTC`
          );

          try {
            // check if any candle exists in this instance
            if (this.currentCandle) {
              this.currentCandle.onPrice({ price, volume });
            } else {
              // create a new candlestick
              this.currentCandle = new Candlestick({
                price: price,
                volume: volume,
                interval: this.interval
              });
            }

            // maintain an array of sticks
            this.sticks.push(this.currentCandle);

            // run the strategy specified in the input.
            await this.strategy.run({
              sticks: this.sticks,
              time: new Date()
            });

            // print the positions and PNL for the simulation.
            if (this.currentCandle.state === "closed") {
              const candle = this.currentCandle;
              this.currentCandle = null;

              this.printPositions();
              this.printProfit();
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  }

  /**
   * onBuySignal is called whenever our strategy buy conditions met
   * @param {float} price at which we want place a buy order for a coin.
   * @param {string} time at which the trade is going to execute.

   * It opens the position after success execution of the trade from an exchange

   */
  async onBuySignal({ price, time }) {
    console.log(`BUY BUY BUY  ${price}`);

    // Place buy order on the respective exchange.
    // For we are just calling this function and will get dummy result.
    const result = await this.exchange.buy(this.totalFunds, price, this.pair);
    if (!result) {
      return;
    }

    const id = randomstring.generate(20);
    this.strategy.positionOpened({
      price: result.price,
      time,
      size: result.size,
      id,
      pair: this.pair
    });
  }

  /**
   * onSellSignal is called whenever our strategy  sell conditions met
   * @param {float} price at which we want place a sell order for a coin.
   * @param {float} size is quantity we want to sold.
   * @param {string} time at which the trade is going to execute.
   * @param {Object} position is the opened position we want to close after successfull trade execution.

   * It finally closes the position after success execution of the trade from an exchange

   */
  async onSellSignal({ price, size, time, position }) {
    console.log(`SELL SELL SELL ${price}`);
    const result = await this.exchange.sell(price, size);
    if (!result) {
      return;
    }
    this.strategy.positionClosed({
      price: result.price,
      time: time,
      size: result.size,
      id: position.id,
      pair: this.pair
    });
  }

  printPositions() {
    const positions = this.strategy.getPositions();
    positions.forEach(p => {
      p.print();
    });
  }

  printProfit() {
    const positions = this.strategy.getPositions();
    const total = positions.reduce((r, p) => {
      return r + p.profit();
    }, 0);

    const prof = `${total.toFixed(2)}`;
    const colored = total > 0 ? colors.green(prof) : colors.red(prof);
    console.log(`PNL: ${colored} USD`);
  }

  getBot() {
    return {
      isLive: this.isLive,
      totalFunds: this.totalFunds,
      exchange: this.exchange
    };
  }
}

module.exports = { TradingBot };
