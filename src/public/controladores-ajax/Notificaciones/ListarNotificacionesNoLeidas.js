ListarNotificacionesNoLeidas = () => {
  ObtenerSession().then((data) => {
    let Id_Usuario = data.session.Id_Usuario;
    $.ajax({
      url: `${URL}/Notificaciones/NoLeidas/${Id_Usuario}`,
      type: "get",
      datatype: "json",
      success: function (datos) {
        let notificaciones = datos.data;
        let cantidad = notificaciones.length;

        if (cantidad > 0) {
          $("#numNotificaciones").removeAttr("style");
          $("#numNotificaciones").text(cantidad);
        }

        $("#ContenedorNotificaciones").empty();

        // Íconos  
        let usuarios = '<i class="mdi mdi-account-plus"></i>';
        let clientes = '<i class="fa fa-building-o"></i>';
        let llamadas = '<i class="fa fa-phone"></i>';
        let citas = '<i class="mdi mdi-calendar-clock"></i>';
        let visitas = '<i class="mdi mdi-map-marker-radius"></i>';

        for (let item of notificaciones) {

            let icono = null;
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
                default:
                    break;
            }
            
          $("#ContenedorNotificaciones").prepend(`
                <a href="#" Id_NU="${item.Id_NU}">
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
                </a>
            `);
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
};

ListarNotificacionesNoLeidas();
