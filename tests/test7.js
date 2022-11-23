
import NvjsGen from '../index.js'

async function __test__() {

    let data = new NvjsGen()

    // Indicators test

    var ds = await data.get(`
        $Candles {
            name=Ape Tether US Binance | data=@(APEUSDT, 1h, 420)
        };
        Splines {
            name=MACD |
            data = (async () => {
                let hist = await macd_bars(close)
                let value = await macd(close)
                let signal = await macd_signal(close)
                let out = []
                while(true) {
                    let h = hist.pop()
                    let v = value.pop()
                    let s = signal.pop()
                    if (h !== undefined && v !== undefined && s !== undefined) {
                        out.unshift([h, v, s])
                    } else {
                        break
                    }
                }
                return out
            })()
        };
    `)

    if (ds?.panes[1]?.overlays[0]?.data.length > 0 &&
        ds?.panes[1]?.overlays[0]?.data[0].length === 3) {
        console.log('Indicator [OK]')
    } else {
        console.log('Indicator [FAILED]')
    }

    console.log(ds?.panes[1]?.overlays[0]?.data)
}

__test__()
