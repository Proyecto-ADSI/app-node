ObtenerSession().then((data) => {
  let Id_Rol = parseInt(data.session.Id_Rol);
  switch (Id_Rol) {
    case 1:
      clientesSocket = io("/Clientes");
      clientesSocket.on("Notificar", function () {
        ListarNotificacionesNoLeidas();
      });
      //   citasSocket = io("/Citas");
      break;
    case 2:
      clientesSocket = io("/Clientes");
      clientesSocket.on("Notificar", function () {
        ListarNotificacionesNoLeidas();
      });
      //   citasSocket = io("/Citas");
      break;

    default:
      break;
  }
});
