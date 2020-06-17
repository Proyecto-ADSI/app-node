// Para editar
var InformacionCliente;
$(function () {
  $("#ValServiciosFijos").removeAttr("style");
  $("#Datos_Validacion").removeAttr("style");
  $("#Tabla_Detalle_Lineas_D").removeAttr("style");

  DataTableServiciosDetalle = $("#DataTableServiciosDetalle")
    .DataTable({
      responsive: true,
      columns: [
        {
          render: function (data, type, row) {
            let text = "";
            if (data == "0") {
              text = NA;
            } else {
              text = data;
            }
            return text;
          },
        },
        {
          render: function (data, type, row) {
            return data;
          },
        },
        {
          render: function (data, type, row) {
            if (data == NA) {
              return data;
            }
            let text = data + " GB";
            return text;
          },
        },
        {
          render: function (data, type, row) {
            return data;
          },
        },
        {
          render: function (data, type, row) {
            return data;
          },
        },
        {
          render: function (data, type, row) {
            if (type === "display") {
              if (data == NA) {
                return data;
              }
              let html = "";
              for (let item of data) {
                html =
                  html +
                  `
                  <div class="label label-table text-center" style="background-color:#00897b">
                  ${item}
                  </div>
                `;
              }
              return html;
            } else {
              let text = "";
              for (let item of data) {
                text = text + ", " + item;
              }
              return text;
            }
          },
        },
        {
          render: function (data, type, row) {
            if (type === "display") {
              if (data == NA) {
                return data;
              }
              let html = "";
              for (let item of data) {
                html =
                  html +
                  `
                  <div class="label label-table text-center" style="background-color:#00897b">
                  ${item}
                  </div>
                `;
              }
              return html;
            } else {
              return data;
            }
          },
        },
        {
          render: function (data, type, row) {
            return data;
          },
        },
        {
          render: function (data, type, row) {
            if (type === "display") {
              if (data == NA) {
                return data;
              }
              let html = "";
              for (let item of data) {
                html =
                  html +
                  `
                  <div class="label label-table text-center" style="background-color:#00897b">
                  ${item}
                  </div>
                `;
              }
              return html;
            } else {
              return data;
            }
          },
        },
      ],
      language: {
        lengthMenu: "Mostrar _MENU_ registros",
        zeroRecords: "No se encontraron resultados",
        info:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
        infoFiltered: "(filtrado de un total de _MAX_ registros)",
        sSearch: "Buscar:",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        sProcessing: "Procesando...",
      },
    })
    .columns.adjust()
    .responsive.recalc();
});

