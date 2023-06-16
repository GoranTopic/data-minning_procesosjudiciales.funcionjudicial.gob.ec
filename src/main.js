import buscar_causas from './api/buscar_causas.js';
import contar_causas from './api/contar_causas.js';
import actuaciones_judiciales from './api/actuaciones_judiciales.js';
import get_incidente_judicatura from './api/get_incidente_judicatura.js';
import get_informacion_juicio from './api/get_informacion_juicio.js';
import Checklist from 'checklist-js';
import fs from 'fs';
import readCSV from './../src/utils/readCSV.js';
import hasSymbols from './../src/utils/hasSymbols.js';
import { KeyValueStore } from 'crawlee';
import { waitForShortTime, waitForLongTime } from './../src/utils/timers.js';

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
    //user_search_query_data.actor.nombreActor = entry.nombres
    let number_of_causas = await contar_causas(user_search_query_data)
    //console.log(entry.nombres, entry.cedula, number_of_causas)
    // if there are no causes, then we can check this cedula
    if( number_of_causas === 0) cedulas_checklist.check(entry)
    else {
        // query every cause
        let causes = await buscar_causas(user_search_query_data)
        // proecess each caouse
        let causa = {};
        causes.forEach(async causa => {
            let idJuicio = causa.idJuicio;
            //console.log('causa', causa);
            // wait 
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
            await KeyValueStore.setValue(causa.idJuicio.trim(), causa);
            // check the cedula
            cedulas_checklist.check(entry)
        })
    }
    entry = cedulas_checklist.next();
    console.log('missing', cedulas_checklist.missingLeft())
    console.log('done', cedulas_checklist.valuesDone())
    // wait for short 
    await waitForShortTime();
}


//console.log(entry)


