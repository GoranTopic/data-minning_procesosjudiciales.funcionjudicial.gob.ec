import axios_main from 'axios'; 
import { api_endpoint } from './endpoints.js';

let endpoint =  api_endpoint + 'contarCausas';

/* @param causa: objeto con los datos de la causa a buscar
 *       "numeroCausa":"",
 *       "actor":{
 *           "cedulaActor":"",
 *           "nombreActor":""
 *       },
 *       "demandado":{
 *           "cedulaDemandado":"",
 *           "nombreDemandado":""
 *       },
 *       "provincia":"",
 *       "numeroFiscalia":"",
 *       "recaptcha":""
 *   }
 * @return: objeto con los datos de la causa */
export default async (causa, axiosInstance) => {
    let axios = axiosInstance || axios_main;
    try {
        const res = await axios.post(endpoint, causa);
        if( res === undefined ){
            console.error('respose from contar causas is empty', res);
            throw new Error('respose from contar causas is empty');
        }
        return res.data;
    } catch (error) {
        // print only error message
        throw error;

    }
}
