import axios from 'axios';

let endpoint = 'https://api.funcionjudicial.gob.ec/informacion/getIncidenteJudicatura/'

// must pass the incidente_id

const get_incidente_judicatura = async incidente_id => {
    // add incidente_id to endopoint
    endpoint = endpoint + incidente_id;
    // make post request
    const res = await axios.get(
        endpoint // url
    );
    // check response status
    if (res.status !== 200) {
        console.log('Error: ', res.status);
        return;
    }
    // return response
    return res.data;
}

export default get_incidente_judicatura;
