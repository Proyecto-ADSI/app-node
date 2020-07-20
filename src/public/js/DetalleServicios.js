$(function () {
  try {
    dataSet = JSON.parse(localStorage.getItem("ServiciosMoviles") || []);
  } catch (err) {
    dataSet = [];
  }

  if (localStorage.ServiciosFijos) {
    Listar_CheckearServiciosFijos();
  } else {
    $("#ValSiServiciosFijos").css("display", "none");
    $("#ValNoServiciosFijos").removeAttr("style");
  }

  DataTableServicios = $("#DataTableServicios")
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
              if (controlServicios == 3) {
                return `
                    <button type="button" id="DetallesLineasEditar" id_linea="${data}"
                      class="btn btn-info btn-sm"> <i class="fa fa-pencil"></i>
                    </button>
                    <button type="button" id="DetallesLineasEliminar" id_linea="${data}"
                      class="btn btn-danger btn-sm"><i class="fa fa-close"></i>
                    </button>
                  `;
              } else {
                return `
                <button type="button" id="DetallesLineasDetalle" id_linea="${data}"
                  class="btn btn-primary btn-sm"><i class="mdi mdi-cellphone-android"></i>
                </button>
                <button type="button" id="DetallesLineasEditar" id_linea="${data}"
                  class="btn btn-info btn-sm"> <i class="fa fa-pencil"></i>
                </button>
                <button type="button" id="DetallesLineasEliminar" id_linea="${data}"
                  class="btn btn-danger btn-sm"><i class="fa fa-close"></i>
                </button>
              `;
              }
            }
            return data;
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

  if (dataSet.length > 0) {
    ListarDetalleLineas();
  }

  $("#checkDetalle_Pagina").change(function () {
    ValidarBtnServicosFijos();
  });
  $("#checkDetalle_Correo").change(function () {
    ValidarBtnServicosFijos();
  });
  $("#checkDetalle_IPFija").change(function () {
    ValidarBtnServicosFijos();
  });
  $("#checkDetalle_dominio").change(function () {
    ValidarBtnServicosFijos();
  });
  $("#checkDetalle_telefonia").change(function () {
    ValidarBtnServicosFijos();
  });
  $("#checkDetalle_television").change(function () {
    ValidarBtnServicosFijos();
  });

  // Botones servicios fijos
  $("#btnGuardarServiciosFijos").click(function () {
    RegistrarServiciosFijo();
  });
  $("#btnEliminarServiciosFijos").click(function () {
    EliminarServiciosFijos();
  });

  // Botones servicios móviles
  $("#btnLimpiar").click(function () {
    LimpiarDetalleLinea();
  });

  $("#btnGuardarDetalleLineas").click(function () {
    form.validate().settings.ignore = ":disabled,:hidden, .valDetalle";
    if (form.valid()) {
      $("#txtDetalleId").val() == "0"
        ? RegistrarDetalleLinea()
        : EditarDetalleLinea();

      // Detalles líneas
      DetalleServiciosMoviles();
      // Editar linea
      ObtenerDataLineasEditar();
      // Eliminar línea.
      EliminarDetalleLinea();
    }
  });

  // Formatear números
  FormatearNumerosInput("#txtDetalle_Valor_Mensual");
  // Validación minutos ilimitados.
  $("input:checkbox[name=txtDetalle_Validacion_Ilimitados]").change(
    function () {
      if ($(this).is(":checked")) {
        $("#txtDetalle_Minutos").prop("disabled", true);
      } else {
        $("#txtDetalle_Minutos").prop("disabled", false);
      }
    }
  );
  // Validación mensajes ilimitados.
  $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados]").change(
    function () {
      if ($(this).is(":checked")) {
        $("#txtDetalle_Mensajes").prop("disabled", true);
      } else {
        $("#txtDetalle_Mensajes").prop("disabled", false);
      }
    }
  );
  // Validación minutos LDI
  $("#txtDetalleMinutosLDI").on("change", function (e) {
    let minutosLDI = $("#txtDetalleMinutosLDI").val();
    if (minutosLDI.length > 0) {
      $("#txtDetalle_Cantidad_LDI").removeAttr("disabled");
    } else {
      $("#txtDetalle_Cantidad_LDI").attr("disabled", true);
    }
  });

  if (localStorage.ServiciosMoviles) {
    let serviciosMoviles = JSON.parse(localStorage.ServiciosMoviles);
    if (serviciosMoviles.length > 0) {
      $(".switch_corporativo").bootstrapSwitch("disabled", false);
      $(".switch_cita1").bootstrapSwitch("disabled", false);
      $(".switch_AT1").bootstrapSwitch("disabled", false);
    }
  }
});

