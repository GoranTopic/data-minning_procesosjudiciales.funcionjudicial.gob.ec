import UserAgent from 'user-agents';
import mk_axios_instance from '../axios_instance.js';
import scrap_causa from './scrap_causa.js';
import Storage from 'dstore-js';
import { MongoClient } from 'mongodb';
import slavery from 'slavery-js';

/* this code uses a breath first search to find all the prefixes of the judicial processes in Ecuador */

const mongo_url = 'mongodb://10.0.10.101:27017'; // vpn
const mongo_database = 'Procesos_Judiciales'; // connect to the database

// Replace with your MongoDB connection string
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


slavery({
    host: 'localhost',
    port: 3000,
})

    .store_ids({
        '_startup': async (data, {self}) => {
            self.client = new MongoClient(mongo_url, { useNewUrlParser: true });
            await self.client.connect();
            const db = self.client.db(mongo_database);
            self.collection = db.collection('juiciosId');
        },
        'next': async (data, {self}) => {
            // get a single juiciosId from the database with scrapped.isScrapped: false
            let id = await self.collection.findOne({ "scrapped.isScrapped": false });
            if (!id) return null;
            return id.idJuicio;
        },
        'update': async (id, {self}) => {
            // update the juiciosId in the database
            try{
                await self.collection.updateOne({ idJuicio: id }, { $set: {
                    "scrapped.isScrapped": true,
                    "scrapped.hasErrored": false
                } });
            }catch(e){
                console.log('error updating juiciosId: ', id);
                console.log(e);
            }
        },
        '_cleanup': async (data, {self}) => {
            await self.client.close();
        }
    })

    .store_causas({
        '_startup': async (data, {self}) => {
            self.causas_store = await makeStore('causas');
        },
        'push': async (data,{self}) => {
            // push the causa to the store
            await self.causas_store.push(data);
        },
        '_cleanup': async (data, {self}) => {
            await self.causas_store.close();
        }
    })

    .agents({
        'getAgent': async () => {
            // get a random user agent
            const userAgent = new UserAgent().toString();
            return userAgent;
        }
    })

    .scraper({
        'scrap_causa': async(id, { agents, store_causas }) => {
            // get a random id from the database
            try {
                // get a random user agent
                const userAgent = await agents.getAgent();
                // make axios instance
                const axios = mk_axios_instance(null, userAgent);
                console.log('scrapping causa: ', id);
                // scrap the causa
                let causa = await scrap_causa(id, axios);
                if(!causa) {
                    console.log('causa not scraped: ', id);
                    return false
                }
                console.log('saving causa: ', causa.idJuicio);
                // save in the database
                await store_causas.push(causa);
                return true
            } catch (error) {
                console.log('error scrapping causa: ', id);
                console.log(error);
                return false
            }
        }
    })

    .main( async ({ scraper, store_ids }) => {
        let timeTaken = []; // get the last 500 times
        setInterval(async () => {
            let id = await store_ids.next();
            // get a random id from the database
            let start = new Date();
            let res = await scraper.scrap_causa(id);
            if(res) await store_ids.update(id);
            let end = new Date();
            let time = end - start;
            if (timeTaken.length > 500) {
                timeTaken.shift();
            }else 
                timeTaken.push({time, res});
            console.log('time taken: ', time);
            console.log('average time taken: ', timeTaken.reduce((a, b) => a + b.time, 0) / timeTaken.length);
        }, 1000);
    })

