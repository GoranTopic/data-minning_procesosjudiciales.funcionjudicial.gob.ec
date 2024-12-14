import { makeProxies } from '../src/init.js';
import { HttpsProxyAgent } from 'https-proxy-agent';
import Axios from 'axios';
import { expect } from 'chai';

describe('Proxy IP Test', function () {
    it('should use the same IP from makeProxies as the proxy IP in the request', async function () {
        // Create proxies from makeProxies
        const proxies = makeProxies();
        const proxy = proxies.next();

        // Function to create an Axios instance
        const make_axios_instance = (proxy) => {
            return Axios.create({ 
                httpsAgent: new HttpsProxyAgent({ ...proxy }),
                proxy: false,
            });
        };

        // Create an Axios instance with the proxy
        const axios_instance = make_axios_instance(proxy);

        // Send a request and verify the proxy IP matches
        const result = await axios_instance.get('https://httpbin.org/ip');

        // Extract the IP used by the proxy from the response
        const originIp = result.data.origin;

        // Assert that the origin IP matches the proxy IP
        expect(originIp).to.equal(proxy.host);
    });
});