// Detalle Líneas
let RegistrarDetalleLinea = () => {
  let ServiciosMoviles = [];
  if (localStorage.ServiciosMoviles) {
    ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMoviles"));
  }

  // Servicios móviles
  let arrayDetalleLinea = ObtenerDatosServiciosMoviles(true);

  ServiciosMoviles.push(arrayDetalleLinea);
  localStorage.ServiciosMoviles = JSON.stringify(ServiciosMoviles);

  // Activar botones
  // if ($(".switch_corporativo").bootstrapSwitch("state")) {
  //   $(".switch_cita2").bootstrapSwitch("disabled", false);
  //   $(".switch_AT2").bootstrapSwitch("disabled", false);
  // } else {
  //   $(".switch_cita1").bootstrapSwitch("disabled", false);
  //   $(".switch_AT1").bootstrapSwitch("disabled", false);
  // }

  $(".switch_corporativo").bootstrapSwitch("disabled", false);
  $(".switch_cita1").bootstrapSwitch("disabled", false);
  $(".switch_AT1").bootstrapSwitch("disabled", false);

  LimpiarDetalleLinea();
  ListarDetalleLineas();
};

// Set data on form
let ObtenerDataLineasEditar = () => {
  $(document).on("click", "#DetallesLineasEditar", function () {
    let data = DataTableServicios.row($(this).parents("tr")).data();
    $("#txtDetalleId").val(data[9]);
    $("#txtDetalle_Cantidad_Lineas").val(data[0]);
    $("#txtDetalle_Cantidad_Lineas").attr("id_linea", data[9]);
    $("#txtDetalle_Valor_Mensual").val(data[1]);
    $("#txtDetalle_radio2").prop("checked", true);
    $("#txtDetalleNavegacion").val(data[2]);

    if (data[3] === "Ilimitados") {
      if (
        !$("input:checkbox[name=txtDetalle_Validacion_Ilimitados]").is(
          ":checked"
        )
      ) {
        $("input:checkbox[name=txtDetalle_Validacion_Ilimitados]").trigger(
          "click"
        );
      }
    } else {
      if (
        $("input:checkbox[name=txtDetalle_Validacion_Ilimitados]").is(
          ":checked"
        )
      ) {
        $("input:checkbox[name=txtDetalle_Validacion_Ilimitados]").trigger(
          "click"
        );
      }
      $("#txtDetalle_Minutos").val(data[3]);
    }
    if (data[4] === "Ilimitados") {
      if (
        !$("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados]").is(
          ":checked"
        )
      ) {
        $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados]").trigger(
          "click"
        );
      }
    } else {
      if (
        $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados]").is(
          ":checked"
        )
      ) {
        $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados]").trigger(
          "click"
        );
      }
      $("#txtDetalle_Mensajes").val(data[4]);
    }

    if (data[6].length > 0) {
      $("#txtDetalleMinutosLDI").val(data[6]).trigger("change");
      $("#txtDetalle_Cantidad_LDI").val(data[7]);
    }
    if (data[5].length > 0) {
      $("#txtDetalle_Servicios_Ilimitados").val(data[5]).trigger("change");
    }
    if (data[8].length > 0) {
      $("#txtDetalle_Servicios_Adicionales").val(data[8]).trigger("change");
    }
  });
};

