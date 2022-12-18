
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
                if (result.timify === false) {
                    ov.data = result.out || []
                } else {
                    ov.data = timify(result, mainOv.data)
                }
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
                script = replace(script, 'ta.' + m[1],
                    m.index,
                    m.index + m[1].length)
            }
        }
    }

    return new Function('env', 'ta', `

        let {
            open, high, low, close, volume,
            hl, hcl, hclv, ohcl, time
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

// Insert string into text
function replace(src, str, i1, i2) {
    return [src.slice(0, i1), str, src.slice(i2)].join('')
}

function makeEnv(data) {

    let stub = {
        open: [], high: [], low: [], close: [],
        volume: [], hl: [], hcl: [], ohlc: [],
        hclv:[], time: []
    }

    if (!data.length) return stub

    if (data[0].length >= 5) {
        stub.time = data.map(x => x[0])
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
        stub.time = data.map(x => x[0])
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
