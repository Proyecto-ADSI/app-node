// Formulario
var form = null;

// Variables de control
var Reprogramar_Llamada = false;
var Enviar_Cita_Despues = false;
var RecordarCita = false;
var Fecha_Cita = null;
var Fecha_LP = null;
var Fecha_EC = null;
var FinalizarLlamada = false;
var TerminarLlamada = false;
var ClienteNoValido = false;
var NoResponden = false;
var EnlazarUbicacionEmpresa = false;
var ValDireccionCita = false;

$(function () {
  controlServicios = 3;
  iniciarCronometroLlamada();
  // var stepPlanCorp;
  // var stepCita;
  // var stepAT;
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
      stepAT = form.steps("getStep", 4);
      stepFinLlamada = form.steps("getStep", 5);
      stepProgramarFecha = form.steps("getStep", 6);
      stepDiseñarOferta = form.steps("getStep", 7);
      form.steps("remove", 2);
      form.steps("remove", 2);
      form.steps("remove", 2);
      form.steps("remove", 3);
      form.steps("remove", 3);

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
      if (FinalizarLlamada) {
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
      } else {
        GenerarAlertasToast(3);
      }
    },
  }),
    form.validate({
      onkeyup: function (element) {
        if (
          element.id == "txtRazonSocial" ||
          element.id == "txtTelefono" ||
          element.id == "txtNIT"
        ) {
          return false;
        }
      },
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
        } else if (element[0].name == "rbtnEnvioOferta") {
          error.insertAfter($("#lblAtencionTel3"));
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
        //   minlength: 2,
        //   maxlength: 45,
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
        //         $("#DetalleEmpresaCard").attr("style", "display:none");
        //         return '"true"';
        //       } else {
        //         MostarCardDetalleEmpresa(json.data.cliente);
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
        //   minlength: 7,
        //   maxlength: 7,
        //   remote: {
        //     url: `${URL}/Cliente/ValidarCliente/Disponibilidad`,
        //     type: "get",
        //     dataType: "json",
        //     data: {
        //       texto: function (e) {
        //         return $("#txtTelefono").val().trim();
        //       },
        //     },
        //     dataFilter: function (res) {
        //       var json = JSON.parse(res);
        //       if (json.data.ok) {
        //         $("#DetalleEmpresaCard").attr("style", "display:none");
        //         return '"true"';
        //       } else {
        //         MostarCardDetalleEmpresa(json.data.cliente);
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
        //   minlength: 9,
        //   maxlength: 11,
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
        //         $("#DetalleEmpresaCard").attr("style", "display:none");
        //         return '"true"';
        //       } else {
        //         MostarCardDetalleEmpresa(json.data.cliente);
        //         CargarDatosModalDetalles(json.data.cliente);
        //         let Estado_Cliente = parseInt(json.data.cliente.Estado_Cliente);
        //         ValidarLlamarCliente(Estado_Cliente);
        //         return '"NIT ya registrado."';
        //       }
        //     },
        //   },
        // },
        //   txtPersona_Responde: {
        //     required: true,
        //     maxlength: 45,
        //     SoloLetras: true,
        //   },
        //   txtEncargado: {
        //     maxlength: 45,
        //     SoloLetras: true,
        //   },
        //   txtPais: "required",
        //   txtDepartamento: "required",
        //   txtMunicipio: "required",
        //   txtOperador: "required",
        //   txtDetalle_Cantidad_Lineas: {
        //     required: true,
        //     maxlength: 3,
        //     SoloNumeros2: true,
        //   },
        //   txtDetalle_Valor_Mensual: {
        //     required: true,
        //     maxlength: 45,
        //     SoloNumeros2: true,
        //   },
        //   detalleLineasRadios: "required",
        //   txtDetalleNavegacion: {
        //     maxlength: 45,
        //     SoloNumeros: true,
        //   },
        //   txtDetalle_Minutos: {
        //     maxlength: 45,
        //     SoloNumeros: true,
        //   },
        //   txtDetalle_Mensajes: {
        //     maxlength: 45,
        //     SoloNumeros: true,
        //   },
        //   txtDetalle_Cantidad_LDI: {
        //     maxlength: 45,
        //     SoloNumeros: true,
        //   },
        //   // txtFecha_inicio: "required",
        //   // txtFecha_fin: "required",
        // rbtnEnvioOferta: "required",
        // txtCorreo: {
        //   required: true,
        //   maxlength: 45,
        //   ValidarCorreo: true,
        // },
        // txtCodigoPostal: {
        //   required: true,
        //   SoloNumeros: true,
        //   maxlength: 5,
        //   minlength: 1,
        // },
        // txtCelularAT: {
        //   required: true,
        //   NumeroMovil: true,
        //   minlength: 10,
        //   maxlength: 10,
        // },
        // txtOperadorCita: "required",
        // txtFechaCita: "required",
        // btnHoraCita: "required",
        // txtEncargado_Cita: {
        //   required: true,
        //   SoloLetras: true,
        // },
        // txtCelularCita: {
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

  // tooltip
  // InicializarToltips();
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
  $(".switch_AT1").bootstrapSwitch({
    onText: "SI",
    offText: "NO",
    onColor: "success",
    offColor: "danger",
  });

  $(".atencion_tel").bootstrapSwitch({
    onText: "SI",
    offText: "NO",
    onColor: "success",
    offColor: "danger",
  });

  $("input:radio[name=rbtnEnvioOferta]").change(function () {
    let value = parseInt($(this).val());

    switch (value) {
      case 1:
        $("#txtCorreo").removeAttr("disabled");
        $("#txtCodigoPostal").attr("disabled");
        $("#txtCelularAT").attr("disabled", true);
        $("#txtCodigoPostal").attr("disabled", true);
        break;
      case 2:
        $("#txtCodigoPostal").removeAttr("disabled");
        $("#txtCelularAT").removeAttr("disabled");
        $("#txtCorreo").attr("disabled", true);
        break;
      case 3:
        $("#txtCodigoPostal").removeAttr("disabled");
        $("#txtCelularAT").removeAttr("disabled");
        $("#txtCorreo").removeAttr("disabled");
        break;
    }
  });

  $(".switch_habeas_data").bootstrapSwitch({
    onText: "SI",
    offText: "NO",
    onColor: "success",
    offColor: "danger",
  });

  // Llamar nuevamente
  $(".switch_llamarNuevamente").bootstrapSwitch({
    onText: "SI",
    offText: "NO",
    onColor: "success",
    offColor: "danger",
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

  // Estado del switch Cita 1
  $(".switch_cita1").on("switchChange.bootstrapSwitch", function (
    event,
    state
  ) {
    if (state) {
      $(".switch_AT1").bootstrapSwitch("disabled", true);
      $(".switch_corporativo").bootstrapSwitch("disabled", true);
      form.steps("insert", 2, stepCita);
      InicializarFormCitas();
      ValidarBtnTerminarLlamada();
    } else {
      $(".switch_AT1").bootstrapSwitch("disabled", false);
      $(".switch_corporativo").bootstrapSwitch("disabled", false);
      form.steps("remove", 2);
      EliminarStepCita();
      ValidarBtnTerminarLlamada();
    }
  });

  // Estado del switch atención 1
  $(".switch_AT1").on("switchChange.bootstrapSwitch", function (event, state) {
    if (state) {
      $(".switch_cita1").bootstrapSwitch("disabled", true);
      $(".switch_corporativo").bootstrapSwitch("disabled", true);
      form.steps("insert", 2, stepAT);
      form.steps("insert", 4, stepDiseñarOferta);
      $(".ValidacionesLlamada").attr("style", "display:none");
      ModificarConclusionLlamada(3);
      ValidarBtnTerminarLlamada();
    } else {
      $(".switch_cita1").bootstrapSwitch("disabled", false);
      $(".switch_corporativo").bootstrapSwitch("disabled", false);
      form.steps("remove", 2);
      form.steps("remove", 3);
      ModificarConclusionLlamada(1);
      ValidarBtnTerminarLlamada();
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

  // Advertencia servicios
  EnlazarClickAdvertencias();

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

      $(".ValidacionClickCorp").attr("style", "display: none");
      ValidarBtnTerminarLlamada();

      $(".switch_cita2").bootstrapSwitch({
        onText: "SI",
        offText: "NO",
        onColor: "success",
        offColor: "danger",
      });
      $(".switch_AT2").bootstrapSwitch({
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
          $(".switch_AT2").bootstrapSwitch("disabled", true);
          form.steps("insert", 3, stepCita);
          InicializarFormCitas();
          ValidarBtnTerminarLlamada();
        } else {
          $(".switch_AT2").bootstrapSwitch("disabled", false);
          form.steps("remove", 3);
          EliminarStepCita();
          ValidarBtnTerminarLlamada();
        }
      });

      $(".switch_AT2").on("switchChange.bootstrapSwitch", function (
        event,
        state
      ) {
        if (state) {
          $(".switch_corporativo").bootstrapSwitch("disabled", true);
          $(".switch_cita2").bootstrapSwitch("disabled", true);
          form.steps("insert", 3, stepAT);
          form.steps("insert", 5, stepDiseñarOferta);
          $(".ValidacionesLlamada").attr("style", "display:none");
          ModificarConclusionLlamada(3);
        } else {
          $(".switch_corporativo").bootstrapSwitch("disabled", false);
          $(".switch_cita2").bootstrapSwitch("disabled", false);
          form.steps("remove", 3);
          form.steps("remove", 4);
          ModificarConclusionLlamada(1);
        }
      });
    } else {
      if ($(".switch_cita2").bootstrapSwitch("state")) {
        $(".switch_cita2").bootstrapSwitch("state", false);
      }

      form.steps("remove", 2);
      $(".ValidacionClickCorp").removeAttr("style");
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

  // Botón terminar llamada
  $("#btnTerminarLlamada").click(function () {
    TerminarLlamada = true;
    $("#ValidacionTerminarLL1").attr("style", "display:none");
    $(".ValidacionTerminarLL2").removeAttr("style");

    $("input:radio[name=rbtEmpresaValida]").change(function () {
      let value = $(this).val();
      switch (value) {
        case "1":
          ClienteNoValido = false;
          break;
        case "2":
          ClienteNoValido = true;
          break;
        case "3":
          NoResponden = true;
          break;
      }
    });
    form.steps("skip", 1);
    form.steps("next");
  });

  // Botón finalizar llamada
  $("#btnFinalizarLlamada").click(function () {
    FinalizarLlamada = true;
    detenerCronometroLlamada();
    iniciarCronometroVerificar();

    if (
      $(".switch_cita1").bootstrapSwitch("state") === true ||
      $(".switch_cita2").bootstrapSwitch("state") === true
    ) {
      $("#ValFinalizarLlamada").removeAttr("style");
      $(".ValFinalizarLlamadaCita").removeAttr("style");
      $(".switch_cita1").bootstrapSwitch("disabled", true);
      $(".switch_cita2").bootstrapSwitch("disabled", true);
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

      $(".switch_enviarCitaDespues").bootstrapSwitch({
        onText: "Si",
        offText: "No",
        onColor: "success",
        offColor: "danger",
      });

      // Alertas toast
      EnlazarClickAdvertencias();

      $(".switch_direccion").on("switchChange.bootstrapSwitch", function (
        event,
        state
      ) {
        HabilitarEnviarDC();
        ValidarResumenCita();
      });
      $(".switch_nit").on("switchChange.bootstrapSwitch", function (
        event,
        state
      ) {
        HabilitarEnviarDC();
        ValidarResumenCita();
      });
    } else {
      $("#ValFinalizarLlamada").removeAttr("style");
    }
  });

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

  // Llamar nuevamente
  $(".switch_llamarNuevamente").on("switchChange.bootstrapSwitch", function (
    event,
    state
  ) {
    if (state) {
      $(".switch_corporativo").bootstrapSwitch("disabled", true);
      if ($(".switch_corporativo").bootstrapSwitch("state")) {
        form.steps("insert", 4, stepProgramarFecha);
        $(".switch_AT2").bootstrapSwitch("disabled", true);
        $(".switch_cita2").bootstrapSwitch("disabled", true);
      } else {
        form.steps("insert", 3, stepProgramarFecha);
        $(".switch_AT1").bootstrapSwitch("disabled", true);
        $(".switch_cita1").bootstrapSwitch("disabled", true);
      }

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
            Reprogramar_Llamada = true;
            ModificarConclusionLlamada(2);
          } else {
            Reprogramar_Llamada = false;
            ModificarConclusionLlamada(1);
          }
        });
    } else {
      $(".switch_corporativo").bootstrapSwitch("disabled", false);
      if ($(".switch_corporativo").bootstrapSwitch("state")) {
        form.steps("remove", 4);
        $(".switch_AT2").bootstrapSwitch("disabled", false);
        $(".switch_cita2").bootstrapSwitch("disabled", false);
      } else {
        form.steps("remove", 3);
        $(".switch_AT1").bootstrapSwitch("disabled", false);
        $(".switch_cita1").bootstrapSwitch("disabled", false);
      }
    }
  });

  // Enviar cita después
  $(".switch_enviarCitaDespues").on("switchChange.bootstrapSwitch", function (
    event,
    state
  ) {
    if (state) {
      if ($(".switch_corporativo").bootstrapSwitch("state")) {
        $(".switch_cita2").bootstrapSwitch("disabled", true);
        form.steps("insert", 5, stepProgramarFecha);
      } else {
        $(".switch_cita1").bootstrapSwitch("disabled", true);
        form.steps("insert", 4, stepProgramarFecha);
      }
      $(".ValidacionesPLlamada").attr("style", "display:none");
      $(".ValidacionesPCita").removeAttr("style");

      // Fecha enviar cita después
      $("#Fecha_EC")
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
            Fecha_EC = FormatearFecha(date._d, true);
            Enviar_Cita_Despues = true;
            // ModificarConclusionLlamada(2);
          } else {
            Enviar_Cita_Despues = false;
            ModificarConclusionLlamada(1);
          }
        });
    } else {
      if ($(".switch_corporativo").bootstrapSwitch("state")) {
        $(".switch_cita2").bootstrapSwitch("disabled", false);
        form.steps("remove", 5);
      } else {
        $(".switch_cita1").bootstrapSwitch("disabled", false);
        form.steps("remove", 4);
        $(".ValidacionesPCita").attr("style", "display:none");
        $(".ValidacionesPLlamada").removeAttr("style");
      }
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

    // Servicios Fijos
    let serviciosFijos = null;
    if (localStorage.ServiciosFijos) {
      let localServiciosFijos = JSON.parse(
        localStorage.getItem("ServiciosFijos")
      );
      serviciosFijos = {
        correo: localServiciosFijos.correo ? 1 : 0,
        dominio: localServiciosFijos.dominio ? 1 : 0,
        ip: localServiciosFijos.ip ? 1 : 0,
        pagina: localServiciosFijos.pagina ? 1 : 0,
        telefonia: localServiciosFijos.telefonia ? 1 : 0,
        television: localServiciosFijos.television ? 1 : 0,
      };
    }

    // Servicios Moviles
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
            minutos: lineaItem.minutos === "" ? null : lineaItem.minutos,
            navegacion:
              lineaItem.navegacion === "" ? null : lineaItem.navegacion,
            mensajes: lineaItem.mensajes === "" ? null : lineaItem.mensajes,
            redes: redes === "" ? null : redes,
            minutosLDI: minLDI === "" ? null : minLDI,
            cantidadLDI: cantidadLDI === "" ? null : cantidadLDI,
            serviciosAdicionales:
              serviciosAdicionales === "" ? null : serviciosAdicionales,
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

    // Estado cliente
    let Estado_Cliente = null;
    if (NoResponden) {
      Estado_Cliente = 1;
    } else {
      if (ClienteNoValido) {
        Estado_Cliente = 2;
      } else {
        Estado_Cliente = 0;
      }
    }
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
      Extension:
        $("#txtExtension").val() === "" ? null : $("#txtExtension").val(),
      NIT_CDV: $("#txtNIT").val() == "" ? null : $("#txtNIT").val(),
      Encargado:
        $("#txtEncargado").val() == "" ? null : $("#txtEncargado").val(),
      Barrio_Vereda:
        parseInt($("#txtNombre_Lugar").val()) === NaN
          ? null
          : parseInt($("#txtNombre_Lugar").val()),
      Direccion:
        $("#txtDireccion").val() == "" ? null : $("#txtDireccion").val(),
      Correo: null,
      Celular: null,
      Estado_Cliente: Estado_Cliente,
      //DBL
      Id_Operador:
        parseInt($("#txtOperador").val()) === NaN
          ? null
          : parseInt($("#txtOperador").val()),
      Id_Calificacion_Operador:
        parseInt($("#txtCalificacion").val()) === NaN
          ? null
          : parseInt($("#txtCalificacion").val()),
      Razones: stringRazones === "" ? null : stringRazones,
      Cantidad_Lineas: Cantidad_Total_Lineas,
      Valor_Mensual: Valor_Total_Mensual.toString(),
      ServiciosFijos: serviciosFijos,
      ServiciosMoviles: arrayLineas,

      // Validación
      Validacion_DBL: TerminarLlamada ? false : true,
      Validacion_PLan_C: false,
      Validacion_Doc_S: false,
      Validacion_Cita: false,
    };

    if (Id_Estado_Llamada == 2) {
      Object.defineProperty(datos, "Fecha_LP", {
        value: Fecha_LP,
        enumerable: true,
      });
    }

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
          value:
            $("#txtDescripcion").val() === ""
              ? null
              : $("#txtDescripcion").val(),
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

      // Celular
      datos.Celular =
        $("#txtCelularCita").val() == "" ? null : $("#txtCelularCita").val();

      // Estado Cita
      // 3 -> sin gestionar en BD
      let Estado_Cita = 3;

      if (RecordarCita) {
        // 2 -> sin recordar en BD
        Estado_Cita = 2;
        Object.defineProperty(datos, "Fecha_Programada", {
          value: Fecha_RC,
          enumerable: true,
        });
      }

      if (Enviar_Cita_Despues) {
        // 1 -> sin confirmar en BD
        Estado_Cita = 1;
        Object.defineProperty(datos, "Fecha_Programada", {
          value: Fecha_EC,
          enumerable: true,
        });
      }
      Object.defineProperties(datos, {
        Encargado_Cita: {
          value: $("#txtEncargado_Cita").val(),
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

    // Si se genera atención telefónica
    if (
      $(".switch_AT1").bootstrapSwitch("state") === true ||
      $(".switch_AT2").bootstrapSwitch("state") === true
    ) {
      // Formatear celular
      let codigo = $("#txtCodigoPostal").val();
      let celular = $("#txtCelularAT").val();
      if (celular !== "") {
        celular = "+" + codigo + " " + celular;
      }

      datos.Celular = celular == "" ? null : celular;
      datos.Correo = $("#txtCorreo").val() == "" ? null : $("#txtCorreo").val();
    }
    console.log(datos);
    $.ajax({
      url: `${URL}/Llamadas/LlamadaNP`,
      dataType: "json",
      type: "post",
      contentType: "aplication/json",
      data: JSON.stringify(datos),
      processData: false,
      success: function (respuesta) {
        if (respuesta.data.ok) {
          //se envía notifiación a coordinadores y administrador
          localStorage.removeItem("ServiciosMoviles");
          localStorage.removeItem("ServiciosFijos");
          clientesSocket.emit("Notificar");
          swal({
            title: "Registro exitoso.",
            type: "success",
            showCancelButton: false,
            showConfirmButton: false,
          });
          setTimeout(function () {
            location.href = Redireccionar("/Noticias");
          }, 1000);
        } else {
          swal(
            {
              title: "Error al registrar.",
              text: "Ha ocurrido un error al registrar, intenta de nuevo",
              type: "error",
              showCancelButton: false,
              confirmButtonColor: "#2F6885",
              confirmButtonText: "Continuar",
              closeOnConfirm: false,
            },
            function (isConfirm) {
              if (isConfirm) {
                location.href = "Llamadas.html";
                console.log(respuesta.data);
              }
            }
          );
        }
      },
      error: function (error) {
        console.log(error);
        swal(
          {
            title: "Error al registrar.",
            text: "Error en el servidor, contacta al administrador",
            type: "error",
            showCancelButton: false,
            confirmButtonColor: "#2F6885",
            confirmButtonText: "Continuar",
            closeOnConfirm: false,
          },
          function (isConfirm) {
            if (isConfirm) {
              location.href = "AgregarEmpresa.html";
            }
          }
        );
      },
    });
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

  $("#Fecha_RC")
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
        Fecha_RC = FormatearFecha(date._d, true);
        RecordarCita = true;
      } else {
        RecordarCita = false;
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

  // $("input:radio[name=rbtRecordarCita]").change(function () {
  //   let value = $(this).val();
  //   switch (value) {
  //     case "1":
  //       RecordarCita = true;
  //       break;
  //     case "2":
  //       RecordarCita = false;
  //       break;
  //   }
  // });

  // Validaciones Cita
  $(".ValidacionesLlamada").attr("style", "display:none");
  $(".ValidacionesCita").removeAttr("style");

  $(".switch_factura").bootstrapSwitch({
    onText: "SI",
    offText: "NO",
    onColor: "success",
    offColor: "danger",
  });

  // ValidarAlertaServicios;

  // Conclusión llamada
  ModificarConclusionLlamada(3);
};

let EliminarStepCita = () => {
  $("#lbReprogramarLlamada").text("Llamar nuevamente:");
  $(".ValidacionesCita").attr("style", "display:none");
  $(".ValidacionesLlamada").removeAttr("style");

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
    $(".switch_cita2").bootstrapSwitch("state") === true ||
    $(".switch_AT1").bootstrapSwitch("state") === true ||
    $(".switch_AT2").bootstrapSwitch("state") === true
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
    $("#RazonesNoDisponible").attr("style", "display:none");
    $("#ValidarBtnLlamar").removeAttr("style");
  } else {
    $("#MensajeLabel").empty();
    $("#MensajeLabel").append(`
      <div class="label label-table label-danger">
        <h4 class="text-white">
          <i class="fa fa-lock"></i> Cliente <strong>NO</strong> disponible para llamar
        </h4>
      </div>
    `);
    $("#ValidarBtnLlamar").attr("style", "display:none");
    $("#RazonesNoDisponible").removeAttr("style");
    $("#listRazones").text("Cliente inhabilitado");
  }
};

let ValidarResumenCita = () => {
  if ($(".switch_nit").bootstrapSwitch("state")) {
    $("#resumenCitaNIT").attr("checked", true);
  } else {
    $("#resumenCitaNIT").removeAttr("checked");
  }
  if ($(".switch_direccion").bootstrapSwitch("state")) {
    $("#resumenCitaDireccion").attr("checked", true);
  } else {
    $("#resumenCitaDireccion").removeAttr("checked");
  }
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
      if ($(".switch_cita1").bootstrapSwitch("disabled")) {
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
        bgColor: "#00897b",
        loaderBg: "#383f48",
        icon: "warning",
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
        bgColor: "#00897b",
        loaderBg: "#383f48",
        icon: "warning",
        hideAfter: 3000,
        showHideTransition: "slide",
        stack: 1,
      });
      break;
    case 3:
      $.toast({
        heading: "¡No se puede enviar!",
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
  }
};

// Habilitar enviar después cita
let HabilitarEnviarDC = () => {
  if (
    $(".switch_nit").bootstrapSwitch("state") &&
    $(".switch_direccion").bootstrapSwitch("state")
  ) {
    $(".switch_enviarCitaDespues").bootstrapSwitch("disabled", false);
  } else {
    $(".switch_enviarCitaDespues").bootstrapSwitch("disabled", true);
  }
};

let MostarCardDetalleEmpresa = (data) => {
  $("#spnEmpresa").text(data.Razon_Social);
  $("#spnTelefono").text(data.Telefono);
  $("#spnNIT").text(data.NIT_CDV);
  $("#spnOPerador").text(data.Nombre_Operador);
  $("#spnCorporativo").text("Corporativo: " + data.Corporativo);
  $("#spnLineas").text(data.Cantidad_Total_Lineas + " líneas");
  $("#DetalleEmpresaCard").removeAttr("style");
};
