import { expect } from 'chai'; // Assertion library
import get_informacion_juicio from '../src/api/get_informacion_juicio.js'; // API function to test

// test juicio id
const juicio_id = "2030120120212";

describe('get informacion juicio', () => {

    it('should return the correct data', async () => {
        try {
            const result = await get_informacion_juicio(juicio_id);
            //console.log('API Response from Function:', result); 
            // check if the result is an array
            expect(result).to.be.an('array');
            // check if the first element of the array is an object and it is not empty
            expect(result[0]).to.be.an('object').that.is.not.empty;
        } catch (error) {
            console.error('API Call Error:', error.response?.data || error.message);
            throw error; // Fail the test if an error occurs
        }
    });
});
