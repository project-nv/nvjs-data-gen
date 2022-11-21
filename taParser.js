
import ta from 'ta.js'

const FN_REGEX = /([._a-z]+)\(/g

async function exec(query) {

    let all = query.panes.map(x => x.overlays || []).flat()
    let mainOv = all.find(x => x.main) || all[0]

    let env = makeEnv(mainOv.data)

    for (var pane of query.panes) {
        for (var ov of pane.overlays) {
            if (typeof ov.data === 'string') {
                let exec = makeExecutor(ov.data)
                let result = await exec(env, ta)
                ov.data = timify(result, mainOv.data)
            }
        }
    }

    return query
}

function makeExecutor(script) {

    FN_REGEX.lastIndex = 0

    var m, fns = []
    let taExports = Object.keys(ta)
    while(m = FN_REGEX.exec(script)) {
        if (m && m[1]) {
            if (taExports.includes(m[1])) {
                fns.push(m[1])
            }
        }
    }

    for (var f of fns) {
        script = script.replace(f, 'ta.' + f)
    }

    return new Function('env', 'ta', `

        let {
            open, high, low, close, volume,
            hl, hcl, hclv, ohcl
        } = env

        function iter(f) {
            let out = []
            for (var i = 0; i < close.length; i++) {
                out.push(f(i))
            }
            return out
        }

        return ${script}
    `)
}

function makeEnv(data) {

    let stub = {
        open: [], high: [], low: [], close: [],
        volume: [], hl: [], hcl: [], ohlc: [],
        hclv:[]
    }

    if (!data.length) return stub

    if (data[0].length >= 5) {
        stub.open = data.map(x => x[1])
        stub.high = data.map(x => x[2])
        stub.low = data.map(x => x[3])
        stub.close = data.map(x => x[4])
        stub.volume = data.map(x => x[5])
        stub.hl = data.map(x => [x[2], x[3]])
        stub.hcl = data.map(x => [x[2], x[4], x[3]])
        stub.hclv = data.map(x => [x[2], x[4], x[3], x[5]])
        stub.ohcl = data.map(x => [x[1], x[2], x[3], x[4]])
    } else {
        stub.close = data.map(x => x[1])
    }

    return stub

}

function timify(result, data) {

    let offset = data.length - result.length
    let out = []

    for (var i = 0; i < result.length; i++) {
        let t = data[i + offset][0]
        if (typeof result[0] === 'number') {
            out.push([t, result[i]])
        } else {
            out.push([t, ...result[i]])
        }
    }
    return out
}

export default {
    exec
}
