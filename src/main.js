import Checklist from 'checklist-js';
import { KeyValueStore } from 'crawlee';
import buscar_causas from './api/buscar_causas.js';
import contar_causas from './api/contar_causas.js';
import actuaciones_judiciales from './api/actuaciones_judiciales.js';
import get_incidente_judicatura from './api/get_incidente_judicatura.js';
import get_informacion_juicio from './api/get_informacion_juicio.js';
import { waitForShortTime, waitForLongTime } from '../src/utils/timers.js';
import readCSV from '../src/utils/readCSV.js';

const filePath = './storage/cedulas/idsamples.csv';

let cedulas = await readCSV(filePath)
cedulas = cedulas.map(cedula => 
    ({ cedula: cedula['0'], nombres: cedula['NOMBRES'] })
)

let cedulas_checklist = new Checklist( cedulas, { 
    name: 'cedulas_checklist',
    path: process.cwd() + '/storage/',
});

let user_search_query_data = {
"numeroCausa" : "",
"actor": {  
    "cedulaActor":"",
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

// Open a named key-value store
const causas_db = await KeyValueStore.open('causas');

//cedula_checklist.log()
let entry = cedulas_checklist.next()
while(entry) {
	user_search_query_data.actor.cedulaActor = entry.cedula
	// get numero de causas
	let actorCausas = await contar_causas(user_search_query_data)
	if( actorCausas > 0 ){
		console.log('cases found as actor: ', number_of_causas);
		// query every cause
		let causes = await buscar_causas(user_search_query_data)
		// scrap each causa
		scrap_
		causes.forEach( scrap_causa )
	}
	// switch cedula ot check if he as been demendado
	user_search_query_data.actor.cedulaActor = ''
	user_search_query_data.demandado.cedulaDemandado = entry.cedula
	// check if there are any entries
	//
	if( await contar_causas(user_search_query_data) > 0 )
		else {
			console.log('cases found as demandado: ', number_of_causas);
			// query every cause
			let causes = await buscar_causas(user_search_query_data)
			// scrap each causa
			causes.forEach( scrap_causa )
		}
	//console.log(entry.nombres, entry.cedula, number_of_causas)
	// if there are no causes, then we can check this cedula
	if( number_of_causas === 0) cedulas_checklist.check(entry)
    
    entry = cedulas_checklist.next();
    console.log('done', cedulas_checklist.valuesDone(), ' missing', cedulas_checklist.missingLeft())
    // wait for short 
    await waitForShortTime();
}

const scrap_causa = async causa => {
	let idJuicio = causa.idJuicio;
	//console.log('causa', causa);
	await waitForShortTime();
	let jucio_info = await get_informacion_juicio(idJuicio)
	// overwrite the cause if it is null
	for(let key in jucio_info)
		causa[key] = (causa[key]) ? causa[key] : jucio_info[key]
	//console.log('jucio_info', jucio_info);
	let incidentes = await get_incidente_judicatura(idJuicio)
	//console.log('incidentes', incidentes);
	incidentes.forEach(async incidente => {
		let { idJudicatura, 
			lstIncidenteJudicatura,
			nombreJudicatura,
		} = incidente;
		lstIncidenteJudicatura.forEach(async judicatura => {
			//console.log('judicatura', judicatura);
			let { idMovimientoJuicioIncidente, 
				idIncidenteJudicatura } = judicatura;
			let params = { idMovimientoJuicioIncidente, 
				idJuicio, idJudicatura,
				idIncidenteJudicatura, 
				aplicativo : "web", 
				nombreJudicatura }
			await waitForShortTime()
			let actuaciones = await actuaciones_judiciales(params)
			//console.log('actuaciones', actuaciones);
			incidente.actuaciones_judiciales = actuaciones
		})
	})
	causa.incidentes = incidentes
	// save in storage key value
	await causas_db.setValue(causa.idJuicio.trim(), causa);
	console.log('causas saved')
	// check the cedula
	cedulas_checklist.check(entry)
})

//console.log(entry)


