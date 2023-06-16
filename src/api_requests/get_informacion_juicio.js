import axios from 'axios';
let endpoint = 'https://api.funcionjudicial.gob.ec/informacion/getInformacionJuicio/'

// must pass the incidente_id


const get_informacion_juicio = async incidente_id => {
    // add incidente_id to endopoint
    // make post request
    const res = await axios.get(
        endpoint + incidente_id,
    );
    // check response status
    if (res.status !== 200) {
        console.log('Error: ', res.status);
        return;
    }
    // return response
    return res.data;
}

export default get_informacion_juicio;
