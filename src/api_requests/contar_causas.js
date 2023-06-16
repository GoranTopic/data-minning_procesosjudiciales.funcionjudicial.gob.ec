import axios from 'axios';

let endpoint = 'https://api.funcionjudicial.gob.ec/informacion/contarCausas';

/* // fromat of post data
{
"numeroCausa" : "",
"actor": {  
        "cedulaActor":"",
        "nombreActor":""
            },
"demandado":{ 
        "cedulaDemandado":"",
        "nombreDemandado":"TOMISLAV TOPIC"
        },
"provincia":"",
"numeroFiscalia":"",
"recaptcha":""
}
*/

/* // format of response data
 5 
 */
  
const contar_causas = async json_post_data => {
    // make post request
    const res = await axios.post(
        endpoint, // url
        json_post_data // data
    );
    if (res.status !== 200) {
        console.error(res);
        return {error: 'Error en la consulta'};
    }
    return res.data;
}

export default contar_causas;
