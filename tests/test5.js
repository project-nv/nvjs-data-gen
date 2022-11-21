
import NvjsGen from '../index.js'

async function __test__() {

    let data = new NvjsGen()

    // Indicators test

    var ds = await data.get(`
        $Candles {
            name=Ape Tether US Binance | data=@(APEUSDT, 1h, 420)
        }
        + Spline {
            name=Vol Plus |
            data = iter(i => {
                let total = volume[i] || undefined;
                let prop = 0.3 + Math.random() * 0.4;
                let buy = prop * total;
                let sell = total - buy;
                let delta = buy - sell;
                return [buy, sell, total, delta];
            })
        };
    `)

    if (ds?.panes[0]?.overlays[0]?.data.length > 0 &&
        ds?.panes[0]?.overlays[1]?.data[0].length === 5) {
        console.log('Indicator [OK]')
    } else {
        console.log('Indicator [FAILED]')
    }
    
}

__test__()
