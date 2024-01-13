import { waitForShortTime, waitForLongTime } from '../utils/timers.js';
import buscar_causas from '../api/buscar_causas.js';
import contar_causas from '../api/contar_causas.js';
import scrap_causa from './scrap_causa.js'
import Axios from 'axios';

// this is the post data fromat that the server expects
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

let make_axios_instance = ( proxy, userAgent ) => {
    // make an axios instance
    let axios = ( proxy ) ?
        Axios.create({ 
            proxy: { 
                protocol: proxy.protocol,
                host: proxy.ip, 
                port: proxy.port 
            },
            userAgent: userAgent,
        }) : 
        Axios.create({
            userAgent: userAgent,
        });
    return axios;
}

let scrap_cedula = async (cedula, proxy, userAgent, log) => {
    // make an axios instance
    let axios = make_axios_instance( proxy, userAgent )
    // get numero de causas
    user_search_query_data.actor.cedulaActor = cedula
    user_search_query_data.demandado.cedulaDemandado = ''
    // check if there are any entries
    let numero_de_causas_como_actor 
        = await contar_causas(user_search_query_data, axios)
    let causas_actor_scraped;
    if( numero_de_causas_como_actor > 0 ){
        // query every cause
        let causas = 
            await buscar_causas(user_search_query_data, axios);
        // scrap each causa
        causas_actor_scraped = 
            await scrap_causa(causas, axios, log);
    }else 
        causas_actor_scraped = true;
    // switch from actor to demandado
    user_search_query_data.actor.cedulaActor = ''
    user_search_query_data.demandado.cedulaDemandado = cedula
    // check if there are any entries
    let causas_como_demandado_encontradas 
        = await contar_causas(user_search_query_data, axios)
    let causas_demandado_scraped = [];
    if( causas_como_demandado_encontradas > 0 ){
        // query every cause
        let causas
            = await buscar_causas(user_search_query_data, axios)
        // scrap each causa
        causas_demandado_scraped
            = await scrap_causa(causas, axios, log)
    }else 
        causas_demandado_scraped = true;
    // check if we have scrapped all the causes
    if( causas_actor_scraped && causas_demandado_scraped ){
        log(`cedula scraped`)
        return { cedula, causas_actor_scraped, causas_demandado_scraped }
    } else 
        return false;
}


export default scrap_cedula
