import axios from 'axios'; 
import { api_endpoint } from '../../config/endpoints.js';

let endpoint = api_endpoint + '/actuacionesJudiciales';

/* @param causa: objeto con los datos de la causa a buscar
 *{"idMovimientoJuicioIncidente":25043529,"idJuicio":"09327202300264G","idJudicatura":"09327","idIncidenteJudicatura":26403326,"aplicativo":"web","nombreJudicatura":"UNIDAD JUDICIAL MULTICOMPETENTE  CON SEDE EN EL CANTÓN EL TRIUNFO"}
 *  @return: objeto con los datos de la causa
 */
export default async juicio => {
    try {
        const res = await axios.post(endpoint, juicio);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
