import Axios from 'axios';
import axiosRetry from 'axios-retry';
import { HttpsProxyAgent } from 'https-proxy-agent';

let make_axios_instance = (proxy, userAgent) => {
    // Create base config
    const config = {
        timeout: 5 * 60 * 1000, // 5 minutes
        headers: {
            'User-Agent': userAgent
        }
    };

    // If using a proxy
    if (proxy) {
        config.httpsAgent = new HttpsProxyAgent({ ...proxy });
        config.proxy = false; // Must be false when using httpsAgent
    }

    // Create the instance
    const instance = Axios.create(config);

    // Apply retry logic (3 retries, with exponential backoff)
    axiosRetry(instance, {
        retries: 3,
        retryDelay: axiosRetry.exponentialDelay,
        retryCondition: (error) => {
            // Retry on network errors or 5xx status codes
            return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNRESET';
        }
    });

    return instance;
};

export default make_axios_instance;
