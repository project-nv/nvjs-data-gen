
import NvjsGen from '../index.js'

async function __test__() {

    let data = new NvjsGen()

    // Indicators test

    var ds = await data.get(`
        $Candles {
            name=Ape Tether US Binance | data=@(APEUSDT, 1h, 420, close) |
            settings={ precision: 2 }
        }
        + !EMA {
            props = { length: 12 } |
            settings = {}
        }
        + !EMA {
            props = { length: 26 } |
            settings = {}
        };
        !RSI {
            props = { length: 14 } |
            settings = {}
        }
    `)

    if (ds?.panes[0]?.scripts.length > 0 &&
        ds?.panes[0]?.scripts.length > 0 &&
        ds?.panes[0]?.scripts.length > 0) {
        console.log('Indicator [OK]')
    } else {
        console.log('Indicator [FAILED]')
    }

}

__test__()
