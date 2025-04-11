import { expect } from 'chai'; // Assertion library
import buscarCausa from '../src/api/buscar_causas.js'; // Function to test

// known cedula for testing
const cedula = "2000032306";

describe('buscarCausas returned data correctly', () => {

    const requestData = {
        numeroCausa: "",
        actor: {
            cedulaActor: cedula,
            nombreActor: ""
        },
        demandado: {
            cedulaDemandado: "",
            nombreDemandado: ""
        },
        provincia: "",
        numeroFiscalia: "",
        recaptcha: ""
    };

    const first_element_response = {
        "id": 1,
        "idJuicio": "2033120140139",
        "estadoActual": "A",
        "idMateria": 6,
        "idProvincia": null,
        "idCanton": null,
        "idJudicatura": null,
        "nombreDelito": "DIVORCIO POR CAUSAL",
        "fechaIngreso": "2014-04-25T05:00:00.000+00:00",
        "nombre": null,
        "cedula": null,
        "idEstadoJuicio": null,
        "nombreMateria": null,
        "nombreEstadoJuicio": null,
        "nombreJudicatura": null,
        "nombreTipoResolucion": null,
        "nombreTipoAccion": null,
        "fechaProvidencia": null,
        "nombreProvidencia": null,
        "nombreProvincia": null,
        "iedocumentoAdjunto": "N"
    }

    it('should return the correct data', async () => {
        try {
            const result = await buscarCausa(requestData); // Call your function
            //console.log('API Response from Function:', result); // Log the response for visibility
            // chek is result is not empty
            expect(result).to.not.be.empty; 
            // check if result is a list
            expect(result).to.be.an('array'); // Ensure the result is a list
            // chek if the first element of the list is an object
            expect(result[0]).to.be.an('object'); // Ensure the first element is an object
            // idJuicio and nombreDelito are strings
            expect(result[0].idJuicio).to.be.a('string'); // Ensure idJuicio is a string
            // expect the first element of the list to be equal to first_element_response
            expect(result[0]).to.deep.equal(first_element_response);
        } catch (error) {
            console.error('API Call Error:', error.response?.data || error.message);
            throw error; // Fail the test if an error occurs
        }
    });
});
