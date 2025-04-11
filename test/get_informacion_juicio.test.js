import { expect } from 'chai'; // Assertion library
import get_informacion_juicio from '../src/api/get_informacion_juicio.js'; // API function to test

// test juicio id
const juicio_id = "17292202100028G";

// expected response from the API
const expectedResponse =  {
    "id": 1,
    "idJuicio": "17292202100028G",
    "estadoActual": null,
    "idMateria": 27,
    "idProvincia": null,
    "idCanton": null,
    "idJudicatura": null,
    "nombreDelito": "ARCHIVO DE LA INVESTIGACIÓN PREVIA ART. 586",
    "fechaIngreso": "2021-01-07T14:50:42.827+00:00",
    "nombre": null,
    "cedula": null,
    "idEstadoJuicio": null,
    "nombreMateria": "PENAL COIP",
    "nombreEstadoJuicio": null,
    "nombreJudicatura": null,
    "nombreTipoResolucion": null,
    "nombreTipoAccion": "INVESTIGACIÓN PREVIA",
    "fechaProvidencia": null,
    "nombreProvidencia": null,
    "nombreProvincia": null,
    "iedocumentoAdjunto": "N"
}

describe('get informacion juicio', () => {
    it('should return the correct data', async () => {
        try {
            const result = await get_informacion_juicio(juicio_id);
            //console.log('API Response from Function:', result); 
            // check if the result is an array
            expect(result).to.be.an('array');
            // check if the first element of the array is an object and it is not empty
            expect(result[0]).to.be.an('object').that.is.not.empty;
            // expect the first element of the array to be equal to the expected response
            expect(result[0]).to.deep.equal(expectedResponse);
        } catch (error) {
            console.error('API Call Error:', error.response?.data || error.message);
            throw error; // Fail the test if an error occurs
        }
    });
});
