const { MongoClient, connect } = require('mongodb');

const uri = "mongodb://localhost:27017";
connect_mongo();

async function connect_mongo() {
    const client = new MongoClient(uri);
    console.log('test')
    try {
        await client.connect();
        const db = client.db("pisbdata")
        console.log(`Connected to database ${db.databaseName}`)
        /*
        get collections from the user
        const collections = await db.collections();
        collections.forEach(c => console.log(c.collectionName));
        */
        
        const users = db.collection('users');
        const serachCursor = await users.find();

        const result = await serachCursor.toArray();

        // Insert into collection
        
        /*
        const insertCursor = await users.insert(
            {
                "id": 4,
                "username": "komalghati",
                "password": "4321",
                "fullname": "Gaurav ghati",
                "numberQue": 5,
                "role": 'basic'
            }
        )

        console.log(insertCursor.insertedCount);
        */

        // Update
        /*
        const updateCursor = await users.updateOne(
            {"username":"komalghati"},
            {"$set": {"fullname": "Komal Ghait"}}
        )

        console.log(updateCursor.modifiedCount);
        */

        // DELETE
        /*
        const deleteCursor = await users.deleteOne(
            {"username":"komalghati"}
        )

        console.log(deleteCursor.deletedCount);
        */

       // console.table(result);
    } catch (exp) {
        console.error(`Something happened ${exp}`);
    } finally {
        client.close();
    }
}