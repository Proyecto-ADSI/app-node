const express = require('express');
const router = express.Router();
const {usuarioLogeado} = require("../lib/validar-session");

// Administrador
// Inicio
router.get('/', usuarioLogeado,(req,res)=>{
    res.render('inicio/estadisticas',{layout:'CoordinadorLayout.hbs', session: req.session.datos_usuario })
});

router.get('/Noticias', usuarioLogeado, (req,res)=>{
    res.render('inicio/listar-noticias',{layout:'CoordinadorLayout.hbs', Noticias: true , session: req.session.datos_usuario })
});
// Directorio
router.get('/Directorio', usuarioLogeado,(req,res)=>{
    res.render('directorio/listar-clientes',{layout:'CoordinadorLayout.hbs',  Directorio: true, session: req.session.datos_usuario })
});

router.get('/Directorio/Registrar', usuarioLogeado,(req,res)=>{
    res.render('directorio/registrar-clientes',{layout:'CoordinadorLayout.hbs', Directorio_Registro: true , session: req.session.datos_usuario })
});

router.get('/Directorio/Editar', usuarioLogeado, (req,res)=>{
    res.render('directorio/editar-clientes',{layout:'CoordinadorLayout.hbs', Directorio_Editar: true , session: req.session.datos_usuario })
});

// Llamadas
router.get('/Llamadas',usuarioLogeado,(req,res)=>{
    res.render('llamadas/listar-llamadas',{layout:'CoordinadorLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

router.get('/Llamadas/Control',usuarioLogeado,(req,res)=>{
    res.render('llamadas/control-llamadas',{layout:'CoordinadorLayout.hbs', Control_Llamadas: true , session: req.session.datos_usuario })
});

// Citas
router.get('/Citas',usuarioLogeado,(req,res)=>{
    res.render('citas/listar-citas',{layout:'CoordinadorLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

router.get('/Agenda',usuarioLogeado,(req,res)=>{
    res.render('citas/agenda',{layout:'CoordinadorLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

// Notificaciones
router.get('/Notificaciones',usuarioLogeado,(req,res)=>{
    res.render('notificaciones/listar-notifiaciones',{layout:'CoordinadorLayout.hbs', Notificaciones: true , session: req.session.datos_usuario })
});

// Usuarios
router.get('/Usuarios',usuarioLogeado,(req,res)=>{
    res.render('usuarios/listar-usuarios',{layout:'CoordinadorLayout.hbs', Usuarios: true , session: req.session.datos_usuario })
});

router.get('/Usuarios/Registro',usuarioLogeado,(req,res)=>{
    res.render('usuarios/registrar-usuarios',{layout:'CoordinadorLayout.hbs', Registrar_Usuarios: true , session: req.session.datos_usuario })
});






module.exports = router;