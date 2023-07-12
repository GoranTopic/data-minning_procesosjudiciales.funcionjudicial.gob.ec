import fs from 'fs';

// path where to fins the files needed
const cedulasFilePath 
    = './storage/cedulas/cedulas.txt';

process.stdout.write('reading cedulas file...');
// read content fo text file
let file = fs.readFileSync(cedulasFilePath, 'utf-8')


let total = 0;
console.log('done');
let cedulas = file.split('\n');
let cedulas_len = cedulas.length
console.log('numero cedulas', cedulas_len);
for(let i = 0; i < 100 ; i++){
    // count to the first two didgits of the starting string
    let digits = i.toString().padStart(2, '0');
    let subCedulas = cedulas.filter(cedula => cedula.startsWith(digits))
    let count = subCedulas.length;
    if(count > 0){
        console.log(`cedulas ${digits}: ${count}`);
        // save list of cedulas to file
        fs.writeFileSync(`./storage/cedulas/cedulas_${digits}.txt`, subCedulas.join('\n'));
    }
    total += count;
}
console.log('total', total);

