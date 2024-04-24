const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('../lib/auth');

const User = require('../models/User');
const Sala = require('../models/Sala');
const UserSalas = require('../models/UserSalas');

router.get('/add', isLoggedIn, (req, res) => {
  res.render('salas/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
  try {
    const { title, xml="", description } = req.body;

    const newSala = {
      title,
      xml,
      description,
      user_id: req.user._id // Use _id instead of id
    };

    const tokenS = jwt.sign({ newSala }, 'token_sala');
    newSala.tokenS = tokenS;

    const sala = await Sala.create(newSala);

    // await UserSalas.create({
    //   user_id: req.user._id, // Use _id instead of id
    //   salas_id: sala._id
    // });

    req.flash('success', 'Sala guardada exitosamente');
    res.redirect('/salas');
  } catch (error) {
    console.error('Error al agregar la sala:', error);
    req.flash('error', 'Error al agregar la sala');
    res.redirect('/salas/add');
  }
});

router.get('/', isLoggedIn, async (req, res) => {
  try {
    const salas = await Sala.find({ user_id: req.user._id }); // Use _id instead of id
    res.render('salas/list', { salas });
  } catch (error) {
    console.error('Error al obtener las salas:', error);
    req.flash('error', 'Error al obtener las salas');
    res.redirect('/salas');
  }
});


router.get('/salasCompartidas', isLoggedIn, async (req, res) => {
  try {
    const userSalas = await UserSalas.find({ user_id: req.user._id });
    const salasIds = userSalas.map(userSala => userSala.salas_id);

    const salas = await Sala.find({ _id: { $in: salasIds } });
    
    console.log(salas);
    res.render('salas/listCompartidas', { salas });
  } catch (error) {
    console.error('Error al obtener las salas compartidas:', error);
    req.flash('error', 'Error al obtener las salas compartidas');
    res.redirect('/salas/salasCompartidas');
  }
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    try {
      const { id } = req.params;
      await UserSalas.deleteMany({ salas_id: id });
      await Sala.findByIdAndDelete(id);
      req.flash('success', 'Sala eliminada de la base de datos');
      res.redirect('/salas');
    } catch (error) {
      console.error('Error al eliminar la sala:', error);
      req.flash('error', 'Error al eliminar la sala');
      res.redirect('/salas');
    }
  });
  
  router.get('/edit/:id', isLoggedIn, async (req, res) => {
    try {
      const { id } = req.params;
      const sala = await Sala.findById(id);
      res.render('salas/edit', { sala });
    } catch (error) {
      console.error('Error al obtener la sala para editar:', error);
      req.flash('error', 'Error al obtener la sala para editar');
      res.redirect('/salas');
    }
  });
  
  router.post('/edit/:id', isLoggedIn, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, xml } = req.body;
      const updatedSala = {
        title,
        description,
        xml
      };
  
      await Sala.findByIdAndUpdate(id, updatedSala);
      req.flash('success', 'Sala actualizada exitosamente');
      res.redirect('/salas');
    } catch (error) {
      console.error('Error al actualizar la sala:', error);
      req.flash('error', 'Error al actualizar la sala');
      res.redirect('/salas');
    }
  });
  
  router.get('/inSala/:tokenS', isLoggedIn, async (req, res) => {
    try {
      const { tokenU } = req.user;
      const { tokenS } = req.params;
      const inSala = `?room=${tokenS}`;
      const inUs = `&username=${tokenU}`;
      const rutaDeMiProyectoPizarra = `http://localhost:8080/secuence-diagram${inSala}${inUs}`;
      res.redirect(rutaDeMiProyectoPizarra);
    } catch (error) {
      console.error('Error al redirigir a la sala:', error);
      req.flash('error', 'Error al redirigir a la sala');
      res.redirect('/salas');
    }
  });
  
  router.get('/listUsuarios/:idSala', isLoggedIn, async (req, res) => {
    try {
      const { idSala } = req.params;
      const users = await User.find();
      res.render('salas/listUsuarios', { users, idSala });
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
      req.flash('error', 'Error al obtener la lista de usuarios');
      res.redirect('/salas');
    }
  });
  

  router.post('/compartir/:idSala/:idUsuario', isLoggedIn, async (req, res) => {
    try {
        const { idUsuario, idSala } = req.params;
        await UserSalas.create({ user_id: idUsuario, salas_id: idSala });
        req.flash('success', 'Compartido exitosamente');
        res.redirect('/salas');
    } catch (error) {
        console.error('Error al compartir la sala:', error);
        req.flash('error', 'Error al compartir la sala');
        res.redirect('/salas');
    }
});
  
  // router.post('/compartir/:idSala', isLoggedIn, async (req, res) => {
  //   console.log(req.body);
  //   try {
  //     const { idUsuario } = req.body;
  //     const { idSala } = req.params;
  //     await UserSalas.create({ user_id: idUsuario, salas_id: idSala });
  //     req.flash('success', 'Compartido exitosamente');
  //     res.redirect('/salas');
  //   } catch (error) {
  //     console.error('Error al compartir la sala:', error);
  //     req.flash('error', 'Error al compartir la sala');
  //     res.redirect('/salas');
  //   }
  // });
  
  module.exports = router;

