import ProxyRotator from 'proxy-rotator-js'
import UserAgent from 'user-agents';
import Checklist from 'checklist-js';      
import scrap_cedula from './scraper/scrap_cedula.js';
import remove_found_cedulas from './utils/remove_found_cedulas.js';
import Storage from 'storing-me'
import fs from 'fs';                       

// get which cedulas we are reading from
let cedula_prefix = process.argv[2];
// let get the phone number from the params passed
console.log('reading cedulas starting with: ', cedula_prefix);
if (!cedula_prefix) {
    console.log('Please enter a number from 01 - 24, 30, 50, 71, 90');
    process.exit(1);
}
// create proxy rotator
let proxies = new ProxyRotator('./storage/proxies/proxyscrape_premium_http_proxies.txt', {
    returnAs: 'object',
    protocol: 'http',
    shuffle: true,
})
// open the key value store
let cedulas = fs.readFileSync(`./storage/cedulas/${cedula_prefix}.txt`, 'utf8').split('\n');
console.log(`cedulas to scrap: ${cedulas.length}`);
// open the key value store
console.log(`opening store: siirs_${cedula_prefix}`);
let storage = new Storage({
    type: 'json',
    keyValue: true,
    path: './storage/procesos_judiciales', // default: ./storage/
});
let store = await storage.open(`procesos_${cedula_prefix}`)
// storage read all the files in process_${cedula_prefix}
let procesos_found = fs.readdirSync(`./storage/procesos_${cedula_prefix}`)
    .map(pro => pro.split('.')[0]);

console.log(`total cedulas: ${cedulas.length}`);
console.log(`procesos found: ${procesos_found.length}`);
// remove the procesos already found from the cedulas to scrap
cedulas = remove_found_cedulas(cedulas, procesos_found);
console.log(`cedulas to scrap: ${cedulas.length}`);

// make directory
console.log(`store opened: procesos_${cedula_prefix}`);                                                                                                                                                              
try{                                                                                                                                                                                                                        
    fs.mkdirSync(`./storage/checklists`);                                                                                                                                                                                   
}catch(e){}                                                                                                                                                                                                                 

// create checklist                                                                                                                                                                                                         
let checklist = new Checklist(cedulas, {
    path: './storage/checklists/',
    name: `cedulas_${cedula_prefix}`,
});
// get new cedula
// check every ceduula found in the checklist


// get next cedula
let cedula = checklist.next()
// get next proxy
let proxy = proxies.next();
// get next user agent
let userAgent = new UserAgent().toString();


let log = str => console.log(`[${proxy? proxy.ip:null}] [${cedula}] ${str}`);

// while there are cedulas to scrap
while (cedula !== undefined) {
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
        log('saving cedula in db');
        await store.push(cedula, result);
    } else {
        log('cedula not found');
        log(result);
    }

    // get next cedula
    cedula = checklist.next()
    // get next proxy
    //proxy = proxies.next();
    // get next user agent
    userAgent = new UserAgent().toString();

}
