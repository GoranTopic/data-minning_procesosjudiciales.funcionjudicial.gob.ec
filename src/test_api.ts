import buscarCausas from './api/buscar_causas';
import contarCausas from './api/contar_causas';
import getInformacionJuicio from './api/get_informacion_juicio';
import getIncidenteJudicatura from './api/get_incidente_judicatura';
import actuacionesJudiciales from './api/actuaciones_judiciales';
import { SearchQuery } from './types';

const testApis = async () => {
    console.log('Starting API tests...\n');

    // Test data
    const testCedula = "2000032306";
    const testJuicioId = "2030120120212";
    
    // Test search query
    const searchQuery: SearchQuery = {
        numeroCausa: "",
        actor: {
            cedulaActor: testCedula,
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

    // Test actuaciones judiciales data
    const actuacionesData = {
        idMovimientoJuicioIncidente: 25043529,
        idJuicio: "09327202300264G",
        idJudicatura: "09327",
        idIncidenteJudicatura: 26403326,
        aplicativo: "web",
        nombreJudicatura: "UNIDAD JUDICIAL MULTICOMPETENTE  CON SEDE EN EL CANTÓN EL TRIUNFO"
    };

    try {
        // Test buscarCausas
        console.log('Testing buscarCausas...');
        const buscarResult = await buscarCausas(searchQuery);
        console.log('buscarCausas result:', JSON.stringify(buscarResult, null, 2), '\n');

        // Test contarCausas
        console.log('Testing contarCausas...');
        const contarResult = await contarCausas(searchQuery);
        console.log('contarCausas result:', contarResult, '\n');

        // Test getInformacionJuicio
        console.log('Testing getInformacionJuicio...');
        const infoResult = await getInformacionJuicio(testJuicioId);
        console.log('getInformacionJuicio result:', JSON.stringify(infoResult, null, 2), '\n');

        // Test getIncidenteJudicatura
        console.log('Testing getIncidenteJudicatura...');
        const incidenteResult = await getIncidenteJudicatura(testJuicioId);
        console.log('getIncidenteJudicatura result:', JSON.stringify(incidenteResult, null, 2), '\n');

        // Test actuacionesJudiciales
        console.log('Testing actuacionesJudiciales...');
        const actuacionesResult = await actuacionesJudiciales(actuacionesData);
        console.log('actuacionesJudiciales result:', JSON.stringify(actuacionesResult, null, 2), '\n');

    } catch (error) {
        console.error('Error during API tests:', error);
    }
};

// Run the tests
testApis().catch(console.error);