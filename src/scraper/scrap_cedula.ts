import buscar_causas from '../api/buscar_causas';
import contar_causas from '../api/contar_causas';
import scrap_causa from './scrap_causa';
import Axios, { AxiosInstance } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SearchQuery, Proxy, CausaScraped, LogFunction } from '../types';

// this is the post data format that the server expects
const user_search_query_data: SearchQuery = {
    "numeroCausa": "",
    "actor": {
        "cedulaActor": "",
        "nombreActor": ""
    },
    "demandado": {
        "cedulaDemandado": "",
        "nombreDemandado": ""
    },
    "provincia": "",
    "numeroFiscalia": "",
    "recaptcha": ""
};

interface ScrapCedulaResult {
    cedula: string;
    causas_actor_scraped: CausaScraped[];
    causas_demandado_scraped: CausaScraped[];
}

/**
 * Create an axios instance with optional proxy and user agent
 */
const make_axios_instance = (proxy: Proxy | null, userAgent: string): AxiosInstance => {
    // make an axios instance
    const axios = (proxy) ?
        Axios.create({
            httpsAgent: new HttpsProxyAgent({ ...proxy }),
            proxy: false,
            headers: {
                'User-Agent': userAgent
            }
        }) :
        Axios.create({
            headers: {
                'User-Agent': userAgent
            }
        });
    return axios;
};

/**
 * Scrape information for a specific ID
 */
const scrap_cedula = async (
    cedula: string, 
    proxy: Proxy | null, 
    userAgent: string, 
    log: LogFunction
): Promise<ScrapCedulaResult | false> => {
    try {
        // make an axios instance
        const axios_instance = make_axios_instance(proxy, userAgent);
        log('made axios instance');
        
        // get numero de causas
        user_search_query_data.actor.cedulaActor = cedula;
        user_search_query_data.demandado.cedulaDemandado = '';
        
        // check if there are any entries
        const numero_de_causas_como_actor = await contar_causas(user_search_query_data, axios_instance);
        log(`numero de causas como actor: ${numero_de_causas_como_actor}`);
        
        let causas_actor_scraped: CausaScraped[] | boolean;
        if (numero_de_causas_como_actor > 0) {
            // query every cause
            const causas = await buscar_causas(user_search_query_data, axios_instance);
            causas_actor_scraped = await scrap_causa(causas, axios_instance, log);
        } else {
            causas_actor_scraped = true;
        }
        
        // switch from actor to demandado
        user_search_query_data.actor.cedulaActor = '';
        user_search_query_data.demandado.cedulaDemandado = cedula;
        
        // check if there are any entries
        const causas_como_demandado_encontradas = await contar_causas(user_search_query_data, axios_instance);
        log(`numero de causas como demandado: ${causas_como_demandado_encontradas}`);
        
        let causas_demandado_scraped: CausaScraped[] | boolean = [];
        if (causas_como_demandado_encontradas > 0) {
            // query every cause
            const causas = await buscar_causas(user_search_query_data, axios_instance);
            // scrap each causa
            causas_demandado_scraped = await scrap_causa(causas, axios_instance, log);
        } else {
            causas_demandado_scraped = true;
        }
        
        // check if we have scrapped all the causes
        if (causas_actor_scraped && causas_demandado_scraped) {
            log(`cedula scraped`);
            // put the data in the right format
            if (causas_actor_scraped === true) causas_actor_scraped = [];
            if (causas_demandado_scraped === true) causas_demandado_scraped = [];
            
            // return the data
            return {
                cedula,
                causas_actor_scraped: causas_actor_scraped as CausaScraped[],
                causas_demandado_scraped: causas_demandado_scraped as CausaScraped[]
            };
        } else {
            return false;
        }
    } catch (e) {
        throw e;
    }
};

export default scrap_cedula;
