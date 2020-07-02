let InicializarOfertaEstandar = () => {
  // Inicializar elementos
  $("#txtDetalleMinutosLDI_OE").select2({
    tags: true,
    tokenSeparators: [","],
  });
  $("#txtDetalle_ServiciosI_OE").select2({
    tags: true,
    tokenSeparators: [","],
  });
  $("#txtDetalle_ServiciosA_OE").select2({
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
        $("#txtDetalleMinutosLDI_OE").append(newOption).trigger("change");
      }
      if (item.Categoria == "Servicios ilimitados") {
        $("#txtDetalle_ServiciosI_OE").append(newOption).trigger("change");
      }
      if (item.Categoria == "Servicios adicionales") {
        $("#txtDetalle_ServiciosA_OE").append(newOption).trigger("change");
      }
    }
  }

  DataTableOE = $("#DataTableOE")
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
                    <button type="button" id="ServiciosMovilesEditarOE" id_linea="${data}"
                      class="btn btn-info btn-sm"> <i class="fa fa-pencil"></i>
                    </button>
                    <button type="button" id="ServiciosMovilesEliminarOE" id_linea="${data}"
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

  if (localStorage.ServiciosMovilesOE) {
    ListarServiciosMovilesOE();
  }
  // Botones servicios móviles
  $("#btnLimpiar_OE").click(function () {
    LimpiarFormServiciosMovilesOE();
  });

  $("#btnGuardar_OE").click(function () {
    form.validate().settings.ignore = ":disabled,:hidden, .valDetalle";
    if (form.valid()) {
      $("#txtDetalleId_OE").val() == "0"
        ? RegistrarServiciosMovilesOE()
        : EditarServiciosMovilesOE();

      // Editar linea
      SetDataServiciosMovilesOE();
      // Eliminar línea.
      EliminarServiciosMovilesOE();
    }
  });

  // Formatear números
  FormatearNumerosInput("#txtDetalle_Valor_Mensual_OE");

  // Validación minutos ilimitados.
  $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OE]").change(
    function () {
      if ($(this).is(":checked")) {
        $("#txtDetalle_Minutos_OE").prop("disabled", true);
      } else {
        $("#txtDetalle_Minutos_OE").prop("disabled", false);
      }
    }
  );
  // Validación mensajes ilimitados.
  $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OE]").change(
    function () {
      if ($(this).is(":checked")) {
        $("#txtDetalle_Mensajes_OE").prop("disabled", true);
      } else {
        $("#txtDetalle_Mensajes_OE").prop("disabled", false);
      }
    }
  );
  // Validación minutos LDI
  $("#txtDetalleMinutosLDI_OE").on("change", function (e) {
    let minutosLDI = $("#txtDetalleMinutosLDI_OE").val();
    if (minutosLDI.length > 0) {
      $("#txtDetalle_Cantidad_LDI_OE").removeAttr("disabled");
    } else {
      $("#txtDetalle_Cantidad_LDI_OE").attr("disabled", true);
    }
  });
};

// *********************************************
// CRUD SERVICIOS MÓVILES OFERTA ESTÁNDAR
// *********************************************

let RegistrarServiciosMovilesOE = () => {
  $("#tabOfertaP").attr("style", "display:none");
  $("#Pseudo_tabOfertaP").removeAttr("style");
  let ServiciosMoviles = [];
  if (localStorage.ServiciosMovilesOE) {
    ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMovilesOE"));
  }

  // Servicios móviles
  let arrayDetalleLinea = GetDataServiciosMovilesOE(true);

  ServiciosMoviles.push(arrayDetalleLinea);
  localStorage.ServiciosMovilesOE = JSON.stringify(ServiciosMoviles);

  LimpiarFormServiciosMovilesOE();
  ListarServiciosMovilesOE();
};

