import axios from 'axios';

let endpoint = 'https://api.funcionjudicial.gob.ec/informacion/actuacionesJudiciales';

/* // format of post data
{
"idMovimientoJuicioIncidente" : 25043529,
"idJuicio" : "09327202300264G",
"idJudicatura" : "09327",
"idIncidenteJudicatura" : 26403326,
"aplicativo" : "web",
"nombreJudicatura" : "UNIDAD JUDICIAL MULTICOMPETENTE  CON SEDE EN EL CANTÓN EL TRIUNFO"
}
*/

const actuaciones_judiciales = async json_post_data => {
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

export default actuaciones_judiciales;
