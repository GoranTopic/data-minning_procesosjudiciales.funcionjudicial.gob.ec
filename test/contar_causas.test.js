import { expect } from 'chai'; // Assertion library
import contar from '../src/api/contar_causas.js'; 

// known cedula for testing
const cedula = "2000032306"; // Replace with a valid cedula for testing

describe('Contar Causas API', () => {

    const requestData = {
        "numeroCausa":"",
        "actor":{
            "cedulaActor": cedula,
            "nombreActor":""
        },
        "demandado":{
            "cedulaDemandado":"",
            "nombreDemandado":""
        },
        "provincia":"",
        "numeroFiscalia":"",
        "recaptcha":""
    }

    it('should return the correct data', async () => {
        try {
            const result = await contar(requestData); // Call the API function with the test data
            // console.log('API Response from Function:', result); // Log the response for visibility
            // chek is result is not null
            expect(result).to.not.be.null;
            // ensure that the result is an number
            expect(result).to.be.a('number');
            // to be not zero
            expect(result).to.not.equal(0);
        } catch (error) {
            console.error('API Call Error:', error.response?.data || error.message);
            throw error; // Fail the test if an error occurs
        }
    });
});
