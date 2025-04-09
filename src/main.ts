// First let's read an Excel file and print every line
import XLSX from 'xlsx';

// Read the Excel file
const excelFile = XLSX.readFile('./files/prefijos y sufijos unqiue id_Juicios 2021 2022 y 2023.xlsx');
const sheetName = excelFile.SheetNames[1];
const sheet = excelFile.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

console.log(data);

// Pop the first line in the array
data.shift();

// Get the first column for 2021
const unique_prefixes_2021 = data.map(row => row[0]);
const unique_suffixes_2021 = data.map(row => row[1]);

// Get the first column for 2022
const unique_prefixes_2022 = data.map(row => row[2]);
const unique_suffixes_2022 = data.map(row => row[3]);

// Get the first column for 2023
const unique_prefixes_2023 = data.map(row => row[4]);
const unique_suffixes_2023 = data.map(row => row[5]);

/*
// Alternative implementation using the scraper directly
import scrap_cedula from './scraper/scrap_cedula';
import { 
    init, 
    makeStore, 
    makeChecklist, 
    makeProxies, 
    makeUserAgent 
} from './init';
import { LogFunction } from './types';

const main = async () => {
    // Initialize components
    console.log('making store');
    const store = await makeStore('procesos_judiciales_new');
    console.log('making checklist');
    const checklist = makeChecklist([]);
    console.log('making proxies');
    const proxies = makeProxies();

    // Get next cedula
    let cedula = checklist.next();
    // Get next proxy
    let proxy = proxies.next();
    // Get next user agent
    let userAgent = makeUserAgent();

    // Log function
    let log: LogFunction = (str) => console.log(`[${proxy ? proxy.ip : null}] [${cedula}] ${str}`);

    // While there are cedulas to scrape
    while (cedula !== undefined) {
        // Update log function with current cedula and proxy
        log = (str) => console.log(`[${proxy ? proxy.ip : null}] [${cedula}] ${str}`);
        log('scraping cedula');
        
        const result = await scrap_cedula(cedula, proxy, userAgent, log);
        
        // Process the result
        if (result) {
            const resultCedula = result.cedula;
            // Check off the checklist
            log('checking cedula');
            checklist.check(resultCedula);
            log('pushing to store');
            console.log(result);
            await store.push(result);
        } else {
            log('cedula not found');
            log(result);
        }
        
        // Get next cedula
        cedula = checklist.next();
        // Get next proxy
        proxy = proxies.next();
        // Get next user agent
        userAgent = makeUserAgent();
    }
};

// Uncomment to run the main function
// main().catch(console.error);
*/
