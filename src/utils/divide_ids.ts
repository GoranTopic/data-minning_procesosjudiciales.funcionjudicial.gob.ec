import fs from 'fs';

// path where to find the files needed
const cedulasFilePath = './storage/cedulas/cedulas.txt';

process.stdout.write('reading cedulas file...');
// read content of text file
const file = fs.readFileSync(cedulasFilePath, 'utf-8');

let total = 0;
console.log('done');
const cedulas = file.split('\n');
const cedulas_len = cedulas.length;
console.log('numero cedulas', cedulas_len);

for (let i = 0; i < 100; i++) {
    // count to the first two digits of the starting string
    const digits = i.toString().padStart(2, '0');
    const subCedulas = cedulas.filter(cedula => cedula.startsWith(digits));
    const count = subCedulas.length;
    
    if (count > 0) {
        console.log(`cedulas ${digits}: ${count}`);
        // save list of cedulas to file
        fs.writeFileSync(`./storage/cedulas/cedulas_${digits}.txt`, subCedulas.join('\n'));
    }
    total += count;
}

console.log('total', total);
