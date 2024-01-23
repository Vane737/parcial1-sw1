
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de la ubicación correcta del modelo User
const Sala = require('../models/Sala'); // Asegúrate de la ubicación correcta del modelo Sala

router.get('/user/:tokenU', async (req, res) => {
    const { tokenU } = req.params;
    try {
        const user = await User.findOne({ tokenU });

        if (!user) {
            return res.status(404).json({ status: 'Not Found' });
        }

        const respuesta = {
            name: user.username,
            email: user.correo,
            token: user.tokenU
        };

        res.json(respuesta);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ status: 'Internal Server Error' });
    }
});

router.put('/guardar-diagrama/:tokenS', async (req, res) => {
    const { tokenS } = req.params;
    const { content } = req.body;

    try {
        const sala = await Sala.findOne({ tokenS });

        if (!sala) {
            return res.json({ status: 'Token Not Valid' });
        }

        sala.xml = content;
        await sala.save();

        res.json({ status: 'Project Updated Successfully' });
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.json({ status: 'ERROR! Could not Update Project' });
    }
});

router.get('/cargar-salas/:tokenS', async (req, res) => {
    const { tokenS } = req.params;

    try {
        const sala = await Sala.findOne({ tokenS });

        if (!sala) {
            return res.status(404).json({ status: 'Token Not Valid' });
        }

        const resultado = {
            id: sala.id,
            nombre: sala.title,
            descripcion: sala.description,
            user_id: sala.user_id,
            content: sala.xml,
            codigo: sala.tokenS
        };

        res.json(resultado);
    } catch (error) {
        console.error('Error al cargar salas:', error);
        res.status(500).json({ status: 'Internal Server Error' });
    }
});

module.exports = router; 

// const express = require('express');
// const router = express.Router();

// const pool = require('../database');

// router.get('/user/:tokenU', async (req, res) => {
//     const { tokenU } = req.params;
//     console.log(tokenU + 'tokenUser');
//     const users = await pool.query('SELECT * FROM users WHERE tokenU = ?', [tokenU]);
//     if (users.length <= 0) {
//         res.status(404).json({ status: 'Not Found' });
//     }
//     const user = users[0];
//     const respuesta = {
//         name: user.username,
//         email: user.correo,
//         token: user.tokenU
//     }
//     res.json(respuesta);
// });

// router.put('/guardar-diagrama/:tokenS', async (req, res) => {
//     const { tokenS } = req.params;
//     console.log(req.params);
//     //contect es el xml del diagrama
//     const { content } = req.body;
//     console.log(req.body);
//     console.log("arriba esta mi content body? xlm ");
//     const salas = await pool.query('SELECT * FROM salas WHERE tokenS = ?', [tokenS]);
//     if (salas.length <= 0) {
//         res.json({ status: 'Token Not Valid' });
//     }
//     const salaId = salas[0].id;
//     await pool.query('UPDATE salas SET xml = ? WHERE id= ?', [content, salaId], (err, rows, filds) => {
//         if (!err) {
//             res.json({ status: 'Project Updated Successfully' });
//         } else {
//             res.json({ status: 'ERROR! Could not Update Project' });
//         }
//     });
//     res.json({ status: 'Project Updated Successfully' });
// });


// router.get('/cargar-salas/:tokenS', async (req, res) => {
//     console.log(req.params);
//     console.log(req.params.tokenS);
//     const { tokenS } = req.params;
//     const salas = await pool.query('SELECT * FROM salas WHERE tokenS= ?', [tokenS]);
//     if (salas.length <= 0) {
//         res.status(404).json({ status: 'Token Not Valid' });
//     }
//     const sala = salas[0];
//     console.log(sala + 'sala apis');
//     const resultado = {
//         id: sala.id,
//         nombre: sala.title,
//         descripcion: sala.description,
//         user_id: sala.user_id,
//         content: sala.xml,
//         codigo: sala.tokenS
//     }
//     res.json(resultado);
// });



// module.exports = router;