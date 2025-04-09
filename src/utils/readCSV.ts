import fs from 'fs';
import csv from 'csv-parser';

interface CsvRow {
    [key: string]: string;
}

const readCSV = async (filePath: string): Promise<CsvRow[]> => {
    try {
        const rows: CsvRow[] = [];
        return await new Promise<CsvRow[]>((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data: CsvRow) => rows.push(data))
                .on('end', () => resolve(rows))
                .on('error', (error: Error) => reject(error));
        });
    } catch (error) {
        throw error;
    }
};

export default readCSV;
