const express = require('express');
const router = express.Router();
const {usuarioLogeado} = require("../lib/validar-session");

// Administrador
// Inicio

router.get('/', usuarioLogeado, (req,res)=>{
   res.redirect("/App/ContactCenter/Noticias")
});

router.get('/Noticias', usuarioLogeado, (req,res)=>{
    res.render('inicio/listar-noticias',{layout:'ContacLayout.hbs', Noticias: true , session: req.session.datos_usuario })
});

// Directorio
router.get('/Directorio', usuarioLogeado, (req,res)=>{
    res.render('directorio/listar-clientes',{layout:'ContacLayout.hbs', Directorio: true , session: req.session.datos_usuario })
});

router.get('/Directorio/Asignacion', usuarioLogeado, (req,res)=>{
    res.render('directorio/listar-asignacion-contact',{layout:'ContacLayout.hbs', Asignacion: true , session: req.session.datos_usuario })
});

// Llamadas
router.get('/Llamadas',usuarioLogeado,(req,res)=>{
    res.render('llamadas/listar-llamadas',{layout:'ContacLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

router.get('/Llamadas/Control',usuarioLogeado,(req,res)=>{
    res.render('llamadas/control-llamadas',{layout:'ContacLayout.hbs', Control_Llamadas: true , session: req.session.datos_usuario })
});

router.get('/Llamadas/RegistrarNP',usuarioLogeado,(req,res)=>{
    res.render('llamadas/registrar-llamadas',{layout:'ContacLayout.hbs', Registrar_Llamada_NP: true , session: req.session.datos_usuario })
});
router.get('/Llamadas/RegistrarP',usuarioLogeado,(req,res)=>{
    res.render('llamadas/registrar-llamadas',{layout:'ContacLayout.hbs', Registrar_Llamada_P: true , session: req.session.datos_usuario })
});

// Citas
router.get('/Citas',usuarioLogeado,(req,res)=>{
    res.render('citas/listar-citas',{layout:'ContacLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

router.get('/Agenda',usuarioLogeado,(req,res)=>{
    res.render('citas/agenda',{layout:'ContacLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});




module.exports = router;

