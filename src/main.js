import Checklist from 'checklist-js';
import { KeyValueStore } from 'crawlee';
import buscar_causas from './api/buscar_causas.js';
import contar_causas from './api/contar_causas.js';
import actuaciones_judiciales from './api/actuaciones_judiciales.js';
import get_incidente_judicatura from './api/get_incidente_judicatura.js';
import get_informacion_juicio from './api/get_informacion_juicio.js';
import { waitForShortTime, waitForLongTime } from '../src/utils/timers.js';
import readCSV from '../src/utils/readCSV.js';
import ProxyRotator from 'proxy-rotator-js'
import Axios from 'axios';
import UserAgent from 'user-agents';

const cedulasFilePath = './storage/cedulas/cneids.csv';
let proxyFilePath = './storage/proxies/proxyscrape_premium_http_proxies.txt';

let cedulas = await readCSV(cedulasFilePath)

cedulas = cedulas.map(cedula => {
    try{ // if cedula states with 9 add 0 at the beginning
        if( cedula['CEDULA'].length === 9 )
            cedula['CEDULA'] = '0' + cedula['CEDULA']
        return cedula['CEDULA'] 
    }catch(e){
        return undefined
    }
}).filter(
    cedula => cedula !== undefined
)
/*
 * .forEach( cedula => { 
    if(cedula.length !== 10) 
        console.error('cedula does not have 10 digits', cedula)
})
*/
let cedulas_len = cedulas.length
console.log('numero cedulas', cedulas_len);
console.log('making checklist...');
let cedulas_checklist = new Checklist( cedulas, { 
    name: 'cedulas_checklist',
    path: process.cwd() + '/storage/',
    recalc_on_check: false,
    save_every_check: 500,
});
console.log('done');
let cedulasDone = cedulas_checklist.valuesDone();
console.log('cedulasDone', cedulasDone);

// path to proxies
const proxyRotator = new ProxyRotator(proxyFilePath, {
    protocol: 'http',
    returnAs: 'object' 
});

// Open a named key-value store
const causas_db = await KeyValueStore.open('causas');


let user_search_query_data = {
"numeroCausa" : "",
"actor": {  
    "cedulaActor":"",
    "nombreActor":""
},
"demandado":{ 
    "cedulaDemandado":"",
    "nombreDemandado":""
},
"provincia":"",
"numeroFiscalia":"",
"recaptcha":""
}


/* scrap the causes */
const scrap_causa = async (causas, axiosInstance) => {
    let axios = axiosInstance || axios;
    // number of scrapped causas
    let causasIds = causas.map( causa => causa.idJuicio )
    let cedulas_checklist = new Checklist( causasIds );
    // for each causa
    for(let causa of causas){
        let idJuicio = causa.idJuicio;
        //console.log('causa', causa);
        //await waitForShortTime();
        let jucio_info = await get_informacion_juicio(idJuicio, axios)
        // overwrite the cause if it is null
        for(let key in jucio_info)
            causa[key] = (causa[key]) ? causa[key] : jucio_info[key]
        //console.log('jucio_info', jucio_info);
        let incidentes = await get_incidente_judicatura(idJuicio, axios)
        //console.log('incidentes', incidentes);
        incidentes.forEach(async incidente => {
            let { idJudicatura, 
                lstIncidenteJudicatura,
                nombreJudicatura,
            } = incidente;
            lstIncidenteJudicatura.forEach(async judicatura => {
                //console.log('judicatura', judicatura);
                let { idMovimientoJuicioIncidente, 
                    idIncidenteJudicatura } = judicatura;
                let params = { idMovimientoJuicioIncidente, 
                    idJuicio, idJudicatura,
                    idIncidenteJudicatura, 
                    aplicativo : "web", 
                    nombreJudicatura }
                //await waitForShortTime()
                let actuaciones = await actuaciones_judiciales(params, axios)
                //console.log('actuaciones', actuaciones);
                incidente.actuaciones_judiciales = actuaciones
            })
        })
        causa.incidentes = incidentes
        // clean idJuicio, som id com with * character. I am replacing it with capital S1
        let id = causa.idJuicio.trim().replace('*', 'S1')
        // save in storage key value
        await causas_db.setValue(id, causa);
        // scape the cause
        cedulas_checklist.check(idJuicio)
        console.log('causa scraped')
    }
    // return the number of scapped causes
    return cedulas_checklist.isDone()
}

// next values
let cedula = cedulas_checklist.next()
let proxy =  proxyRotator.next();
let userAgent = new UserAgent();

while(cedula) {
    try{
        // make an axios instance
        let axios = Axios.create({ 
            proxy: { 
                protocol: proxy.protocol,
                host: proxy.ip, 
                port: proxy.port 
            },
            userAgent: userAgent.toString(),
        });
        // get numero de causas
        user_search_query_data.actor.cedulaActor = cedula
        // check if there are any entries
        let numero_de_causas_como_actor = await contar_causas(user_search_query_data, axios)
        let was_actor_causas_scraped;
        if( numero_de_causas_como_actor > 0 ){
            // query every cause
            let causes = await buscar_causas(user_search_query_data, axios);
            // scrap each causa
            was_actor_causas_scraped = await scrap_causa(causes, axios);
        }else 
            was_actor_causas_scraped = true;
        // switch between actor and demandado
        user_search_query_data.actor.cedulaActor = ''
        user_search_query_data.demandado.cedulaDemandado = cedula
        // check if there are any entries
        let causas_como_demandado_encontradas = await contar_causas(user_search_query_data, axios)
        let was_demandado_causas_scraped;
        if( causas_como_demandado_encontradas > 0 ){
            // query every cause
            let causes = await buscar_causas(user_search_query_data, axios)
            // scrap each causa
            was_demandado_causas_scraped = await scrap_causa(causes, axios)
        }else 
            was_demandado_causas_scraped = true;
        // check if we have scrapped all the causes
        if( was_actor_causas_scraped && was_demandado_causas_scraped ){
            cedulas_checklist.check(cedula, { cedula, was_actor_causas_scraped, was_demandado_causas_scraped })
        }
        // get next entry
        cedula = cedulas_checklist.next();
        // get next proxy
        proxy =  proxyRotator.next();
        //await waitForShortTime();
        console.log('done:', cedulasDone++, 'of', cedulas_len--);
    }catch(e){
        console.error(e)
        // get next entry
        cedula = cedulas_checklist.next();
        // set proxy as bad
        proxyRotator.kill(proxy);
        // get next proxy
        proxy = proxyRotator.next();
        // save the checklist
        cedulas_checklist.save();
    }
}

