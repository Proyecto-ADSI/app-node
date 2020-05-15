const express = require('express');
const router = express.Router();
const {usuarioLogeado} = require("../lib/validar-session");

// AseorExterno
// Inicio
router.get('/', usuarioLogeado,(req,res)=>{
    res.render('inicio/estadisticas',{layout:'AsesorELayout.hbs', session: req.session.datos_usuario })
});

router.get('/Noticias', usuarioLogeado, (req,res)=>{
    res.render('inicio/listar-noticias',{layout:'AsesorELayout.hbs', Noticias: true , session: req.session.datos_usuario })
});

// Configuración
router.get('/Configuracion',usuarioLogeado, (req,res)=>{
    res.render('configuracion/configuracion',{layout:'AsesorELayout.hbs', Configuracion: true , session: req.session.datos_usuario })
});

// Directorio
router.get('/Directorio', usuarioLogeado, (req,res)=>{
    res.render('directorio/listar-clientes',{layout:'AsesorELayout.hbs', Directorio: true , session: req.session.datos_usuario })
});

router.get('/Directorio/Registrar', usuarioLogeado,(req,res)=>{
    res.render('directorio/registrar-clientes',{layout:'AsesorELayout.hbs', Directorio_Registro: true , session: req.session.datos_usuario })
});

router.get('/Directorio/Editar', usuarioLogeado, (req,res)=>{
    res.render('directorio/editar-clientes',{layout:'AsesorELayout.hbs', Directorio_Editar: true , session: req.session.datos_usuario })
});

// Llamadas
router.get('/Llamadas',usuarioLogeado,(req,res)=>{
    res.render('llamadas/listar-llamadas',{layout:'AsesorELayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

router.get('/Llamadas/Control',usuarioLogeado,(req,res)=>{
    res.render('llamadas/control-llamadas',{layout:'AsesorELayout.hbs', Control_Llamadas: true , session: req.session.datos_usuario })
});

router.get('/Llamadas/RegistrarNP',usuarioLogeado,(req,res)=>{
    res.render('llamadas/registrar-llamadas-np',{layout:'AsesorELayout.hbs', Registrar_Llamada_NP: true , session: req.session.datos_usuario })
});

// Citas
router.get('/Citas',usuarioLogeado,(req,res)=>{
    res.render('citas/listar-citas',{layout:'AsesorELayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

router.get('/Agenda',usuarioLogeado,(req,res)=>{
    res.render('citas/agenda',{layout:'AsesorELayout.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

// Usuarios
router.get('/Usuarios',usuarioLogeado,(req,res)=>{
    res.render('usuarios/listar-usuarios',{layout:'AsesorELayout.hbs', Usuarios: true , session: req.session.datos_usuario })
});

router.get('/Usuarios/Registro',usuarioLogeado,(req,res)=>{
    res.render('usuarios/registrar-usuarios',{layout:'AsesorELayout.hbs', Registrar_Usuarios: true , session: req.session.datos_usuario })
});

// Notificaciones
router.get('/Notificaciones',usuarioLogeado,(req,res)=>{
    res.render('notificaciones/listar-notifiaciones',{layout:'AsesorELayout.hbs', Notificaciones: true , session: req.session.datos_usuario })
});


module.exports = router;

