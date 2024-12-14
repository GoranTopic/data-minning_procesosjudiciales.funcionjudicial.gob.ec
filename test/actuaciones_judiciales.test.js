import { expect } from 'chai'; // Assertion library
import actuaciones_judiciales from '../src/api/actuaciones_judiciales.js'; // API function to test

describe('Contar Causas API', () => {

    const requestData = {
        "idMovimientoJuicioIncidente":25043529,
        "idJuicio":"09327202300264G",
        "idJudicatura":"09327",
        "idIncidenteJudicatura":26403326,
        "aplicativo":"web",
        "nombreJudicatura":"UNIDAD JUDICIAL MULTICOMPETENTE  CON SEDE EN EL CANTÓN EL TRIUNFO"
    }

    it('should return the correct data', async () => {
        try {
            const result = await actuaciones_judiciales(requestData); // Call the API function with the request data
            // console.log('API Response from Function:', result); // Log the response for visibility
            // chek is result is not null
            expect(result).to.not.be.null;
            // expect the first element to be an object
            expect(result[0]).to.be.an('object');
        } catch (error) {
            console.error('API Call Error:', error.response?.data || error.message);
            throw error; // Fail the test if an error occurs
        }
    });
});
