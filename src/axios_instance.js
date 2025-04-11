import Axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

let make_axios_instance = ( proxy, userAgent ) => {
    // make an axios instance
    let axios = ( proxy ) ?
        Axios.create({
            httpsAgent: new HttpsProxyAgent({ ...proxy }),
            proxy: false,
            userAgent
        }) :
        Axios.create({
            userAgent: userAgent,
        });
    return axios;
}

export default make_axios_instance;
