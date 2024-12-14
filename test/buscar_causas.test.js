import { expect } from 'chai'; // Assertion library
import buscarCausa from '../src/api/buscar_causas.js'; // Function to test

// known cedula for testing
const cedula = "2000032306";

describe('buscarCausas API returned data correctly', () => {

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

    it('should return the correct data', async () => {
        try {
            const result = await buscarCausa(requestData); // Call your function
            //console.log('API Response from Function:', result); // Log the response for visibility
            // chek is result is not empty
            expect(result).to.not.be.empty; // Ensure the result is not empty
            // check if result is a list
            expect(result).to.be.an('array'); // Ensure the result is a list
            // chek if the first element of the list is an object
            expect(result[0]).to.be.an('object'); // Ensure the first element is an object
            // idJuicio and nombreDelito are strings
            expect(result[0].idJuicio).to.be.a('string'); // Ensure idJuicio is a string
        } catch (error) {
            console.error('API Call Error:', error.response?.data || error.message);
            throw error; // Fail the test if an error occurs
        }
    });
});
