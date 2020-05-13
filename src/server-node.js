const express = require("express");
const path = require("path");
const socket = require("socket.io");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
var cookieParser = require('cookie-parser');


//*** Inicializaciones ***/ 
const app = express();

//*** Configuraciones ***/ 
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "eskatemp",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    // helpers: require('./lib/handlebars')
  })
);
app.set("view engine", ".hbs");

//*** Middlewares ***/ 
// Ver peticiones en consola.
app.use(morgan("dev"));
// Recibir datos de peticiones
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Acceder a la cookie del navegador.
app.use(cookieParser());
// Inicializar sesión
app.use(session({
  // Nombre de la cookie
  key: 'user_sid',
  // Cada sesión se guarda de manera única.
  secret: "Call-Phone-Soft-Session",
  // Que se inicialice.
  saveUninitialized: false,
  // Que se vuelva a guardar.
  resave: false,
  }
));

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.datos_usuario) {
      res.clearCookie('user_sid');        
  }
  next();
});


//*** Rutas ***/ 
// Ruta inicial
app.use(require("./routes/index"));
// Ruta de logeo y cerrar sesión
app.use(require("./routes/autenticacion"));
// Rutas Admin
app.use("/App/Admin", require("./routes/rutas-admin"));
// Rutas Coordinador
app.use('/App/Coordinador',require('./routes/rutas-coordinador'));
// // Rutas Contact
app.use('/App/Contact',require('./routes/rutas-contact'));
// // Rutas AsesorI
app.use('/App/AsesorI',require('./routes/rutas-asesorI'));
// // Rutas AsesorE
app.use('/App/AsesorE',require('./routes/rutas-asesorE'));
// // Rutas GestionC
// app.use('/App/GestionC',require('./routes/rutas-gestionC'));

// Código público (accesible para el navegador)
app.use(express.static(path.join(__dirname, "public")));

// Guardar y arrancar servidor
const server = app.listen(app.get("port"), () => {
  console.log("Servidor node: ", app.get("port"));
});

// Pasar socket al servidor
const io = socket(server);

// Métodos Socket.io
io.on("connection", (socket) => {
  console.log("Socket conectado:", socket.id);

  socket.on("chat:message", function (data) {
    io.sockets.emit("chat:message", data);
  });

  socket.on("chat:typing", function (data) {
    socket.broadcast.emit("chat:typing", data);
  });
});  