// Get data form
let ObtenerDatosServiciosMoviles = (registrar, lineas) => {
  let arrayDetalleLinea = null;
  let cargobasico = 0;
  let valorInput = QuitarComas($("#txtDetalle_Valor_Mensual").val());
  valorInput = parseFloat(valorInput);
  let cantidadLineas = parseInt($("#txtDetalle_Cantidad_Lineas").val());
  if ($("input:radio[name=detalleLineasRadios]:checked").val() == 1) {
    cargobasico = valorInput / cantidadLineas;
  } else {
    cargobasico = valorInput;
  }
  cargobasico = AgregarComas(cargobasico);

  let minutos = "";
  if (
    $("input:checkbox[name=txtDetalle_Validacion_Ilimitados]").is(":checked")
  ) {
    minutos = "Ilimitados";
  } else {
    minutos = $("#txtDetalle_Minutos").val();
  }

  let mensajes = "";
  if (
    $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados]").is(":checked")
  ) {
    mensajes = "Ilimitados";
  } else {
    mensajes = $("#txtDetalle_Mensajes").val();
  }

  let minutosLDI = $("#txtDetalleMinutosLDI").val();
  let cantidadLDI = "";
  if (minutosLDI.length > 0) {
    cantidadLDI = $("#txtDetalle_Cantidad_LDI").val();
  }

  if (registrar) {
    arrayDetalleLinea = {
      id: uuid.v4(),
      cantidadLineas: cantidadLineas,
      cargoBasicoMensual: cargobasico,
      navegacion: $("#txtDetalleNavegacion").val(),
      minutos: minutos,
      mensajes: mensajes,
      serviciosIlimitados: $("#txtDetalle_Servicios_Ilimitados").val(),
      minutosLDI: minutosLDI,
      cantidadLDI: cantidadLDI,
      serviciosAdicionales: $("#txtDetalle_Servicios_Adicionales").val(),
    };
  } else {
    arrayDetalleLinea = {
      id: lineas.id,
      grupo: lineas.grupo,
      NumerosLineas: lineas.NumerosLineas,
      id_lineas: lineas.id_lineas,
      cantidadLineas: cantidadLineas,
      cargoBasicoMensual: cargobasico,
      navegacion: $("#txtDetalleNavegacion").val(),
      minutos: minutos,
      mensajes: mensajes,
      serviciosIlimitados: $("#txtDetalle_Servicios_Ilimitados").val(),
      minutosLDI: minutosLDI,
      cantidadLDI: cantidadLDI,
      serviciosAdicionales: $("#txtDetalle_Servicios_Adicionales").val(),
    };
  }

  return arrayDetalleLinea;
};

let ListarDetalleLineas = () => {
  if (localStorage.ServiciosMoviles) {
    DataTableServicios.clear().draw();

    let ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMoviles"));

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
      DataTableServicios.row.add(data).draw();
    }
    DataTableServicios.responsive.recalc();
    ObtenerDataLineasEditar();
    EliminarDetalleLinea();
    DetalleServiciosMoviles();
    if (controlServicios == 3) {
      $(".switch_corporativo").bootstrapSwitch("disabled", false);
      $(".switch_cita1").bootstrapSwitch("disabled", false);
      if (
        $(".switch_AT1").bootstrapSwitch("state") === true ||
        $(".switch_AT2").bootstrapSwitch("state") === true
      ) {
        if (ServiciosMoviles.length == 0) {
          $("#tabOfertaP").attr("style", "display:none");
          $("#tabOfertaE a").trigger("click");
        } else {
          $("#tabOfertaP").removeAttr("style");
        }
        ListarSwipers();
      }
    }
  }
};

let EditarDetalleLinea = () => {
  let idLinea = $("#txtDetalleId").val();
  let ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMoviles"));
  let lineasMoviles = null;

  ServiciosMoviles.forEach(function (valor, indice, array) {
    if (valor.id == idLinea) {
      lineasMoviles = valor;
      ServiciosMoviles.splice(indice, 1);
    }
  });

  // Servicios fijos
  RegistrarServiciosFijo();
  // Servicios móviles
  let arrayDetalleLinea = ObtenerDatosServiciosMoviles(false, lineasMoviles);

  ServiciosMoviles.push(arrayDetalleLinea);
  localStorage.ServiciosMoviles = JSON.stringify(ServiciosMoviles);

  LimpiarDetalleLinea();
  ListarDetalleLineas();
};

let LimpiarDetalleLinea = () => {
  $("#txtDetalleId").val(0);
  $("#txtDetalle_Cantidad_Lineas").val("");
  $("#txtDetalle_Cantidad_Lineas").removeAttr("id_linea");
  $("#txtDetalle_Valor_Mensual").val("");
  $("input:radio[name=detalleLineasRadios]:checked").prop("checked", false);
  $("#txtDetalleNavegacion").val("");
  $("#txtDetalle_Minutos").val("");
  if (
    $("input:checkbox[name=txtDetalle_Validacion_Ilimitados]").is(":checked")
  ) {
    $("input:checkbox[name=txtDetalle_Validacion_Ilimitados]").prop(
      "checked",
      false
    );
    $("#txtDetalle_Minutos").prop("disabled", false);
  } else {
    $("#txtDetalle_Minutos").val("");
  }
  if (
    $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados]").is(":checked")
  ) {
    $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados]").prop(
      "checked",
      false
    );
    $("#txtDetalle_Mensajes").prop("disabled", false);
  } else {
    $("#txtDetalle_Mensajes").val("");
  }
  $("#txtDetalleMinutosLDI").val(null).trigger("change");
  $("#txtDetalle_Cantidad_LDI").val("");
  $("#txtDetalle_Cantidad_LDI").prop("disabled", true);
  $("#txtDetalle_Servicios_Ilimitados").val(null).trigger("change");
  $("#txtDetalle_Servicios_Adicionales").val(null).trigger("change");

  EliminarClasesSuccessValidate("#txtDetalle_Cantidad_Lineas");
  EliminarClasesSuccessValidate("#txtDetalle_Valor_Mensual");
  EliminarClasesSuccessValidate("#txtDetalleNavegacion");
  EliminarClasesSuccessValidate("#txtDetalle_Minutos");
  EliminarClasesSuccessValidate("#txtDetalle_Mensajes");
  EliminarClasesSuccessValidate("#txtDetalle_Cantidad_LDI");
};

