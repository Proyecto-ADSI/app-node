GuardarNotificaciones = (guardar, cargar) => {
  if (guardar) {
    ObtenerSession().then((data) => {
      let Id_Usuario = data.session.Id_Usuario;
      $.ajax({
        url: `${URL}/Notificaciones/NoVisitadas/${Id_Usuario}`,
        type: "get",
        datatype: "json",
        success: function (datos) {
          let notificaciones = datos.data;
          sessionStorage.Notificaciones = JSON.stringify(notificaciones);
          if (cargar) {
            CargarNotificacionesNoVisitadas();
          }
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  } else {
    if (cargar) {
      CargarNotificacionesNoVisitadas();
    }
  }
};

let CargarNotificacionesNoVisitadas = () => {
  let notificaciones = JSON.parse(sessionStorage.getItem("Notificaciones"));

  if (notificaciones != null) {
    let cantidad = 0;

    $("#ContenedorNotificaciones").empty();

    // Íconos
    let usuarios = '<i class="mdi mdi-account-plus"></i>';
    let clientes = '<i class="fa fa-building-o"></i>';
    let llamadas = '<i class="fa fa-phone"></i>';
    let citas = '<i class="mdi mdi-calendar-clock"></i>';
    let visitas = '<i class="mdi mdi-map-marker-radius"></i>';
    let noticias = '<i class="mdi mdi-message-text"></i>';

    for (let item of notificaciones) {
      let icono = "";
      let Id_Categoria = parseInt(item.Id_Categoria_N);
      switch (Id_Categoria) {
        case 1:
          icono = usuarios;
          break;
        case 2:
          icono = clientes;
          break;
        case 3:
          icono = llamadas;
          break;
        case 4:
          icono = citas;
          break;
        case 5:
          icono = visitas;
          break;
        case 6:
          icono = noticias;
          break;
        default:
          break;
      }

      let fondo = "";
      if (item.Estado_Lectura == "0") {
        fondo = "style='background-color: #b2e4da'";
        $("#numNotificaciones").removeAttr("style");
        $("#numNotificaciones2").removeAttr("style");
        cantidad++;
        $("#numNotificaciones").text(cantidad);
        $("#numNotificaciones2").text(cantidad);
      }
      $("#ContenedorNotificaciones").append(`
        <div id="itemNotificacion" class="itemNotificacion" id_nu="${item.Id_NU}" id_categoria="${Id_Categoria}" id_notificacion_registro="${item.Id_Registro}" ${fondo}>
            <div class="btn MyStyle_Notificacion fondo-verde btn-circle">
                ${icono}
            </div>
            <div class="mail-contnet">
                <h5> ${item.Usuario}</h5>
                <span class="mail-desc">
                    ${item.Mensaje}
                </span>
                <span class="time">
                    ${item.Fecha_Notificacion}
                </span>
            </div>
        </div>
    `);
    }

    $("#itemNotificacion").click(function () {
      let IdNU = parseInt($(this).attr("id_nu"));
      let IdCategoria = parseInt($(this).attr("id_categoria"));
      let IdRegistroNotificacion = $(this).attr("id_notificacion_registro");
      VerDetalleNotificacion(IdRegistroNotificacion, IdNU, IdCategoria);
    });
  }
};

let VerDetalleNotificacion = (IdRegistroNotificacion, IdNU, IdCategoria) => {
  sessionStorage.IdRegistroNotificacion = IdRegistroNotificacion;
  sessionStorage.IdNU = IdNU;
  switch (IdCategoria) {
    case 1:
      Redireccionar("/Usuarios");
      break;
    case 2:
      Redireccionar("/Directorio");
      break;
    case 3:
      Redireccionar("/Llamadas");
      break;
    case 4:
      Redireccionar("/Citas");
      break;
    case 5:
      Redireccionar("/Citas");
      break;
    case 6:
      Redireccionar("/Noticias");
      break;
    default:
      break;
  }
};

let CambiarEstadoVisitaNotificacion = () => {
  let Id_NU = parseInt(sessionStorage.getItem("IdNU"));
  $.ajax({
    url: `${URL}/Notificaciones/EstadoVisita/${Id_NU}`,
    type: "patch",
    datatype: "json",
    success: function(){
      GuardarNotificaciones(true, true);
    },
    error: function (error) {
      console.log(error);
    },
  });
  sessionStorage.removeItem("IdNU");
};

let OcultarContador = () => {
  $("#numNotificaciones").text("0");
  $("#numNotificaciones2").text("0");
  $("#numNotificaciones").attr("style", "display:none");
  $("#numNotificaciones2").attr("style", "display:none");
};
// Eventos de escucha.
$("#iconNotificaciones").click(function () {
  let cantidad = parseInt($("#numNotificaciones").text());
  if (cantidad > 0) {
    OcultarContador();
    ObtenerSession().then((data) => {
      let Id_Usuario = data.session.Id_Usuario;
      $.ajax({
        url: `${URL}/Notificaciones/EstadoLectura/${Id_Usuario}`,
        type: "patch",
        datatype: "json",
        success: function (datos) {
          if (datos.data.ok) {
            GuardarNotificaciones(true, false);
          }
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  } else {
    CargarNotificacionesNoVisitadas();
  }
});

let notificaciones = JSON.parse(sessionStorage.getItem("Notificaciones"));
if (notificaciones != null) {
  GuardarNotificaciones(false, true);
}else{
  GuardarNotificaciones(true, true);
}

