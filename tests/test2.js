
import NvjsGen from '../index.js'

async function __test__() {

    let data = new NvjsGen()

    // Indicators test

    var ds = await data.get(`
        $Candles {
            name=Ape Tether US Binance | data=@(APEUSDT, 1h, 420) |
            settings={ precision: 2 }
        };
        Spline {
            name=Stoch, 14 |
            data=stoch(hcl, 14) |
            settings={ precision: 2 }
        };
        #pane0 { scales: { A: { precision: 2 } } };
    `)

    if (ds?.panes[1]?.overlays[0]?.data.length > 0) {
        console.log('Indicator [OK]')
    } else {
        console.log('Indicator [FAILED]')
    }

}

__test__()
