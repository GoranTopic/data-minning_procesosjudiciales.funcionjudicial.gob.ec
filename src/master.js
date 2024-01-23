import UserAgent from 'user-agents';
import ProxyRotator from 'proxy-rotator-js'
import Checklist from 'checklist-js';      
import slavery from 'slavery-js';
import remove_found_cedulas from './utils/remove_found_cedulas.js';
import Storage from 'storing-me'
import fs from 'fs';

slavery({
	timeout: 1000 * 60 * 7, // 7 minute
	host: 'localhost',
	port: 3003,
}).master(async master => {
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
	try {
		fs.mkdirSync(`./storage/checklists`);
	} catch (e) { }
	// create checklist                                                                                                                                                                                                         
	let checklist = new Checklist(cedulas, {
		path: './storage/checklists/',
	});

	let cedula = checklist.next()
	let proxy = proxies.next();
	let userAgent = new UserAgent().toString();
	let log = str => console.log(`[Master][${proxy ? proxy.ip : null}][${cedula}] ${str}`);
	// check every ceduula found in the checklist
	while (cedula !== undefined) {
		// get a idle slave
		let slave = await master.getIdle();
		// send the slave to work
		log('scraping cedula')
		slave.run({ cedula, proxy, userAgent })
			.then(async result => {
				if (result) {
					let cedula = result.cedula;
					let log = str => console.log(`[Master][${proxy ? proxy.ip : null}][${cedula}] ${str}`);
					// check of the check list
					log(`checking cedulas ${cedulas.length}/${checklist.missingLeft()} left}`);
					checklist.check(cedula);
					log('saving cedula in db');
					await store.push(cedula, result);
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
		userAgent = new UserAgent().toString();
		log = str => console.log(`[Master][${proxy ? proxy.ip : null}][${cedula}] ${str}`);
	}
});

