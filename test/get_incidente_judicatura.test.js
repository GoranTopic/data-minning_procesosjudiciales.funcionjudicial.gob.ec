import { expect } from 'chai'; // Assertion library
import get_incidente_judicatura from '../src/api/get_incidente_judicatura.js'

// test juicio id
const juicio_id = "17292202100028G"


describe('get incidente judicatura', () => {

    it('should return the correct data', async () => {
        try {
            const result = await get_incidente_judicatura(juicio_id);
            //console.log('API get incidente judicatura result:', result);
            // check if the result is an array
            expect(result).to.be.an('array');
            expect(result[0]).to.have.property('idJudicatura');
            expect(result[0]).to.have.property('nombreJudicatura');
            expect(result[0]).to.have.property('ciudad');
            // check if the frist element of the array is an object 'lstIncidenteJudicatura'
            expect(result[0]).to.have.property('lstIncidenteJudicatura');
            // check if the first element 
            expect(result[0].lstIncidenteJudicatura).to.be.an('array');
            // check if the first element of the array is an object
            expect(result[0].lstIncidenteJudicatura[0]).to.be.an('object');
            // check if the first element of the array is equal to the firstElement object
        } catch (error) {
            console.error('API Call Error:', error.response?.data || error.message);
            throw error; // Fail the test if an error occurs
        }
    });
});
