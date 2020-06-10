const express = require('express');
const router = express.Router();
const {usuarioLogeado} = require("../lib/validar-session");

// Administrador
// Inicio
router.get('/', usuarioLogeado,(req,res)=>{
    res.render('inicio/estadisticas',{layout:'AdminLayout.hbs', Estadisticas: true, session: req.session.datos_usuario })
});

router.get('/Noticias', usuarioLogeado, (req,res)=>{
    res.render('inicio/listar-noticias',{layout:'AdminLayout.hbs', Noticias: true , session: req.session.datos_usuario })
});

// Configuración
router.get('/Configuracion',usuarioLogeado, (req,res)=>{
    res.render('configuracion/configuracion',{layout:'AdminLayout.hbs', Configuracion: true , session: req.session.datos_usuario })
});

// Directorio
router.get('/Directorio', usuarioLogeado, (req,res)=>{
    res.render('directorio/listar-clientes',{layout:'AdminLayout.hbs', Directorio: true , session: req.session.datos_usuario })
});

router.get('/Directorio/Registrar', usuarioLogeado,(req,res)=>{
    res.render('directorio/registrar-clientes',{layout:'AdminLayout.hbs', Directorio_Registro: true , session: req.session.datos_usuario })
});

router.get('/Directorio/Editar', usuarioLogeado, (req,res)=>{
    res.render('directorio/editar-clientes',{layout:'AdminLayout.hbs', Directorio_Editar: true , session: req.session.datos_usuario })
});

// Llamadas
router.get('/Llamadas',usuarioLogeado,(req,res)=>{
    res.render('llamadas/listar-llamadas',{layout:'AdminLayout.hbs', Llamadas: true , session: req.session.datos_usuario })
});

router.get('/Llamadas/Control',usuarioLogeado,(req,res)=>{
    res.render('llamadas/control-llamadas',{layout:'AdminLayout.hbs', Control_Llamadas: true , session: req.session.datos_usuario })
});

router.get('/Llamadas/RegistrarNP',usuarioLogeado,(req,res)=>{
    res.render('llamadas/registrar-llamadas-np',{layout:'AdminLayout.hbs', Registrar_Llamada_NP: true , session: req.session.datos_usuario })
});

// Citas
router.get('/Citas',usuarioLogeado,(req,res)=>{
    res.render('citas/listar-citas',{layout:'AdminLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

router.get('/Agenda',usuarioLogeado,(req,res)=>{
    res.render('citas/agenda',{layout:'AdminLayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

// Usuarios
router.get('/Usuarios',usuarioLogeado,(req,res)=>{
    res.render('usuarios/listar-usuarios',{layout:'AdminLayout.hbs', Usuarios: true , session: req.session.datos_usuario })
});

router.get('/Usuarios/Registro',usuarioLogeado,(req,res)=>{
    res.render('usuarios/registrar-usuarios',{layout:'AdminLayout.hbs', Registrar_Usuarios: true , session: req.session.datos_usuario })
});

// Notificaciones
router.get('/Notificaciones',usuarioLogeado,(req,res)=>{
    res.render('notificaciones/listar-notifiaciones',{layout:'AdminLayout.hbs', Notificaciones: true , session: req.session.datos_usuario })
});


module.exports = router;

