import axios from 'axios'; 
import { api_endpoint } from './endpoints.js';
import { cookieStringToToughCookie } from 'crawlee';

let endpoint = 'https://api.funcionjudicial.gob.ec/informacion/contarCausas';
let userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36';
let proxy = {
	protocol: 'http',
	host: '156.239.57.61',
	port: '3128',
	status: 'new',
	changeTimeStamp: 1705343071616
};
let causa = {
	numeroCausa: '',
	actor: { cedulaActor: '0200637601', nombreActor: '' },
	demandado: { cedulaDemandado: '', nombreDemandado: '' },
	provincia: '',
	numeroFiscalia: '',
	recaptcha: ''
}



/* @param causa: objeto con los datos de la causa a buscar
 * {"numeroCausa":"","actor":{"cedulaActor":"","nombreActor":""},"demandado":{"cedulaDemandado":"","nombreDemandado":""},"provincia":"","numeroFiscalia":"","recaptcha":""}
 *  @return: objeto con los datos de la causa */
const res = await axios.post(endpoint, causa, {
	proxy: {
		host: proxy.host,
		port: proxy.port,
		protocol: proxy.protocol
	},
	userAgent
});

console.log('res:', res);
