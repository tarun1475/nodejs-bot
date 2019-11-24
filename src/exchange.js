class Exchange {
  constructor({ isLive, orderType = "market", pair }) {
    this.isLive = isLive;
    this.orderType = orderType;
    this.pair = pair;
  }

  async buy(funds, price) {
    if (funds === undefined) {
      throw new Error(`Should pass funds as parameter`);
    }

    if (price === undefined) {
      throw new Error(`Should pass price as parameter`);
    }

    let size = Number(funds / price);
    size = size.toFixed(2);

    return {
      price: price,
      size: size
    };
  }
  async sell(price, size) {
    if (price === undefined) {
      throw new Error(`Should pass price as parameter`);
    }

    if (size === undefined) {
      throw new Error(`Should pass size as parameter`);
    }

    // call bitfinex sell order api here
    // return the results we get from the api
    return {
      price: price,
      size: size
    };
  }
}

module.exports = { Exchange };
