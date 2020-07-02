let InicializarOfertaPersonalizada = () => {
  // Inicializar elementos
  $("#txtDetalleMinutosLDI_OP").select2({
    tags: true,
    tokenSeparators: [","],
  });
  $("#txtDetalle_ServiciosI_OP").select2({
    tags: true,
    tokenSeparators: [","],
  });
  $("#txtDetalle_ServiciosA_OP").select2({
    tags: true,
    tokenSeparators: [","],
  });

  // LLenar selects
  let arrayOpciones = JSON.parse(sessionStorage.getItem("Opciones"));
  if (arrayOpciones.length > 0) {
    for (let item of arrayOpciones) {
      let data = {
        id: `${item.Opcion}`,
        text: `${item.Opcion}`,
      };
      let newOption = new Option(data.text, data.id, false, false);
      if (item.Categoria == "País LDI") {
        $("#txtDetalleMinutosLDI_OP").append(newOption).trigger("change");
      }
      if (item.Categoria == "Servicios ilimitados") {
        $("#txtDetalle_ServiciosI_OP").append(newOption).trigger("change");
      }
      if (item.Categoria == "Servicios adicionales") {
        $("#txtDetalle_ServiciosA_OP").append(newOption).trigger("change");
      }
    }
  }

  DataTableOP = $("#DataTableOP")
    .DataTable({
      responsive: true,
      columns: [
        {
          render: function (data, type, row) {
            let text = data + " líneas";
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
            if (data == "") {
              return NA;
            }
            let text = data + " GB";
            return text;
          },
        },
        {
          render: function (data, type, row) {
            if (data == "") {
              return NA;
            }
            return data;
          },
        },
        {
          render: function (data, type, row) {
            if (data == "") {
              return NA;
            }
            return data;
          },
        },
        {
          render: function (data, type, row) {
            if (type === "display") {
              if (data.length == 0) {
                return NA;
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
              if (data.length == 0) {
                return NA;
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
            if (data == "") {
              return NA;
            }
            return data;
          },
        },
        {
          render: function (data, type, row) {
            if (type === "display") {
              if (data.length == 0) {
                return NA;
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
            if (type === "display") {
              return `
                      <button type="button" id="ServiciosMovilesEliminarOP" id_linea="${data}"
                        class="btn btn-danger btn-sm"><i class="fa fa-close"></i>
                      </button>
                    `;
            } else {
              return data;
            }
          },
        },
      ],
      columnDefs: [
        { responsivePriority: 1, targets: 0 },
        { responsivePriority: 2, targets: -1 },
      ],
      language: {
        lengthMenu: "Mostrar _MENU_ registros",
        zeroRecords: "No se encontraron resultados",
        info:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        infoPmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
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

  if (localStorage.ServiciosMovilesOP) {
    ListarServiciosMovilesOP();
  }
  // Botones servicios móviles
  $("#btnLimpiar_OP").click(function () {
    $("input:radio[name='rbtnCardServicios']").prop("checked", false);
    $(".details.show").removeClass("show");
    LimpiarFormServiciosMovilesOP();
    CambiarEstadoFormOP(true);
  });

  $("#btnGuardar_OP").click(function () {
    form.validate().settings.ignore = ":disabled,:hidden, .valDetalle";
    if (form.valid()) {
      $("#txtDetalleId_OP").val() == "0"
        ? RegistrarServiciosMovilesOP()
        : EditarServiciosMovilesOP();

      // Eliminar línea.
      EliminarServiciosMovilesOP();
    }
  });
  // Formatear números
  FormatearNumerosInput("#txtDetalle_Valor_Mensual_OP");
  // Validación minutos ilimitados.
  $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OP]").change(
    function () {
      if ($(this).is(":checked")) {
        $("#txtDetalle_Minutos_OP").prop("disabled", true);
      } else {
        $("#txtDetalle_Minutos_OP").prop("disabled", false);
      }
    }
  );
  // Validación mensajes ilimitados.
  $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OP]").change(
    function () {
      if ($(this).is(":checked")) {
        $("#txtDetalle_Mensajes_OP").prop("disabled", true);
      } else {
        $("#txtDetalle_Mensajes_OP").prop("disabled", false);
      }
    }
  );
  // Validación minutos LDI
  $("#txtDetalleMinutosLDI_OP").on("change", function (e) {
    let minutosLDI = $("#txtDetalleMinutosLDI_OP").val();
    if (minutosLDI.length > 0) {
      $("#txtDetalle_Cantidad_LDI_OP").removeAttr("disabled");
    } else {
      $("#txtDetalle_Cantidad_LDI_OP").attr("disabled", true);
    }
  });

  // Generar alerta de que se tiene que seleccionar grupo de
  // líneas, para habilitar los campos del formulario.

  $(".OfertaPClick").on("click", function () {
    if ($(this).is("[readonly]")) {
      GenerarAlertasToast(7);
    }
  });

  CambiarEstadoFormOP(true);
};

// *********************************************
// CRUD SERVICIOS MÓVILES OFERTA PERSONALIZADA
// *********************************************

let RegistrarServiciosMovilesOP = () => {
  $("#tabOfertaE").attr("style", "display:none");
  $("#Pseudo_tabOfertaE").removeAttr("style");
  let ServiciosMoviles = [];
  if (localStorage.ServiciosMovilesOP) {
    ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMovilesOP"));
  }

  // Servicios móviles
  let arrayDetalleLinea = GetDataServiciosMovilesOP(true);

  ServiciosMoviles.push(arrayDetalleLinea);
  localStorage.ServiciosMovilesOP = JSON.stringify(ServiciosMoviles);

  // Crear comparativo
  let arrayComparativo = [];
  if (localStorage.Comparativo) {
    arrayComparativo = JSON.parse(localStorage.Comparativo);
  }

  let itemComparativo = {
    Id_ServiciosCliente: $(
      "input:radio[name='rbtnCardServicios']:checked"
    ).val(),
    Id_ServiciosOferta: arrayDetalleLinea.id,
  };
  arrayComparativo.push(itemComparativo);
  localStorage.Comparativo = JSON.stringify(arrayComparativo);
  // Agergar ícono mark
  $(
    `input:radio[name='rbtnCardServicios'][value='${itemComparativo.Id_ServiciosCliente}']`
  )
    .parents(".CardServicios")
    .children(".icono_mark")
    .addClass("show");
  $("input:radio[name='rbtnCardServicios']").prop("checked", false);
  $(".details.show").removeClass("show");
  CambiarEstadoFormOP(true);
  LimpiarFormServiciosMovilesOP();
  ListarServiciosMovilesOP();
};

// Set data on form
let SetDataServiciosMovilesOP = () => {
  $(document).on(
    "change",
    "input:radio[name='rbtnCardServicios']",
    function () {
      // $("#valSiComparativo").removeAttr("style");
      // $("#valNoComparativo").attr("style", "display:none");
      CambiarEstadoFormOP(false);
      $(".details.show").removeClass("show");
      let detalle = $(this).parents(".details");
      $(detalle).addClass("show");
      let Id_SC = $(this).val();
      let InfoSC = null;
      let arrayServiciosCliente = JSON.parse(localStorage.ServiciosMoviles);
      for (let serviciosCliente of arrayServiciosCliente) {
        if (serviciosCliente.id == Id_SC) {
          InfoSC = serviciosCliente;
        }
      }
      if (localStorage.Comparativo) {
        let Id_SO = null;
        let dataSO = null;
        let arrayComparativo = JSON.parse(localStorage.Comparativo);

        for (let itemComparativo of arrayComparativo) {
          if (itemComparativo.Id_ServiciosCliente == Id_SC) {
            Id_SO = itemComparativo.Id_ServiciosOferta;
          }
        }

        let arrayServiciosOfertaP = JSON.parse(localStorage.ServiciosMovilesOP);

        for (let itemSC of arrayServiciosOfertaP) {
          if (itemSC.id == Id_SO) {
            dataSO = itemSC;
          }
        }
        if (dataSO !== null) {
          $("#txtDetalleId_OP").val(dataSO.id);
          $("#txtDetalle_Cantidad_Lineas_OP").val(dataSO.cantidadLineas);
          // $("#txtDetalle_Cantidad_Lineas_OP").attr("id_linea", dataSO.id);
          $("#txtDetalle_Valor_Mensual_OP").val(dataSO.cargoBasicoMensual);
          $("#txtDetalle_radio2").prop("checked", true);
          $("#txtDetalleNavegacion_OP").val(dataSO.navegacion);
          if (dataSO.minutos === "Ilimitados") {
            if (
              !$("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OP]").is(
                ":checked"
              )
            ) {
              $(
                "input:checkbox[name=txtDetalle_Validacion_Ilimitados_OP]"
              ).trigger("click");
            }
          } else {
            if (
              $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OP]").is(
                ":checked"
              )
            ) {
              $(
                "input:checkbox[name=txtDetalle_Validacion_Ilimitados_OP]"
              ).trigger("click");
            }
            $("#txtDetalle_Minutos_OP").val(dataSO.minutos);
          }
          if (dataSO.mensajes === "Ilimitados") {
            if (
              !$(
                "input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OP]"
              ).is(":checked")
            ) {
              $(
                "input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OP]"
              ).trigger("click");
            }
          } else {
            if (
              $(
                "input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OP]"
              ).is(":checked")
            ) {
              $(
                "input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OP]"
              ).trigger("click");
            }
            $("#txtDetalle_Mensajes_OP").val(dataSO.mensajes);
          }
          if (dataSO.minutosLDI.length > 0) {
            $("#txtDetalleMinutosLDI_OP")
              .val(dataSO.minutosLDI)
              .trigger("change");
            $("#txtDetalle_Cantidad_LDI_OP").val(dataSO.cantidadLDI);
          }
          if (dataSO.serviciosIlimitados.length > 0) {
            $("#txtDetalle_ServiciosI_OP")
              .val(dataSO.serviciosIlimitados)
              .trigger("change");
          }
          if (dataSO.serviciosAdicionales.length > 0) {
            $("#txtDetalle_ServiciosA_OP")
              .val(dataSO.serviciosAdicionales)
              .trigger("change");
          }
        } else {
          LimpiarFormServiciosMovilesOP();
          $("#txtDetalle_Cantidad_Lineas_OP").val(InfoSC.cantidadLineas);
        }
      } else {
        LimpiarFormServiciosMovilesOP();
        $("#txtDetalle_Cantidad_Lineas_OP").val(InfoSC.cantidadLineas);
      }
      // let data = DataTableOP.row($(this).parents("tr")).data();
    }
  );
};

// Get data form
let GetDataServiciosMovilesOP = (registrar, lineas) => {
  let arrayDetalleLinea = null;
  let cargobasico = QuitarComas($("#txtDetalle_Valor_Mensual_OP").val());
  cargobasico = parseFloat(cargobasico);
  cargobasico = AgregarComas(cargobasico);
  let cantidadLineas = parseInt($("#txtDetalle_Cantidad_Lineas_OP").val());

  let minutos = "";
  if (
    $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OP]").is(":checked")
  ) {
    minutos = "Ilimitados";
  } else {
    minutos = $("#txtDetalle_Minutos_OP").val();
  }

  let mensajes = "";
  if (
    $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OP]").is(
      ":checked"
    )
  ) {
    mensajes = "Ilimitados";
  } else {
    mensajes = $("#txtDetalle_Mensajes_OP").val();
  }

  let minutosLDI = $("#txtDetalleMinutosLDI_OP").val();
  let cantidadLDI = "";
  if (minutosLDI.length > 0) {
    cantidadLDI = $("#txtDetalle_Cantidad_LDI_OP").val();
  }

  if (registrar) {
    arrayDetalleLinea = {
      id: uuid.v4(),
      cantidadLineas: cantidadLineas,
      cargoBasicoMensual: cargobasico,
      navegacion: $("#txtDetalleNavegacion_OP").val(),
      minutos: minutos,
      mensajes: mensajes,
      serviciosIlimitados: $("#txtDetalle_ServiciosI_OP").val(),
      minutosLDI: minutosLDI,
      cantidadLDI: cantidadLDI,
      serviciosAdicionales: $("#txtDetalle_ServiciosA_OP").val(),
    };
  } else {
    arrayDetalleLinea = {
      id: lineas.id,
      grupo: lineas.grupo,
      NumerosLineas: lineas.NumerosLineas,
      id_lineas: lineas.id_lineas,
      cantidadLineas: cantidadLineas,
      cargoBasicoMensual: cargobasico,
      navegacion: $("#txtDetalleNavegacion_OP").val(),
      minutos: minutos,
      mensajes: mensajes,
      serviciosIlimitados: $("#txtDetalle_ServiciosI_OP").val(),
      minutosLDI: minutosLDI,
      cantidadLDI: cantidadLDI,
      serviciosAdicionales: $("#txtDetalle_ServiciosA_OP").val(),
    };
  }
  return arrayDetalleLinea;
};

