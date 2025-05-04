import UserAgent from 'user-agents';
import mk_axios_instance from '../axios_instance.js';
import scrap_causa from './scrap_causa.js';
import Storage from 'dstore-js';
import { MongoClient } from 'mongodb';

/* this code uses a breath first search to find all the prefixes of the judicial processes in Ecuador */

const mongo_url = 'mongodb://10.0.10.5:27017'; // vpn
const mongo_database = 'Procesos_Judiciales';

// Replace with your MongoDB connection string

const client = new MongoClient(mongo_url, { useNewUrlParser: true });
await client.connect();
const db = client.db(mongo_database);
const collection = db.collection('juiciosId');

// get a single juiciosId from the database with scrapped.isScrapped: false
let id = await collection.findOne({ "scrapped.isScrapped": false });

const makeStore = async store_name => {
    // make a store to store the companies
    // Create a storage
    let storage = new Storage({
        type: 'mongodb',
        url: mongo_url,
        database: mongo_database,
    });
    // open the store
    let store = await storage.open(store_name);
    // return store
    return store;
}

let causas_store = await makeStore('causas');

// scrap causas
let userAgent = new UserAgent().toString();
// make axios instance
const axios = mk_axios_instance(null, userAgent)
console.log('scrapping causa: ', id.idJuicio);
// scrap the causa
let causa = await scrap_causa(id.idJuicio, axios);
console.log(causa);
// save in the database
await causas_store.push(causa);
// update the id to scrapped
await collection.updateOne({ _id: id._id }, { $set: { "scrapped.isScrapped": true } });