// Set data on form
let SetDataServiciosMovilesOE = () => {
  $(document).on("click", "#ServiciosMovilesEditarOE", function () {
    let data = DataTableOE.row($(this).parents("tr")).data();
    $("#txtDetalleId_OE").val(data[9]);
    $("#txtDetalle_Cantidad_Lineas_OE").val(data[0]);
    $("#txtDetalle_Cantidad_Lineas_OE").attr("id_linea", data[9]);
    $("#txtDetalle_Valor_Mensual_OE").val(data[1]);
    $("#txtDetalle_radio2").prop("checked", true);
    $("#txtDetalleNavegacion_OE").val(data[2]);

    if (data[3] === "Ilimitados") {
      if (
        !$("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OE]").is(
          ":checked"
        )
      ) {
        $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OE]").trigger(
          "click"
        );
      }
    } else {
      if (
        $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OE]").is(
          ":checked"
        )
      ) {
        $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OE]").trigger(
          "click"
        );
      }
      $("#txtDetalle_Minutos_OE").val(data[3]);
    }
    if (data[4] === "Ilimitados") {
      if (
        !$("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OE]").is(
          ":checked"
        )
      ) {
        $(
          "input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OE]"
        ).trigger("click");
      }
    } else {
      if (
        $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OE]").is(
          ":checked"
        )
      ) {
        $(
          "input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OE]"
        ).trigger("click");
      }
      $("#txtDetalle_Mensajes_OE").val(data[4]);
    }

    if (data[6].length > 0) {
      $("#txtDetalleMinutosLDI_OE").val(data[6]).trigger("change");
      $("#txtDetalle_Cantidad_LDI_OE").val(data[7]);
    }
    if (data[5].length > 0) {
      $("#txtDetalle_ServiciosI_OE").val(data[5]).trigger("change");
    }
    if (data[8].length > 0) {
      $("#txtDetalle_ServiciosA_OE").val(data[8]).trigger("change");
    }
  });
};

// Get data form
let GetDataServiciosMovilesOE = (registrar, lineas) => {
  let arrayDetalleLinea = null;
  let cargobasico = QuitarComas($("#txtDetalle_Valor_Mensual_OE").val());
  cargobasico = parseFloat(cargobasico);
  cargobasico = AgregarComas(cargobasico);
  let cantidadLineas = parseInt($("#txtDetalle_Cantidad_Lineas_OE").val());

  let minutos = "";
  if (
    $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OE]").is(":checked")
  ) {
    minutos = "Ilimitados";
  } else {
    minutos = $("#txtDetalle_Minutos_OE").val();
  }

  let mensajes = "";
  if (
    $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OE]").is(
      ":checked"
    )
  ) {
    mensajes = "Ilimitados";
  } else {
    mensajes = $("#txtDetalle_Mensajes_OE").val();
  }

  let minutosLDI = $("#txtDetalleMinutosLDI_OE").val();
  let cantidadLDI = "";
  if (minutosLDI.length > 0) {
    cantidadLDI = $("#txtDetalle_Cantidad_LDI_OE").val();
  }

  if (registrar) {
    arrayDetalleLinea = {
      id: uuid.v4(),
      cantidadLineas: cantidadLineas,
      cargoBasicoMensual: cargobasico,
      navegacion: $("#txtDetalleNavegacion_OE").val(),
      minutos: minutos,
      mensajes: mensajes,
      serviciosIlimitados: $("#txtDetalle_ServiciosI_OE").val(),
      minutosLDI: minutosLDI,
      cantidadLDI: cantidadLDI,
      serviciosAdicionales: $("#txtDetalle_ServiciosA_OE").val(),
    };
  } else {
    arrayDetalleLinea = {
      id: lineas.id,
      grupo: lineas.grupo,
      NumerosLineas: lineas.NumerosLineas,
      id_lineas: lineas.id_lineas,
      cantidadLineas: cantidadLineas,
      cargoBasicoMensual: cargobasico,
      navegacion: $("#txtDetalleNavegacion_OE").val(),
      minutos: minutos,
      mensajes: mensajes,
      serviciosIlimitados: $("#txtDetalle_ServiciosI_OE").val(),
      minutosLDI: minutosLDI,
      cantidadLDI: cantidadLDI,
      serviciosAdicionales: $("#txtDetalle_ServiciosA_OE").val(),
    };
  }
  return arrayDetalleLinea;
};

