import { expect } from 'chai'; // Assertion library
import actuaciones_judiciales from '../src/api/actuaciones_judiciales.js'; // API function to test

describe('Get Actuaciones Judiciales', () => {

    const requestData = {
        "idMovimientoJuicioIncidente":25043529,
        "idJuicio":"09327202300264G",
        "idJudicatura":"09327",
        "idIncidenteJudicatura":26403326,
        "aplicativo":"web",
        "nombreJudicatura":"UNIDAD JUDICIAL MULTICOMPETENTE  CON SEDE EN EL CANTÓN EL TRIUNFO"
    }

    const expected_resutl_frist_element = {
        "codigo": 203900573,
        "idJudicatura": "09327",
        "idJuicio": "09327202300264G",
        "fecha": "2023-08-18T16:51:46.310+00:00",
        "tipo": "ARCHIVO DE LA INVESTIGACION PREVIA (RAZON DE NOTIFICACION) ",
        "actividad": "<p style=\"text-align: justify;\">En El triunfo, viernes dieciocho de agosto del dos mil veinte y tres, a partir de las once horas y cincuenta y dos minutos.  Certifico:</p><br /><br /><br /><br /><br /><br /><p style=\"text-align:center\"><strong>EVELYN MICHELLE CORONEL SANCHEZ</strong>\r\n  </p>\n\r<p style=\"text-align:center\"><strong>SECRETARIA</strong>\r\n  </p>",
        "visible": "H",
        "origen": "ProvPrimera",
        "idMovimientoJuicioIncidente": 25043529,
        "ieTablaReferencia": "ProvPrimera",
        "ieDocumentoAdjunto": "S",
        "escapeOut": "false",
        "uuid": "20230818-115180493526-593792259-136073074",
        "alias": "HBA01",
        "nombreArchivo": "09327202300264G_210598587_11_51_45_P21.pdf",
        "tipoIngreso": "O",
        "idTablaReferencia": "25043529",
        "nombreUsuarioModifica": "",
        "descripcionMotivoVisible": "",
        "cargo": ""
    }

    it('should return the correct data', async () => {
        try {
            const result = await actuaciones_judiciales(requestData); // Call the API function with the request data
            // console.log('API Response from Function:', result); // Log the response for visibility
            // chek is result is not null
            expect(result).to.not.be.null;
            // expect result to be an array
            expect(result).to.be.an('array');
            // check the first element of the result
            expect(result[0]).to.deep.equal(expected_resutl_frist_element);
        } catch (error) {
            console.error('API Call Error:', error.response?.data || error.message);
            throw error; // Fail the test if an error occurs
        }
    });
});
