import captchanSolver from '../src/captchan/capmonster.js';
import dotenv from 'dotenv';
dotenv.config();

// get the enviroment variables
let captchanKey = process.env.CAPTCHA_SOLVER_API_KEY;
let domain = 'https://procesosjudiciales.funcionjudicial.gob.ec/expel-busqueda-avanzada';
let siteKey = '6LfjVAcUAAAAANT1V80aWoeJusJ9flay5wTKvr0i';

// solve captchan
let token = await captchanSolver(domain, siteKey, process.env.CAPTCHA_SOLVER_API_KEY, { 
    debug: true,
});
console.log(token);
// genreate fake proxy
//let token = generateToken();

