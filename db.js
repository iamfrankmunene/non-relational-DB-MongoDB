const { MongoClient } = require('mongodb')

let dbConnection
let uri = 'mongodb+srv://iamfrank:frankmunenenjari@cluster0.mgxurrc.mongodb.net/?retryWrites=true&w=majority'

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
           dbConnection =  client.db()
           return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}