let EliminarClasesSuccessValidate = (element) =>{
  $(element).removeClass("form-control-success");
  $(element).parents(".form-group").removeClass("has-success");
} 

let EliminarDetalleLinea = () => {
  $(document).on("click", "#DetallesLineasEliminar", function () {
    let idLinea = $(this).attr("id_linea");
    let ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMoviles"));

    ServiciosMoviles.forEach(function (valor, indice, array) {
      if (valor.id == idLinea) {
        ServiciosMoviles.splice(indice, 1);
      }
    });
    localStorage.ServiciosMoviles = JSON.stringify(ServiciosMoviles);
    ListarDetalleLineas();
    if (localStorage.ServiciosMoviles) {
      let serviciosMoviles = JSON.parse(localStorage.ServiciosMoviles);
      if (serviciosMoviles.length == 0) {
        $(".switch_corporativo").bootstrapSwitch("disabled", true);
        $(".switch_cita1").bootstrapSwitch("disabled", true);
        $(".switch_AT1").bootstrapSwitch("disabled", true);
      }
    }
  });
};

let DetalleServiciosMoviles = () => {
  $(document).on("click", "#DetallesLineasDetalle", function () {
    $("#LineasModal").modal("show");
    let idLinea = $(this).attr("id_linea");
    let ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMoviles"));

    ServiciosMoviles.forEach(function (linea, indice, array) {
      if (linea.id == idLinea) {
        $("#tbodyModalLinea").empty();
        $("#tbodyModalLinea").append(`
                <tr id="txtIdLineasModalNumeros" style="display:none" >
                    <td>${linea.id}</td>
                </tr>
                <tr>
                    <td> Cantidad líneas </td>
                    <td>
                      <p id="txtIncrementarLineas" class="text-center"> ${
                        linea.cantidadLineas
                      }
                        </p>
                    </td>
                </tr>
                <tr>
                    <td><h5 class="text-danger font-weight-bold text-uppercase">Cargo básico</h5></td>
                    <td>
                        <i class="fa fa-dollar text-danger"></i>
                        <h5 class="float-right text-danger font-weight-bold">
                            ${linea.cargoBasicoMensual}
                        </h5>
                    </td>
                </tr>
                <tr>
                    <td>Navegación</td>
                    <td>
                      <p class="text-center">
                        ${linea.navegacion + "  GB"}
                      </p>
                    </td>
                </tr>
                <tr>
                    <td>Minutos</td>
                    <td>
                    <p class="text-center">
                      ${linea.minutos}
                    </p>
                    </td>
                </tr>
                <tr>
                    <td>Mensajes</td>
                    <td>
                      <p class="text-center">
                        ${linea.mensajes}
                      </p>
                    </td>
                </tr>
            `);

        if (typeof linea.NumerosLineas !== "undefined") {
          $("#ModalNumerosLineas").empty();

          let arrayNumeros = [];

          for (let numero of linea.NumerosLineas) {
            if (numero == "0") {
              numero = "";
            }
            arrayNumeros.push(numero);
          }

          AgregarInput(linea.NumerosLineas.length, arrayNumeros, false);
          $("#btnGuardarNumerosLineas").removeAttr("disabled");
        } else {
          $("#ModalNumerosLineas").empty();
          AgregarInput(linea.cantidadLineas, 0, false);
          $("#btnGuardarNumerosLineas").attr("disabled", true);
        }

        for (let i = 1; i <= linea.cantidadLineas; i++) {
          $(`#txtNumeroMovil${i}Idgrupo${linea.id}`).rules("add", {
            ValidarCelular: true,
            minlength: 10,
            maxlength: 10,
          });
          $(`#txtNumeroMovil${i}Idgrupo${linea.id}`).change(function () {
            let validacion = form.validate().element(this);
            if (validacion) {
              $("#btnGuardarNumerosLineas").removeAttr("disabled");
            } else {
              $("#btnGuardarNumerosLineas").attr("disabled", true);
            }
          });
        }
      }
    });
  });
};

// Números de líneas

