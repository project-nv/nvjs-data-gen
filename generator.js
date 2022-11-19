
import { DataLoader } from './binance.js'
import taParser from './taParser.js'

const BRACES_REGEX = /\{(.+)\}/gm
const PARENTH_REGEX = /\((.+)\)/gm
const TYPES_REGEX = /[_$a-zA-Z]+/
const PANE_REGEX = /pane[_\s-]*?([0-9]+)/

export default class Generator {

    constructor() {
        this.dl = new DataLoader()
    }

    /* Variants:

    // returns a simple ochlv dataset
    get('APEUSDT', '1H', 4200)

    // Text-based data constructor
    get(`
        indexBased;
        $Candles {name=Ape Tether US Binance | data=@(APEUSDT, 1h, 4200)}
            + Spline {name=EMA, 10 | data=ema(close, 10)}
            + Spline {name=EMA, 20 | data=ema(close, 20)};
        RSI(name=RSI, 14 | data=rsi(close, 14));
    `)

    // Full form of a dataset
    get({
        indexBased: true,
        panes: [{
            overlays: [{
                name: 'Ape Tether US Binance',
                type: 'Candles',
                main: true,
                data: 'APEUSDT, 1H, 4200'
            }, {
                name: 'EMA, 50',
                type: 'EMA',
                data: 'EMA(50)'
            }]
        }]
    })
    */

    get(query, tf, length) {

        if (query && tf) {
            return this.getSimple(query, tf, length)
        }

        if (typeof query === 'string' && !tf) {
            return this.getTextBased(query)
        }

        if (typeof query === 'Object') {
            return this.getFull(query)
        }

    }

    async getSimple(query, tf, length = 4200) {
        this.dl.SYM = query
        this.dl.TF = tf

        let data = await this.dl.loadLength(length)

        return {
            panes: [{
                overlays: [{
                    name: query,
                    type: "Candles",
                    data: data
                }]
            }]
        }
    }

    async getTextBased(query) {

        let data = { panes: [] }
        let lines = query.split(';').map(x => x.trim())

        for (var line of lines) {

            if (line.includes('indexBased')) {
                data.indexBased = true
                continue
            }

            if (line[0] === '#') {
                this.parsePaneSettings(line, data)
                continue
            }

            let newPane = { overlays: [] }

            let ovs = line.split('+')
            ovs = ovs.filter(x => x.trim().length)

            if (!ovs.length) continue

            for (var ovSrc of ovs) {
                let ov = this.parseOverlay(ovSrc)
                newPane.overlays.push(ov)
            }

            data.panes.push(newPane)

        }

        return this.getFull(data)
    }

    async getFull(query) {

        for (var pane of query.panes) {
            for (var ov of pane.overlays) {
                if (typeof ov.data === 'string') {
                    if (ov.data[0] === '@') {
                        PARENTH_REGEX.lastIndex = 0
                        var m = PARENTH_REGEX.exec(ov.data)
                        if (m && m[1]) {
                            let args = this.getDataArgs(m[1])
                            this.dl.SYM = args[0]
                            this.dl.TF = args[1]
                            let len = args[2] ?? 420
                            let d = await this.dl.loadLength(len)
                            ov.data = this.filterData(d, args[3])
                        }
                    }
                }
            }
        }
        return taParser.exec(query)
    }

    parseOverlay(str) {

        let ov = {}

        TYPES_REGEX.lastIndex = 0
        //BRACES_REGEX.lastIndex = 0

        var m = TYPES_REGEX.exec(str)
        if (m && m[0]) {
            if (m[0][0] === '$') ov.main = true
            ov.name = m[0].replace('$', '')
            ov.type = m[0].replace('$', '')
        }

        //var m = BRACES_REGEX.exec(str)
        var m = this.insideBraces(str)
        if (m) {
            let props = m.split('|').map(x => x.trim())
            for (var p of props) {
                let [k, v] = p.split('=').map(x => x.trim())
                ov[k] = this.parseValue(v)
            }
        }

        return ov
    }

    parsePaneSettings(line, data) {
        let m = PANE_REGEX.exec(line)
        let id = (m && m[1]) ? parseInt(m[1]) : 0

        if (!data.panes[id]) {
            return console.warn(`Theres not pane #${id}`)
        }

        let pane = data.panes[id]
        let obj = this.insideBraces(line)
        pane.settings = new Function(`return {${obj}}`)()
    }

    parseValue(v) {
        if (v === 'undefined') return undefined
        if (v === 'null') return null
        if (v === 'true') return true
        if (v === 'false') return false
        let num = parseFloat(v)
        if (num === num) return num
        if (v[0] === '[' || v[0] === '{') {
            return new Function(`return ${v}`)()
        }
        return v
    }

    getDataArgs(str) {
        let args = str.split(',').map(x => x.trim())
        args[2] = args[2] ? parseInt(args[2]) : null
        return args
    }

    filterData(data, filter) {
        switch(filter) {
            case 'o':
            case 'open':
                return data.map(x => [x[0], x[1]])
            case 'h':
            case 'high':
                return data.map(x => [x[0], x[2]])
            case 'l':
            case 'low':
                return data.map(x => [x[0], x[3]])
            case 'c':
            case 'close':
                return data.map(x => [x[0], x[4]])
            case 'v':
            case 'vol':
            case 'volume':
                return data.map(x => [x[0], x[5]])
            default:
                return data
        }
    }

    insideBraces(src) {
        let count = 0
        let firstLeft = undefined
        let lastRight = undefined
        for (var i = 0; i < src.length; i++) {
            if (src[i] === '{') {
                count++
                firstLeft = firstLeft ?? i
            }
            else if (src[i] === '}') {
                count--
                lastRight = i
            }
            if (count === 0 && firstLeft !== undefined) {
                return src.slice(
                    firstLeft + 1,
                    lastRight
                )
            }
        }
    }
}
