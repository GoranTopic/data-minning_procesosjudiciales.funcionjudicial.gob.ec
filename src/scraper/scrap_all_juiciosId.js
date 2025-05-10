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
    timeout: 45 * 60 * 1000
})

    .store_ids({
        '_startup': async (data, {self}) => {
            self.client = new MongoClient(mongo_url);
            await self.client.connect();
            const db = self.client.db(mongo_database);
            self.collection = db.collection('juiciosId');
        },
        'next': async (data, {self}) => {
            // get a single juiciosId from the database with scrapped.isScrapped: false
            let id = await self.collection.findOneAndUpdate({
                "scraped.isScraped": false,
                "scraped.hasErrored": false,
                "scraped.inUse": false,
            }, {
                $set: { "scraped.inUse": true }
            }, {
                returnDocument: 'after',
            });
            if (!id) return null;
            return id.idJuicio;
        },
        'update': async (id, {self}) => {
            // update the juiciosId in the database
            await self.collection.updateOne({ idJuicio: id }, { $set: {
                "scraped.isScraped": true,
                "scraped.hasErrored": false,
                "scraped.inUse": false,
                "scraped.timestamp": new Date(),
                }
            });
        },
        'error': async (id, {self}) => {
            // update the juiciosId in the database
            await self.collection.updateOne({ idJuicio: id }, { $set: {
                "scraped.isScraped": false,
                "scraped.hasErrored": true,
                "scraped.inUse": false,
                "scraped.timestamp": new Date(),
            } });
        },
        '_cleanup': async (data, {self}) => {
            await self.client.close();
        }
    }, { number_of_nodes: 1 })

    .store_causas({
        '_startup': async (data, {self}) => {
            self.causas_store = await makeStore('causas');
        },
        'push': async (data,{self}) => {
            try{
            // push the causa to the store
            await self.causas_store.push(data);
                // if we alerady have a recored with that id
            }catch(e){
                console.log(e);
                console.log('error pushing causa: ', data.idJuicio);
            }
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
                // save in the database
                await store_causas.push(causa);
                return true
            } catch (error) {
                console.log('error scrapping causa: ', id);
                return false
            }
        }
    })

    .main( async ({ scraper, store_ids }) => {
        console.log('scrapping all juiciosId');
        let id = true; // start loop
        while (id) {
            // wait for 1 second
            console.log('[main] getting causa: ');
            let id = await store_ids.next();
            console.log('[main] got causa: ', id);
            // get a random id from the database
            console.log('[main] scrapping causa: ', id);
            scraper.scrap_causa(id)
                .then(async (res) => {
                    if(res === true){
                        console.log('[main] successfully scrapped causa: ', id);
                        await store_ids.update(id);
                    }else{
                        console.log('[main] error scrapping causa: ', id);
                        await store_ids.error(id);
                    }
                }).catch(async (e) => {
                    console.error('[main] error scrapping causa: ', id);
                    console.error(e);
                    await store_ids.error(id);
                })
        }
        console.log('finished scrapping all juiciosId');
    })

