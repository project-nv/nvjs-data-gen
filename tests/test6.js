
import NvjsGen from '../index.js'

async function __test__() {

    let data = new NvjsGen()

    // Indicators test

    var ds = await data.get(`
        $Candles {
            name=Ape Tether US Binance | data=@(APEUSDT, 1h, 420)
        }
        + Trades {
            name=Trades |
            data = (async () => {
                let rrr = await rsi(close, 14)
                let out = []
                let pos = 0
                for (var i = 0; i < close.length; i++) {
                    if (rrr[i - 14] < 30 && pos < 5) {
                        out.push([time[i], 1, close[i], 'Buy'])
                        pos++
                    } else if (rrr[i - 14] > 70 && pos > 0) {
                        out.push([time[i], -1, close[i], 'Sell'])
                        pos = 0
                    }
                }
                return {out, timify: false}
            })()
        };
        Spline {
            name=RSI, 14 |
            data=rsi(close, 14) |
            settings={ precision: 2 }
        };
    `)

    if (ds?.panes[0]?.overlays[1]?.data.length > 0) {
        console.log('Indicator [OK]')
    } else {
        console.log('Indicator [FAILED]')
    }
}

__test__()
