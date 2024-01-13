import ProxyRotator from 'proxy-rotator-js'
import Checklist from 'checklist-js';
import { KeyValueStore } from 'crawlee';
import fs from 'fs';

// path where to fins the files needed
let cedulasFilePath 
    //= './storage/cedulas/cedulas.txt';
    = './storage/cedulas/cedulas.txt';
let proxyFilePath 
    = './storage/proxies/proxyscrape_premium_http_proxies.txt';
let db_name = 'cedulas';
let save_every_check = 1000;

let init = async (options) => {
	if(!options) options = {};
	if(options.cedulasFilePath) cedulasFilePath = options.cedulasFilePath;
	if(options.proxyFilePath) proxyFilePath = options.proxyFilePath;
	if(options.db_name) db_name = options.db_name;
	if(options.save_every_check) save_every_check = options.save_every_check
	/* initilize objects */
	process.stdout.write('reading cedulas file...');
	// read content fo text file
	let file = fs.readFileSync(cedulasFilePath, 'utf-8')
	console.log('done');
	// split by new line
	let cedulas = file.split('\n');
	let cedulas_len = cedulas.length
	console.log('numero cedulas', cedulas_len);
	process.stdout.write('making checklist...');
	let cedulas_checklist = new Checklist( cedulas, { 
		name: db_name,
		path: process.cwd() + '/storage/checklists/',
		recalc_on_check: false,
		save_every_check,
	});
	console.log('done');
	let cedulasDone = cedulas_checklist.valuesDone();
	let cedulasToGo = cedulas_checklist.missingLeft();
	console.log('cedulas done:', cedulasDone);
	console.log('cedulas to go:', cedulasToGo);
	process.stdout.write('making proxy rotator...');
	// path to proxies
	const proxyRotator = new ProxyRotator(proxyFilePath, {
		protocol: 'http',
		returnAs: 'object' 
	});
	console.log('done');
	process.stdout.write('making causas db...');
	// Open a named key-value store
	const cedulas_db = await KeyValueStore.open(db_name);
	// retun initiliazed objects
	console.log('done');
	return { cedulas_checklist, proxyRotator, cedulas_db };
}

export default init;
