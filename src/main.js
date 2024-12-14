import scrap_cedula from './scraper/scrap_cedula.js';
import { init, 
    makeStore, makeChecklist, makeProxies, makeUserAgent
} from './init.js';

//let {checklist, store, proxies, makeUserAgent } = await init();
console.log('making store');
let store = await makeStore('procesos_judiciales_new');
console.log('making checklist');
let checklist = makeChecklist();
console.log('making proxies');
let proxies = makeProxies();

// get next cedula
let cedula = checklist.next();
// get next proxy
let proxy = proxies.next();
// get next user agent
let userAgent = makeUserAgent();

// log function
let log = str => console.log(`[${proxy? proxy.ip:null}] [${cedula}] ${str}`);

// while there are cedulas to scrap
//while (cedula !== undefined) {

// get a idle slave
log = str => console.log(`[${proxy? proxy.ip:null}] [${cedula}] ${str}`);
log('scraping cedula')
let result = await scrap_cedula(cedula, proxy, userAgent, log );
// return the result
if (result) {
    let cedula = result.cedula;
    // check of the check list
    log('checking cedula');
    checklist.check(cedula);
    log('pushing to store');
    console.log(result);
    await store.push(result);
} else {
    log('cedula not found');
    log(result);
}

// get next cedula
cedula = checklist.next()
// get next proxy
proxy = proxies.next();
// get next user agent
userAgent = makeUserAgent();

//}
