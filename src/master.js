import slavery from 'slavery-js';
import { init, 
    makeStore, makeChecklist, makeProxies, makeUserAgent
} from './init.js';

slavery({
	timeout: 1000 * 60 * 7, // 7 minute
	host: 'localhost',
	port: 3003,
}).master(async master => {

    let { checklist, store, proxies, makeUserAgent } = await init();
    //console.log('making store');
    //let store = await makeStore('procesos_judiciales_new');
    //console.log('making checklist');
    //let checklist = makeChecklist();
    //console.log('making proxies');
    //let proxies = makeProxies();

    // get next cedula
    let cedula = checklist.next();
    // get next proxy
    let proxy = proxies.next();
    // get next user agent
    let userAgent = makeUserAgent();
    // while loop
    while (cedula !== undefined) {
        // get a idle slave
        let slave = await master.getIdle();
        // send the slave to work
        console.log(`[Master][${proxy ? proxy.ip : null}][${cedula}] starting`);
        slave.run({ cedula, proxy, userAgent })
            .then(async result => {
                if (result) {
                    let cedula = result.cedula;
                    let log = str => console.log(`[Master][${proxy ? proxy.ip : null}][${cedula}] ${str}`);
                    // check of the check list
                    log(`checking cedulas ${checklist.valuesDone()}/${checklist.valuesCount()} left}`);
                    checklist.check(cedula);
                    log('saving cedula in db');
                    await store.push(result);
                } else {
                    log('cedula not found');
                    log(result);
                }
            })
            .catch(e => {
                console.error(e)
            })
        // get next values, changet to deconstructor
        cedula = checklist.next()
        proxy = proxies.next();
        userAgent = makeUserAgent();
    }
});