let ListarServiciosMovilesOP = () => {
  if (localStorage.ServiciosMovilesOP) {
    DataTableOP.clear().draw();

    let ServiciosMoviles = JSON.parse(
      localStorage.getItem("ServiciosMovilesOP")
    );

    for (let servicio of ServiciosMoviles) {
      let data = [
        servicio.cantidadLineas,
        servicio.cargoBasicoMensual,
        servicio.navegacion,
        servicio.minutos,
        servicio.mensajes,
        servicio.serviciosIlimitados,
        servicio.minutosLDI,
        servicio.cantidadLDI,
        servicio.serviciosAdicionales,
        servicio.id,
      ];
      DataTableOP.row.add(data).draw();
    }
    DataTableOP.responsive.recalc();
    // SetDataServiciosMovilesOP();
    EliminarServiciosMovilesOP();
    DetalleServiciosMoviles();
  }
};

let EditarServiciosMovilesOP = () => {
  let idLinea = $("#txtDetalleId_OP").val();
  let ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMovilesOP"));
  let lineasMoviles = null;

  ServiciosMoviles.forEach(function (valor, indice, array) {
    if (valor.id == idLinea) {
      lineasMoviles = valor;
      ServiciosMoviles.splice(indice, 1);
    }
  });

  // Servicios móviles
  let arrayDetalleLinea = GetDataServiciosMovilesOP(false, lineasMoviles);

  ServiciosMoviles.push(arrayDetalleLinea);
  localStorage.ServiciosMovilesOP = JSON.stringify(ServiciosMoviles);
  $("input:radio[name='rbtnCardServicios']").prop("checked", false);
  $(".details.show").removeClass("show");
  CambiarEstadoFormOP(true);
  LimpiarFormServiciosMovilesOP();
  ListarServiciosMovilesOP();
};

