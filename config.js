const config = {};

config.options = {
  interval: 10, // Interval in seconds for candlestick
  pair: "BTC-USD", //  Pair identifier ,
  strategy: "simple", // strategy type
  isLive: false,
  funds: 50000 // 50000 usd
};

module.exports = config;