function AgregarInput(cantidad, numeros, click) {
  for (let i = 1; i <= cantidad; i++) {
    let idLinea = $("#txtIdLineasModalNumeros td").html();
    id++;
    let objTo = document.getElementById("ModalNumerosLineas");
    let divtest = document.createElement("div");
    divtest.setAttribute("class", "form-group removeclass" + id);

    if (Array.isArray(numeros)) {
      divtest.innerHTML = `
              <div class="row form-group">
                  <div class="col-md-12">
                      <div class="input-group">
                          <div class="input-group-prepend">
                              <span class="input-group-text" id="basic-addon1">
                                  <i class="fa fa-mobile"></i>
                              </span>
                          </div>
                          <input type="text" id="txtNumeroMovil${i}Idgrupo${idLinea}" class="form-control txtNumeroLinea" name="txtNumeroLinea" placeholder="Ingresa un número"
                          value="${numeros[i - 1]}">
                          <div class="input-group-append">
                              <button class="btn btn-danger" type="button" onclick="Eliminarinput(${id})">
                                  <i class="fa fa-minus"></i>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          `;
    } else {
      if (click) {
        let cantidadLineas = parseInt($("#txtIncrementarLineas").html());
        cantidadLineas++;
        $("#txtIncrementarLineas").html(cantidadLineas);
        $("#btnGuardarNumerosLineas").removeAttr("disabled");
      }

      divtest.innerHTML = `
                  <div class="row form-group">
                      <div class="col-md-12">
                          <div class="input-group">
                              <div class="input-group-prepend">
                                  <span class="input-group-text" id="basic-addon1">
                                      <i class="fa fa-mobile"></i>
                                  </span>
                              </div>
                              <input type="text" id="txtNumeroMovil${i}Idgrupo${idLinea}" class="form-control txtNumeroLinea" name="txtNumeroLinea" placeholder="Ingresa un número">
                              <div class="input-group-append">
                                  <button class="btn btn-danger" type="button" onclick="Eliminarinput(${id})">
                                      <i class="fa fa-minus"></i>
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              `;
    }

    objTo.appendChild(divtest);
  }
}

function Eliminarinput(id) {
  let cantidadLineas = parseInt($("#txtIncrementarLineas").html());
  cantidadLineas--;
  $("#txtIncrementarLineas").html(cantidadLineas);
  $(".removeclass" + id).remove();
  $("#btnGuardarNumerosLineas").removeAttr("disabled");
}

function RegistrarNumeros() {
  if (ValidarNumerosLineas()) {
    let ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMoviles"));
    let idLinea = $("#txtIdLineasModalNumeros td").html();
    let arrayInputs = $('input:text[name="txtNumeroLinea"]');
    let arrayNumeros = [];

    ServiciosMoviles.forEach(function (linea, indice, array) {
      if (linea.id == idLinea) {
        linea.cantidadLineas = parseInt($("#txtIncrementarLineas").html());

        for (let numero of arrayInputs) {
          let value = $(numero).val();
          if (value == "") {
            value = "0";
          }
          arrayNumeros.push(value);
        }

        Object.defineProperty(linea, "NumerosLineas", {
          value: arrayNumeros,
          enumerable: true,
        });

        localStorage.ServiciosMoviles = JSON.stringify(ServiciosMoviles);
        ListarDetalleLineas();
        swal(
          {
            title: "Números registrados correctamente.",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#2F6885",
            confirmButtonText: "Continuar",
            closeOnConfirm: true,
          },
          function (isConfirm) {
            if (isConfirm) {
              $("#LineasModal").modal("hide");
            }
          }
        );
      }
    });
  }
}

function ValidarNumerosLineas() {
  let valid = true;

  if ($('input:text[name="txtNumeroLinea"]').length > 0) {
    $('input:text[name="txtNumeroLinea"]').each(function (index, element) {
      let validacion = form.validate().element(element);

      if (validacion === false) {
        valid = validacion;
      }
    });
  } else {
    valid = false;

    swal({
      title: "Error al registrar números.",
      text: "Debes registrar por lo menos una línea.",
      type: "error",
      showCancelButton: false,
      confirmButtonColor: "#2F6885",
      confirmButtonText: "Continuar",
      closeOnConfirm: true,
    });
  }

  return valid;
}

// Servicios fijos

