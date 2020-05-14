const express = require('express');
const router = express.Router();
const {usuarioLogeado} = require("../lib/validar-session");

// Gestión Cliente

// Inicio
router.get('/Noticias',usuarioLogeado,(req,res)=>{
    res.render('citas/listar-citas',{layout:'GestionClienteLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});
// Directorio
router.get('/Directorio',usuarioLogeado,(req,res)=>{
    res.render('citas/agenda',{layout:'GestionClienteLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});
// Llamadas
router.get('/Llamadas',usuarioLogeado,(req,res)=>{
    res.render('citas/agenda',{layout:'GestionClienteLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});
// Llamadas
router.get('/Llamadas',usuarioLogeado,(req,res)=>{
    res.render('citas/agenda',{layout:'GestionClienteLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});
// Visitas
router.get('/Visitas',usuarioLogeado,(req,res)=>{
    res.render('citas/agenda',{layout:'GestionClienteLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});


module.exports = router;