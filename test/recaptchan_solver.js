import captchanSolver from '../src/captchan/capmonster.js';
import dotenv from 'dotenv';
dotenv.config();

// get the enviroment variables
let captchanKey = process.env.CAPTCHA_SOLVER_API_KEY;
let domain = 'https://procesosjudiciales.funcionjudicial.gob.ec/expel-busqueda-avanzada';
let siteKey = '6LfjVAcUAAAAANT1V80aWoeJusJ9flay5wTKvr0i';

/*
// solve captchan
let token = await captchanSolver(domain, siteKey, process.env.CAPTCHA_SOLVER_API_KEY, { 
    debug: true,
});
console.log(token);
// genreate fake proxy
//let token = generateToken();
*/

import { CapMonsterCloudClientFactory, ClientOptions, RecaptchaV2Request } from '@zennolab_com/capmonstercloud-client';

const cmcClient = CapMonsterCloudClientFactory.Create(new ClientOptions({ clientKey: captchanKey }));
console.log(await cmcClient.getBalance());
/*

const recaptchaV2Request = new RecaptchaV2Request({
	websiteURL: 'https://lessons.zennolab.com/captchas/recaptcha/v2_simple.php?level=high',
	websiteKey: '6Lcg7CMUAAAAANphynKgn9YAgA4tQ2KI_iqRyTwd',
	proxyType: 'http',
	proxyAddress: '8.8.8.8',
	proxyPort: 8080,
	proxyLogin: 'proxyLoginHere',
	proxyPassword: 'proxyPasswordHere',
	userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.132 Safari/537.36',
});

console.log(await cmcClient.Solve(recaptchaV2Request));

*/


