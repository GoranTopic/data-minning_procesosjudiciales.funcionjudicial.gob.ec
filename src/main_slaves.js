import slavery from 'slavery-js';

	

let slave_function = async ({ cedula, proxy, userAgent }, slave) => {
    // code to be run by the slave 
    let log = message => console.log( '[' + slave.id +'] ' + message );
    // make a function
    let result = await scrap_cedula(cedula, proxy, userAgent, log);
    // return the result
    return result;
}

slavery({ 
    //numberOfSlaves: 2
    host: '192.168.50.143',
    port : 3000,
    debug: false,
}).slave(
    slave_function
)


