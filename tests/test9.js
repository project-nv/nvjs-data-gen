/*
'cloud-data'; // Change this name, press 'Create' when you are ready
// indexBased;  // Uncomment if you need index-based mode
$Candles {
    name=Ape Tether US Binance | data=@(APEUSDT, 1h, 4200)
}
+ Cloud {
    name=Cloud |
    data = (async () => {
        let ema1 = await ema(close, 50)
        let ema2 = await ema(close, 100)
        while(ema1.length > ema2.length) {
            ema1.shift()
        }
        let out = []
        for (var i = 0; i < ema1.length; i++) {
            out.push([ema1[i], ema2[i]])
        }
        return out
    })()
};
#pane0 { scales: { A: { precision: 2 } } };


*/


import NvjsGen from '../index.js'

async function __test__() {

    let data = new NvjsGen()

    // Indicators test

    var ds = await data.get(`
        $Candles {
            name=Ape Tether US Binance | data=@(APEUSDT, 1h, 420)
        }
        + Cloud {
            name=Cloud |
            data = (async () => {
                let ema1 = await ema(close, 50)
                let ema2 = await ema(close, 100)
                while(ema1.length > ema2.length) {
                    ema1.shift()
                }
                let out = []
                for (var i = 0; i < ema1.length; i++) {
                    out.push([ema1[i], ema2[i]])
                }
                return out
            })()
        };
        #pane0 { scales: { A: { precision: 2 } } };
    `)


}

__test__()
