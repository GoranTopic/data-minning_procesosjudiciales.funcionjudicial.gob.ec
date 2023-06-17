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

/* scrap the causes */
const scrap_causa = async causas => {
    // number of scrapped causas
    let causasIds = causas.map( causa => causa.idJuicio )
    let cedulas_checklist = new Checklist( causasIds );
    // for each causa
    for(let causa of causas){
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
        // scape the cause
        cedulas_checklist.check(idJuicio)
        console.log('causa scraped')
    }
    // return the number of scapped causes
    return cedulas_checklist.isDone()
}

// Open a named key-value store
const causas_db = await KeyValueStore.open('causas');

//cedula_checklist.log()
let entry = cedulas_checklist.next()
while(entry) {
    // get numero de causas
    user_search_query_data.actor.cedulaActor = entry.cedula
    // check if there are any entries
    let numero_de_causas_como_actor = await contar_causas(user_search_query_data)
    let was_actor_causas_scraped = null;
    if( numero_de_causas_como_actor <= 0 ){
        console.log('numero_de_causas_como_actor', numero_de_causas_como_actor);
        // query every cause
        let causes = await buscar_causas(user_search_query_data);
        // scrap each causa
        was_actor_causas_scraped = await scrap_causa(causes);
    }else 
        was_actor_causas_scraped = true;
    // switch between actor and demandado
    user_search_query_data.actor.cedulaActor = ''
    user_search_query_data.demandado.cedulaDemandado = entry.cedula
    // check if there are any entries
    let causas_como_demandado_encontradas = await contar_causas(user_search_query_data)
    let was_demandado_causas_scraped = null;
    if( causas_como_demandado_encontradas > 0 ){
        console.log('causas_como_demandado_encontradas', causas_como_demandado_encontradas);
        // query every cause
        let causes = await buscar_causas(user_search_query_data)
        // scrap each causa
        was_demandado_causas_scraped = await scrap_causa(causes)
    }else 
        was_demandado_causas_scraped = true;
    // check if we have scrapped all the causes
    if( was_actor_causas_scraped && was_demandado_causas_scraped )
        cedulas_checklist.check(entry)
    // get next entry
    entry = cedulas_checklist.next();
    console.log('done', cedulas_checklist.valuesDone(), ' out of', cedulas_checklist.missingLeft())
    // wait for short 
    await waitForShortTime();
}


