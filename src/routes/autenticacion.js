const express = require("express");
const router = express.Router();
const {usuarioLogeado,redireccionarUsuario} = require("../lib/validar-session");

router.get("/Login",redireccionarUsuario, (req, res) => {
  res.render("home/login",{layout: 'eskatemp.hbs'});
});

router.post("/Login", (req, res) => {
  req.session.datos_usuario = req.body;
  res.send({ ok: true });
});

router.get("/Logout", usuarioLogeado, (req, res) => {
  res.clearCookie('user_sid');
  res.redirect("/Login");
});

module.exports = router;