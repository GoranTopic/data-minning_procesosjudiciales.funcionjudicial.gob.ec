import Checklist from 'checklist-js';
import actuaciones_judiciales from '../api/actuaciones_judiciales.js';
import get_incidente_judicatura from '../api/get_incidente_judicatura.js';
import get_informacion_juicio from '../api/get_informacion_juicio.js';
import { waitForShortTime } from '../utils/timers.js';

/* scrap the causes */
const scrap_causa = async (causas, axios_instance, log) => {
    // number of scrapped causas
    let causasIds = causas.map( causa => causa.idJuicio )
    let cedulas_checklist = new Checklist( causasIds );
    let causas_scraped = []
    // for each causa
    for(let causa of causas){
        let idJuicio = causa.idJuicio;
        //console.log('causa', causa);
        await waitForShortTime();
        let jucio_info = await get_informacion_juicio(idJuicio, axios_instance);
        // overwrite the cause if it is null
        for(let key in jucio_info)
            causa[key] = (causa[key]) ? causa[key] : jucio_info[key]
        //console.log('jucio_info', jucio_info);
        let incidentes = await get_incidente_judicatura(idJuicio, axios_instance);
        log(`incidentes: ${incidentes.length}`)
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
                //await waitForShortTime()
                let actuaciones = await actuaciones_judiciales(params, axios_instance);
                //console.log('actuaciones', actuaciones);
                incidente.actuaciones_judiciales = actuaciones
            })
        })
        // save incidentes in causa
        causa.incidentes = incidentes
        // clean idJuicio, som id com with * character. I am replacing it with capital S1
        let id = idJuicio.trim().replace('*', 'S1')
        // save causas scraped
        causas_scraped.push( { id, causa } )
        log('causa scraped')
        // scape the cause
        cedulas_checklist.check(idJuicio)
    }
    // check if we have scrapped all of the causas
    if(cedulas_checklist.isDone()){
        cedulas_checklist.delete()
        return causas_scraped
    }else 
        return false
}

export default scrap_causa;

