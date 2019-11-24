## Cryptobot

## Overview

Cryptobot is an algo trading simulation that can connect to any major crypto exchange but for this particular code we have
connected bitfinex websocket.It is written in javascript and runs on nodejs.

Right now it supports only one simple algorithm strategy which is responsible for buy and sell signals based on the ticker data
we receive from the exchange. Our goal is to listen for market data from the exchange and place buy and sell orders in order to
calculate the final profit and loss and print it to the console.

### Installation

Make sure you have node.js and npm installed.

Clone the repository and install the dependencies

```bash
git clone https://github.com/tarun1475/nodejs-bot.git
cd nodejs-bot
npm install
```

### Run

```bash
npm start
```

## Designing a Algotrading bot in nodejs.

Being a single threaded language nodejs is capable to perform non-blocking I/O operations which simply means offloading operations to
to system kernel whenever possible.

By utilising this asynchronous nature we can handle multiple buy and sell orders running in the background and when it completes nodejs recieves an event from the kernel and each operation is added to poll queue.

## Performance improvements

- I will try to optimize each operation which is involved in processing the orders to lower the latency of the system by
  not allocating any extra run time memory.
- In c++ we can use system registers to do mathematical operations. it can be used in nodejs as c++ addons which will help us to
  optimize our mathematical calculation and hence we can process more orders.
- If we have e.g lacks of ticks per second in a bull run scenario this bot can't handle it effciently so what we can do is use
  messaging queue services like rabbitmq so that we can never lose any tick.
- We can have multiple services running under a cluster like one is reponsible for listening market data and adding buy and sell
  signals to queue and other is only responsible for only executing orders.Hence we can scale independently each service when required.
- For communication between these services we can use protocol buffers instead of json data.
