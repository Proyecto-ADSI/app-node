// Formulario
var form = null;

// Variables de control
var Reprogramar_Llamada = false;
var Enviar_Cita_Despues = false;
var Fecha_Cita = null;
var Fecha_LP = null;
var Validacion_RegistrarCliente = true;
var TerminarLlamada = false;
var EnlazarUbicacionEmpresa = false;
var ValDireccionCita = false;

$(function () {
  iniciarCronometroLlamada();
  var stepPlanCorp;
  var stepCita;
  form = $("#Form_Registro_LlamadaNP").show();

  form.steps({
    saveState: true,
    headerTag: "h6",
    bodyTag: "section",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    onInit: function (event, currentIndex) {
      // Validacion de steps
      stepPlanCorp = form.steps("getStep", 2);
      stepCita = form.steps("getStep", 3);
      stepFinLlamada = form.steps("getStep", 4);
      form.steps("remove", 2);
      form.steps("remove", 2);

      // Inicializar selects del formulario
      CargarDatosUbicacion();
      CargarOpcionesPredefinidas();
      CargarOperadores();
      CargarCalificaciones();

      if (sessionStorage.DetalleLineas) {
        sessionStorage.removeItem("DetalleLineas");
      }
    },
    onStepChanging: function (event, currentIndex, newIndex) {
      if (TerminarLlamada) {
        return true;
      } else {
        return (
          currentIndex > newIndex ||
          (!(3 === newIndex && Number($("#age-2").val()) < 18) &&
            (currentIndex < newIndex &&
              (form.find(".body:eq(" + newIndex + ") label.error").remove(),
              form
                .find(".body:eq(" + newIndex + ") .error")
                .removeClass("error")),
            (form.validate().settings.ignore =
              ":disabled,:hidden, .detalleLinea"),
            form.valid()))
        );
      }
    },
    onFinishing: function (event, currentIndex) {
      return (
        (form.validate().settings.ignore = ":disabled, .detalleLinea"),
        form.valid()
      );
    },
    onFinished: function (event, currentIndex) {
      if (
        $(".switch_cita1").bootstrapSwitch("state") === true ||
        $(".switch_cita2").bootstrapSwitch("state") === true
      ) {
        if (ValidacionesCita()) {
          if (sessionStorage.DatosUbicacion) {
            sessionStorage.removeItem("DatosUbicacion");
          }
          RegistrarLlamadaNP();
        }
      } else {
        if (sessionStorage.DatosUbicacion) {
          sessionStorage.removeItem("DatosUbicacion");
        }
        RegistrarLlamadaNP();
      }
    },
  }),
    form.validate({
      ignore: "input[type=hidden]",
      successClass: "text-success",
      errorClass: "form-control-feedback",
      errorElement: "div",
      errorPlacement: function (error, element) {
        if (
          element[0].id == "txtDetalle_Valor_Mensual" ||
          element[0].name == "txtNumeroLinea"
        ) {
          error.insertAfter(element.parent(".input-group"));
        } else if (element[0].name == "detalleLineasRadios") {
          error.insertAfter($("#lblDetalle_radio2"));
        } else {
          error.insertAfter(element);
        }
      },
      highlight: function (element) {
        $(element)
          .parents(".form-group")
          .addClass("has-danger")
          .removeClass("has-success");
        $(element)
          .addClass("form-control-danger")
          .removeClass("form-control-success");
      },
      unhighlight: function (element) {
        $(element)
          .parents(".form-group")
          .addClass("has-success")
          .removeClass("has-danger");
        $(element)
          .addClass("form-control-success")
          .removeClass("form-control-danger");
      },
      rules: {
        // txtRazonSocial: {
        //   required: true,
        //   minlength: 5,
        //   SoloAlfanumericos: true,
        //   remote: {
        //     url: `${URL}/Cliente/ValidarCliente/Disponibilidad`,
        //     type: "get",
        //     dataType: "json",
        //     data: {
        //       texto: function () {
        //         return $("#txtRazonSocial").val().trim();
        //       },
        //     },
        //     dataFilter: function (res) {
        //       var json = JSON.parse(res);
        //       if (json.data.ok) {
        //         return '"true"';
        //       } else {
        //         CargarDatosModalDetalles(json.data.cliente);
        //         let Estado_Cliente = parseInt(json.data.cliente.Estado_Cliente);
        //         ValidarLlamarCliente(Estado_Cliente);
        //         return '"Cliente ya registrado."';
        //       }
        //     },
        //   },
        // },
        // txtTelefono: {
        //   required: true,
        //   SoloNumeros: true,
        //   minlength: 5,
        //   maxlength: 10,
        //   remote: {
        //     url: `${URL}/Cliente/ValidarCliente/Disponibilidad`,
        //     type: "get",
        //     dataType: "json",
        //     data: {
        //       texto: function (e) {
        //         console.log(e);
        //         return $("#txtTelefono").val().trim();
        //       },
        //     },
        //     dataFilter: function (res) {
        //       var json = JSON.parse(res);
        //       if (json.data.ok) {
        //         return '"true"';
        //       } else {
        //         CargarDatosModalDetalles(json.data.cliente);
        //         let Estado_Cliente = parseInt(json.data.cliente.Estado_Cliente);
        //         ValidarLlamarCliente(Estado_Cliente);
        //         return '"Teléfono ya registrado."';
        //       }
        //     },
        //   },
        // },
        // txtNIT: {
        //   ValidarNIT: true,
        //   minlength: 5,
        //   remote: {
        //     url: `${URL}/Cliente/ValidarCliente/Disponibilidad`,
        //     type: "get",
        //     dataType: "json",
        //     data: {
        //       texto: function () {
        //         return $("#txtNIT").val().trim();
        //       },
        //     },
        //     dataFilter: function (res) {
        //       var json = JSON.parse(res);
        //       if (json.data.ok) {
        //         ValidarResumenNIT(true);
        //         return '"true"';
        //       } else {
        //         ValidarResumenNIT(false);
        //         CargarDatosModalDetalles(json.data.cliente);
        //         let Estado_Cliente = parseInt(json.data.cliente.Estado_Cliente);
        //         ValidarLlamarCliente(Estado_Cliente);
        //         return '"NIT ya registrado."';
        //       }
        //     },
        //   },
        // },
        // txtPersona_Responde: {
        //   SoloLetras: true,
        // },
        // txtEncargado: {
        //   SoloLetras: true,
        // },
        // txtExt_Tel_Contacto: {
        //   SoloNumeros: true,
        //   minlength: 2,
        //   maxlength: 10,
        // },
        // txtPais: "required",
        // txtDepartamento: "required",
        // txtMunicipio: "required",
        // txtSubTipo: "required",
        // txtOperador: "required",
        // txtCalificacion: "required",
        txtDetalle_Cantidad_Lineas: {
          required: true,
          SoloNumeros: true,
        },
        txtDetalle_Valor_Mensual: {
          required: true,
          SoloNumeros2: true,
        },
        detalleLineasRadios: "required",
        txtDetalleNavegacion: {
          SoloNumeros: true,
        },
        txtDetalle_Minutos: {
          SoloNumeros: true,
        },
        txtDetalle_Mensajes: {
          SoloNumeros: true,
        },
        txtDetalle_Minutos_LDI: {
          SoloNumeros: true,
        },
        // txtFecha_inicio: "required",
        // txtFecha_fin: "required",
        // txtOperadorCita: "required",
        // txtFechaCita: "required",
        // btnHoraCita: "required",
        // txtEncargado_Cita: {
        //   required: true,
        //   SoloLetras: true,
        // },
        // txtExt_Tel_ContactoEC: {
        //   SoloNumeros: true,
        //   minlength: 2,
        //   maxlength: 10,
        // },
        // txtPaisCita: "required",
        // txtDepartamentoCita: "required",
        // txtMunicipioCita: "required",
        // txtSubTipoCita: "required",
        // txtNombre_LugarCita: "required",
        // txtDireccion_Cita: "required",
        // txtPuntoReferencia: {
        //   required: true,
        //   SoloAlfanumericos: true,
        // },
      },
    });

  // Inicializar elementos:

  try {
    dataSet = JSON.parse(localStorage.getItem("ServiciosMoviles") || []);
  } catch (err) {
    dataSet = [];
  }

  try {
    serviciosFijos = JSON.parse(localStorage.getItem("ServiciosFijos") || []);
  } catch (err) {
    serviciosFijos = [];
  }

  if (serviciosFijos.length > 0) {
    for (let item of serviciosFijos) {
      let pagina = "checkDetalle_Pagina";
      let correo = "checkDetalle_Correo";
      let ip = "checkDetalle_IPFija";
      let dominio = "checkDetalle_dominio";
      let telefonia = "checkDetalle_telefonia";
      let television = "checkDetalle_television";
      $("#ServiciosFijos").append(
        `
      <label class="ServiciosFijosItems" for="checkDetalle_telefonia"><i class="mdi mdi-bookmark-check"></i>
        ${item}
      </label>
      `
      );

      switch (item) {
        case "Página Web":
          checkServiciosFijo(pagina);
          break;
        case "Correo":
          checkServiciosFijo(correo);
          break;
        case "IP fija":
          checkServiciosFijo(ip);
          break;
        case "Dominio":
          checkServiciosFijo(dominio);
          break;
        case "Telefonía":
          checkServiciosFijo(telefonia);
          break;
        case "Televisión":
          checkServiciosFijo(television);
          break;
      }
    }
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
              <button type="button" id="DetallesLineasEditar" id_linea="${data}"
              class="btn btn-info btn-sm">
              <i class="fa fa-pencil"></i>
          </button>
          <button type="button" id="DetallesLineasEliminar" id_linea="${data}"
              class="btn btn-danger btn-sm">
              <i class="fa fa-close"></i>
          </button>
              `;
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
    for (let servicio of dataSet) {
      let data = [
        servicio.cantidadLineas,
        servicio.cargoBasicoMensual,
        servicio.navegacion,
        servicio.minutos,
        servicio.mensajes,
        servicio.redesSociales,
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
  }

  // tooltip
  $("body").tooltip({ selector: "[data-toggle=tooltip]" });

  // bootstrap-switch

  $(".switch_corporativo").bootstrapSwitch({
    onText: "SI",
    offText: "NO",
    onColor: "success",
    offColor: "danger",
  });

  $(".switch_cita1").bootstrapSwitch({
    onText: "SI",
    offText: "NO",
    onColor: "success",
    offColor: "danger",
  });

  $(".switch_habeas_data").bootstrapSwitch({
    onText: "SI",
    offText: "NO",
    onColor: "success",
    offColor: "danger",
  });

  // Fecha reprogramar llamada
  $("#Fecha_LP")
    .bootstrapMaterialDatePicker({
      lang: "es",
      format: "dddd DD MMMM YYYY - HH:mm",
      minDate: new Date(),
      switchOnClick: true,
      weekStart: 1,
      // maxDate: moment().add(10, 'days'),
      disabledDays: [6, 7],
      shortTime: true,
      clearButton: true,
      nowButton: true,
      cancelText: "Cancelar",
      clearText: "Limpiar",
      nowText: "Fecha actual",
    })
    .on("change", function (e, date) {
      if (typeof date !== "undefined") {
        Fecha_LP = FormatearFecha(date._d, true);

        if (
          $(".switch_cita1").bootstrapSwitch("state") === true ||
          $(".switch_cita2").bootstrapSwitch("state") === true
        ) {
          Enviar_Cita_Despues = true;
        } else {
          Reprogramar_Llamada = true;
          ModificarConclusionLlamada(2);
        }
      } else {
        Enviar_Cita_Despues = false;
        Reprogramar_Llamada = false;
        ModificarConclusionLlamada(1);
      }
    });

  // Enlazar eventos de escucha:

  // Atajos del formulario
  $("#txtPersona_Responde").keyup(function () {
    let estado = $("input:checkbox[name=txtValEncargado]").is(":checked");
    if (estado) {
      let Persona_Responde = $("#txtPersona_Responde").val();
      $("#txtEncargado").val(Persona_Responde);
    }
  });

  $("#lbltxtValEncargado").click(function () {
    let estado = $("input:checkbox[name=txtValEncargado]").is(":checked");
    let estado2 = !estado;

    if (estado2) {
      let Persona_Responde = $("#txtPersona_Responde").val();
      $("#txtEncargado").val(Persona_Responde);
    }
  });

  $("input:radio[name=Validacion_UbicacionEmpresa]").click(function () {
    let estado = $("input:radio[name=Validacion_UbicacionEmpresa]").is(
      ":checked"
    );

    if (estado) {
      CargarDatosUbicacionRadio(false);
    }
  });

  // Detalle línea
  $("#txtDetalleMinutosLDI").on("change", function (e) {
    let minutosLDI = $("#txtDetalleMinutosLDI").val();
    if (minutosLDI.length > 0) {
      $("#txtDetalle_Cantidad_LDI").removeAttr("disabled");
    } else {
      $("#txtDetalle_Cantidad_LDI").attr("disabled", true);
    }
  });

  // Estado del switch Cita 1
  $(".switch_cita1").on("switchChange.bootstrapSwitch", function (
    event,
    state
  ) {
    if (state) {
      form.steps("insert", 2, stepCita);
      InicializarFormCitas();
      ValidarBtnTerminarLlamada();
    } else {
      form.steps("remove", 2);
      EliminarStepCita();
      ValidarBtnTerminarLlamada();
    }
  });

  // Estado del switch Plan corporativo
  $(".switch_corporativo").on("switchChange.bootstrapSwitch", function (
    event,
    state
  ) {
    if (state) {
      if ($(".switch_cita1").bootstrapSwitch("state")) {
        $(".switch_cita1").bootstrapSwitch("state", false);
      }

      form.steps("insert", 2, stepPlanCorp);

      // // Rango Fecha corporativo
      $("#Fecha_Corporativo").datepicker({
        language: "es",
        format: "yyyy/mm/dd",
        autoclose: true,
        todayHighlight: true,
      });

      $("#ValidacionCita").attr("style", "display: none");
      ValidarBtnTerminarLlamada();

      $(".switch_cita2").bootstrapSwitch({
        onText: "SI",
        offText: "NO",
        onColor: "success",
        offColor: "danger",
      });

      // Estado del switch Cita 2
      $(".switch_cita2").on("switchChange.bootstrapSwitch", function (
        event,
        state
      ) {
        if (state) {
          form.steps("insert", 3, stepCita);
          InicializarFormCitas();
          ValidarBtnTerminarLlamada();
        } else {
          form.steps("remove", 3);
          EliminarStepCita();
          ValidarBtnTerminarLlamada();
        }
      });
    } else {
      if ($(".switch_cita2").bootstrapSwitch("state")) {
        $(".switch_cita2").bootstrapSwitch("state", false);
      }

      form.steps("remove", 2);
      $("#ValidacionCita").removeAttr("style");
      ValidarBtnTerminarLlamada();
    }
  });

  // Operador cliente
  $("#txtOperador").change(function () {
    let Id_Operador_Cita = parseInt($("#txtOperador option:selected").val());
    CargarOperadoresCita(Id_Operador_Cita);
  });

  // Ubicación cliente

  $("#txtPais").change(function () {
    let DatosUbicacion = JSON.parse(sessionStorage.getItem("DatosUbicacion"));
    let Departamentos = DatosUbicacion.Departamentos;
    let Id_Pais = parseInt($("#txtPais option:selected").val());

    let arrayDepartamentos = [];

    for (let item of Departamentos) {
      if (parseInt(item.Id_Pais) === Id_Pais) {
        arrayDepartamentos.push(item);
      }
    }

    CargarDepartamentos(arrayDepartamentos, false);
    $("#txtDepartamento").trigger("change");
  });

  $("#txtDepartamento").change(function () {
    let DatosUbicacion = JSON.parse(sessionStorage.getItem("DatosUbicacion"));
    let Municipios = DatosUbicacion.Municipios;
    let Id_Departamento = parseInt($("#txtDepartamento option:selected").val());

    let arrayMunicipios = [];

    for (let item of Municipios) {
      if (parseInt(item.Id_Departamento) === Id_Departamento) {
        arrayMunicipios.push(item);
      }
    }

    CargarMunicipios(arrayMunicipios, false);
    $("#txtMunicipio").trigger("change");
  });

  $("#txtMunicipio").change(function () {
    let Id_Municipio = parseInt($("#txtMunicipio option:selected").val());
    let Id_SubTipo = parseInt($("#txtSubTipo option:selected").val());

    PonerBarrios_Veredas(Id_Municipio, Id_SubTipo, false);
  });

  $("#txtSubTipo").change(function () {
    let Id_Municipio = parseInt($("#txtMunicipio option:selected").val());
    let Id_SubTipo = parseInt($("#txtSubTipo option:selected").val());

    PonerBarrios_Veredas(Id_Municipio, Id_SubTipo, false);
  });

  // Botones detalle líneas

  $("#btnLimpiar").click(function () {
    LimpiarDetalleLinea();
  });

  $("#btnGuardarDetalleLineas").click(function () {
    form.validate().settings.ignore = ":disabled,:hidden, .valDetalle";
    if (form.valid()) {
      $("#txtDetalleId").val() == "0"
        ? RegistrarDetalleLinea()
        : EditarDetalleLinea();

      // Editar linea
      ObtenerDataLineasEditar();

      // Eliminar línea.
      EliminarDetalleLinea();
    }
  });

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

  // Terminar llamada
  $("#btnTerminarLlamada").click(function () {
    TerminarLlamada = true;
    form.steps("skip", 1);
    form.steps("next");
    Validacion_RegistrarCliente = false;
  });

  // Verificar Datos
  $("#btnVerificarDatos").click(function () {
    detenerCronometroLlamada();
    iniciarCronometroVerificar();
  });

  // Resumen Cita
  // NIT
  // $("#txtNIT").change(function () {

  // });

  // Factura
  $(".switch_factura").on("switchChange.bootstrapSwitch", function (
    event,
    state
  ) {
    if (state) {
      $("#resumenCitaFactura").attr("checked", true);
    } else {
      $("#resumenCitaFactura").removeAttr("checked");
    }
  });

  // Habeas Data
  $(".switch_habeas_data").on("switchChange.bootstrapSwitch", function (
    event,
    state
  ) {
    if (state) {
      $("#resumenCitaHD").attr("checked", true);
    } else {
      $("#resumenCitaHD").removeAttr("checked");
    }
  });
});

// FUNCIONES:

let ValidacionesCita = () => {
  let validacion = false;
  let estadoDireccion = $(".switch_direccion").bootstrapSwitch("state");
  let estadoNIT = $(".switch_nit").bootstrapSwitch("state");
  if (estadoDireccion && estadoNIT) {
    validacion = true;
  } else {
    if (estadoDireccion == false) {
      $.toast({
        heading: "¡Error!",
        text:
          '<p class="jq-toast-body">La dirección para la cita no es válida, por tanto no se puede registrar la cita.</p>',
        position: "top-right",
        loaderBg: "#ff6849",
        icon: "error",
        hideAfter: 5000,
        showHideTransition: "slide",
      });
    }
    if (estadoNIT == false) {
      $.toast({
        heading: "¡Error!",
        text:
          '<p class="jq-toast-body">El NIT de la empresa no es válido, por tanto no se puede registrar la cita.</p>',
        position: "top-right",
        loaderBg: "#ff6849",
        icon: "error",
        hideAfter: 5000,
        showHideTransition: "slide",
      });
    }
  }
  return validacion;
};

let RegistrarLlamadaNP = () => {
  ObtenerSession().then((data) => {
    let Id_Usuario = parseInt(data.session.Id_Usuario);

    // Array Lineas
    let arrayLineas = [];

    let Cantidad_Total_Lineas = 0;
    let Valor_Total_Mensual = 0;

    if (localStorage.ServiciosMoviles) {
      let ServiciosMoviles = JSON.parse(localStorage.ServiciosMoviles);

      let GrupoLineas = 0;
      for (let lineaItem of ServiciosMoviles) {
        let redes = "";
        if (lineaItem.redesSociales.length > 0) {
          for (let red of lineaItem.redesSociales) {
            redes = redes + red + ", ";
            redes = redes.trim();
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

        // Establecer valor total mensual de la totalidad de lineas.
        Valor_Total_Mensual += parseInt(lineaItem.cargoBasicoMensual);

        GrupoLineas++;
        for (let i = 0; i < parseInt(lineaItem.cantidadLineas); i++) {
          let linea = {
            minutos: lineaItem.minutos,
            navegacion: lineaItem.navegacion,
            mensajes: lineaItem.mensajes,
            redes: redes,
            minutosLDI: minLDI,
            cantidadLDI: cantidadLDI,
            serviciosAdicionales: serviciosAdicionales,
            cargoBasicoMensual: lineaItem.cargoBasicoMensual,
            grupo: GrupoLineas,
          };

          arrayLineas.push(linea);
        }
      }

      Cantidad_Total_Lineas = arrayLineas.length;
    }

    let arrayRazones = $("#txtRazones").val();
    let stringRazones = "";

    if (typeof arrayRazones !== "undefined") {
      arrayRazones.forEach(function (razon, index, array) {
        if (index == 0) {
          stringRazones += razon + ", ";
        } else {
          stringRazones += razon + ", ";
        }
      });
    }

    let Id_Estado_Llamada = parseInt($("#txtConclusion").val());
    let txtDuracion_Llamada =
      "00:" + $("#txtMinutosL").text() + ":" + $("#txtSegundosL").text();
    let datos = {
      // Llamada
      Id_Usuario: Id_Usuario,
      Persona_Responde:
        $("#txtPersona_Responde").val() == ""
          ? null
          : $("#txtPersona_Responde").val(),
      Info_Habeas_Data: $(".switch_habeas_data").bootstrapSwitch("state")
        ? 1
        : 0,
      Observacion: $("#txtObservacion").val(),
      Tipo_Llamada: 1,
      Id_Estado_Llamada: Id_Estado_Llamada,
      Duracion_Llamada: txtDuracion_Llamada,
      // Cliente
      Razon_Social: $("#txtRazonSocial").val(),
      Telefono: $("#txtTelefono").val(),
      NIT_CDV: $("#txtNIT").val(),
      Encargado: $("#txtEncargado").val(),
      Ext_Tel_Contacto: $("#txtExt_Tel_Contacto").val(),
      Barrio_Vereda: parseInt($("#txtNombre_Lugar").val()),
      Direccion: $("#txtDireccion").val(),
      //DBL
      Id_Operador: parseInt($("#txtOperador").val()),
      Id_Calificacion_Operador: parseInt($("#txtCalificacion").val()),
      Razones: stringRazones,
      Cantidad_Lineas: Cantidad_Total_Lineas,
      Valor_Mensual: Valor_Total_Mensual.toString(),
      ServiciosFijos: JSON.parse(localStorage.getItem("ServiciosFijos")),
      ServiciosMoviles: arrayLineas,

      // Validación
      Validacion_Registro_Cliente: Validacion_RegistrarCliente,
      Validacion_PLan_C: false,
      Validacion_Doc_S: false,
      Validacion_Cita: false,
    };

    if (Id_Estado_Llamada == 3) {
      Object.defineProperty(datos, "Fecha_LP", {
        value: Fecha_LP,
        enumerable: true,
      });
    }

    // Validar si el cliente es válido
    if (Validacion_RegistrarCliente) {
      // Si tiene corporativo.
      if ($(".switch_corporativo").bootstrapSwitch("state")) {
        let switchClausula = $("#switchClausula")
          .children("label")
          .children("input");

        datos.Validacion_PLan_C = true;

        Object.defineProperties(datos, {
          Clausula: {
            value: switchClausula[0].checked ? 1 : 0,
            enumerable: true,
          },
          Fecha_Inicio: {
            value: $("#txtFecha_inicio").val(),
            enumerable: true,
          },
          Fecha_Fin: {
            value: $("#txtFecha_fin").val(),
            enumerable: true,
          },
          Descripcion: {
            value: $("#txtDescripcion").val(),
            enumerable: true,
          },
        });
      }

      // Si se agenda cita.
      if (
        $(".switch_cita1").bootstrapSwitch("state") === true ||
        $(".switch_cita2").bootstrapSwitch("state") === true
      ) {
        let txtDuracion_Verificacion =
          "00:" + $("#txtMinutosV").text() + ":" + $("#txtSegundosV").text();
        let switchRL = $("#switchRL").children("label").children("input");
        datos.Validacion_Cita = true;
        // Hora cita
        let horaCita = "11:00:00";

        // Fecha Cita
        let fechaCita = Fecha_Cita + " " + horaCita;

        // Estado Cita
        // 2 -> sin gestionar en BD
        let Estado_Cita = 2;
        if (Enviar_Cita_Despues) {
          // 1 -> sin confirmar en BD
          Estado_Cita = 1;
          Object.defineProperty(datos, "Fecha_LP", {
            value: Fecha_LP,
            enumerable: true,
          });
        }

        Object.defineProperties(datos, {
          Encargado_Cita: {
            value: $("#txtEncargado_Cita").val(),
            enumerable: true,
          },
          Ext_Tel_ContactoEC: {
            value: $("#txtExt_Tel_ContactoEC").val(),
            enumerable: true,
          },
          Representante_Legal: {
            value: switchRL[0].checked ? 1 : 0,
            enumerable: true,
          },
          Fecha_Cita: {
            value: fechaCita,
            enumerable: true,
          },
          Duracion_Verificacion: {
            value: txtDuracion_Verificacion,
            enumerable: true,
          },
          Direccion_Cita: {
            value: $("#txtDireccion_Cita").val(),
            enumerable: true,
          },
          Barrios_Veredas_Cita: {
            value: parseInt($("#txtNombre_LugarCita").val()),
            enumerable: true,
          },
          Lugar_Referencia: {
            value: $("#txtPuntoReferencia").val(),
            enumerable: true,
          },
          Id_Operador_Cita: {
            value: parseInt($("#txtOperadorCita").val()),
            enumerable: true,
          },
          Id_Estado_Cita: {
            value: Estado_Cita,
            enumerable: true,
          },
          Id_Estado_Cita: {
            value: Estado_Cita,
            enumerable: true,
          },
        });
      }
    }
    console.log(datos);
    // $.ajax({
    //   url: `${URL}/Llamadas/LlamadaNP`,
    //   dataType: "json",
    //   type: "post",
    //   contentType: "aplication/json",
    //   data: JSON.stringify(datos),
    //   processData: false,
    //   success: function (respuesta) {
    //     if (respuesta.data.ok) {
    //       //se envía notifiación a coordinadores y administrador
    //       clientesSocket.emit("Notificar");

    //       swal(
    //         {
    //           title: "Registro exitoso.",
    //           type: "success",
    //           showCancelButton: false,
    //           confirmButtonColor: "#2F6885",
    //           confirmButtonText: "Continuar",
    //           closeOnConfirm: false,
    //         },
    //         function (isConfirm) {
    //           if (isConfirm) {
    //             sessionStorage.removeItem("DetalleLineas");
    //             location.href = Redireccionar("/Llamadas");
    //           }
    //         }
    //       );
    //     } else {
    //       swal(
    //         {
    //           title: "Error al registrar.",
    //           text: "Ha ocurrido un error al registrar, intenta de nuevo",
    //           type: "error",
    //           showCancelButton: false,
    //           confirmButtonColor: "#2F6885",
    //           confirmButtonText: "Continuar",
    //           closeOnConfirm: false,
    //         },
    //         function (isConfirm) {
    //           if (isConfirm) {
    //             location.href = "Llamadas.html";
    //             console.log(respuesta.data);
    //           }
    //         }
    //       );
    //     }
    //   },
    //   error: function (error) {
    //     console.log(error);
    //     swal(
    //       {
    //         title: "Error al registrar.",
    //         text: "Error en el servidor, contacta al administrador",
    //         type: "error",
    //         showCancelButton: false,
    //         confirmButtonColor: "#2F6885",
    //         confirmButtonText: "Continuar",
    //         closeOnConfirm: false,
    //       },
    //       function (isConfirm) {
    //         if (isConfirm) {
    //           location.href = "AgregarEmpresa.html";
    //         }
    //       }
    //     );
    //   },
    // });
  });
};

let InicializarFormCitas = () => {
  // Operador cita
  let Id_Operador_Cita = parseInt($("#txtOperador option:selected").val());
  CargarOperadoresCita(Id_Operador_Cita);

  // Fecha hora Cita
  $("#date-format")
    .bootstrapMaterialDatePicker({
      lang: "es",
      format: "dddd DD MMMM YYYY",
      minDate: new Date(),
      switchOnClick: true,
      time: false,
      weekStart: 1,
      // maxDate: moment().add(10, 'days'),
      disabledDays: [6, 7],
      clearButton: true,
      nowButton: true,
      cancelText: "Cancelar",
      clearText: "Limpiar",
      nowText: "Fecha actual",
    })
    .on("change", function (e, date) {
      if (typeof date != "undefined") {
        let fechaCitaInput = new Date(date._d);
        let anio = fechaCitaInput.getFullYear();
        let mes = fechaCitaInput.getMonth() + 1;
        if (mes < 10) {
          mes = "0" + mes;
        }
        let dia = fechaCitaInput.getDate();
        Fecha_Cita = `${anio}-${mes}-${dia}`;
        // Resumen cita
        $("#resumenCitaFecha").attr("checked", true);
      } else {
        $("#resumenCitaFecha").removeAttr("checked");
      }
    });

  $("#btnHoraCita").change(function () {
    $("#resumenCitaHora").attr("checked", true);
  });

  // Ubicación cita
  let DatosUbicacion = JSON.parse(sessionStorage.getItem("DatosUbicacion"));
  CargarPaises(DatosUbicacion.Paises, true);
  CargarSubTipos(DatosUbicacion.Subtipos, true);

  // Enlazar eventos de escucha

  $("#lbltxtValEncargadoCita").click(function () {
    let estado = $("input:checkbox[name=txtValEncargadoCita]").is(":checked");
    let estado2 = !estado;

    if (estado2) {
      // Encargado
      let Encargado = $("#txtEncargado").val();
      $("#txtEncargado_Cita").val(Encargado);

      // Extensión telefono contacto
      let Ext_Tel_Contacto = $("#txtExt_Tel_Contacto").val();
      $("#txtExt_Tel_ContactoEC").val(Ext_Tel_Contacto);
    }
  });

  $("input:radio[id=Validacion_Ubicacion2]").click(function () {
    let estado = $("input:radio[id=Validacion_Ubicacion2]").is(":checked");
    if (estado) {
      CargarDatosUbicacionRadio(true);
    }
  });

  $("input:radio[id=ValAtiendeEmpresa]").click(function () {
    let estado = $("input:radio[id=ValAtiendeEmpresa]").is(":checked");
    if (estado) {
      DatosUbicacionEmpresa();
      EnlazarUbicacionEmpresa = true;
    }
  });

  $("#txtPaisCita").change(function () {
    let DatosUbicacion = JSON.parse(sessionStorage.getItem("DatosUbicacion"));
    let Departamentos = DatosUbicacion.Departamentos;
    let Id_Pais = parseInt($("#txtPaisCita option:selected").val());

    let arrayDepartamentos = [];

    for (let item of Departamentos) {
      if (parseInt(item.Id_Pais) === Id_Pais) {
        arrayDepartamentos.push(item);
      }
    }
    CargarDepartamentos(arrayDepartamentos, true);
    $("#txtDepartamentoCita").trigger("change");

    if (EnlazarUbicacionEmpresa) {
      let Paises = DatosUbicacion.Paises;
      CargarPaises(Paises, false, Id_Pais);
      $("#txtPais").trigger("change");
    }
  });

  $("#txtDepartamentoCita").change(function () {
    let DatosUbicacion = JSON.parse(sessionStorage.getItem("DatosUbicacion"));
    let Municipios = DatosUbicacion.Municipios;
    let Id_Departamento = parseInt(
      $("#txtDepartamentoCita option:selected").val()
    );

    let arrayMunicipios = [];

    for (let item of Municipios) {
      if (parseInt(item.Id_Departamento) === Id_Departamento) {
        arrayMunicipios.push(item);
      }
    }
    CargarMunicipios(arrayMunicipios, true);
    $("#txtMunicipioCita").trigger("change");

    if (EnlazarUbicacionEmpresa) {
      let Departamentos = DatosUbicacion.Departamentos;
      CargarDepartamentos(Departamentos, false, Id_Departamento);
      $("#txtDepartamento").trigger("change");
    }
  });

  $("#txtMunicipioCita").change(function () {
    let Id_Municipio = parseInt($("#txtMunicipioCita option:selected").val());
    let Id_SubTipo = parseInt($("#txtSubTipoCita option:selected").val());
    PonerBarrios_Veredas(Id_Municipio, Id_SubTipo, true);
    if (EnlazarUbicacionEmpresa) {
      $("#txtMunicipio").trigger("change");
    }
  });

  $("#txtSubTipoCita").change(function () {
    let Id_Municipio = parseInt($("#txtMunicipioCita option:selected").val());
    let Id_SubTipo = parseInt($("#txtSubTipoCita option:selected").val());
    PonerBarrios_Veredas(Id_Municipio, Id_SubTipo, true);

    if (EnlazarUbicacionEmpresa) {
      $("#txtSubTipo").trigger("change");
    }
  });

  $("#txtNombre_LugarCita").change(function () {
    if (EnlazarUbicacionEmpresa) {
      let DatosUbicacion = JSON.parse(sessionStorage.getItem("DatosUbicacion"));
      let Barrios_Veredas = DatosUbicacion.Barrios_Veredas;
      let Id_Barrios_Veredas = parseInt(
        $("#txtNombre_LugarCita option:selected").val()
      );
      CargarBarrios_Veredas(Barrios_Veredas, false, Id_Barrios_Veredas);
    }
  });

  $("#txtDireccion_Cita").click(function () {
    ValDireccionCita = true;
    $("#modalDireccion").modal("show");
  });

  $("#txtDireccion_Cita").change(function () {
    $("#resumenCitaDireccion").attr("checked", true);
    if (EnlazarUbicacionEmpresa) {
      let direccion = $("#txtDireccion_Cita").val();
      $("#txtDireccion").val(direccion);
    }
  });

  // Validaciones Cita
  $("#ValidacionesCita").removeAttr("style");
  $("#lbReprogramarLlamada").text("Enviar cita después:");

  $(".switch_factura").bootstrapSwitch({
    onText: "SI",
    offText: "NO",
    onColor: "success",
    offColor: "danger",
  });

  $(".switch_direccion").bootstrapSwitch({
    onText: "Válida",
    offText: "Inválida",
    onColor: "success",
    offColor: "danger",
  });

  $(".switch_nit").bootstrapSwitch({
    onText: "Válido",
    offText: "Inválido",
    onColor: "success",
    offColor: "danger",
  });

  // Conclusión llamada
  ModificarConclusionLlamada(3);

  $("#btnVerificarDatos").removeAttr("disabled");
};

let EliminarStepCita = () => {
  $("#lbReprogramarLlamada").text("Llamar nuevamente:");
  $("#ValidacionesCita").attr("style", "display:none");

  // Conclusión llamada
  ModificarConclusionLlamada(1);
  $("#btnVerificarDatos").prop("disabled", true);
};

let ModificarConclusionLlamada = (valSelect) => {
  let arrayConclusion = $("#txtConclusion option");

  for (let item of arrayConclusion) {
    let valor = parseInt($(item).val());

    if (valor == valSelect) {
      $(item).removeAttr("disabled");
      $(item).attr("selected", true);
    } else {
      $(item).removeAttr("selected");
      $(item).attr("disabled", true);
    }
  }
};

let FormatearFecha = (fecha, tiempo) => {
  let fechaFormateada = null;
  let fechaCitaInput = new Date(fecha);
  let anio = fechaCitaInput.getFullYear();
  let mes = fechaCitaInput.getMonth() + 1;
  let dia = fechaCitaInput.getDate();

  mes > 10 ? (mes = "0" + mes) : (mes = mes);
  dia > 10 ? (dia = "0" + dia) : (dia = dia);

  if (tiempo) {
    let horas = fechaCitaInput.getHours();
    let minutos = fechaCitaInput.getMinutes();

    horas < 10 ? (horas = "0" + horas) : (horas = horas);
    minutos < 10 ? (minutos = "0" + minutos) : (minutos = minutos);

    fechaFormateada = `${anio}-${mes}-${dia} ${horas}:${minutos}:00`;
  } else {
    fechaFormateada = `${anio}-${mes}-${dia}`;
  }

  return fechaFormateada;
};

let ValidarBtnTerminarLlamada = () => {
  if (
    $(".switch_corporativo").bootstrapSwitch("state") == true ||
    $(".switch_cita1").bootstrapSwitch("state") === true ||
    $(".switch_cita2").bootstrapSwitch("state") === true
  ) {
    $("#btnTerminarLlamada").prop("disabled", true);
  } else {
    $("#btnTerminarLlamada").removeAttr("disabled");
  }
};

let CargarDatosUbicacion = () => {
  $.ajax({
    url: `${URL}/Cliente/Datos/Ubicacion`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      sessionStorage.DatosUbicacion = JSON.stringify(datos.data);

      CargarPaises(datos.data.Paises);
      CargarSubTipos(datos.data.Subtipos);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let CargarPaises = (datos, Cita, Id_Pais) => {
  let selector = null;
  if (Cita) {
    selector = "#txtPaisCita";
  } else {
    selector = "#txtPais";
  }

  $(selector).empty();
  if (Id_Pais) {
    for (let item of datos) {
      let opcion = null;
      if (parseInt(item.Id_Pais) == Id_Pais) {
        opcion = $("<option />", {
          text: `${item.Nombre_Pais}`,
          value: `${item.Id_Pais}`,
          selected: true,
        });
        $(selector).append(opcion);
      } else {
        let opcion = $("<option />", {
          text: `${item.Nombre_Pais}`,
          value: `${item.Id_Pais}`,
        });
        $(selector).append(opcion);
      }
    }
  } else {
    $(selector).prepend("<option selected disabled >Seleccione...</option>");
    for (let item of datos) {
      let opcion = $("<option />", {
        text: `${item.Nombre_Pais}`,
        value: `${item.Id_Pais}`,
      });
      $(selector).append(opcion);
    }
  }
};

let CargarDepartamentos = (datos, Cita, Id_Departamento) => {
  let selector = null;
  if (Cita) {
    selector = "#txtDepartamentoCita";
  } else {
    selector = "#txtDepartamento";
  }

  $(selector).empty();
  if (Id_Departamento) {
    for (let item of datos) {
      let opcion = null;
      if (parseInt(item.Id_Departamento) == Id_Departamento) {
        opcion = $("<option />", {
          text: `${item.Nombre_Departamento}`,
          value: `${item.Id_Departamento}`,
          selected: true,
        });
        $(selector).append(opcion);
      } else {
        let opcion = $("<option />", {
          text: `${item.Nombre_Departamento}`,
          value: `${item.Id_Departamento}`,
        });
        $(selector).append(opcion);
      }
    }
  } else {
    $(selector).prepend("<option selected disabled >Seleccione...</option>");
    for (let item of datos) {
      let opcion = $("<option />", {
        text: `${item.Nombre_Departamento}`,
        value: `${item.Id_Departamento}`,
      });

      $(selector).append(opcion);
    }
  }
};

let CargarMunicipios = (datos, Cita, Id_Municipio) => {
  let selector = null;
  if (Cita) {
    selector = "#txtMunicipioCita";
  } else {
    selector = "#txtMunicipio";
  }

  $(selector).empty();
  if (Id_Municipio) {
    for (let item of datos) {
      let opcion = null;
      if (parseInt(item.Id_Municipio) == Id_Municipio) {
        opcion = $("<option />", {
          text: `${item.Nombre_Municipio}`,
          value: `${item.Id_Municipio}`,
          selected: true,
        });
        $(selector).append(opcion);
      } else {
        let opcion = $("<option />", {
          text: `${item.Nombre_Municipio}`,
          value: `${item.Id_Municipio}`,
        });

        $(selector).append(opcion);
      }
    }
  } else {
    $(selector).prepend("<option selected disabled >Seleccione...</option>");
    for (let item of datos) {
      let opcion = $("<option />", {
        text: `${item.Nombre_Municipio}`,
        value: `${item.Id_Municipio}`,
      });

      $(selector).append(opcion);
    }
  }
};

let CargarSubTipos = (datos, Cita, Id_SubTipo) => {
  let selector = null;
  if (Cita) {
    selector = "#txtSubTipoCita";
  } else {
    selector = "#txtSubTipo";
  }

  $(selector).empty();
  if (Id_SubTipo) {
    for (let item of datos) {
      let opcion = null;
      if (parseInt(item.Id_SubTipo_Barrio_Vereda) == Id_SubTipo) {
        opcion = $("<option />", {
          text: `${item.SubTipo}`,
          value: `${item.Id_SubTipo_Barrio_Vereda}`,
          selected: true,
        });
        $(selector).append(opcion);
      } else {
        let opcion = $("<option />", {
          text: `${item.SubTipo}`,
          value: `${item.Id_SubTipo_Barrio_Vereda}`,
        });
        $(selector).append(opcion);
      }
    }
  } else {
    $(selector).prepend("<option selected disabled >Seleccione...</option>");
    for (let item of datos) {
      let opcion = $("<option />", {
        text: `${item.SubTipo}`,
        value: `${item.Id_SubTipo_Barrio_Vereda}`,
      });
      $(selector).append(opcion);
    }
  }
};

let CargarBarrios_Veredas = (datos, Cita, Id_Barrios_Veredas) => {
  let selector = null;
  if (Cita) {
    selector = "#txtNombre_LugarCita";
  } else {
    selector = "#txtNombre_Lugar";
  }

  $(selector).empty();
  if (Id_Barrios_Veredas) {
    for (let item of datos) {
      let opcion = null;
      if (parseInt(item.Id_Barrios_Veredas) == Id_Barrios_Veredas) {
        opcion = $("<option />", {
          text: `${item.Nombre_Barrio_Vereda}`,
          value: `${item.Id_Barrios_Veredas}`,
          selected: true,
        });
        $(selector).append(opcion);
      } else {
        let opcion = $("<option />", {
          text: `${item.Nombre_Barrio_Vereda}`,
          value: `${item.Id_Barrios_Veredas}`,
        });
        $(selector).append(opcion);
      }
    }
  } else {
    $(selector).prepend("<option selected disabled >Seleccione...</option>");
    for (let item of datos) {
      let $opcion = $("<option />", {
        text: `${item.Nombre_Barrio_Vereda}`,
        value: `${item.Id_Barrios_Veredas}`,
      });

      $(selector).append($opcion);
    }
  }
};

let PonerBarrios_Veredas = (
  Id_Municipio,
  Id_SubTipo,
  Cita,
  Id_Barrio_Veredas
) => {
  let DatosUbicacion = JSON.parse(sessionStorage.getItem("DatosUbicacion"));
  let Municipios = DatosUbicacion.Municipios;
  let Subtipos = DatosUbicacion.Subtipos;
  let Barrios_Veredas = DatosUbicacion.Barrios_Veredas;

  let arrayBarrios_Veredas = [];

  for (let item of Barrios_Veredas) {
    if (parseInt(item.Id_Municipio) === Id_Municipio) {
      if (parseInt(item.Id_SubTipo_Barrio_Vereda) === Id_SubTipo) {
        arrayBarrios_Veredas.push(item);
      }
    }
  }
  if (Id_Barrio_Veredas) {
    CargarBarrios_Veredas(arrayBarrios_Veredas, Cita, Id_Barrio_Veredas);
  } else {
    CargarBarrios_Veredas(arrayBarrios_Veredas, Cita);
  }
  if (EnlazarUbicacionEmpresa) {
    if (!isNaN(Id_Municipio)) {
      CargarMunicipios(Municipios, false, Id_Municipio);
    }
    if (!isNaN(Id_SubTipo)) {
      CargarSubTipos(Subtipos, false, Id_SubTipo);
    }
  }
};

let CargarOperadores = () => {
  $.ajax({
    url: `${URL}/Operador`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      $("#txtOperador").empty();
      $("#txtOperador").prepend(
        "<option selected disabled >Seleccione...</option>"
      );
      for (let item of datos.data) {
        let $opcion = $("<option />", {
          text: `${item.Nombre_Operador}`,
          value: `${item.Id_Operador}`,
        });

        $("#txtOperador").append($opcion);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let CargarCalificaciones = () => {
  $.ajax({
    url: `${URL}/Calificaciones`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      $("#txtCalificacion").empty();
      $("#txtCalificacion").prepend(
        "<option selected disabled >Seleccione...</option>"
      );
      for (let item of datos.data) {
        let $opcion = $("<option />", {
          text: `${item.Calificacion}`,
          value: `${item.Id_Calificacion_Operador}`,
        });

        $("#txtCalificacion").append($opcion);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let CargarOpcionesPredefinidas = () => {
  $.ajax({
    url: `${URL}/OpcionesPredefinidas`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      $("#txtRazones").empty();
      $("#txtDetallle_Redes_Sociales").empty();
      $("#txtDetalle_Servicios_Adicionales").empty();
      $("#txtRazonesLlamada").empty();
      $("#txtDetalleMinutosLDI").empty();

      for (let item of datos.data) {
        let opcion = $("<option />", {
          text: `${item.Opcion}`,
          value: `${item.Opcion}`,
        });

        if (item.Categoria == "Operador") {
          $("#txtRazones").append(opcion);
        } else if (item.Categoria == "Redes Sociales") {
          $("#txtDetallle_Redes_Sociales").append(opcion);
        } else if (item.Categoria == "Servicios Adicionales") {
          $("#txtDetalle_Servicios_Adicionales").append(opcion);
        } else if (item.Categoria == "Llamada") {
          $("#txtRazonesLlamada").append(opcion);
        } else if (item.Categoria == "País LDI") {
          $("#txtDetalleMinutosLDI").append(opcion);
        }
      }

      //  Selects input
      $("#txtRazones").select2({
        tags: true,
        tokenSeparators: [","],
      });
      $("#txtDetalleMinutosLDI").select2({
        multiple: true,
        tags: true,
        tokenSeparators: [","],
      });
      $("#txtDetallle_Redes_Sociales").select2({
        multiple: true,
        tags: true,
        tokenSeparators: [","],
      });
      $("#txtDetalle_Servicios_Adicionales").select2({
        multiple: true,
        tags: true,
        tokenSeparators: [","],
      });
      $("#txtRazonesLlamada").select2({
        tags: true,
        tokenSeparators: [","],
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
};

// Cita

let CargarOperadoresCita = (Id_Operador_Cliente) => {
  $.ajax({
    url: `${URL}/Operador`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      $("#txtOperadorCita").empty();
      $("#txtOperadorCita").prepend(
        "<option selected disabled >Seleccione...</option>"
      );
      let opcion = null;
      for (let item of datos.data) {
        if (parseInt(item.Id_Operador) == Id_Operador_Cliente) {
          $opcion = $("<option />", {
            text: `${item.Nombre_Operador}`,
            value: `${item.Id_Operador}`,
            disabled: true,
          });
        } else {
          $opcion = $("<option />", {
            text: `${item.Nombre_Operador}`,
            value: `${item.Id_Operador}`,
          });
        }

        $("#txtOperadorCita").append($opcion);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let CargarDatosUbicacionRadio = (cita) => {
  // Arrays
  let DatosUbicacion = JSON.parse(sessionStorage.getItem("DatosUbicacion"));
  let Paises = DatosUbicacion.Paises;
  let Departamentos = DatosUbicacion.Departamentos;
  let Municipios = DatosUbicacion.Municipios;
  let Subtipos = DatosUbicacion.Subtipos;

  // Id
  let Id_Pais = null;
  let Id_Departamento = null;
  let Id_Municipio = null;
  let Id_SubTipo = null;

  for (let item of Paises) {
    if (item.Nombre_Pais == "Colombia") {
      Id_Pais = parseInt(item.Id_Pais);
    }
  }
  for (let item of Departamentos) {
    if (item.Nombre_Departamento == "Antioquia") {
      Id_Departamento = parseInt(item.Id_Departamento);
    }
  }
  for (let item of Municipios) {
    if (
      item.Nombre_Municipio == "Medellín" ||
      item.Nombre_Municipio == "Medellin"
    ) {
      Id_Municipio = parseInt(item.Id_Municipio);
    }
  }
  for (let item of Subtipos) {
    if (item.SubTipo == "Barrio") {
      Id_SubTipo = parseInt(item.Id_SubTipo_Barrio_Vereda);
    }
  }

  // Setear valores en el select

  CargarPaises(Paises, cita, Id_Pais);
  CargarDepartamentos(Departamentos, cita, Id_Departamento);
  CargarMunicipios(Municipios, cita, Id_Municipio);
  CargarSubTipos(Subtipos, cita, Id_SubTipo);
  PonerBarrios_Veredas(Id_Municipio, Id_SubTipo, cita);
};

let DatosUbicacionEmpresa = () => {
  // Arrays
  let DatosUbicacion = JSON.parse(sessionStorage.getItem("DatosUbicacion"));
  let Paises = DatosUbicacion.Paises;
  let Departamentos = DatosUbicacion.Departamentos;
  let Municipios = DatosUbicacion.Municipios;
  let Subtipos = DatosUbicacion.Subtipos;

  // Id
  let Id_Pais = parseInt($("#txtPais").val());
  let Id_Departamento = parseInt($("#txtDepartamento").val());
  let Id_Municipio = parseInt($("#txtMunicipio").val());
  let Id_SubTipo = parseInt($("#txtSubTipo").val());
  let Id_Barrio_Veredas = parseInt($("#txtNombre_Lugar").val());
  // Setear valores en el select
  CargarPaises(Paises, true, Id_Pais);
  CargarDepartamentos(Departamentos, true, Id_Departamento);
  CargarMunicipios(Municipios, true, Id_Municipio);
  CargarSubTipos(Subtipos, true, Id_SubTipo);
  PonerBarrios_Veredas(Id_Municipio, Id_SubTipo, true, Id_Barrio_Veredas);
  let Direccion = $("#txtDireccion").val();
  $("#txtDireccion_Cita").val(Direccion);
};

// Detalle Líneas

let RegistrarDetalleLinea = () => {
  let ServiciosMoviles = [];
  if (localStorage.ServiciosMoviles) {
    ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMoviles"));
  }

  // Servicios fijos
  RegistrarServiciosFijo();

  // Servicios móviles
  let arrayDetalleLinea = ObtenerDatosServiciosMoviles();

  let data = [
    arrayDetalleLinea.cantidadLineas,
    arrayDetalleLinea.cargoBasicoMensual,
    arrayDetalleLinea.navegacion,
    arrayDetalleLinea.minutos,
    arrayDetalleLinea.mensajes,
    arrayDetalleLinea.redesSociales,
    arrayDetalleLinea.minutosLDI,
    arrayDetalleLinea.cantidadLDI,
    arrayDetalleLinea.serviciosAdicionales,
    arrayDetalleLinea.id,
  ];

  ServiciosMoviles.push(arrayDetalleLinea);
  localStorage.ServiciosMoviles = JSON.stringify(ServiciosMoviles);

  LimpiarDetalleLinea();
  ListarDetalleLineas();
};

let ObtenerDataLineasEditar = () => {
  $(document).on("click", "#DetallesLineasEditar", function () {
    let data = DataTableServicios.row($(this).parents("tr")).data();
    $("#txtDetalleId").val(data[9]);
    $("#txtDetalle_Cantidad_Lineas").val(data[0]);
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
      $("#txtDetallle_Redes_Sociales").val(data[5]).trigger("change");
    }
    if (data[8].length > 0) {
      $("#txtDetalle_Servicios_Adicionales").val(data[8]).trigger("change");
    }
  });
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
        servicio.redesSociales,
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
  }
};

let EditarDetalleLinea = () => {
  let idLinea = $("#txtDetalleId").val();
  let ServiciosMoviles = JSON.parse(localStorage.getItem("ServiciosMoviles"));

  ServiciosMoviles.forEach(function (valor, indice, array) {
    if (valor.id == idLinea) {
      ServiciosMoviles.splice(indice, 1);
    }
  });

  // Servicios fijos
  RegistrarServiciosFijo();
  // Servicios móviles
  let arrayDetalleLinea = ObtenerDatosServiciosMoviles();

  ServiciosMoviles.push(arrayDetalleLinea);
  localStorage.ServiciosMoviles = JSON.stringify(ServiciosMoviles);

  LimpiarDetalleLinea();
  ListarDetalleLineas();
};

let LimpiarDetalleLinea = () => {
  $("#txtDetalleId").val(0);
  $("#txtDetalle_Cantidad_Lineas").val("");
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
  $("#txtDetallle_Redes_Sociales").val(null).trigger("change");
  $("#txtDetalle_Servicios_Adicionales").val(null).trigger("change");
};

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
  });
};

let ValidarLlamarCliente = (estadoCliente) => {
  if (estadoCliente == 1) {
    $("#MensajeLabel").empty();
    $("#MensajeLabel").append(`
      <div class="label label-table label-info">
        <h4 class="text-white">
          <i class="fa fa-unlock-alt"></i> Cliente disponible para llamar</div>
        </h4>
      </div>
    `);

    $("#ValidarBtnLlamar").empty();
    $("#ValidarBtnLlamar").append(`
      <div class="row">
        <div class="col-md-6">
          <button type="button" onclick="LlamarClienteRegistrado()" class="btn btn-info">
              <i class="fa fa-phone"></i> Llamar
          </button>
        </div>
      </div>
    `);
  } else {
    $("#MensajeLabel").empty();
    $("#MensajeLabel").append(`
      <div class="label label-table label-danger">
        <h4 class="text-white">
          <i class="fa fa-lock"></i> Cliente <strong>NO</strong> disponible para llamar
        </h4>
      </div>
    `);
  }
};

let ValidarResumenNIT = (validacion) => {
  if (validacion) {
    $("#resumenCitaNIT").attr("checked", true);
  } else {
    $("#resumenCitaNIT").removeAttr("checked");
  }
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
  for (let item of itemsServiciosFijos) {
    $("#ServiciosFijos").append(
      `
      <label class="ServiciosFijosItems" for="checkDetalle_telefonia"><i class="mdi mdi-bookmark-check"></i>
        ${item}
      </label>
      `
    );
  }
};

let ObtenerDatosServiciosMoviles = () => {
  let cargobasico = 0;
  let valorInput = parseFloat($("#txtDetalle_Valor_Mensual").val());
  let cantidadLineas = parseInt($("#txtDetalle_Cantidad_Lineas").val());
  if ($("input:radio[name=detalleLineasRadios]:checked").val() == 1) {
    cargobasico = valorInput / cantidadLineas;
  } else {
    cargobasico = valorInput;
  }
  cargobasico = cargobasico.toFixed(2);

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

  let arrayDetalleLinea = {
    id: uuid.v4(),
    cantidadLineas: cantidadLineas,
    cargoBasicoMensual: cargobasico,
    navegacion: $("#txtDetalleNavegacion").val(),
    minutos: minutos,
    mensajes: mensajes,
    redesSociales: $("#txtDetallle_Redes_Sociales").val(),
    minutosLDI: minutosLDI,
    cantidadLDI: cantidadLDI,
    serviciosAdicionales: $("#txtDetalle_Servicios_Adicionales").val(),
  };

  return arrayDetalleLinea;
};
