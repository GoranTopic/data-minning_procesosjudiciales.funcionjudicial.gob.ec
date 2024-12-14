import { api_endpoint } from './endpoints.js';
import axios_main from 'axios';

let size = 100;
let page = 1;
let endpoint =  api_endpoint + `/buscarCausas?page=${page}&size=${size}`;

/* @param causa: objeto con los datos de la causa a buscar
 * {
 *  "numeroCausa":"",
 *  "actor":{
 *      "cedulaActor":"",
 *      "nombreActor":""
 *      },  
 *  "demandado":{
 *      "cedulaDemandado":"",
 *      "nombreDemandado":""
 *   },
 *  "provincia":"",
 *  "numeroFiscalia":"",
 *  "recaptcha":""
 *  }
 *  @return: objeto con los datos de la causa
 */
export default async (causa, axiosInstance) => {
        let axios = axiosInstance || axios_main;
    try {
        const res = await axios.post(endpoint, causa);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
