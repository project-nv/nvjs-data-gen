
import NvjsGen from '../index.js'

async function __test__() {

    let data = new NvjsGen()

    // Simple API

    var ds = await data.get('BTCUSDT', '1h', 420)

    if (ds?.panes[0]?.overlays[0]?.data.length === 420) {
        console.log('Simple get [OK]')
    } else {
        console.log('Simple get [FAILED]')
    }

    // Text-based API

    var ds = await data.get(`
        indexBased;
        $Candles {name=Ape Tether US Binance | data=@(APEUSDT, 1h, 420)}
            + Spline {name=EMA, 10 | data=ema(close, 10)}
            + Spline {name=EMA, 20 | data=ema(close, 20)};
        Spline {name=RSI, 14 | data=rsi(close, 14)};
    `)

    if (ds?.panes[0]?.overlays[0]?.data.length === 420) {
        console.log('Text-based get [OK]')
    } else {
        console.log('Text-based get [FAILED]')
    }

}

__test__()
