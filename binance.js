
import axios from 'axios'

class DataLoader {

    constructor() {
        this.URL = "https://api1.binance.com/api/v3/klines";
        this.SYM = "APEUSDT";
        this.TF = "1h"; // See binance api definitions

        this.loading = false;
    }

    async load() {
        let url = `${this.URL}?symbol=${this.SYM}&interval=${this.TF}`;
        let result = await this.getUrl(url)
        let data = result.data
        return data.map((x) => this.format(x))
    }

    async loadMore(endTime) {
        let url = `${this.URL}?symbol=${this.SYM}&interval=${this.TF}`;
        url += `&endTime=${endTime}`;
        let result = await this.getUrl(url)
        let data = result.data
        return data.map((x) => this.format(x));
    }

    async loadLength(len) {
        let data = await this.load()
        while(data.length < len) {
            let t0 = data[0][0]
            let chunk = await this.loadMore(t0 - 1)
            if (chunk.length < 2) break
            data.unshift(...chunk)
        }
        return data.slice(-len)
    }

    async getUrl(url) {
        try {
            if (typeof window !== "undefined") {
                console.log('here')
                let res = await fetch(url)
                return { data: await res.json() }
            } else {
                return await axios.get(url)
            }
        } catch(err) {
            console.log(err)
            return { data: [] }
        }
    }

    format(x) {
        return [
            x[0],
            parseFloat(x[1]),
            parseFloat(x[2]),
            parseFloat(x[3]),
            parseFloat(x[4]),
            parseFloat(x[7])
        ];
    }
}

export {
    DataLoader
};
