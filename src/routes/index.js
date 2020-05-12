const express = require('express');
const router = express.Router();

const {usuarioLogeado,redireccionarUsuario} = require("../lib/validar-session");

router.get('/',(req,res)=>{
    res.render('home/home')
});

router.get('/App',usuarioLogeado,(req,res)=>{
    res.send("Efecto de carga de la aplicacion")
});


module.exports = router;