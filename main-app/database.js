require('dotenv').config();

const { MongoClient } = require('mongodb');

const mongo_user = process.env.MONGODB_USER;
const mongo_pass = process.env.MONGODB_PASSWORD;
const url = `mongodb+srv://${mongo_user}:${mongo_pass}@pisbdata.pbz9k.mongodb.net/<dbname>?retryWrites=true&w=majority`;

var BASIC_USERS = new Array();
var ALL_USERS = new Array();

query = (message, data=null) => {
    try {
        MongoClient.connect(url, (err, client) => {
            if (err) throw err;
            console.log("Connected correctly to server");
        
            const db = client.db('pisbdata');
            if (message==='insert_user')  insert_user(db, data);

            if (message==='get_users') {
            }

            if (message==='update_user') update_user(db, data);
            if (message==='delete_user')   return delete_user(db);
            if (message==='get_basic_users')  return get_basic_users(db)
    
            else if (message==='insert_que')   return que_user(db, data);
            else if (message==='delete_que')   return delete_user(db, data);
            else if (message==='update_que')   return update_que(db, data);
            else if (message==='get_user_ques') return get_user_ques(db, data);
            
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

// get basic users
module.exports = {
    query,
};