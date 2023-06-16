import axios from 'axios';

let endpoint = 'https://api.funcionjudicial.gob.ec/informacion/buscarCausas?page=1&size=100'

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
[
  {
    id: 1,
    idJuicio: '09210201501934 ',
    estadoActual: 'A',
    idMateria: 6,
    idProvincia: null,
    idCanton: null,
    idJudicatura: null,
    nombreDelito: 'DIVORCIO POR CAUSAL',
    fechaIngreso: '2015-08-31T21:18:08.183+00:00',
    iEDocumentoAdjunto: 'N',
    nombre: null,
    cedula: null,
    idEstadoJuicio: null,
    nombreMateria: null,
    nombreEstadoJuicio: null,
    nombreJudicatura: null,
    nombreTipoResolucion: null,
    nombreTipoAccion: null,
    fechaProvidencia: null,
    nombreProvidencia: null,
    nombreProvincia: null
  }
]
*/

const buscar_causas = async json_post_data => {
    // make post request
    const res = await axios.post(
        endpoint, // url
        json_post_data // data
    );
    // check response status
    if (res.status !== 200) {
        console.log('Error: ', res.status);
        return;
    }
    // return response
    return res.data;
}

export default buscar_causas;
