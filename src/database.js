const mongoose = require('mongoose');
const { promisify } = require('util');
const { database } = require('./keys');

// Conexión a MongoDB Atlas
mongoose.connect(database.mongoURI);

// Manejo de eventos de conexión y error
const db = mongoose.connection;
db.on('error', ( err ) =>  console.error('Error de conexión a la base de datos:', err));
db.on('connected', () => console.log('connected'));
db.on('open', () => { console.log('Open DB está conectada');});
db.on('disconnected', () => console.log('disconnected'));
db.on('reconnected', () => console.log('reconnected'));
db.on('disconnecting', () => console.log('disconnecting'));
db.on('close', () => console.log('close'));


// Promisify Mongoose Querys
mongoose.query = function(query) {
    return query.exec.bind(query);
};

module.exports = mongoose;

// const mysql = require('mysql');
// //para las promesas
// const { promisify } = require('util');

// const { database } = require('./keys');

// const pool = mysql.createPool(database);

// pool.getConnection((err, connection) => {
//     if (err) {
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.error('Database connection fue cerrada.');
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR') {
//             console.error('Database has to many connections');
//         }
//         //fue rechazada
//         if (err.code === 'ECONNREFUSED') {
//             console.error('Database connection fue rechazada');
//         }
//     }

//     if (connection) {connection.release();
//     console.log('DB esta conectada');
//     }
//     return;
// });

// // Promisify Pool Querys
// pool.query = promisify(pool.query);

// module.exports = pool;