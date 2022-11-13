
# Data generator for NightVision charts

## Install

`npm i @nvjs/data-gen`

## Use

```js

import Degen from '@nvjs/data-gen'

async function main() {

    let degen = new Degen()
    let data = await degen.get('APEUSDT', '15m', 420)

    console.log(data)
}

main()

```

## Examples

```js
// returns a simple ochlv dataset
get('APEUSDT', '1H', 4200)

// Text-based data constructor
get(`
  indexBased;
  $Candles {name=Ape Tether US Binance | data=@(APEUSDT, 1h, 4200)}
    + Spline {name=EMA, 10 | data=ema(close, 10)}
    + Spline {name=EMA, 20 | data=ema(close, 20)};
  RSI(name=RSI, 14 | data=rsi(close, 14));
`)
```

- `$` means that `Candles` is the main overlay.
- `@` loads data from Binance
- `rsi(...)` calculates TA with ta.js lib
