const mongo = require('mongoose');
require('dotenv').config();

const conn = async = () => {
    mongo.connect(`${process.env.DB_NAME}`).
    then(i=>console.log('connected')).
    catch((err)=>console.log(err))
}

module.exports = conn;