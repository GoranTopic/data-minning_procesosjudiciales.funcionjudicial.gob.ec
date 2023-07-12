import init from './init.js';
import scrap_cedula from './scraper/scrap_cedula.js';
import Axios from 'axios';
import UserAgent from 'user-agents';
import slavery from 'slavery-js';
import { performance } from 'perf_hooks'

let get_next_values = ({ cedulas_checklist, proxyRotator }) => {
    /* next value from the proxies, user agents and cedulas */
    // get next cedula
    let cedula = cedulas_checklist.next()
    // get next proxy
    let proxy =  proxyRotator.next();
    // get next user agent
    let userAgent = new UserAgent().toString();
    // return the values
    return { cedula, proxy, userAgent };
}

let master_function = async master => {
	await master.connected();  
	// code to be run by the master
	let { cedulas_checklist, proxyRotator, cedulas_db } 
		= await init();
	// get next values
	let { cedula, proxy, userAgent } = get_next_values(
		{ cedulas_checklist, proxyRotator }
	);
	// while there are cedulas to scrap
	while( cedula !== undefined ){
		// get a idle slave
		console.log('[master] awating to get idelslave')
		let slave = await master.getIdle();
		master.printStatus()
		// send the slave to work
		slave.run( { cedula, proxy, userAgent } )
			.then( async result => {
				if( result ){
					let cedula = result.cedula;
					// check of the check list
					console.log('[master] checking cedula')
					cedulas_checklist.check(cedula);
					console.log('[master] saving cedula in db')
					// save into the db
					await cedulas_db.setValue(cedula, result);
				}
			})
			.catch( e => {
				console.error(e)
			} )
		// get next values, changet to deconstructor
		let values = get_next_values(   
			{ cedulas_checklist, proxyRotator }
		);
		console.log('[master] getting next values')
		cedula = values.cedula;
		proxy = values.proxy;
		userAgent = values.userAgent;
	}
	console.log('[master] all cedulas checked');
}

let slave_function = async ({ cedula, proxy, userAgent }, slave) => {
    // code to be run by the slave 
    let log = message => console.log( '[' + slave.id +'] ' + message );
    // make a function
    let result = await scrap_cedula(cedula, proxy, userAgent, log);
    // return the result
    return result;
}

slavery({ 
	host: '192.168.50.132',
	port : 3003,
}).master(
	master_function
)
/*	.slave(
	slave_function
) */