let Listar_CheckearServiciosFijos = () => {
  serviciosFijos = JSON.parse(localStorage.getItem("ServiciosFijos"));
  let pagina = "checkDetalle_Pagina";
  let correo = "checkDetalle_Correo";
  let ip = "checkDetalle_IPFija";
  let dominio = "checkDetalle_dominio";
  let telefonia = "checkDetalle_telefonia";
  let television = "checkDetalle_television";

  if (serviciosFijos.pagina) {
    checkServiciosFijo(pagina);
  }
  if (serviciosFijos.correo) {
    checkServiciosFijo(correo);
  }
  if (serviciosFijos.ip) {
    checkServiciosFijo(ip);
  }
  if (serviciosFijos.dominio) {
    checkServiciosFijo(dominio);
  }
  if (serviciosFijos.telefonia) {
    checkServiciosFijo(telefonia);
  }
  if (serviciosFijos.television) {
    checkServiciosFijo(television);
  }
  ListarServiciosFijos();
};

let checkServiciosFijo = (name) => {
  if (!$(`input:checkbox[name=${name}]`).is(":checked")) {
    $(`input:checkbox[name=${name}]`).trigger("click");
  }
};

let RegistrarServiciosFijo = () => {
  let serviciosFijos = {
    pagina: false,
    correo: false,
    ip: false,
    dominio: false,
    telefonia: false,
    television: false,
  };

  if ($("input:checkbox[name=checkDetalle_Pagina]").is(":checked")) {
    serviciosFijos.pagina = true;
  }
  if ($("input:checkbox[name=checkDetalle_Correo]").is(":checked")) {
    serviciosFijos.correo = true;
  }
  if ($("input:checkbox[name=checkDetalle_IPFija]").is(":checked")) {
    serviciosFijos.ip = true;
  }
  if ($("input:checkbox[name=checkDetalle_dominio]").is(":checked")) {
    serviciosFijos.dominio = true;
  }
  if ($("input:checkbox[name=checkDetalle_telefonia]").is(":checked")) {
    serviciosFijos.telefonia = true;
  }
  if ($("input:checkbox[name=checkDetalle_television]").is(":checked")) {
    serviciosFijos.television = true;
  }
  localStorage.ServiciosFijos = JSON.stringify(serviciosFijos);

  ListarServiciosFijos();
};

let ListarServiciosFijos = () => {
  if (localStorage.ServiciosFijos) {
    let serviciosFijos = JSON.parse(localStorage.ServiciosFijos);
    $("#ServiciosFijos").empty();
    let itemsServiciosFijos = [];
    if (serviciosFijos.pagina) {
      itemsServiciosFijos.push("Página web");
    }
    if (serviciosFijos.correo) {
      itemsServiciosFijos.push("Correo");
    }
    if (serviciosFijos.ip) {
      itemsServiciosFijos.push("IP Fija");
    }
    if (serviciosFijos.dominio) {
      itemsServiciosFijos.push("Dominio");
    }
    if (serviciosFijos.telefonia) {
      itemsServiciosFijos.push("Telefonía");
    }
    if (serviciosFijos.television) {
      itemsServiciosFijos.push("Televisión");
    }
    $("#ValNoServiciosFijos").css("display", "none");
    $("#ValSiServiciosFijos").removeAttr("style");
    for (let item of itemsServiciosFijos) {
      $("#ServiciosFijos").append(
        `
          <label class="ServiciosFijosItems" for="checkDetalle_telefonia"><i class="mdi mdi-bookmark-check"></i>
            ${item}
          </label>
          `
      );
    }
  } else {
    if ($("input:checkbox[name=checkDetalle_Pagina]").is(":checked")) {
      $("input:checkbox[name=checkDetalle_Pagina]").trigger("click");
    }
    if ($("input:checkbox[name=checkDetalle_Correo]").is(":checked")) {
      $("input:checkbox[name=checkDetalle_Correo]").trigger("click");
    }
    if ($("input:checkbox[name=checkDetalle_IPFija]").is(":checked")) {
      $("input:checkbox[name=checkDetalle_IPFija]").trigger("click");
    }
    if ($("input:checkbox[name=checkDetalle_dominio]").is(":checked")) {
      $("input:checkbox[name=checkDetalle_dominio]").trigger("click");
    }
    if ($("input:checkbox[name=checkDetalle_telefonia]").is(":checked")) {
      $("input:checkbox[name=checkDetalle_telefonia]").trigger("click");
    }
    if ($("input:checkbox[name=checkDetalle_television]").is(":checked")) {
      $("input:checkbox[name=checkDetalle_television]").trigger("click");
    }
    $("#ValSiServiciosFijos").css("display", "none");
    $("#ValNoServiciosFijos").removeAttr("style");
  }
  ValidarBtnServicosFijos();
};

let EliminarServiciosFijos = () => {
  localStorage.removeItem("ServiciosFijos");
  ListarServiciosFijos();
};

