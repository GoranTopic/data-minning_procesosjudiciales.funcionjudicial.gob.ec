import axios from 'axios'; 
import api_endpoint from '../config/endpoints.js';

let size = 100;
let page = 1;
let endpoint =  api_endpoint + `/buscarCausas?page=${page}&size=${size}`;

/* @param causa: objeto con los datos de la causa a buscar
 * {"numeroCausa":"","actor":{"cedulaActor":"","nombreActor":""},"demandado":{"cedulaDemandado":"","nombreDemandado":"TOMISLAV TOPIC"},"provincia":"","numeroFiscalia":"","recaptcha":""}
 *  @return: objeto con los datos de la causa
 */
export const buscarCausas = async causa => {
    try {
        const res = await axios.post(endpoint, causa);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
