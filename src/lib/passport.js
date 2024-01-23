const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Asegúrate de la ubicación correcta del modelo User
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'correo',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, correo, password, done) => {
  try {
    const user = await User.findOneByCorreo(correo);

    if (user) {
      const validPassword = await helpers.matchPassword(password, user.password);

      if (validPassword) {
        done(null, user, req.flash('success', '¡Bienvenido ' + user.username + '!'));
      } else {
        done(null, false, req.flash('message', 'Contraseña incorrecta'));
      }
    } else {
      return done(null, false, req.flash('message', 'La cuenta no existe.'));
    }
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    done(error);
  }
}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const { correo } = req.body;

  try {
    let newUser = {
      username,
      correo,
      password
    };

    const token = jwt.sign({ newUser }, 'token_user');
    console.log(token);

    newUser.tokenU = token;
    console.log(newUser);

    newUser.password = await helpers.encryptPassword(password);

    // Guardar en la base de datos
    const user = await User.create(newUser);
    return done(null, user);
  } catch (error) {
    console.error('Error al registrar nuevo usuario:', error);
    done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Error al deserializar usuario:', error);
    done(error);
  }
});


// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const jwt = require('jsonwebtoken');

// const pool = require('../database');
// const helpers = require('./helpers');


// passport.use('local.signin', new LocalStrategy({
//   usernameField: 'correo',
//   passwordField: 'password',
//   passReqToCallback: true
// }, async (req, correo, password, done) => {
//   console.log(req.body);
//   console.log(correo);
//   console.log(password);
//   const rows = await pool.query('SELECT * FROM users WHERE correo = ?', [correo]);
//   if (rows.length > 0) {
//     const user = rows[0];
//     const validPassword = await helpers.matchPassword(password, user.password)
//     if (validPassword) {
//       done(null, user, req.flash('success', 'Bienvenido ' + user.username));
//     } else {
//       done(null, false, req.flash('message', 'Contraseña Incorrecta'));
//     }
//   } else {
//     return done(null, false, req.flash('message', 'La cuenta no existe.'));
//   }
// }));
// //serializar al user
// passport.use('local.signup', new LocalStrategy({
//   usernameField: 'username',
//   //   correoField: 'correo',
//   passwordField: 'password',
//   passReqToCallback: true
// }, async (req, username, password, done) => {
//   const { correo } = req.body;
//   console.log(req.body.correo);
//   let newUser = {
//     username,
//     correo,
//     password
//   };
//   const token = jwt.sign({ newUser }, 'token_user');
//   console.log(token);
//   newUser.tokenU = token;
//   console.log(newUser);
//   newUser.password = await helpers.encryptPassword(password);
//   //   // Saving in the Database
//   const result = await pool.query('INSERT INTO users SET ? ', [newUser]);
//   newUser.id = result.insertId;
//   return done(null, newUser);
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// //guarda los usuarios dentro de la sesion  
// passport.deserializeUser(async (id, done) => {
//   const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
//   done(null, rows[0]);
// });