let ValidarBtnServicosFijos = () => {
  let control = false;
  if ($("input:checkbox[name=checkDetalle_Pagina]").is(":checked")) {
    control = true;
  }
  if ($("input:checkbox[name=checkDetalle_Correo]").is(":checked")) {
    control = true;
  }
  if ($("input:checkbox[name=checkDetalle_IPFija]").is(":checked")) {
    control = true;
  }
  if ($("input:checkbox[name=checkDetalle_dominio]").is(":checked")) {
    control = true;
  }
  if ($("input:checkbox[name=checkDetalle_telefonia]").is(":checked")) {
    control = true;
  }
  if ($("input:checkbox[name=checkDetalle_television]").is(":checked")) {
    control = true;
  }

  if (control) {
    $("#btnGuardarServiciosFijos").removeAttr("disabled");
  } else {
    $("#btnGuardarServiciosFijos").attr("disabled", true);
  }

  if (localStorage.ServiciosFijos) {
    $("#btnEliminarServiciosFijos").removeAttr("disabled");
  } else {
    $("#btnEliminarServiciosFijos").attr("disabled", true);
  }
};

let getArrayString = (string) => {
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

// Alertas Toast
let EnlazarClickAdvertencias = () => {
  $(".bootstrap-switch-label").click(function () {
    let input = $(this).next().next();
    let clase = $(input).attr("class");
    ValidarAlertaServicios(clase);
  });
  $(".bootstrap-switch-handle-off").click(function () {
    let input = $(this).next();
    let clase = $(input).attr("class");
    ValidarAlertaServicios(clase);
  });
};

let ValidarAlertaServicios = (clase) => {
  switch (clase) {
    case "switch_corporativo":
      if ($(".switch_corporativo").bootstrapSwitch("disabled")) {
        GenerarAlertasToast(1);
      }
      break;
    case "switch_cita1":
      if ($(".switch_cita1").bootstrapSwitch("disabled")) {
        GenerarAlertasToast(1);
      }
      break;
    case "switch_cita2":
      if ($(".switch_cita2").bootstrapSwitch("disabled")) {
        GenerarAlertasToast(1);
      }
      break;
    case "switch_AT1":
      if ($(".switch_AT1").bootstrapSwitch("disabled")) {
        GenerarAlertasToast(1);
      }
      break;
    case "switch_AT2":
      if ($(".switch_AT2").bootstrapSwitch("disabled")) {
        GenerarAlertasToast(1);
      }
      break;
    case "switch_enviarCitaDespues":
      if ($(".switch_enviarCitaDespues").bootstrapSwitch("disabled")) {
        GenerarAlertasToast(2);
      }
      break;
  }
};

let GenerarAlertasToast = (categoria) => {
  switch (categoria) {
    case 1:
      $.toast({
        heading: "¡Advertencia!",
        text: '<p class="jq-toast-body">Primero debes registrar servicios.</p>',
        position: "top-right",
        // bgColor: "#00897b",
        loaderBg: "#ff6849",
        icon: "error",
        hideAfter: 3000,
        showHideTransition: "slide",
        stack: 1,
      });
      break;
    case 2:
      $.toast({
        heading: "¡Advertencia!",
        text:
          '<p class="jq-toast-body">Primero debes validar NIT y dirección.</p>',
        position: "top-right",
        // bgColor: "#00897b",
        loaderBg: "#ff6849",
        icon: "error",
        hideAfter: 3000,
        showHideTransition: "slide",
        stack: 1,
      });
      break;
    case 3:
      $.toast({
        heading: "¡Acción no permitida!",
        text:
          '<p class="jq-toast-body">Primero debes finalizar la llamada.</p>',
        position: "top-right",
        // bgColor: "#ff6849",
        loaderBg: "#ff6849",
        icon: "error",
        hideAfter: 3000,
        showHideTransition: "slide",
        stack: 1,
      });
      break;
    case 4:
      $.toast({
        heading: "¡No se puede eliminar!",
        text: '<p class="jq-toast-body">Este campo es requerido.</p>',
        position: "top-right",
        loaderBg: "#ff6849",
        icon: "error",
        hideAfter: 3000,
        showHideTransition: "slide",
        stack: 1,
      });
      break;
    case 5:
      $.toast({
        heading: "¡Notas no válidas!",
        text:
          '<p class="jq-toast-body">Las notas son requeridas y tienen un máximo de 255 caracteres.</p>',
        position: "top-right",
        loaderBg: "#ff6849",
        icon: "error",
        hideAfter: 3000,
        showHideTransition: "slide",
        stack: 1,
      });
      break;
    case 6:
      $.toast({
        heading: "¡No se puede cambiar de oferta!",
        text:
          '<p class="jq-toast-body">Debes eliminar los servicios móviles de la oferta actual</p>',
        position: "top-right",
        loaderBg: "#ff6849",
        icon: "error",
        hideAfter: 5000,
        showHideTransition: "slide",
        stack: 1,
      });
      break;
    case 7:
      $.toast({
        heading: "¡Deshabilitado!",
        text:
          '<p class="jq-toast-body">Debes seleccionar un grupo de líneas primero</p>',
        position: "top-right",
        loaderBg: "#ff6849",
        icon: "error",
        hideAfter: 3000,
        showHideTransition: "slide",
        stack: 1,
      });
      break;
    case 8:
      $.toast({
        heading: "¡Acción no permitida!",
        text: '<p class="jq-toast-body">Algunos campos están erróneos</p>',
        position: "top-right",
        loaderBg: "#ff6849",
        icon: "error",
        hideAfter: 3000,
        showHideTransition: "slide",
        stack: 1,
      });
      break;
  }
};

// Formatear Servicios móviles para registro en BD

let FormatearServiciosMoviles = (ServiciosMoviles, esOfertaBD) => {
  let arrayLineas = [];
  let Cantidad_Total_Lineas = 0;
  let Valor_Total_Mensual = 0;
  let GrupoLineas = 0;
  for (let lineaItem of ServiciosMoviles) {
    let serviciosIlimitados = "";
    if (lineaItem.serviciosIlimitados.length > 0) {
      for (let servicioI of lineaItem.serviciosIlimitados) {
        serviciosIlimitados = serviciosIlimitados + servicioI + ", ";
        serviciosIlimitados = serviciosIlimitados.trim();
      }
    }
    let minLDI = "";
    let cantidadLDI = null;
    if (lineaItem.minutosLDI.length > 0) {
      for (let pais of lineaItem.minutosLDI) {
        minLDI = minLDI + pais + ", ";
        minLDI = minLDI.trim();
      }
      cantidadLDI = lineaItem.cantidadLDI;
    }

    let serviciosAdicionales = "";
    if (lineaItem.serviciosAdicionales.length > 0) {
      for (let servicio of lineaItem.serviciosAdicionales) {
        serviciosAdicionales = serviciosAdicionales + servicio + ", ";
        serviciosAdicionales = serviciosAdicionales.trim();
      }
    }

    GrupoLineas++;
    if (esOfertaBD) {
      let linea = {
        cantidadLineasOferta: lineaItem.cantidadLineas,
        minutos: lineaItem.minutos === "" ? null : lineaItem.minutos,
        navegacion: lineaItem.navegacion === "" ? null : lineaItem.navegacion,
        mensajes: lineaItem.mensajes === "" ? null : lineaItem.mensajes,
        serviciosIlimitados:
          serviciosIlimitados === "" ? null : serviciosIlimitados,
        minutosLDI: minLDI === "" ? null : minLDI,
        cantidadLDI: cantidadLDI === "" ? null : cantidadLDI,
        serviciosAdicionales:
          serviciosAdicionales === "" ? null : serviciosAdicionales,
        cargoBasicoMensual: lineaItem.cargoBasicoMensual,
        grupo: GrupoLineas,
      };
      arrayLineas.push(linea);
    } else {
      for (let i = 0; i < parseInt(lineaItem.cantidadLineas); i++) {
        let linea = {
          minutos: lineaItem.minutos === "" ? null : lineaItem.minutos,
          navegacion: lineaItem.navegacion === "" ? null : lineaItem.navegacion,
          mensajes: lineaItem.mensajes === "" ? null : lineaItem.mensajes,
          serviciosIlimitados:
            serviciosIlimitados === "" ? null : serviciosIlimitados,
          minutosLDI: minLDI === "" ? null : minLDI,
          cantidadLDI: cantidadLDI === "" ? null : cantidadLDI,
          serviciosAdicionales:
            serviciosAdicionales === "" ? null : serviciosAdicionales,
          cargoBasicoMensual: lineaItem.cargoBasicoMensual,
          grupo: GrupoLineas,
        };
        arrayLineas.push(linea);
        // Establecer valor total mensual de la totalidad de lineas.
        let cargoBasicoMensual = QuitarComas(lineaItem.cargoBasicoMensual);
        cargoBasicoMensual = parseFloat(cargoBasicoMensual);
        Valor_Total_Mensual += cargoBasicoMensual;
      }
      Cantidad_Total_Lineas = arrayLineas.length;
    }
  }

  let ServiciosFormateados = {
    Cantidad_Total_Lineas: Cantidad_Total_Lineas,
    Valor_Total_Mensual: AgregarComas(Valor_Total_Mensual),
    arrayServiciosMoviles: arrayLineas,
  };
  return ServiciosFormateados;
};
