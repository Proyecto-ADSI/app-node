ObtenerSession().then((data) => {
  let Id_Rol = parseInt(data.session.Id_Rol);
  switch (Id_Rol) {
    case 1:
      clientesSocket = io("/Clientes");
      clientesSocket.on("Notificar", function () {
        GuardarNotificaciones(true, true);
      });
      clientesSocket.on("Asignacion", function () {
        let url = document.location;
        if (url.pathname == "/App/Admin/Directorio/Asignacion") {
          RecargarDataTable();
        }
      });
      usuariosSocket = io("/Usuarios");
      usuariosSocket.on("RecargarDataTableUsuarios", function () {
        RecargarDataTable();
      });
      citasSocket = io("/Citas");
      citasSocket.on("ActualizarHorasCita", function (data) {
        console.log(data);
      });
      break;
    case 2:
      clientesSocket = io("/Clientes");
      clientesSocket.on("Notificar", function () {
        GuardarNotificaciones(true, true);
      });
      clientesSocket.on("Asignacion", function () {
        let url = document.location;
        if (url.pathname == "/App/Coordinador/Directorio/Asignacion") {
          RecargarDataTable();
        }
      });

      clientesSocket = io("/Usuarios");
      clientesSocket.on("RecargarDataTableUsuarios", function () {
        RecargarDataTable();
      });
      //   citasSocket = io("/Citas");
      break;
    case 3:
      clientesSocket = io("/Clientes");
      clientesSocket.on("Notificar", function () {
        GuardarNotificaciones(true, true);
      });
      clientesSocket.on("Asignacion", function () {
        let url = document.location;
        if (url.pathname == "/App/ContactCenter/Directorio/Asignacion") {
          RecargarDataTable();
        }
      });

      citasSocket = io("/Citas");
      citasSocket.on("ActualizarHorasCita", function (data) {
        let url = document.location;
        if (url.pathname == "/App/ContactCenter/Llamadas/RegistrarP") {
          ActualizarHorasCitaSocket(data);
        }
      });
      break;

    default:
      break;
  }
});
