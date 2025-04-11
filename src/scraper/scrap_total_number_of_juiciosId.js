import UserAgent from 'user-agents';
import mk_axios_instance from '../axios_instance.js';
import contar_causas from '../api/contar_causas.js';

let userAgent = new UserAgent().toString();
// make axios instance
const axios = mk_axios_instance(null, userAgent)
let parameter = {
      "numeroCausa":"",
      "actor":{
          "cedulaActor":"",
          "nombreActor":""
      },
      "demandado":{
          "cedulaDemandado":"",
          "nombreDemandado":""
      },
      "provincia":"",
      "numeroFiscalia":"",
      "recaptcha":"verdad"
}

// for every char in the alphabet
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
let total = 0;
for(let letter of alphabet){
    parameter.numeroCausa = letter;
    let result = await contar_causas(parameter, axios);
    console.log(`Total for ${letter}: ${result}`);
    if(result){
        total += result;
    }
}
console.log(`Total: ${total}`);


