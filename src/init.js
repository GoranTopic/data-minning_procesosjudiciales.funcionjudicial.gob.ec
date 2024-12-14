/* this script initlizes the necesary value to start scrapping */
import { mkdir } from 'files-js';
import ProxyRotator from 'proxy-rotator-js'
import Checklist from 'checklist-js';
import Storage from 'dstore-js';
import UserAgent from 'user-agents';

const mongo_url = 'mongodb://10.0.10.5:27017'; // vpn
//const mongo_url = 'mongodb://0.0.0.0:27017';
const mongo_database = 'Procesos_Judiciales';

const makeStore = async store_name => {
    /* make a store to store the companies */
    // Create a storage
    let storage = new Storage({
        type: 'mongodb',
        url: mongo_url,
        database: mongo_database,
    });
    // open the store
    let store = await storage.open(store_name);
    // return store
    return store;
}

const getCedulasToScrap = async () => {
    /* read storage to get the rucs to scrap */
    // Create a storage
    let store = new Storage({
        type: 'mongodb',
        url: mongo_url,   
        database: 'CNE',
    });
    // open the store
    let checklist_store = await store.open('cne');
    // get the cedulas
    let cedulas_to_scrap = await checklist_store.get({})
    // close the store
    await checklist_store.close();
    // format the cedulas
    cedulas_to_scrap = cedulas_to_scrap.map( r => r.cedula );
    return cedulas_to_scrap;
}

const makeChecklist = rucs_to_scrap => {
    /* make a checklist with the rucs to scrap */
    mkdir('./storage/checklists');
    // Read the file
    let checklist = new Checklist(
        rucs_to_scrap, {
        name: 'cedulas',
        path: './storage/checklists',
        recalc_on_check: false,
        save_every_check: 1000,
    });
    // return the checklist
    return checklist;
}

const makeUserAgent = () => {
    /* make a user agent rotator */
    let userAgentRotator = new UserAgent().toString();
    return userAgentRotator;
}

const makeProxies = () => {
    /* make a proxy rotator */
    let proxyRotator = new ProxyRotator('./storage/proxies/proxyscrape_premium_http_proxies.txt', {
        shuffle: true,
        returnAs: 'object',
    });
    return proxyRotator;
}

const init = async () => {
    // get a list of cedulas from mongodb
    console.log('getting cedulas to scrap');
    let cedulas_to_scrap = await getCedulasToScrap();
    console.log('cedulas to scrap:', cedulas_to_scrap.length);
    // make a store
    console.log('making store');
    let store = await makeStore('procesos_judiciales_new');
    console.log('store created');
    // make checklist dir
    console.log('making checklist');
    let checklist = makeChecklist(cedulas_to_scrap);
    console.log('checklist created');
    // create a proxy rotator
    let proxies = makeProxies();
    // return values
    return {
        checklist,
        store,
        proxies,
        makeUserAgent,
    }
}

export { init, makeStore, getCedulasToScrap, makeChecklist, makeUserAgent, makeProxies };
