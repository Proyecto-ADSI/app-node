const express = require("express");
const router = express.Router();
const {usuarioLogeado,redireccionarUsuario} = require("../lib/validar-session");

router.get("/Login",redireccionarUsuario, (req, res) => {
  res.render("home/login");
});

router.post("/Login", (req, res) => {
  // app.locals.session = req.body;
  req.session.datos_usuario = req.body;
  res.send({ ok: true });
});

router.get("/Logout", usuarioLogeado, (req, res) => {
  // delete app.locals.session
  res.clearCookie('user_sid');
  res.redirect("/Login");
});

module.exports = router;