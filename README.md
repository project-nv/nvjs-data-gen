
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
get('APEUSDT', '1h', 4200)

// Text-based data constructor
get(`
    indexBased;
    $Candles {
        name=Ape Tether US Binance | data=@(APEUSDT, 1h, 420)
    }
    + Spline {name=EMA, 10 | data=ema(close, 10)}
    + Spline {name=EMA, 20 | data=ema(close, 20)};
    Spline {
        name=RSI, 14 |
        data=rsi(close, 14) |
        settings={ precision: 2 }
    };
    #pane0 { scales: { A: { precision: 2 } } };
`)
```

- `indexBased` sets the index-based mode
- `$` means that `Candles` is the main overlay.
- `@` loads data from Binance
- `rsi()`, `ema()` calculate TA with [ta.js](https://github.com/Bitvested/ta.js) lib
- `#` is for the pane settings

Lines should be separated with `;`. Each line is either:

- Overlay1 + Overlay2 + ... + OverlayN
- indexBased flag
- pane settings descriptor

Overlay props are separated with `|`:

```js
Spline { name = EMA, 20 | data = ema(close, 20) }
```
