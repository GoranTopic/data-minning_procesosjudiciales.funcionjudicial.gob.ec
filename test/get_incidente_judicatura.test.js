import { expect } from 'chai'; // Assertion library
import get_incidente_judicatura from '../src/api/get_incidente_judicatura.js'

// test juicio id
const juicio_id = "2030120120212";

describe('get incidente judicatura', () => {

    it('should return the correct data', async () => {
        try {
            const result = await get_incidente_judicatura(juicio_id);
            // console.log('API Response from Function:', result);
            // check if the result is an array
            expect(result).to.be.an('array');
            // check if the frist element of the array is an object 'lstIncidenteJudicatura'
            expect(result[0]).to.have.property('lstIncidenteJudicatura');
        } catch (error) {
            console.error('API Call Error:', error.response?.data || error.message);
            throw error; // Fail the test if an error occurs
        }
    });
});