let LimpiarFormServiciosMovilesOP = () => {
  $("#txtDetalleId_OP").val(0);
  $("#txtDetalle_Cantidad_Lineas_OP").val("");
  $("#txtDetalle_Cantidad_Lineas_OP").removeAttr("id_linea");
  $("#txtDetalle_Valor_Mensual_OP").val("");
  $("input:radio[name=detalleLineasRadios]:checked").prop("checked", false);
  $("#txtDetalleNavegacion_OP").val("");
  $("#txtDetalle_Minutos_OP").val("");
  if (
    $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OP]").is(":checked")
  ) {
    $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OP]").prop(
      "checked",
      false
    );
    $("#txtDetalle_Minutos_OP").prop("disabled", false);
  } else {
    $("#txtDetalle_Minutos_OP").val("");
  }
  if (
    $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OP]").is(
      ":checked"
    )
  ) {
    $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OP]").prop(
      "checked",
      false
    );
    $("#txtDetalle_Mensajes_OP").prop("disabled", false);
  } else {
    $("#txtDetalle_Mensajes_OP").val("");
  }
  $("#txtDetalleMinutosLDI_OP").val(null).trigger("change");
  $("#txtDetalle_Cantidad_LDI_OP").val("");
  $("#txtDetalle_Cantidad_LDI_OP").prop("disabled", true);
  $("#txtDetalle_ServiciosI_OP").val(null).trigger("change");
  $("#txtDetalle_ServiciosA_OP").val(null).trigger("change");

  EliminarClasesValidate("#txtDetalle_Cantidad_Lineas_OP");
  EliminarClasesValidate("#txtDetalle_Valor_Mensual_OP");
  EliminarClasesValidate("#txtDetalleNavegacion_OP");
  EliminarClasesValidate("#txtDetalle_Minutos_OP");
  EliminarClasesValidate("#txtDetalle_Mensajes_OP");
  EliminarClasesValidate("#txtDetalle_Cantidad_LDI_OP");
};

