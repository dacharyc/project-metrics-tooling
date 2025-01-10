import { MongoClient } from 'mongodb';

async function addMetricsToAtlas(metricsDoc) {
    const uri =  process.env.ATLAS_CONNECTION_STRING;
    const client = new MongoClient(uri);
    try {
        await client.connect();

        // set namespace
        const database = client.db("github_metrics");
        const coll = database.collection("docs-notebooks");
        const result = await coll.insertOne(metricsDoc);
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
        await client.close();
    }
}

export {
    addMetricsToAtlas,
}