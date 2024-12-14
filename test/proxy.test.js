import { makeProxies } from '../src/init.js';
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
                proxy: { ...proxy, protocol: 'http' },
            });
        };

        // Create an Axios instance with the proxy
        const axios_instance = make_axios_instance(proxy);

        // Send a request and verify the proxy IP matches
        const result = await axios_instance.post('http://httpbin.org/post', { data: 'hello' });

        // Extract the IP used by the proxy from the response
        const originIp = result.data.origin;

        // Assert that the origin IP matches the proxy IP
        expect(originIp).to.equal(proxy.host);
    });
});