CargarDatosModalDetalles = (Informacion) => {
  // Llenar detalles cliente
  InformacionCliente = Informacion;
  $("#txtRazon_Social_D").text(Informacion.Razon_Social);

  let telefono = Informacion.Telefono;
  if (Informacion.Extension !== null) {
    telefono = telefono + "  Ext " + Informacion.Extension;
  }
  $("#txtTelefono_D").text(telefono);
  $("#txtNIT_D").text(Informacion.NIT_CDV);
  $("#txtEncargado_D").text(Informacion.Encargado);
  $("#txtCorreo_D").text(Informacion.Correo);
  $("#txtCelular_D").text(Informacion.Celular);
  $("#txtPais_D").text(Informacion.Nombre_Pais);
  $("#txtDepartamento_D").text(Informacion.Nombre_Departamento);
  $("#txtMunicipio_D").text(Informacion.Nombre_Municipio);
  $("#txtTipo_D").text(Informacion.SubTipo);
  $("#txtBarrio_Vereda_D").text(Informacion.Nombre_Barrio_Vereda);
  $("#txtDireccion_D").text(Informacion.Direccion);
  $("#txtOperador_tbl_Lineas_D").text(Informacion.Nombre_Operador);
  $("#txtCalificacion_D").text(Informacion.Calificacion);
  if (Informacion.Razones == ",") {
    $("#txtRazones_D").text(NA);
  } else {
    $("#txtRazones_D").text(Informacion.Razones);
  }
  // Datatable servicios fijos
  if (Informacion.Servicios_Fijos) {
    $("#ValNoServicios1Detalle").css("display", "none");
    $("#ValServiciosFijosDetalle").removeAttr("style");
    let serviciosFijos = Informacion.Servicios_Fijos;
    $("#ServiciosFijosDetalle").empty();
    let itemsServiciosFijos = [];
    if (serviciosFijos.Pagina_Web == "1") {
      itemsServiciosFijos.push("Página web");
    }
    if (serviciosFijos.Correo_Electronico == "1") {
      itemsServiciosFijos.push("Correo");
    }
    if (serviciosFijos.IP_Fija == "1") {
      itemsServiciosFijos.push("IP Fija");
    }
    if (serviciosFijos.Dominio == "1") {
      itemsServiciosFijos.push("Dominio");
    }
    if (serviciosFijos.Telefonia == "1") {
      itemsServiciosFijos.push("Telefonía");
    }
    if (serviciosFijos.Television == "1") {
      itemsServiciosFijos.push("Televisión");
    }

    for (let item of itemsServiciosFijos) {
      $("#ServiciosFijosDetalle").append(
        `
      <label class="ServiciosFijosItems" for="checkDetalle_telefonia"><i class="mdi mdi-bookmark-check"></i>
        ${item}
      </label>
      `
      );
    }
  } else {
    $("#ValServiciosFijosDetalle").css("display", "none");
    $("#ValNoServicios1Detalle").removeAttr("style");
  }

  // Datatable servicios móviles.
  if (Informacion.Servicios_Moviles) {
    $("#Datos_Validacion").css("display", "none");
    $("#ValNoServicios2Detalle").css("display", "none");
    $("#Tabla_Detalle_Lineas_D").removeAttr("style");

    dataSet = Informacion.Servicios_Moviles;

    if (dataSet.length > 0) {
      DataTableServiciosDetalle.clear().draw();
      for (let servicio of dataSet) {
        let arrayStringRedes = servicio.Redes_Sociales;
        let arrayStringMinutosLDI = servicio.Minutos_LDI;
        let arrayStringServAd = servicio.Servicios_Adicionales;
        arrayStringRedes = getArrayStringDetalle(servicio.Redes_Sociales);
        if (arrayStringRedes.length == 0) {
          arrayStringRedes = NA;
        }
        arrayStringMinutosLDI = getArrayStringDetalle(servicio.Minutos_LDI);
        if (arrayStringMinutosLDI.length == 0) {
          arrayStringMinutosLDI = NA;
        }
        arrayStringServAd = getArrayStringDetalle(
          servicio.Servicios_Adicionales
        );
        if (arrayStringServAd.length == 0) {
          arrayStringServAd = NA;
        }
        let data = [
          servicio.Linea,
          servicio.Cargo_Basico,
          servicio.Navegacion,
          servicio.Minutos,
          servicio.Mensajes,
          arrayStringRedes,
          arrayStringMinutosLDI,
          servicio.Cantidad_LDI,
          arrayStringServAd,
        ];
        DataTableServiciosDetalle.row.add(data).draw();
      }
      DataTableServiciosDetalle.responsive.recalc();
    }
  } else {
    $("#Tabla_Detalle_Lineas_D").css("display", "none");
    if (
      Informacion.Cantidad_Total_Lineas == "0" ||
      Informacion.Valor_Total_Mensual == "0"
    ) {
      $("#Datos_Validacion").css("display", "none");
      $("#ValNoServicios2Detalle").removeAttr("style");
    } else {
      $("#ValNoServicios2Detalle").css("display", "none");
      $("#Datos_Validacion").removeAttr("style");
      $("#txtCantidad_Lineas2_D").text(Informacion.Cantidad_Total_Lineas);
      $("#txtValor_Mensual2_D").text(Informacion.Valor_Total_Mensual);
    }
  }

  let Id_Plan_Corporativo = parseInt(Informacion.Id_Plan_Corporativo);
  let Id_Documentos = parseInt(Informacion.Id_Documentos);
  // Validar si tiene plan corporativo.
  if (Id_Plan_Corporativo > 0) {
    $("#Menu_Plan").removeAttr("style");

    let clausula = parseInt(Informacion.Clausula_Permanencia);

    if (clausula == 1) {
      $("#txtClausulaPermanencia_D").text("Si");
    } else {
      $("#txtClausulaPermanencia_D").text("No");
    }

    $("#txtFecha_Inicio_D").text(Informacion.Fecha_Inicio);
    $("#txtFecha_Fin_D").text(Informacion.Fecha_Fin);
    $("#txtDescripcion_D").text(Informacion.Descripcion);

    if (Id_Documentos > 0) {
      $("#Menu_Doc").removeAttr("style");
      $("#linkCedula_D").empty();
      $("#linkCedula_D").append(`
                <a href="${URL}/Doc/${Informacion.Cedula_RL}"target="_blank""" class="btn btn-primary">Descargar</a>
            `);
      $("#linkCamara_D").empty();
      $("#linkCamara_D").append(`
                <a href="${URL}/Doc/${Informacion.Camara_Comercio}"target="_blank""" class="btn btn-primary">Descargar</a>
            `);
      $("#linkSoporte_D").empty();
      $("#linkSoporte_D").append(`
                <a href="${URL}/Doc/${Informacion.Soporte_Ingresos}"target="_blank""" class="btn btn-primary">Descargar</a>
            `);

      if (Informacion.Detalles_Plan_Corporativo != null) {
        $("#ValidacionAnexos_D").empty();
        $("#ValidacionAnexos_D").append(`
            <div class="form-group">
                    <label class="font-weight-bold text-right">
                    Anexos Corporativo
                    </label>
                    <p  class="form-control-static">
                    <a href="${URL}/Doc/${Informacion.Detalles_Plan_Corporativo}"target="_blank""" class="btn btn-primary">Descargar</a>
                    </p>
            </div>
        `);
      }

      if (Informacion.Oferta != null) {
        $("#ValidacionOferta_D").empty();
        $("#ValidacionOferta_D").append(`
            <div class="form-group">
                    <label class="font-weight-bold text-right">
                    Oferta
                    </label>
                    <p  class="form-control-static">
                    <a href="${URL}/Doc/${Informacion.Oferta}"target="_blank""" class="btn btn-primary">Descargar</a>
                    </p>
            </div>
        `);
      }
    } else {
      $("#Menu_Doc").css("display", "none");
    }

    // Validar que se haya hecho el cambio de corporativo
    // $("#Menu_Comp").removeAttr('style');
  } else {
    $("#Menu_Plan").css("display", "none");
    $("#Menu_Doc").css("display", "none");
    $("#Menu_Comp").css("display", "none");
  }
  // Mostrar Modal con formulario para editar
  $(".ModalDetalles").modal("show");
};

RedirigirFormEditar = () => {
  sessionStorage.DatosEditarCliente = JSON.stringify(InformacionCliente);
  Redireccionar("/Directorio/Editar");
};
LlamarClienteRegistrado = () => {
  // Valid
};

let getArrayStringDetalle = (string) => {
  let regex = /("[^"]*"|[^,]*),/g;
  let arrayString = string.match(regex);

  let arrayStringFormatiado = [];

  for (let string of arrayString) {
    if (string !== ",") {
      let nuevoString = string.trim();
      nuevoString = nuevoString.replace(/,/g, "");
      arrayStringFormatiado.push(nuevoString);
    }
  }

  return arrayStringFormatiado;
};

$(".ModalDetalles").on("shown.bs.modal", function (e) {
  DataTableServiciosDetalle.responsive.recalc();
});
$("#Menu_DBL").click(function () {
  setTimeout(function () {
    DataTableServiciosDetalle.responsive.recalc();
  }, 100);
});
