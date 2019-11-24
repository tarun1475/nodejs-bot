const program = require("commander");
const { TradingBot } = require("./src/bot");
const Ticker = require("./src/ticker");
const config = require("./config");

(async () => {
  let inputObj = {};

  const { interval, pair, strategy, funds, isLive } = config.options;

  const trader = new TradingBot({ pair, funds, strategy, isLive, interval });
  await trader.init();
})();
