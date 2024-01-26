import scrap_cedula from './scraper/scrap_cedula.js';
import slavery from 'slavery-js';

slavery({
	numberOfSlaves: 60,
	host: 'localhost',
	port: 3003,
}).slave(async ({ cedula, proxy, userAgent }, slave) => {
	// code to be run by the slave 
	let log = str => console.log(`[Slave][${proxy ? proxy.ip : null}][${cedula}] ${str}`);
	// make a function
	let result = await scrap_cedula(cedula, proxy, userAgent, log);
	// return the result
	return ({ result, cedula, proxy, userAgent });
}) 


