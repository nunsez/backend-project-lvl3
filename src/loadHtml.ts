import axios from 'axios'

const loadHtml = (url: string) => {
    const promise = axios.get(url).then((response) => response.data)

    return promise
}

export default loadHtml