let EliminarServiciosMovilesOP = () => {
  $(document).on("click", "#ServiciosMovilesEliminarOP", function () {
    let idLinea = $(this).attr("id_linea");
    let ServiciosMoviles = JSON.parse(
      localStorage.getItem("ServiciosMovilesOP")
    );

    ServiciosMoviles.forEach(function (valor, indice, array) {
      if (valor.id == idLinea) {
        ServiciosMoviles.splice(indice, 1);
      }
    });
    localStorage.ServiciosMovilesOP = JSON.stringify(ServiciosMoviles);

    // Eliminar comparativo
    if (localStorage.Comparativo) {
      let arrayComparativo = JSON.parse(localStorage.getItem("Comparativo"));
      arrayComparativo.forEach(function (item, indice, array) {
        if (item.Id_ServiciosOferta == idLinea) {
          // Quitar ícono mark
          $(
            `input:radio[name='rbtnCardServicios'][value='${item.Id_ServiciosCliente}']`
          )
            .parents(".CardServicios")
            .children(".icono_mark")
            .removeClass("show");
          arrayComparativo.splice(indice, 1);
        }
      });
      localStorage.Comparativo = JSON.stringify(arrayComparativo);
    }

    if (ServiciosMoviles.length == 0) {
      $("#Pseudo_tabOfertaE").attr("style", "display:none");
      $("#tabOfertaE").removeAttr("style");
    }

    LimpiarFormServiciosMovilesOP();
    $("input:radio[name='rbtnCardServicios']").prop("checked", false);
    $(".details.show").removeClass("show");
    CambiarEstadoFormOP(true);
    ListarServiciosMovilesOP();
  });
};

let CambiarEstadoFormOP = (estado) => {
  $("#txtDetalle_Cantidad_Lineas_OP").prop("readOnly", estado);
  $("#txtDetalle_Valor_Mensual_OP").prop("readOnly", estado);
  $("#txtDetalleNavegacion_OP").prop("readOnly", estado);
  $("#txtDetalle_Validacion_Ilimitados_OP").prop("disabled", estado);
  $("#txtDetalle_Minutos_OP").prop("readOnly", estado);
  $("#txtDetalle_Validacion_SMSIlimitados_OP").prop("disabled", estado);
  $("#txtDetalle_Mensajes_OP").prop("readOnly", estado);
  $("#txtDetalleMinutosLDI_OP").prop("disabled", estado);
  if (estado) {
    $("#txtDetalle_Cantidad_LDI_OP").prop("disabled", estado);
  }
  $("#txtDetalle_ServiciosI_OP").prop("disabled", estado);
  $("#txtDetalle_ServiciosA_OP").prop("disabled", estado);
  $("#btnLimpiar_OP").prop("disabled", estado);
  $("#btnGuardar_OP").prop("disabled", estado);
};
