// Para editar
var Id_UsuarioDetalle;
var Id_EmpleadoDetalle;
var datos = null;
CargarDatosModalDetalles = (Informacion) => {
  datos = Informacion;
  Id_EmpleadoEditar = Informacion.Id_Empleado;
  // Imagen
  let img = document.createElement("IMG");
  img.setAttribute("class", "img-thumbnail");
  img.setAttribute("width", "300");
  img.src = `${URL}/Images/Usuarios/${Informacion.Imagen}`;
  $("#imgDetalleUsuario").html(img);
  // Llenar detalles empleado

  if (Informacion.Id_Rol == "5") {
    $("#DetalleNormal").attr("style", "display:none");
    $("#DetalleOperador").removeAttr("style");
    $("#txtNombreDetalle_O").text(Informacion.Nombre);
    $("#txtCorreoDetalle_O").text(Informacion.Correo);
    $("#txtUsuarioDetalle_O").text(Informacion.Usuario);
    $("#txtRolDetalle_O").text(Informacion.Rol);
    $("#txtConexionDetalle_O").text(Informacion.Conexion);
    if (Informacion.Estado_Usuario == 1) {
      $("#txtEstadoDetalle_O").text("Habilitado");
    } else {
      $("#txtEstadoDetalle_O").text("Inhabilitado");
    }
  } else {
    $("#DetalleOperador").attr("style", "display:none");
    $("#DetalleNormal").removeAttr("style");
    $("#txtNombreDetalle").text(Informacion.Nombre_Completo);
    $("#txtCorreoDetalle").text(Informacion.Correo);
    $("#txtTipoDocumentoDetalle").text(Informacion.Tipo_Documento);
    $("#txtDocumentoDetalle").text(Informacion.Documento);
    $("#txtSexoDetalle").text(Informacion.Sexo);
    $("#txtCelularDetalle").text(Informacion.Celular);
    $("#txtTurnoDetalle").text(Informacion.Turno);
    $("#txtUsuarioDetalle").text(Informacion.Usuario);
    $("#txtRolDetalle").text(Informacion.Rol);
    $("#txtConexionDetalle").text(Informacion.Conexion);
    if (Informacion.Estado_Usuario == 1) {
      $("#txtEstadoDetalle").text("Habilitado");
    } else {
      $("#txtEstadoDetalle").text("Inhabilitado");
    }
  }

  // Mostrar Modal con formulario para editar
  $(".ModalDetallesUsuarios").modal("show");
};

MostrarModalEditar = () => {
  $(".ModalDetallesUsuarios").modal("hide");
  CargarDatosModalEditar(datos);
};
