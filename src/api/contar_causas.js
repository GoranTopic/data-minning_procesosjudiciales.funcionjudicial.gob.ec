import axios from 'axios'; 
import { api_endpoint } from './endpoints.js';

let endpoint =  api_endpoint + 'contarCausas';

/* @param causa: objeto con los datos de la causa a buscar
 * {"numeroCausa":"","actor":{"cedulaActor":"","nombreActor":""},"demandado":{"cedulaDemandado":"","nombreDemandado":""},"provincia":"","numeroFiscalia":"","recaptcha":""}
 *  @return: objeto con los datos de la causa */
export default async (causa, axiosInstance) => {
    let axios = axiosInstance || axios;
    try {
        const res = await axios.post(endpoint, causa);
        return res.data;
    } catch (error) {
        console.log(error);
        // print only error message
        throw error.response.data;
    }
}
