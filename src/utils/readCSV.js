import fs from 'fs';
import csv from 'csv-parser';

let readCSV = async filePath => {
    try {
        const rows = [];
        return await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => rows.push(data) )
                .on('end', () => resolve(rows) )
                .on('error', (error) => reject(error) )
        });
    } catch (error) {
        throw error;
    }
}

export default readCSV;
