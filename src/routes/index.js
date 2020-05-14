const express = require('express');
const router = express.Router();

const {usuarioLogeado,redireccionarUsuario} = require("../lib/validar-session");

router.get('/',(req,res)=>{
    res.render('home/home',{layout:'eskatemp.hbs'})
});

router.get('/App',usuarioLogeado,(req,res)=>{
    res.send("Efecto de carga de la aplicacion")
});

router.get('/ObtenerSession',usuarioLogeado,(req,res) =>{
    let session = req.session.datos_usuario;
    res.send({session});
});

module.exports = router;