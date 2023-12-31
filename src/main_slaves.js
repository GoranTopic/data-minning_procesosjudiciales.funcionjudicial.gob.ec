import slavery from 'slavery-js';
import scrap_cedula from './scraper/scrap_cedula.js';

import process from 'node:process'
process.on('unhandledRejection', (reason, promise) => {
    console.warn('Unhandled promise rejection:', promise, 'reason:', reason.stack || reason);
});

let slave_function = async ({ cedula, proxy, userAgent }, slave) => {
    // code to be run by the slave 
    let log = message => console.log( '[' + slave.id +'] ' + message );
    // make a function
    let result = await scrap_cedula(cedula, proxy, userAgent, log);
    // return the result
    return result;
}

slavery({ 
	//numberOfSlaves: 1,
	// timeout: 1000 * 60 * 30, // 30 minutes
	host: '192.168.50.132',
	port : 3003,
	debug: false,
}).slave(
	slave_function
)


