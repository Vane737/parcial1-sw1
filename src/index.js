
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

require('./lib/passport');

const { database } = require('./keys');

const app = express();

// Conexión a MongoDB
mongoose.connect(database.mongoURI);
const db = mongoose.connection;



// Manejar errores de conexión a MongoDB
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
});

app.use((req, res, next) => {
  console.log('Solicitud recibida:', req.method, req.url);
  next();
});
// Configuración de express
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partitials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars'),
  runtimeOptions: {
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
  }
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración de la sesión con connect-mongo
const sessionStore = MongoStore.create({
  mongoUrl: database.mongoURI,
  ttl: 14 * 24 * 60 * 60, // 2 semanas
  autoRemove: 'native' // Elimina sesiones antiguas automáticamente
});

app.use(session({
  secret: 'msm',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000 // 2 semanas
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Variables globales
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user;
  next();
});

// Rutas
app.use(require('./routes/index'));
app. use(require('./routes/authentication'));
app.use('/apis', require('./routes/apis'));
app.use('/salas', require('./routes/salas'));

// Recursos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar servidor
app.listen(app.get('port'), () => {
  console.log('El servidor está en el puerto', app.get('port'));
});


// const express = require('express');
// const morgan = require('morgan');
// const exphbs = require('express-handlebars');
// const path = require('path');
// const flash = require('connect-flash');
// const session = require('express-session');
// // const validator = require('express-validator');

// const MySQLStore = require('express-mysql-session');
// const passport = require('passport');
// // const bodyParser = require('body-parser');
// //  const { engine } = require('express-handlebars');
// const app = express();
// require('./lib/passport');

// const { database } = require('./keys');

// // Settings

// app.set('port', process.env.PORT || 5000);

// //__dirname es una constantes que me devuelve la direccion de la carpeta
// app.set('views', path.join(__dirname, 'views'));
// app.engine('.hbs', exphbs.engine({
//   defaultLayout: 'main',
//   layoutsDir: path.join(app.get('views'), 'layouts'),
//   partialsDir: path.join(app.get('views'), 'partitials'),
//   extname: '.hbs',
//   helpers: require('./lib/handlebars')
// }));
// app.set('view engine', '.hbs');

// // Middlewares
// app.use(morgan('dev'));
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// app.use(session({
//   secret: 'msm',
//   resave: false,
//   saveUninitialized: false,
//   store: new MySQLStore(database)
// }));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session());
// // app.use(validator());


// // app.use(bodyParser.urlencoded({extended: false}));
// // app.use(bodyParser.json());

// // Global variables
// app.use((req, res, next) => {
//   app.locals.message = req.flash('message');
//   app.locals.success = req.flash('success');
//   app.locals.user = req.user;
//   //  app.locals.idSALA = req.
//   next();
// });

// // Routes
// app.use(require('./routes/index'));
// app.use(require('./routes/authentication'));
// app.use('/apis', require('./routes/apis'));
// app.use('/salas', require('./routes/salas'));

// // Public
// app.use(express.static(path.join(__dirname, 'public')));

// // Starting
// app.listen(app.get('port'), () => {
//   console.log('Server is in port', app.get('port'));
// });