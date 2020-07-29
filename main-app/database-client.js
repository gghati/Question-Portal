// NOT WORKING FOR NOW

require('dotenv').config();

const { MongoClient } = require('mongodb');

const mongo_user = process.env.MONGODB_USER;
const mongo_pass = process.env.MONGODB_PASSWORD;
const url = `mongodb+srv://${mongo_user}:${mongo_pass}@pisbdata.pbz9k.mongodb.net/<dbname>?retryWrites=true&w=majority`;

query = (message, data=null) => {
    try {
        MongoClient.connect(url, (err, client) => {
            if (err) throw (err);
            console.log("Connected correctly to database server");
            const db = client.db('pisbdata');

            if (message==='insert_user')  insert_user(db, data);
            if (message==='update_user') update_user(db, data);
            if (message==='delete_user') delete_user(db);
    
            else if (message==='insert_que') que_user(db, data);
            else if (message==='delete_que') delete_user(db, data);
            else if (message==='update_que') update_que(db, data);

            client.close();
        });
    } catch (err) {
        console.log(`ERROR CONNECTING DATABASE ${err}`);
    }
}

// Insert a user
function insert_user(db, data) {
    db.collection('users').insertOne(data, (err, r) => {
      if (err) throw err;
      console.log('User Inserted');
    });
}

// Update a user
function update_user(db, data) {
    db.updateOne({a:1}, {$set: {b: 1}}, (err, r) => {
        if (err) throw err;
        console.log('User Updated!');
    });
}

// Delete User
function delete_user(db, data){
    db.collection("customers").deleteOne(data, function(err, obj) {
        if (err) throw err;
        console.log("User delete!");
    });
}

// Get all users
function get_users(db, data){
    db.collection('users').find().toArray().then((result)=>{
        console.log(result);
    });
}

// Get basic users
function get_basic_users(db, data){
    db.collection('users').find().toArray().then((result)=>{
        console.log(result);
    });
}

// Get basic users
function get_users(db, data){
    db.collection('users').find().toArray().then((result)=>{
        console.log(result);
    });
}