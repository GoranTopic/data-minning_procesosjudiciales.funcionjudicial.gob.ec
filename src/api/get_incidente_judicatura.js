import axios from 'axios'; 
import api_endpoint from '../config/endpoints.js';

let endpoint = api_endpoint + '/getIncidenteJudicatura';

/* @param {string} judicaturaId: id de la judicatura
 *  @return: {array} array de objetos con las actuaciones judiciales
 */
export const actuacionesJudiciales = async judicaturaId => {
    judicaturaId = judicaturaId.trim();
    try {
        const res = await axios.get(endpoint + '/' + judicaturaId);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
