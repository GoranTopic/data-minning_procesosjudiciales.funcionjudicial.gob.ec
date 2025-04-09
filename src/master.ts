import slavery from 'slavery-js';
import { 
    init, 
    makeStore, 
    makeChecklist, 
    makeProxies, 
    makeUserAgent 
} from './init';
import { Proxy, LogFunction } from './types';

interface SlaveResult {
    cedula: string;
    result: any;
    proxy: Proxy | null;
    userAgent: string;
}

interface Slave {
    run: (params: any) => Promise<SlaveResult>;
}

interface Master {
    getIdle: () => Promise<Slave>;
}

slavery({
    timeout: 1000 * 60 * 7, // 7 minute
    host: 'localhost',
    port: 3003,
}).master(async (master: Master) => {
    const { checklist, store, proxies, makeUserAgent } = await init();

    // get next cedula
    let cedula = checklist.next();
    // get next proxy
    let proxy = proxies.next();
    // get next user agent
    let userAgent = makeUserAgent();
    
    // while loop
    while (cedula !== undefined) {
        // get an idle slave
        const slave = await master.getIdle();
        // send the slave to work
        console.log(`[Master][${proxy ? proxy.ip : null}][${cedula}] starting`);
        
        slave.run({ cedula, proxy, userAgent })
            .then(async (result: SlaveResult) => {
                if (result) {
                    const resultCedula = result.cedula;
                    const log: LogFunction = (str: string) => 
                        console.log(`[Master][${proxy ? proxy.ip : null}][${resultCedula}] ${str}`);
                    
                    // check off the checklist
                    log(`checking cedulas ${checklist.valuesDone()}/${checklist.valuesCount()} left}`);
                    checklist.check(resultCedula);
                    log('saving cedula in db');
                    await store.push(result);
                } else {
                    const log: LogFunction = (str: string) => 
                        console.log(`[Master][${proxy ? proxy.ip : null}][${cedula}] ${str}`);
                    log('cedula not found');
                    log(result);
                }
            })
            .catch((e: Error) => {
                console.error(e);
            });
            
        // get next values
        cedula = checklist.next();
        proxy = proxies.next();
        userAgent = makeUserAgent();
    }
});
