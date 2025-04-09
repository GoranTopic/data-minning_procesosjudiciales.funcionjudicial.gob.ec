/* this script initializes the necessary values to start scraping */
import { mkdir } from 'files-js';
import ProxyRotator from 'proxy-rotator-js';
import Checklist from 'checklist-js';
import Storage from 'dstore-js';
import UserAgent from 'user-agents';
import { StorageOptions, Store, ChecklistOptions, Proxy, Checklist as ChecklistType } from './types';

const mongo_url = 'mongodb://10.0.10.5:27017'; // vpn
//const mongo_url = 'mongodb://0.0.0.0:27017';
const mongo_database = 'Procesos_Judiciales';

interface CneRecord {
    cedula: string;
    [key: string]: any;
}

interface InitResult {
    checklist: ChecklistType;
    store: Store;
    proxies: ProxyRotator;
    makeUserAgent: () => string;
}

/**
 * Create a store to store the data
 */
const makeStore = async (store_name: string): Promise<Store> => {
    /* make a store to store the companies */
    // Create a storage
    const storageOptions: StorageOptions = {
        type: 'mongodb',
        url: mongo_url,
        database: mongo_database,
    };
    
    const storage = new Storage(storageOptions);
    // open the store
    const store = await storage.open(store_name);
    // return store
    return store;
};

/**
 * Get the list of IDs to scrape from MongoDB
 */
const getCedulasToScrap = async (): Promise<string[]> => {
    /* read storage to get the rucs to scrap */
    // Create a storage
    const storageOptions: StorageOptions = {
        type: 'mongodb',
        url: mongo_url,
        database: 'CNE',
    };
    
    const store = new Storage(storageOptions);
    // open the store
    const checklist_store = await store.open('cne');
    // get the cedulas
    const cedulas_to_scrap: CneRecord[] = await checklist_store.get({});
    // close the store
    await checklist_store.close();
    // format the cedulas
    return cedulas_to_scrap.map(r => r.cedula);
};

/**
 * Create a checklist with the IDs to scrape
 */
const makeChecklist = (rucs_to_scrap: string[]): ChecklistType => {
    /* make a checklist with the rucs to scrap */
    mkdir('./storage/checklists');
    // Read the file
    const checklistOptions: ChecklistOptions = {
        name: 'cedulas',
        path: './storage/checklists',
        recalc_on_check: false,
        save_every_check: 1000,
    };
    
    const checklist = new Checklist(rucs_to_scrap, checklistOptions);
    // return the checklist
    return checklist;
};

/**
 * Create a user agent string
 */
const makeUserAgent = (): string => {
    /* make a user agent rotator */
    const userAgentRotator = new UserAgent().toString();
    return userAgentRotator;
};

/**
 * Create a proxy rotator
 */
const makeProxies = (): ProxyRotator => {
    /* make a proxy rotator */
    const proxyRotator = new ProxyRotator('./storage/proxies/proxyscrape_premium_http_proxies.txt', {
        shuffle: true,
        returnAs: 'object',
    });
    return proxyRotator;
};

/**
 * Initialize all the necessary components for scraping
 */
const init = async (): Promise<InitResult> => {
    // get a list of cedulas from mongodb
    console.log('getting cedulas to scrap');
    const cedulas_to_scrap = await getCedulasToScrap();
    console.log('cedulas to scrap:', cedulas_to_scrap.length);
    // make a store
    console.log('making store');
    const store = await makeStore('procesos_judiciales_new');
    console.log('store created');
    // make checklist dir
    console.log('making checklist');
    const checklist = makeChecklist(cedulas_to_scrap);
    console.log('checklist created');
    // create a proxy rotator
    const proxies = makeProxies();
    // return values
    return {
        checklist,
        store,
        proxies,
        makeUserAgent,
    };
};

export { init, makeStore, getCedulasToScrap, makeChecklist, makeUserAgent, makeProxies };
