const express = require('express');
const router = express.Router();
const {usuarioLogeado} = require("../lib/validar-session");

// AsesorInterno
// Citas
router.get('/Citas',usuarioLogeado,(req,res)=>{
    res.render('citas/listar-citas',{layout:'AsesorInterno.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

router.get('/Agenda',usuarioLogeado,(req,res)=>{
    res.render('citas/agenda',{layout:'AsesorInterno.hbs', Llamada_NP: true , session: req.session.datos_usuario })
});

module.exports = router;
