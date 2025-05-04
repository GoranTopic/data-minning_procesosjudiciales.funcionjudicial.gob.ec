import actuaciones_judiciales from '../api/actuaciones_judiciales.js';
import get_incidente_judicatura from '../api/get_incidente_judicatura.js';
import get_informacion_juicio from '../api/get_informacion_juicio.js';
import { waitForShortTime } from '../utils/timers.js';

/* scrap the causes */
const scrap_causa = async (idJuicio, axios_instance) => {
    // number of scrapped causas
    let causa = {};
    await waitForShortTime();
    let jucio_info = await get_informacion_juicio(idJuicio, axios_instance);
    // overwrite the cause every cause
    for(let key in jucio_info)
        causa[key] = (causa[key]) ? causa[key] : jucio_info[key]
    //console.log('jucio_info', jucio_info);
    let incidentes = await get_incidente_judicatura(idJuicio, axios_instance);
    //console.log(`incidentes: ${incidentes.length}`)
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
            let actuaciones = await actuaciones_judiciales(params, axios_instance);
            //console.log('actuaciones', actuaciones);
            incidente.actuaciones_judiciales = actuaciones
        })
    })
    if(causa['0'] === undefined)
        return null
    causa = causa['0']
    // save incidentes in causa
    causa.incidentes = incidentes
    // clean idJuicio, some id com with * character. I am replacing it with capital S1
    //let id = idJuicio.trim().replace('*', 'S1')
    // return the causa
    return causa
}

export default scrap_causa;

