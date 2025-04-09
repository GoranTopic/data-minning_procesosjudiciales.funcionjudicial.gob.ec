import Checklist from 'checklist-js';
import { AxiosInstance } from 'axios';
import actuaciones_judiciales from '../api/actuaciones_judiciales';
import get_incidente_judicatura from '../api/get_incidente_judicatura';
import get_informacion_juicio from '../api/get_informacion_juicio';
import { waitForShortTime } from '../utils/timers';
import { Causa, CausaScraped, Incidente, LogFunction } from '../types';

interface IncidenteJudicatura {
    idMovimientoJuicioIncidente: number;
    idIncidenteJudicatura: number;
    [key: string]: any;
}

/**
 * Scrape detailed information for each cause
 * @param causas - Array of causes to scrape
 * @param axios_instance - Axios instance to use for API requests
 * @param log - Logging function
 * @returns Array of scraped causes or false if not all causes were scraped
 */
const scrap_causa = async (
    causas: Causa[], 
    axios_instance: AxiosInstance, 
    log: LogFunction
): Promise<CausaScraped[] | false> => {
    // number of scrapped causas
    const causasIds = causas.map(causa => causa.idJuicio);
    const cedulas_checklist = new Checklist(causasIds);
    const causas_scraped: CausaScraped[] = [];
    
    // for each causa
    for (const causa of causas) {
        const idJuicio = causa.idJuicio;
        await waitForShortTime();
        
        const jucio_info = await get_informacion_juicio(idJuicio, axios_instance);
        // overwrite the cause if it is null
        for (const key in jucio_info) {
            causa[key] = (causa[key]) ? causa[key] : jucio_info[key];
        }
        
        const incidentes = await get_incidente_judicatura(idJuicio, axios_instance);
        log(`incidentes: ${incidentes.length}`);
        
        incidentes.forEach(async (incidente: Incidente) => {
            const { 
                idJudicatura, 
                lstIncidenteJudicatura, 
                nombreJudicatura 
            } = incidente;
            
            if (lstIncidenteJudicatura && Array.isArray(lstIncidenteJudicatura)) {
                lstIncidenteJudicatura.forEach(async (judicatura: IncidenteJudicatura) => {
                    const { 
                        idMovimientoJuicioIncidente, 
                        idIncidenteJudicatura 
                    } = judicatura;
                    
                    const params = { 
                        idMovimientoJuicioIncidente, 
                        idJuicio, 
                        idJudicatura: idJudicatura as string,
                        idIncidenteJudicatura, 
                        aplicativo: "web", 
                        nombreJudicatura: nombreJudicatura as string
                    };
                    
                    const actuaciones = await actuaciones_judiciales(params, axios_instance);
                    incidente.actuaciones_judiciales = actuaciones;
                });
            }
        });
        
        // save incidentes in causa
        causa.incidentes = incidentes;
        // clean idJuicio, some id come with * character. I am replacing it with capital S1
        const id = idJuicio.trim().replace('*', 'S1');
        // save causas scraped
        causas_scraped.push({ id, causa });
        log('causa scraped');
        // mark the cause as scraped
        cedulas_checklist.check(idJuicio);
    }
    
    // check if we have scrapped all of the causas
    if (cedulas_checklist.isDone()) {
        cedulas_checklist.delete();
        return causas_scraped;
    } else {
        return false;
    }
};

export default scrap_causa;
