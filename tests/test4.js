
import NvjsGen from '../index.js'

async function __test__() {

    let data = new NvjsGen()

    // Indicators test

    var ds = await data.get(`
        $Candles {
            name=Ape Tether US Binance | data=@(APEUSDT, 1h, 420) |
            settings={ precision: 2 }
        }
        + Volume {
            name = Vol |
            data = iter(i => {
                if (close[i] > open[i]) {
                    return [volume[i], 1] // Volume Up
                } else {
                    return [volume[i], -1] // Volume Down
                }
            })
        };
    `)

    if (ds?.panes[0]?.overlays[0]?.data.length > 0 &&
        ds?.panes[0]?.overlays[1]?.data[0].length === 3) {
        console.log('Indicator [OK]')
    } else {
        console.log('Indicator [FAILED]')
    }

}

__test__()