let ListarServiciosMovilesOE = () => {
  if (localStorage.ServiciosMovilesOE) {
    DataTableOE.clear().draw();

    let ServiciosMoviles = JSON.parse(
      localStorage.getItem("ServiciosMovilesOE")
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
      DataTableOE.row.add(data).draw();
    }
    DataTableOE.responsive.recalc();
    SetDataServiciosMovilesOE();
    EliminarServiciosMovilesOE();
    DetalleServiciosMoviles();
  }
};

let EditarServiciosMovilesOE = () => {
  let idLinea = $("#txtDetalleId_OE").val();
  let ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMovilesOE"));
  let lineasMoviles = null;

  ServiciosMoviles.forEach(function (valor, indice, array) {
    if (valor.id == idLinea) {
      lineasMoviles = valor;
      ServiciosMoviles.splice(indice, 1);
    }
  });

  // Servicios móviles
  let arrayDetalleLinea = GetDataServiciosMovilesOE(false, lineasMoviles);

  ServiciosMoviles.push(arrayDetalleLinea);
  localStorage.ServiciosMovilesOE = JSON.stringify(ServiciosMoviles);

  LimpiarFormServiciosMovilesOE();
  ListarServiciosMovilesOE();
};

let LimpiarFormServiciosMovilesOE = () => {
  $("#txtDetalleId_OE").val(0);
  $("#txtDetalle_Cantidad_Lineas_OE").val("");
  $("#txtDetalle_Cantidad_Lineas_OE").removeAttr("id_linea");
  $("#txtDetalle_Valor_Mensual_OE").val("");
  $("input:radio[name=detalleLineasRadios]:checked").prop("checked", false);
  $("#txtDetalleNavegacion_OE").val("");
  $("#txtDetalle_Minutos_OE").val("");
  if (
    $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OE]").is(":checked")
  ) {
    $("input:checkbox[name=txtDetalle_Validacion_Ilimitados_OE]").prop(
      "checked",
      false
    );
    $("#txtDetalle_Minutos_OE").prop("disabled", false);
  } else {
    $("#txtDetalle_Minutos_OE").val("");
  }
  if (
    $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OE]").is(
      ":checked"
    )
  ) {
    $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados_OE]").prop(
      "checked",
      false
    );
    $("#txtDetalle_Mensajes_OE").prop("disabled", false);
  } else {
    $("#txtDetalle_Mensajes_OE").val("");
  }
  $("#txtDetalleMinutosLDI_OE").val(null).trigger("change");
  $("#txtDetalle_Cantidad_LDI_OE").val("");
  $("#txtDetalle_Cantidad_LDI_OE").prop("disabled", true);
  $("#txtDetalle_ServiciosI_OE").val(null).trigger("change");
  $("#txtDetalle_ServiciosA_OE").val(null).trigger("change");

  EliminarClasesValidate("#txtDetalle_Cantidad_Lineas_OE");
  EliminarClasesValidate("#txtDetalle_Valor_Mensual_OE");
  EliminarClasesValidate("#txtDetalleNavegacion_OE");
  EliminarClasesValidate("#txtDetalle_Minutos_OE");
  EliminarClasesValidate("#txtDetalle_Mensajes_OE");
  EliminarClasesValidate("#txtDetalle_Cantidad_LDI_OE");
};

let EliminarClasesValidate = (elemento) => {
  $(elemento).removeClass("form-control-success");
  $(elemento).parent().removeClass("has-success");
  $(elemento).removeClass("form-control-danger");
  $(elemento).parent().removeClass("has-danger");
};

let EliminarServiciosMovilesOE = () => {
  $(document).on("click", "#ServiciosMovilesEliminarOE", function () {
    let idLinea = $(this).attr("id_linea");
    let ServiciosMoviles = JSON.parse(
      localStorage.getItem("ServiciosMovilesOE")
    );

    ServiciosMoviles.forEach(function (valor, indice, array) {
      if (valor.id == idLinea) {
        ServiciosMoviles.splice(indice, 1);
      }
    });
    localStorage.ServiciosMovilesOE = JSON.stringify(ServiciosMoviles);
    if (ServiciosMoviles.length == 0) {
      $("#Pseudo_tabOfertaP").attr("style", "display:none");
      $("#tabOfertaP").removeAttr("style");
    }
    ListarServiciosMovilesOE();
  });
};
