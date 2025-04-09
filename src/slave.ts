import scrap_cedula from './scraper/scrap_cedula';
import slavery from 'slavery-js';
import { Proxy, LogFunction } from './types';

interface SlaveParams {
    cedula: string;
    proxy: Proxy | null;
    userAgent: string;
}

slavery({
    numberOfSlaves: 200,
    host: 'localhost',
    port: 3003,
}).slave(async ({ cedula, proxy, userAgent }: SlaveParams, slave: any) => {
    // code to be run by the slave 
    const log: LogFunction = (str: string) => console.log(`[Slave][${proxy ? proxy.ip : null}][${cedula}] ${str}`);
    // make a function
    const result = await scrap_cedula(cedula, proxy, userAgent, log);
    // return the result
    return ({ result, cedula, proxy, userAgent });
});
