
import NvjsGen from '../index.js'

async function __test__() {

    let data = new NvjsGen()

    // Indicators test

    var ds = await data.get(`
        $Spline {
            name=Ape Tether US Binance | data=@(APEUSDT, 1h, 420, close) |
            settings={ precision: 2 }
        };
    `)

    if (ds?.panes[0]?.overlays[0]?.data.length > 0 &&
        ds?.panes[0]?.overlays[0]?.data[0].length === 2) {
        console.log('Indicator [OK]')
    } else {
        console.log('Indicator [FAILED]')
    }

}

__test__()
