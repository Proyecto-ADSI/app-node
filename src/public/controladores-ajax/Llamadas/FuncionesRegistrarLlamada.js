var Id_Usuario = null;
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
var idAclaracion = 0;
var idNota = 0;
var swiper = null;
var Nombre_Empleado = "";
var Oferta_Personalizada_PDF = [];
var valInicializarInfoAT = false;
var Permitir_SocketIO = false;
var Operador_Fecha_Cambio = false;
var HoraAsignada = false;
$(function () {
  MostrarLoaderLlamada();
  ObtenerSession().then((data) => {
    Id_Usuario = parseInt(data.session.Id_Usuario);
  });
  controlServicios = 3;
  // var stepPlanCorp;
  // var stepCita;
  // var stepAT;
  // if (Llamada_Precargada) {
  //   ValidarCamposRegistroCliente();
  // }

  form = $("#Form_Registro_LlamadaNP").show();

  form.steps({
    saveState: true,
    headerTag: "h6",
    bodyTag: "section",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    onInit: function (event, currentIndex) {
      // Validacion de steps
      if (Llamada_Precargada) {
        InicializarFormP();
      } else {
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

        // InicializarFormNP();
      }
    },
    onStepChanging: function (event, currentIndex, newIndex) {
      if (newIndex > currentIndex) {
        if (TerminarLlamada) {
          return true;
        } else {
          if ($(".switch_corporativo").bootstrapSwitch("state")) {
            if (currentIndex == 4) {
              if (FinalizarLlamada) {
                return (
                  (form.validate().settings.ignore =
                    ":disabled,:hidden, .detalleLinea"),
                  form.valid()
                );
              } else {
                GenerarAlertasToast(3);
                return false;
              }
            } else {
              return (
                (form.validate().settings.ignore =
                  ":disabled,:hidden, .detalleLinea"),
                form.valid()
              );
            }
          } else {
            if (currentIndex == 3) {
              if (FinalizarLlamada) {
                return (
                  (form.validate().settings.ignore =
                    ":disabled,:hidden, .detalleLinea"),
                  form.valid()
                );
              } else {
                GenerarAlertasToast(3);
                return false;
              }
            } else {
              return (
                (form.validate().settings.ignore =
                  ":disabled,:hidden, .detalleLinea"),
                form.valid()
              );
            }
          }
        }
      } else {
        return true;
      }
    },
    onStepChanged: function (event, currentIndex, priorIndex) {
      // Recalcular tamaño data table ofertas.
      if (
        $(".switch_AT1").bootstrapSwitch("state") === true ||
        $(".switch_AT2").bootstrapSwitch("state") === true
      ) {
        if ($(".switch_corporativo").bootstrapSwitch("state")) {
          if (currentIndex == 5) {
            DataTableOE.responsive.recalc();
            DataTableOP.responsive.recalc();
            if (swiper) {
              swiper.update();
            }
          }
        } else {
          if (currentIndex == 4) {
            DataTableOE.responsive.recalc();
            DataTableOP.responsive.recalc();
            if (swiper) {
              swiper.update();
            }
          }
        }
      }
    },
    onFinishing: function (event, currentIndex) {
      return (
        (form.validate().settings.ignore = ":disabled, :hidden, .detalleLinea"),
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
            RegistrarLlamada();
          }
        } else {
          if (
            $(".switch_AT1").bootstrapSwitch("state") === true ||
            $(".switch_AT2").bootstrapSwitch("state") === true
          ) {
            let valOferta = ValidarExistenciaDatosOferta();
            Tipo_Oferta = valOferta.Tipo_Oferta;
            Oferta = valOferta.Oferta;
            if (Oferta) {
              if (!valInicializarInfoAT) {
                ModalPrevisualizarOferta(Tipo_Oferta);
              }
              RegistrarLlamada();
            }
          } else {
            RegistrarLlamada();
          }
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
          element[0].id == "txtDetalle_Valor_Mensual_OE" ||
          element[0].id == "txtDetalle_Valor_Mensual_OP" ||
          element[0].name == "txtNumeroLinea" ||
          element[0].name == "opcionOferta"
        ) {
          error.insertAfter(element.parent(".input-group"));
        } else if (element[0].name == "detalleLineasRadios") {
          error.insertAfter($("#lblDetalle_radio2"));
        } else if (element[0].name == "rbtEmpresaValida") {
          error.insertAfter($("#rbtValEmpresa3").next());
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
        txtRazonSocial: {
          required: true,
          minlength: 2,
          maxlength: 45,
          SoloAlfanumericos: true,
          remote: function (element) {
            if (Llamada_Precargada) {
              let value = $(element).val().trim();
              if (value.toLowerCase() == Razon_Social) {
                $("#txtRazonSocial-error").remove();
                return true;
              }
            }
            let res = {
              url: `${URL}/Cliente/ValidarCliente/Disponibilidad`,
              type: "get",
              dataType: "json",
              data: {
                texto: function () {
                  return $("#txtRazonSocial").val().trim();
                },
                Id_Usuario: function () {
                  return Id_Usuario;
                },
              },
              dataFilter: function (res) {
                var json = JSON.parse(res);
                if (json.data.ok) {
                  $("#DetalleEmpresaCard").attr("style", "display:none");
                  return '"true"';
                } else {
                  MostarCardDetalleEmpresa(json.data.cliente);
                  CargarDatosModalDetalles(json.data.cliente);
                  ValidarLlamarCliente(json.data);
                  return '"Cliente ya registrado."';
                }
              },
            };
            return res;
          },
        },
        txtTelefono: {
          required: true,
          SoloNumeros: true,
          minlength: 7,
          maxlength: 7,
          remote: function (element) {
            if (Llamada_Precargada) {
              let value = $(element).val();
              if (value == Telefono) {
                $("#txtTelefono-error").remove();
                return true;
              }
            }
            let res = {
              url: `${URL}/Cliente/ValidarCliente/Disponibilidad`,
              type: "get",
              dataType: "json",
              data: {
                texto: function () {
                  return $("#txtTelefono").val().trim();
                },
                Id_Usuario: function () {
                  return Id_Usuario;
                },
              },
              dataFilter: function (res) {
                var json = JSON.parse(res);
                if (json.data.ok) {
                  $("#DetalleEmpresaCard").attr("style", "display:none");
                  return '"true"';
                } else {
                  MostarCardDetalleEmpresa(json.data.cliente);
                  CargarDatosModalDetalles(json.data.cliente);
                  ValidarLlamarCliente(json.data);
                  return '"Teléfono ya registrado."';
                }
              },
            };
            return res;
          },
        },
        txtNIT: {
          ValidarNIT: true,
          minlength: 9,
          maxlength: 11,
          remote: function (element) {
            if (Llamada_Precargada) {
              let value = $(element).val();
              if (value == NIT_CDV) {
                $("#txtNIT-error").remove();
                return true;
              }
            }
            let res = {
              url: `${URL}/Cliente/ValidarCliente/Disponibilidad`,
              type: "get",
              dataType: "json",
              data: {
                texto: function () {
                  return $("#txtNIT").val().trim();
                },
                Id_Usuario: function () {
                  return Id_Usuario;
                },
              },
              dataFilter: function (res) {
                var json = JSON.parse(res);
                if (json.data.ok) {
                  $("#DetalleEmpresaCard").attr("style", "display:none");
                  return '"true"';
                } else {
                  MostarCardDetalleEmpresa(json.data.cliente);
                  CargarDatosModalDetalles(json.data.cliente);
                  ValidarLlamarCliente(json.data);
                  return '"NIT ya registrado."';
                }
              },
            };
            return res;
          },
        },
        txtPersona_Responde: {
          required: true,
          maxlength: 45,
          SoloLetras: true,
        },
        txtEncargado: {
          maxlength: 45,
          SoloLetras: true,
        },
        txtPais: "required",
        txtDepartamento: "required",
        txtMunicipio: "required",
        txtOperador: "required",
        txtDetalle_Cantidad_Lineas: {
          required: true,
          maxlength: 3,
          SoloNumeros2: true,
        },
        txtDetalle_Valor_Mensual: {
          required: true,
          maxlength: 45,
          SoloNumeros2: true,
        },
        detalleLineasRadios: "required",
        txtDetalleNavegacion: {
          maxlength: 45,
          SoloNumeros: true,
        },
        txtDetalle_Minutos: {
          maxlength: 45,
          SoloNumeros: true,
        },
        txtDetalle_Mensajes: {
          maxlength: 45,
          SoloNumeros: true,
        },
        txtDetalle_Cantidad_LDI: {
          maxlength: 45,
          SoloNumeros: true,
        },
        // txtFecha_inicio: "required",
        // txtFecha_fin: "required",
        rbtnEnvioOferta: "required",
        txtCorreo: {
          required: true,
          maxlength: 45,
          ValidarCorreo: true,
        },
        txtCodigoPostal: {
          required: true,
          SoloNumeros: true,
          maxlength: 5,
          minlength: 1,
        },
        txtCelularAT: {
          required: true,
          NumeroMovil: true,
          minlength: 10,
          maxlength: 10,
        },
        txtOperadorCita: "required",
        txtFechaCita: "required",
        btnHoraCita: {
          ValidarHoraCita: true,
        },
        txtEncargado_Cita: {
          required: true,
          SoloLetras: true,
        },
        txtCelularCita: {
          NumeroMovil: true,
          minlength: 10,
          maxlength: 10,
        },
        txtPaisCita: "required",
        txtDepartamentoCita: "required",
        txtMunicipioCita: "required",
        txtSubTipoCita: "required",
        txtNombre_LugarCita: "required",
        txtDireccion_Cita: "required",
        txtPuntoReferencia: {
          required: true,
          SoloAlfanumericos: true,
        },
        rbtEmpresaValida: "required",
        txtObservacion: "required",
        txtOperadorOferta: "required",
        txtDestinatarioOferta: {
          required: true,
          SoloLetras: true,
          maxlength: 20,
        },
        txtDetalle_Cantidad_Lineas_OE: {
          required: true,
          maxlength: 3,
          SoloNumeros2: true,
        },
        txtDetalle_Valor_Mensual_OE: {
          required: true,
          maxlength: 45,
          SoloNumeros2: true,
        },
        txtDetalleNavegacion_OE: {
          maxlength: 45,
          SoloNumeros: true,
        },
        txtDetalle_Minutos_OE: {
          maxlength: 45,
          SoloNumeros: true,
        },
        txtDetalle_Mensajes_OE: {
          maxlength: 45,
          SoloNumeros: true,
        },
        txtDetalle_Cantidad_LDI_OE: {
          maxlength: 45,
          SoloNumeros: true,
        },
        txtDetalle_Cantidad_Lineas_OP: {
          required: true,
          maxlength: 3,
          SoloNumeros2: true,
        },
        txtDetalle_Valor_Mensual_OP: {
          required: true,
          maxlength: 45,
          SoloNumeros2: true,
        },
        txtDetalleNavegacion_OP: {
          maxlength: 45,
          SoloNumeros: true,
        },
        txtDetalle_Minutos_OP: {
          maxlength: 45,
          SoloNumeros: true,
        },
        txtDetalle_Mensajes_OP: {
          maxlength: 45,
          SoloNumeros: true,
        },
        txtDetalle_Cantidad_LDI_OP: {
          maxlength: 45,
          SoloNumeros: true,
        },
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
      InicializarFormAT();
    } else {
      $(".switch_cita1").bootstrapSwitch("disabled", false);
      $(".switch_corporativo").bootstrapSwitch("disabled", false);
      form.steps("remove", 2);
      form.steps("remove", 3);
      ModificarConclusionLlamada(1);
      ValidarBtnTerminarLlamada();
    }
  });

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

      if (typeof Id_Plan_Corporativo != "undefined") {
        if (Id_Plan_Corporativo > 0) {
          CargarInformacionPlan();
        }
      }

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
          InicializarFormAT();
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
    $("#ValidacionTerminarLL1").removeClass("col-md-12");
    $("#ValidacionTerminarLL1").addClass("col-md-7");
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

    if ($(".switch_AT1").bootstrapSwitch("state")) {
      $(".switch_AT1").bootstrapSwitch("disabled", true);
    }
    if ($(".switch_AT2").bootstrapSwitch("state")) {
      $(".switch_AT2").bootstrapSwitch("disabled", true);
    }
  });

  // Validaciones modal horas disponibles la cerrar modal.
  $("#modalHorasCitas").on("hidden.bs.modal", function (e) {
    $("#btnAgendarHora").prop("disabled", true);
    // $("input:radio[name=rbtnHoraDisponible]:checked").prop("checked", false);
  });

  // Validaciones modal horas disponibles la abrir modal.
  $("#modalHorasCitas").on("show.bs.modal", function (e) {
    if ($("input:radio[name=rbtnHoraDisponible]").is("checked")) {
      $("#btnAgendarHora").prop("disabled", true);
    }
  });

  $("#btnAgendarHora").click(function () {
    let hora = $("input:radio[name=rbtnHoraDisponible]:checked").val();
    let InfoAgendamiento = JSON.parse(
      sessionStorage.getItem("InfoAgendamiento")
    );

    // Validar si ya se había asignado hora y se está cambiando.
    if (HoraAsignada && Permitir_SocketIO) {
      if (InfoAgendamiento.HoraActual !== hora) {
        // Informar de que esta hora ya no la tenemos asignada
        citasSocket.emit("ActualizarHorasCita", {
          Tipo: 2,
          Hora: InfoAgendamiento.HoraActual,
          FechaCita: InfoAgendamiento.FechaCita,
          OperadorCita: InfoAgendamiento.OperadorCita,
        });
        console.log("Cambio de hora: ");
        console.log(InfoAgendamiento);
      }
    }

    // Asignar nueva hora
    InfoAgendamiento.HoraActual = hora;
    let Id_Operador_Cita = InfoAgendamiento.OperadorCita;
    let FechaCita = InfoAgendamiento.FechaCita;
    $("#txtHoraCita").val(hora);
    LimpiarClasestxtHora();
    $("#resumenCitaHora").attr("checked", true);
    if (Permitir_SocketIO) {
      // Informar de que esta hora la tenemos asignada.
      citasSocket.emit("ActualizarHorasCita", {
        Tipo: 1,
        Hora: hora,
        FechaCita: FechaCita,
        OperadorCita: Id_Operador_Cita,
      });
      HoraAsignada = true;
    }

    // Guardar cambios de hora asignada
    sessionStorage.InfoAgendamiento = JSON.stringify(InfoAgendamiento);

    $("#modalHorasCitas").modal("hide");
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
let RegistrarLlamada = () => {
  MostrarLoaderGeneral();
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
    let ServiciosFormateados = FormatearServiciosMoviles(
      JSON.parse(localStorage.ServiciosMoviles),
      false
    );
    Cantidad_Total_Lineas = ServiciosFormateados.Cantidad_Total_Lineas;
    Valor_Total_Mensual = ServiciosFormateados.Valor_Total_Mensual;
    arrayLineas = ServiciosFormateados.arrayServiciosMoviles;
  }

  // Razones
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
    Info_Habeas_Data: $(".switch_habeas_data").bootstrapSwitch("state") ? 1 : 0,
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
    Encargado: $("#txtEncargado").val() == "" ? null : $("#txtEncargado").val(),
    Barrio_Vereda:
      parseInt($("#txtNombre_Lugar").val()) === NaN
        ? null
        : parseInt($("#txtNombre_Lugar").val()),
    Direccion: $("#txtDireccion").val() == "" ? null : $("#txtDireccion").val(),
    Correo: null,
    Celular: null,
    Estado_Cliente: Estado_Cliente,
    //DBL
    Id_Operador:
      $("#txtOperador").val() === null
        ? null
        : parseInt($("#txtOperador").val()),
    Id_Calificacion_Operador:
      $("#txtCalificacion").val() === null
        ? null
        : parseInt($("#txtCalificacion").val()),
    Razones: stringRazones === "" ? null : stringRazones,
    Cantidad_Lineas: Cantidad_Total_Lineas,
    Valor_Mensual: AgregarComas(Valor_Total_Mensual),
    ServiciosFijos: serviciosFijos,
    ServiciosMoviles: arrayLineas,
    Estado_DBL: 3,
    // Validación
    Validacion_Cliente: true,
    Validacion_DBL: false,
    Validacion_PLan_C: false,
    Validacion_Doc_S: false,
    Validacion_Cita: false,
    Validacion_AT: false,
  };

  // Si la llamada es precargada
  if (Llamada_Precargada) {
    datos.Validacion_Cliente = false;
    Object.defineProperty(datos, "Id_Cliente", {
      value: Informacion.Id_Cliente,
      enumerable: true,
    });

    // Registrar DBL como captado si llamada es efectiva.
    if (Id_Estado_Llamada == 3) {
      datos.Validacion_DBL = true;
      datos.Estado_DBL = 1;
    }
  } else {
    if (!TerminarLlamada) {
      datos.Validacion_DBL = true;
    }
  }

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
          $("#txtDescripcion").val() === "" ? null : $("#txtDescripcion").val(),
        enumerable: true,
      },
    });
  }

  // Si se agenda cita.
  if (
    $(".switch_cita1").bootstrapSwitch("state") === true ||
    $(".switch_cita2").bootstrapSwitch("state") === true
  ) {
    detenerCronometroVerificar();
    let txtDuracion_Verificacion =
      "00:" + $("#txtMinutosV").text() + ":" + $("#txtSegundosV").text();

    let switchRL = $("#switchRL").children("label").children("input");
    datos.Validacion_Cita = true;
    // Hora cita
    let horaCita = $("#txtHoraCita").val();
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
    if (!valInicializarInfoAT) {
      ModalPrevisualizarOferta();
    }
    datos.Validacion_AT = true;
    detenerCronometroVerificar();

    let Tiempo_Post_Llamada =
      "00:" + $("#txtMinutosV").text() + ":" + $("#txtSegundosV").text();

    // Formatear celular
    let codigo = $("#txtCodigoPostal").val();
    let celular = $("#txtCelularAT").val();
    if (celular !== "") {
      celular = "+" + codigo + " " + celular;
    }
    datos.Celular = celular == "" ? null : celular;
    datos.Correo = $("#txtCorreo").val() == "" ? null : $("#txtCorreo").val();

    // Aclaraciones
    let arrayAclaraciones = [];
    $(".opcionAclaraciones ").each(function (index, element, array) {
      arrayAclaraciones.push($(element).val());
    });
    // Notas
    let arrayNotas = [];
    $(".opcionNotas").each(function (index, element, array) {
      arrayNotas.push($(element).val());
    });
    Object.defineProperties(datos, {
      Tipo_Oferta: {
        value: Tipo_Oferta,
        enumerable: true,
      },
      Medio_Envio: {
        value: parseInt($("input:radio[name='rbtnEnvioOferta']:checked").val()),
        enumerable: true,
      },
      Estado_Pre_Oferta: {
        value: 1,
        enumerable: true,
      },
      Id_Operador_Oferta: {
        value: parseInt($("#txtOperadorOferta").val()),
        enumerable: true,
      },
      Tiempo_Post_Llamada: {
        value: Tiempo_Post_Llamada,
        enumerable: true,
      },
      Nombre_Cliente: {
        value: $("#txtDestinatarioOferta").val(),
        enumerable: true,
      },
      Mensaje_Superior: {
        value:
          $("#txtMensajeSuperior").val() == ""
            ? null
            : $("#txtMensajeSuperior").val(),
        enumerable: true,
      },
      Aclaraciones: {
        value: arrayAclaraciones.length == 0 ? null : arrayAclaraciones,
        enumerable: true,
      },
      Notas: {
        value: arrayNotas,
        enumerable: true,
      },
      Nombre_Empleado: {
        value: Nombre_Empleado,
        enumerable: true,
      },
    });

    if (Tipo_Oferta == 1) {
      // OFERTA ESTÁNDAR
      let Oferta_Estandar_PDF = JSON.parse(
        localStorage.getItem("ServiciosMovilesOE")
      );
      let Oferta_Estandar_BD = FormatearServiciosMoviles(
        Oferta_Estandar_PDF,
        true
      );
      Object.defineProperties(datos, {
        Oferta_Estandar_BD: {
          value: Oferta_Estandar_BD.arrayServiciosMoviles,
          enumerable: true,
        },
        Oferta_Estandar_PDF: {
          value: Oferta_Estandar_PDF,
          enumerable: true,
        },
      });
    } else {
      // OFERTA PERSONALIZADA
      let Oferta_Personalizada_BD = FormatearServiciosMoviles(
        JSON.parse(localStorage.getItem("ServiciosMovilesOP")),
        false
      );
      let Cantidad_Total_LineasOP =
        Oferta_Personalizada_BD.Cantidad_Total_Lineas;

      let Valor_Total_MensualOP = Oferta_Personalizada_BD.Valor_Total_Mensual;

      Oferta_Personalizada_BD = Oferta_Personalizada_BD.arrayServiciosMoviles;

      Object.defineProperties(datos, {
        Oferta_Personalizada_BD: {
          value: Oferta_Personalizada_BD,
          enumerable: true,
        },
        Oferta_Personalizada_PDF: {
          value: Oferta_Personalizada_PDF,
          enumerable: true,
        },
        Ajuste_Financiero: {
          value: Ajuste_Financiero,
          enumerable: true,
        },
        Cantidad_Total_LineasOP: {
          value: Cantidad_Total_LineasOP,
          enumerable: true,
        },
        Valor_Total_MensualOP: {
          value: Valor_Total_MensualOP,
          enumerable: true,
        },
      });
    }
  }
  console.log(datos);
  $.ajax({
    url: `${URL}/Llamadas`,
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
        localStorage.removeItem("ServiciosMovilesOE");
        localStorage.removeItem("ServiciosMovilesOP");
        localStorage.removeItem("Comparativo");
        localStorage.removeItem("Comparativo");
        sessionStorage.removeItem("Operadores");
        sessionStorage.removeItem("Opciones");
        if (sessionStorage.DatosUbicacion) {
          sessionStorage.removeItem("DatosUbicacion");
        }
        clientesSocket.emit("Notificar");
        OcultarLoaderGeneral();
        swal({
          title: "Registro exitoso.",
          type: "success",
          showCancelButton: false,
          showConfirmButton: false,
        });

        if (respuesta.data.Envio_WhatsApp) {
          let info = respuesta.data.info;
          let infoCelular = FormatearCelular(info.celular);
          let celular = infoCelular.codigo + infoCelular.celular;
          // Abrir API WhatsApp
          window.open(
            `https://api.whatsapp.com/send?phone=${celular}&text=${info.MensajeInicio}`,
            "_blank"
          );
          // Abrir pdf
          window.open(`${URL}/Reportes/${info.archivo}`, "_blank");
        }
        setTimeout(function () {
          Redireccionar("/Noticias");
        }, 1000);
      } else {
        console.log(respuesta);
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
      OcultarLoaderGeneral();
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
};

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

let InicializarFormCitas = () => {
  // Operador cita
  let Id_Operador_Cita = parseInt($("#txtOperador option:selected").val());
  CargarOperadoresCita(Id_Operador_Cita);

  $("#txtOperadorCita").change(function () {
    if (HoraAsignada && Permitir_SocketIO) {
      Operador_Fecha_Cambio = true;
    }
    ValidarHorasCita();
  });

  // Fecha Cita
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

        // Validaciones para SocketIO
        if (HoraAsignada && Permitir_SocketIO) {
          Operador_Fecha_Cambio = true;
        }

        ValidarHorasCita();
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

  // Validar celular cliente
  if (Llamada_Precargada) {
    let Celular = obtenerValueValidado(Informacion.Celular);
    if (Celular !== "") {
      infoCelular = FormatearCelular(Celular);
      $("#txtCelularCita").val(infoCelular.celular);
      $("#txtCodigoPostal").val(infoCelular.codigo);
    }
  }
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

let InicializarFormAT = () => {
  $("input:radio[name=rbtnEnvioOferta]").change(function () {
    let value = parseInt($(this).val());

    switch (value) {
      case 1:
        $("#txtCorreo").removeAttr("disabled");
        $("#txtCelularAT").attr("disabled", true);
        $("#txtCodigoPostal").attr("disabled", true);
        if (Llamada_Precargada) {
          if (Informacion.Correo !== NA) {
            $("#txtCorreo").val(Informacion.Correo);
          }
        }
        break;
      case 2:
        $("#txtCodigoPostal").removeAttr("disabled");
        $("#txtCelularAT").removeAttr("disabled");
        $("#txtCorreo").attr("disabled", true);
        if (Llamada_Precargada) {
          let Celular = obtenerValueValidado(Informacion.Celular);
          if (Celular !== "") {
            infoCelular = FormatearCelular(Celular);
            $("#txtCelularAT").val(infoCelular.celular);
            $("#txtCodigoPostal").val(infoCelular.codigo);
          }
        }
        break;
      case 3:
        $("#txtCodigoPostal").removeAttr("disabled");
        $("#txtCelularAT").removeAttr("disabled");
        $("#txtCorreo").removeAttr("disabled");
        if (Llamada_Precargada) {
          let Celular = obtenerValueValidado(Informacion.Celular);
          if (Celular !== "") {
            infoCelular = FormatearCelular(Celular);
            $("#txtCelularAT").val(infoCelular.celular);
            $("#txtCodigoPostal").val(infoCelular.codigo);
          }
          if (Informacion.Correo !== NA) {
            $("#txtCorreo").val(Informacion.Correo);
          }
        }
        break;
    }
  });

  // Diseñar
  $("#Pseudo_tabOfertaE").click(function () {
    GenerarAlertasToast(6);
  });
  $("#Pseudo_tabOfertaP").click(function () {
    GenerarAlertasToast(6);
  });

  ObtenerNombreEmpleado();
  CargarOperadoresOferta();

  // Collapse tipo oferta
  $("#FormOferta").on("shown.bs.collapse", function () {
    DataTableOE.responsive.recalc();
  });

  // - Oferta Estándar
  InicializarOfertaEstandar();
  // Oferta personalizada
  InicializarOfertaPersonalizada();

  // Reajuste de tamaños datatable y swiper
  $("#tabOfertaP a").on("shown.bs.tab", function (event) {
    swiper.update();
    DataTableOP.responsive.recalc();
  });
  $("#tabOfertaE a").on("shown.bs.tab", function (event) {
    DataTableOE.responsive.recalc();
  });

  // Validación tabs
  if (localStorage.ServiciosMoviles) {
    let arrayServiciosM = JSON.parse(localStorage.getItem("ServiciosMoviles"));
    if (arrayServiciosM.length == 0) {
      $("#tabOfertaP").attr("style", "display:none");
    } else {
      ListarSwipers();
      if (localStorage.ServiciosMovilesOP) {
        let arrayOfertaP = JSON.parse(
          localStorage.getItem("ServiciosMovilesOP")
        );
        if (arrayOfertaP.length > 0) {
          $("#tabOfertaE").attr("style", "display:none");
          $("#Pseudo_tabOfertaE").removeAttr("style");
          $("#tabOfertaP a").trigger("click");
        }
      }
    }
  } else {
    $("#tabOfertaP").attr("style", "display:none");
  }

  if (localStorage.ServiciosMovilesOE) {
    let arrayOfertaE = JSON.parse(localStorage.getItem("ServiciosMovilesOE"));
    if (arrayOfertaE.length > 0) {
      $("#tabOfertaP").attr("style", "display:none");
      $("#Pseudo_tabOfertaP").removeAttr("style");
    }
  }

  let arrayOpciones = JSON.parse(sessionStorage.getItem("Opciones"));
  if (arrayOpciones.length > 0) {
    for (let item of arrayOpciones) {
      if (item.Categoria == "Aclaraciones oferta") {
        PrecargarAclaraciones(false, item.Opcion);
      }
      if (item.Categoria == "Notas oferta") {
        PrecargarNotas(false, item.Opcion);
      }
    }
  }

  // Modal previsualizar oferta

  $("#btnPrevisualizarOferta").click(function () {
    let valOferta = ValidarExistenciaDatosOferta();
    Tipo_Oferta = valOferta.Tipo_Oferta;
    Oferta = valOferta.Oferta;
    let valNotas = true;
    $(".opcionNotas").each(function (index, element) {
      form.validate().settings.ignore = ":disabled, .detalleLinea";
      let validacion = form.validate().element(element);
      if (validacion === false) {
        valNotas = validacion;
        GenerarAlertasToast(5);
      }
    });
    form.validate().settings.ignore = ":disabled,:hidden, .detalleLinea";
    if (form.valid() && Oferta && valNotas) {
      ModalPrevisualizarOferta(Tipo_Oferta);
      $("#modalPrevisualizaroferta").modal("show");
    } else {
      GenerarAlertasToast(8);
    }
  });
};

let ModalPrevisualizarOferta = (tipoOferta) => {
  valInicializarInfoAT = true;
  // Información operador oferta
  let Id_Operador = $("#txtOperadorOferta option:selected").val();
  let Color_Operador_O;
  let Imagen_Operador_O;
  let Nombre_Operador_O;
  let Contador_Propuestas = 0;

  let arrayOperadores = JSON.parse(sessionStorage.Operadores);

  for (let item of arrayOperadores) {
    if (item.Id_Operador == Id_Operador) {
      Color_Operador_O = item.Color;
      Imagen_Operador_O = item.Imagen_Operador;
      Nombre_Operador_O = item.Nombre_Operador;
    }
  }

  // Información cliente
  let Nombre_Cliente = $("#txtDestinatarioOferta").val();

  // Textos
  let Mensaje_Superior = $("#txtMensajeSuperior").val();
  let arrayAclaraciones = [];
  let arrayNotas = [];

  $(".opcionAclaraciones").each(function () {
    let value = $(this).val();
    arrayAclaraciones.push(value);
  });
  $(".opcionNotas").each(function () {
    let value = $(this).val();
    arrayNotas.push(value);
  });

  // Información Empleado
  Nombre_Empleado = sessionStorage.getItem("NombreEmpleado");

  // Cargar información en el modal previsualizar oferta
  $("#nombreCliente").text(Nombre_Cliente);
  $("#nombreCliente2").text(Nombre_Cliente);

  if (Mensaje_Superior != "") {
    $("#textoSuperior").text(Mensaje_Superior);
  }
  $("#ContenidoDinamico").empty();
  // CREACIÓN DE OFERTA
  if (tipoOferta == 1) {
    // OFERTA ESTÁNDAR
    let arrayServicios = JSON.parse(localStorage.ServiciosMovilesOE);
    for (let item of arrayServicios) {
      Contador_Propuestas++;
      let Paises_MLDI = "";
      let Minutos_LDI;
      if (item.minutosLDI.length > 0) {
        for (let itemMinutos of item.minutosLDI) {
          if (Paises_MLDI == "") {
            Paises_MLDI = itemMinutos;
          } else {
            Paises_MLDI = Paises_MLDI + ", " + itemMinutos;
          }
        }
        Minutos_LDI = Paises_MLDI + " (" + item.cantidadLDI + " min)";
      } else {
        Minutos_LDI = "N/A";
      }

      let ServiciosIlimitados = "";
      if (item.serviciosIlimitados.length > 0) {
        for (let itemServicioI of item.serviciosIlimitados) {
          let servicio = `
          <div class="label label-table text-center" style="background-color:${Color_Operador_O}; color:#fff">
              ${itemServicioI}
          </div>`;
          ServiciosIlimitados = ServiciosIlimitados + servicio;
        }
      } else {
        ServiciosIlimitados = "N/A";
      }

      let ServiciosAdicionales = "";
      if (item.serviciosAdicionales.length > 0) {
        for (let itemServicioA of item.serviciosAdicionales) {
          let servicio = `
          <div class="label label-table text-center" style="background-color:${Color_Operador_O}; color:#fff">
              ${itemServicioA}
          </div>`;
          ServiciosAdicionales = ServiciosAdicionales + servicio;
        }
      } else {
        ServiciosAdicionales = "N/A";
      }

      $("#ContenidoDinamico").append(`
        <div id="ContenidoPropuestas" class="row cardPropuesta">

        </div>
      `);
      $("#ContenidoPropuestas").append(` 
      <div class="col-md-12 colPropuesta">
            <div class="card">
              <div class="card-header" style="background-color:${Color_Operador_O}; color:#fff">
                  <h4 class="tituloPropuesta">Propuesta ${Contador_Propuestas}</h4>
              </div>
              <div class="card-body">
                  <table id="TablaPropuesta" class="table table-striped">
                      <thead>
                          <tr>
                              <th class="colum1Titulo" style="background-color:${Color_Operador_O}; color:#fff" >Item</th>
                              <th style="background-color:${Color_Operador_O}; color:#fff">Cantidad</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td class="columna1">Cantidad mínima de líneas</td>
                              <td class="columna2"> ${item.cantidadLineas} </td>
                          </tr>
                          <tr>
                              <td class="columna1"> Minutos a todo destino</td>
                              <td class="columna2">  ${item.minutos}</td>
                          </tr>
                          <tr>
                              <td class="columna1">Datos</td>
                              <td class="columna2">
                                  <h3 class="text-danger font-weight-bold text-uppercase">
                                  ${item.navegacion} GB
                                  </h3>
                              </td>
                          </tr>
                          <tr>
                              <td class="tdPadre">
                                  <div class="columna1 divHijo">
                                      Minutos LDI
                                  </div>
                              </td>
                              <td class="columna2"> ${Minutos_LDI}
                              </td>
                          </tr>
                          <tr>
                              <td class="columna1"> SMS todo destino</td>
                              <td class="columna2"> ${item.mensajes}</td>
                          </tr>
                          <tr>
                              <td class="tdPadre">
                                  <div class="columna1 divHijo">
                                      Servicios ilimitados
                                  </div>
                              </td>
                              <td class="columna2">
                                  ${ServiciosIlimitados}
                              </td>
                          </tr>
                          <tr>
                              <td class="tdPadre">
                                  <div class="columna1 divHijo">
                                      Servicios adicionales
                                  </div>
                              </td>
                              <td class="columna2">
                                  ${ServiciosAdicionales}
                              </td>
                          </tr>
                          <tr>
                              <td class="columna1">
                                  Cargo básico por línea
                              </td>
                              <td class="columna2">
                                  <i class="fa fa-dollar text-danger"></i>
                                  <h3 class="float-right text-danger font-weight-bold text-uppercase">
                                      ${item.cargoBasicoMensual}
                                  </h3>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
            </div>
          </div>
        `);
    }
  } else {
    // OFERTA PERSONALIZADA
    let arrayComparativoTabla = [];
    let arrayServiciosCliente = JSON.parse(localStorage.ServiciosMoviles);
    let arrayServiciosOfertaP = JSON.parse(localStorage.ServiciosMovilesOP);
    let arrayIdComparativo = JSON.parse(localStorage.Comparativo);

    for (let itemId of arrayIdComparativo) {
      let Id_SC = itemId.Id_ServiciosCliente;
      let Id_SO = itemId.Id_ServiciosOferta;
      let infoSC = null;
      let infoSO = null;
      for (let itemSC of arrayServiciosCliente) {
        if (itemSC.id == Id_SC) {
          infoSC = itemSC;
        }
      }
      for (let itemSO of arrayServiciosOfertaP) {
        if (itemSO.id == Id_SO) {
          infoSO = itemSO;
        }
      }
      if (infoSC !== null && infoSO !== null) {
        let itemComparativoTabla = {
          ServiciosCliente: infoSC,
          ServiciosOferta: infoSO,
        };
        arrayComparativoTabla.push(itemComparativoTabla);
      }
    }
    // Información operador cliente
    let Id_Operador_C = $("#txtOperador option:selected").val();
    let Color_Operador_C;
    let Imagen_Operador_C;
    let Nombre_Operador_C;
    for (let itemOperador of arrayOperadores) {
      if (itemOperador.Id_Operador == Id_Operador_C) {
        Color_Operador_C = itemOperador.Color;
        Imagen_Operador_C = itemOperador.Imagen_Operador;
        Nombre_Operador_C = itemOperador.Nombre_Operador;
      }
    }
    let filas = "";
    let totalLineas = 0;
    let CargoBasicoNetoSC = 0;
    let CargoBasicoNetoSO = 0;

    Oferta_Personalizada_PDF = [];

    for (let itemTabla of arrayComparativoTabla) {
      let cantidadLineas = parseInt(itemTabla.ServiciosCliente.cantidadLineas);
      totalLineas += cantidadLineas;
      // Servicios cliente
      let cargoBasicoSC = QuitarComas(
        itemTabla.ServiciosCliente.cargoBasicoMensual
      );
      cargoBasicoSC = parseFloat(cargoBasicoSC);
      let CargoBasicoTotalSC = cargoBasicoSC * cantidadLineas;
      CargoBasicoNetoSC += CargoBasicoTotalSC;
      // Servicios oferta
      let cargoBasicoSO = QuitarComas(
        itemTabla.ServiciosOferta.cargoBasicoMensual
      );
      cargoBasicoSO = parseFloat(cargoBasicoSO);
      let CargoBasicoTotalSO = cargoBasicoSO * cantidadLineas;
      CargoBasicoNetoSO += CargoBasicoTotalSO;
      // Formatear valores tabla
      let cargoBasicoSCTabla = AgregarComas(cargoBasicoSC);
      let cargoBasicoSOTabla = AgregarComas(cargoBasicoSO);
      // let cargoBasicoTotalSCTabla = AgregarComas(CargoBasicoTotalSC);
      // let cargoBasicoTotalSOTabla = AgregarComas(CargoBasicoTotalSO);
      let fila = `
        <tr>
          <td>${cantidadLineas}</td>
          <td>${itemTabla.ServiciosCliente.navegacion} GB</td>
          <td>${itemTabla.ServiciosCliente.minutos}</td>
          <td>${cargoBasicoSCTabla}</td>
          <td>${itemTabla.ServiciosOferta.navegacion} GB</td>
          <td>${itemTabla.ServiciosOferta.minutos}</td>
          <td>${cargoBasicoSOTabla}</td>
        </tr>
      `;
      filas = filas + fila;

      // Información PDF
      let infoOfertaP = {
        cantidadLineas: cantidadLineas,
        navegacion1: itemTabla.ServiciosCliente.navegacion,
        minutos1: itemTabla.ServiciosCliente.minutos,
        cargoBasico1: cargoBasicoSCTabla,
        navegacion2: itemTabla.ServiciosOferta.navegacion,
        minutos2: itemTabla.ServiciosOferta.minutos,
        cargoBasico2: cargoBasicoSOTabla,
      };
      Oferta_Personalizada_PDF.push(infoOfertaP);
    }

    // Ajustar propuesta a recursos
    let valorNetoSC = CargoBasicoNetoSC * 12;
    let valorBrutoSC = CargoBasicoNetoSO * 12;
    let bonos = $("#txtValorBonos").val();
    if (bonos == "") {
      bonos = 0;
    }
    let clausula = $("#txtValorBonos").val();
    if (clausula == "") {
      clausula = 0;
    }
    let valorBonos = parseFloat(bonos);
    let valorClausula = parseFloat(clausula);
    let valorNetoSO = valorBrutoSC - valorBonos - valorClausula;
    let totalAhorro = valorNetoSC - valorNetoSO;
    let reduccionAnual = (totalAhorro / valorNetoSC) * 100;
    reduccionAnual = Math.round10(reduccionAnual, -1);
    let valorMesPromedio = valorNetoSO / 12;
    let ahorroMensualPromedio = CargoBasicoNetoSC - valorMesPromedio;

    // Ajuste financiero
    let ajuste = {
      Basico_Neto_Operador1: AgregarComas(CargoBasicoNetoSC),
      Basico_Neto_Operador2: AgregarComas(CargoBasicoNetoSO),
      Valor_Neto_Operador1: AgregarComas(valorNetoSC),
      Valor_Bruto_Operador2: AgregarComas(valorBrutoSC),
      Bono_Activacion: AgregarComas(valorBonos),
      Clausula: AgregarComas(valorClausula),
      Valor_Neto_Operador2: AgregarComas(valorNetoSO),
      Total_Ahorro: AgregarComas(totalAhorro),
      Reduccion_Anual: AgregarComas(reduccionAnual),
      Valor_Mes_Promedio: AgregarComas(valorMesPromedio),
      Ahorro_Mensual_Promedio: AgregarComas(ahorroMensualPromedio),
    };
    Ajuste_Financiero = ajuste;
    $("#ContenidoDinamico").append(`
      <div class="row">
        <div class="col-md-12">
          <div class="card cardComparativo">
              <div class="card-header titulo_comparativo">
                  Comparativo de servicios móviles
              </div>
              <div class="card-body">
                  <div class="row m-b-20">
                      <div class="col-md-4 text-center">
                          <h1 class="font-weight-bold">${Nombre_Operador_C}</h1>
                      </div>
                      <div class="col-md-4 text-center">
                          <h1 class="font-weight-bold">VS</h1>
                      </div>
                      <div class="col-md-4 text-center">
                          <h1 class="font-weight-bold">${Nombre_Operador_O}</h1>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-md-12">
                          <div class="table-responsive">
                              <table class="table table-striped">
                                  <thead>
                                      <tr>
                                          <th style="background-color:${Color_Operador_C}; color:#fff">Líneas</th>
                                          <th style="background-color:${Color_Operador_C}; color:#fff">Datos</th>
                                          <th style="background-color:${Color_Operador_C}; color:#fff">Minutos</th>
                                          <th style="background-color:${Color_Operador_C}; color:#fff">Cargo básico</th>
                                          <th style="background-color:${Color_Operador_O}; color:#fff">Datos</th>
                                          <th style="background-color:${Color_Operador_O}; color:#fff">Minutos</th>
                                          <th style="background-color:${Color_Operador_O}; color:#fff">Cargo básico</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                     ${filas}
                                  </tbody>
                                  <tfoot>
                                      <tr>
                                          <td>
                                              <h5 class="box-title">Total:  ${totalLineas}</h5>
                                          </td>
                                          <td colspan="2">
                                              <h5 class="font-weight-bold">
                                                  Cargo básico neto:
                                              </h5>
                                          </td>
                                          <td>${AgregarComas(
                                            CargoBasicoNetoSC
                                          )}</td>
                                          <td colspan="2">
                                              <h5 class="font-weight-bold">
                                                  Cargo básico neto:
                                              </h5>
                                          </td>
                                          <td>${AgregarComas(
                                            CargoBasicoNetoSO
                                          )}</td>
                                      </tr>
                                  </tfoot>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-10 colAjuste">
          <div class="card cardAjuste" style="border-color: ${Color_Operador_O} !important;">
              <div class="card-header titulo_ajuste" style="background-color:${Color_Operador_O};">
                  Propuesta ajustada a recursos
              </div>
              <div class="card-body">
                  <div class="row">
                      <div class="col-md-12">
                          <div class="table-responsive">
                              <table class="table table-striped">
                                  <thead>
                                      <tr>
                                          <th class="text-center text-white"
                                              style="background-color:${Color_Operador_O};">
                                              Flujo financiero
                                          </th>
                                          <th class="text-center text-white"
                                              style="background-color:${Color_Operador_O};">
                                              Concepto
                                          </th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <td>Total facturación en ${Nombre_Operador_C}</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right">${AgregarComas(
                                                valorNetoSC
                                              )}</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Cargo básico neto en ${Nombre_Operador_O}</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right">${AgregarComas(
                                                valorBrutoSC
                                              )}</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Bonos de activación</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right">${AgregarComas(
                                                valorBonos
                                              )}</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Cancelación cláusula</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right">${AgregarComas(
                                                valorClausula
                                              )}</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Total facturación en ${Nombre_Operador_O}</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right">${AgregarComas(
                                                valorNetoSO
                                              )}</div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Reducción anual</td>
                                          <td>
                                              <div class="float-right">
                                                ${AgregarComas(
                                                  reduccionAnual
                                                )} <i class="fa fa-percent"></i>
                                              </div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>
                                              <h5 class="text-danger font-weight-bold"> Total ahorro </h5>
                                          </td>
                                          <td>
                                              <i class="fa fa-dollar text-danger"></i>
                                              <h5 class="float-right text-danger font-weight-bold">
                                                ${AgregarComas(totalAhorro)}
                                              </h5>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>
                                              <h3 class="text-danger font-weight-bold text-uppercase">
                                                  Valor mes promedio
                                              </h3>
                                          </td>
                                          <td>
                                              <i class="fa fa-dollar text-danger"></i>
                                              <h3
                                                  class="float-right text-danger font-weight-bold text-uppercase">
                                                    ${AgregarComas(
                                                      valorMesPromedio
                                                    )}
                                              </h3>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td>Ahorro mensual promedio</td>
                                          <td>
                                              <i class="fa fa-dollar"></i>
                                              <div class="float-right"> ${AgregarComas(
                                                ahorroMensualPromedio
                                              )}</div>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
      `);
  }

  // Agregar textos al modal
  if (arrayAclaraciones.length > 0) {
    $("#columnaNotas").removeClass("col-md-12");
    $("#columnaNotas").addClass("col-md-6");
    $("#columnaAclaraciones").remove();

    let Aclaraciones = "";
    for (let itemClaracion of arrayAclaraciones) {
      Aclaraciones = Aclaraciones + `<li>${itemClaracion}</li>`;
    }
    $("#filaAclaraciones_Notas").prepend(`
      <div id="columnaAclaraciones" class="col-md-6 colPadre">
        <div class="sectionAclaraciones">
            <h2 class="SubTituloOferta"> <i class="fa fa-warning"></i> Aclaraciones:</h2>
            <ul id="listaAclaraciones">
                ${Aclaraciones}
            </ul>
        </div>
      </div>
    `);
  } else {
    $("#columnaNotas").removeClass("col-md-6");
    $("#columnaNotas").addClass("col-md-12");
    $("#columnaAclaraciones").remove();
  }

  // Notas
  $("#listaNotasModal").empty();
  for (let itemNota of arrayNotas) {
    $("#listaNotasModal").append(`<li>${itemNota}</li>`);
  }

  // Contacto
  $("#imgOperador").empty();
  $("#imgOperador").append(`
    <img src="${URL}/Images/Usuarios/${Imagen_Operador_O}" height="200">
  `);

  // Pie de página
  $("#nombreEmpleado").text(Nombre_Empleado);
};

let ValidarExistenciaDatosOferta = () => {
  // Validar que existan servicos registrados
  let Tipo_Oferta = 0;
  let Oferta = false;
  if (localStorage.ServiciosMovilesOE || localStorage.ServiciosMovilesOP) {
    let arrayServiciosOE = [];
    try {
      arrayServiciosOE = JSON.parse(localStorage.ServiciosMovilesOE);
    } catch (error) {
      arrayServiciosOE = [];
    }
    let arrayServiciosOP = [];
    try {
      arrayServiciosOP = JSON.parse(localStorage.ServiciosMovilesOP);
    } catch (error) {
      arrayServiciosOP = [];
    }
    if (arrayServiciosOE.length > 0) {
      Tipo_Oferta = 1;
      Oferta = true;
    } else if (arrayServiciosOP.length > 0) {
      Tipo_Oferta = 2;
      Oferta = true;
    } else {
      GenerarAlertasToast(1);
    }
  } else {
    GenerarAlertasToast(1);
  }
  let info = {
    Tipo_Oferta: Tipo_Oferta,
    Oferta: Oferta,
  };
  return info;
};

// Servicios móviles cliente swipers
let ListarSwipers = () => {
  $("#swipers").empty();
  let arrayServiciosMoviles = JSON.parse(
    localStorage.getItem("ServiciosMoviles")
  );
  if (arrayServiciosMoviles.length > 0) {
    $("#swipers").append(`
    <div class="swiper-container">
      <div id="lista_swipers" class="swiper-wrapper"></div>
      <div class="swiper-pagination"></div>
    </div>
  `);
    let contadorID = 0;
    for (let item of arrayServiciosMoviles) {
      contadorID++;
      $("#lista_swipers").append(`
      <div class="swiper-slide">
        <div class="CardServicios">
            <div id="poster" class="poster">
                <div class="icon"><i class="fa fa-list-alt"></i></div>
            </div>
            <div class="icono_mark">
              <i class="fa fa-bookmark"></i>
            </div>
            <div class="details">
                <div class="titulo">
                    <input name="rbtnCardServicios" type="radio"
                        class="with-gap" id="cardServicios${contadorID}" 
                        value="${item.id}">
                    <label id="lblCantidadLineas" for="cardServicios${contadorID}">
                       ${item.cantidadLineas} 
                       ${item.cantidadLineas == 1 ? " línea" : " líneas"}
                    </label>
                </div>
                <div class="info">
                    <div class="row">
                        <div class="col-md-6"> Cargo:</div>
                        <div class="col-md-6">${item.cargoBasicoMensual}</div>
                    </div>
                    <div class="row">
                        <div class="col-md-6"> Datos:</div>
                        <div class="col-md-6">${item.navegacion} GB
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6"> Minutos:</div>
                        <div class="col-md-6">${item.minutos}</div>
                    </div>
                    <div class="row">
                        <div class="col-md-6"> Mensajes:</div>
                        <div class="col-md-6">${item.mensajes}</div>
                    </div>
                    <div class="row">
                        <div class="col-md-12 text-center">
                            <span class="mensaje_consulta">
                                Consulte tabla de servicios *
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `);

      let arrayComparativo = [];
      if (localStorage.Comparativo) {
        arrayComparativo = JSON.parse(localStorage.Comparativo);
        for (let itemComparativo of arrayComparativo) {
          if (itemComparativo.Id_ServiciosCliente == item.id) {
            $(`input:radio[name='rbtnCardServicios'][value='${item.id}']`)
              .parents(".CardServicios")
              .children(".icono_mark")
              .addClass("show");
          }
        }
      }
    }

    swiper = new Swiper(".swiper-container", {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: "auto",
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false,
      },
      pagination: {
        el: ".swiper-pagination",
      },
    });
  }

  // Editar linea
  SetDataServiciosMovilesOP();
  // Evento de escucha (Seleccionar grupo de líneas)
  // $("input:radio[name='rbtnCardServicios']").change(function () {
  //   $("#valSiComparativo").removeAttr("style");
  //   $("#valNoComparativo").attr("style", "display:none");
  // });
};

// Textos oferta
let PrecargarAclaraciones = (click, data) => {
  idAclaracion++;
  let lista = document.getElementById("listaAclaraciones");
  let divtest = document.createElement("div");
  divtest.setAttribute("class", "form-group removeclass" + idAclaracion);
  if (click) {
    divtest.innerHTML = `
      <div class="row form-group">
        <div class="col-md-12">
          <div class="input-group">
              <textarea class="form-control opcionAclaraciones " name="opcionOferta"
                  id="txtOpcionAclaracion${idAclaracion}" rows="3"
                  placeholder="Ingrese aclaraciones sobre la oferta"></textarea>
              <div class="input-group-append">
                  <button class="btn btn-danger" type="button"
                      onclick="Eliminarinput(${idAclaracion})">
                      <i class="fa fa-minus"></i>
                  </button>
              </div>
          </div>
        </div>
      </div>
    `;
  } else {
    divtest.innerHTML = `
      <div class="row form-group">
        <div class="col-md-12">
          <div class="input-group">
              <textarea class="form-control opcionAclaraciones" name="opcionOferta"
                  id="txtOpcionAclaracion${idAclaracion}" rows="3"
                  placeholder="Ingrese aclaraciones sobre la oferta">${data}</textarea>
              <div class="input-group-append">
                  <button class="btn btn-danger" type="button"
                      onclick="Eliminarinput(${idAclaracion})">
                      <i class="fa fa-minus"></i>
                  </button>
              </div>
          </div>
        </div>
      </div>
    `;
  }

  lista.appendChild(divtest);

  $(`#txtOpcionAclaracion${idAclaracion}`).rules("add", {
    maxlength: 255,
  });
};

let PrecargarNotas = (click, data) => {
  idNota++;
  let lista = document.getElementById("listaNotas");
  let divtest = document.createElement("div");
  divtest.setAttribute("class", "form-group removeclass" + idNota);
  if (click) {
    divtest.innerHTML = `
      <div class="row form-group">
        <div class="col-md-12">
          <div class="input-group">
              <textarea class="form-control opcionNotas valDetalle" name="opcionOferta"
                  id="txtOpcionNota${idNota}" rows="3"
                  placeholder="Informacion relevante sobre la oferta"></textarea>
              <div class="input-group-append">
                  <button class="btn btn-danger" type="button"
                      onclick="EliminarNotas(${idNota})">
                      <i class="fa fa-minus"></i>
                  </button>
              </div>
          </div>
        </div>
      </div>
    `;
  } else {
    divtest.innerHTML = `
      <div class="row form-group">
        <div class="col-md-12">
          <div class="input-group">
              <textarea class="form-control opcionNotas valDetalle" name="opcionOferta"
                  id="txtOpcionNota${idNota}" rows="3"
                  placeholder="Informacion relevante sobre la oferta">${data}</textarea>
              <div class="input-group-append">
                  <button class="btn btn-danger" type="button"
                      onclick="EliminarNotas(${idNota})">
                      <i class="fa fa-minus"></i>
                  </button>
              </div>
          </div>
        </div>
      </div>
    `;
  }

  lista.appendChild(divtest);

  $(`#txtOpcionNota${idNota}`).rules("add", {
    maxlength: 255,
    required: true,
  });
};

let EliminarNotas = (id) => {
  let notas = $(".opcionNotas");
  if (notas.length > 1) {
    $(".removeclass" + id).remove();
  } else {
    GenerarAlertasToast(4);
  }
};

let ObtenerNombreEmpleado = () => {
  fetch("/ObtenerSession", {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((error) => console.log("Error:", error))
    .then((data) => {
      let nombre = data.session.Nombre;
      sessionStorage.NombreEmpleado = nombre;
    });
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

let CargarDatosUbicacion = (ubicacion) => {
  $.ajax({
    url: `${URL}/Cliente/Datos/Ubicacion`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      sessionStorage.DatosUbicacion = JSON.stringify(datos.data);

      if (typeof ubicacion != "undefined") {
        CargarPaises(datos.data.Paises, false, ubicacion.Id_Pais);
        CargarDepartamentos(
          datos.data.Departamentos,
          false,
          ubicacion.Id_Departamento
        );
        CargarMunicipios(datos.data.Municipios, false, ubicacion.Id_Municipio);
        CargarSubTipos(
          datos.data.Subtipos,
          false,
          ubicacion.Id_SubTipo_Barrio_Vereda
        );
        CargarBarrios_Veredas(
          datos.data.Barrios_Veredas,
          false,
          ubicacion.Id_Barrios_Veredas
        );
      } else {
        CargarPaises(datos.data.Paises);
        CargarSubTipos(datos.data.Subtipos);
      }
      OcultarLoaderLlamada();
      iniciarCronometroLlamada();
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

let CargarOperadores = (Id_Operador) => {
  $.ajax({
    url: `${URL}/Operador`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      sessionStorage.Operadores = JSON.stringify(datos.data);
      $("#txtOperador").empty();
      $("#txtOperador").prepend(
        "<option selected disabled >Seleccione...</option>"
      );
      for (let item of datos.data) {
        let opcion;
        if (parseInt(item.Id_Operador) == parseInt(Id_Operador)) {
          opcion = $("<option />", {
            text: `${item.Nombre_Operador}`,
            value: `${item.Id_Operador}`,
            selected: true,
          });
        } else {
          opcion = $("<option />", {
            text: `${item.Nombre_Operador}`,
            value: `${item.Id_Operador}`,
          });
        }
        $("#txtOperador").append(opcion);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let CargarCalificaciones = (Id_Calificacion_Operador) => {
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
        let opcion;
        if (
          parseInt(item.Id_Calificacion_Operador) ==
          parseInt(Id_Calificacion_Operador)
        ) {
          opcion = $("<option />", {
            text: `${item.Calificacion}`,
            value: `${item.Id_Calificacion_Operador}`,
            selected: true,
          });
        } else {
          opcion = $("<option />", {
            text: `${item.Calificacion}`,
            value: `${item.Id_Calificacion_Operador}`,
          });
        }
        $("#txtCalificacion").append(opcion);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let CargarOpcionesPredefinidas = (opciones) => {
  $.ajax({
    url: `${URL}/OpcionesPredefinidas`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      sessionStorage.Opciones = JSON.stringify(datos.data);
      $("#txtRazones").empty();
      $("#txtDetalle_Servicios_Ilimitados").empty();
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
        } else if (item.Categoria == "Servicios ilimitados") {
          $("#txtDetalle_Servicios_Ilimitados").append(opcion);
        } else if (item.Categoria == "Servicios adicionales") {
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
      $("#txtDetalle_Servicios_Ilimitados").select2({
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

      if (typeof opciones != "undefined") {
        $("#txtRazones").val(opciones).trigger("change");
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

// CitaEnlazarClickAdvertencias

let CargarOperadoresCita = (Id_Operador_Cliente) => {
  $.ajax({
    url: `${URL}/Operador/Oferta`,
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
          opcion = $("<option />", {
            text: `${item.Nombre_Operador}`,
            value: `${item.Id_Operador}`,
            disabled: true,
          });
        } else {
          opcion = $("<option />", {
            text: `${item.Nombre_Operador}`,
            value: `${item.Id_Operador}`,
          });
        }
        $("#txtOperadorCita").append(opcion);
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let CargarOperadoresOferta = () => {
  $.ajax({
    url: `${URL}/Operador/Oferta`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      $("#txtOperadorOferta").empty();
      $("#txtOperadorOferta").prepend(
        "<option selected disabled >Seleccione...</option>"
      );
      let Id_Operador_Cliente = parseInt(
        $("#txtOperador option:selected").val()
      );
      let opcion = null;
      for (let item of datos.data) {
        if (parseInt(item.Id_Operador) == Id_Operador_Cliente) {
          opcion = $("<option />", {
            text: `${item.Nombre_Operador}`,
            value: `${item.Id_Operador}`,
            disabled: true,
          });
        } else {
          opcion = $("<option />", {
            text: `${item.Nombre_Operador}`,
            value: `${item.Id_Operador}`,
          });
        }
        $("#txtOperadorOferta").append(opcion);
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

let ValidarLlamarCliente = (data) => {
  $("#Info_Registrado").removeAttr("style");
  $("#titulo_modal_detalle").empty();
  $("#titulo_modal_detalle").append(`
    <i class="fa fa-warning"></i> ¡Cliente ya registrado!
  `);
  if (data.llamar) {
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
    $("#listRazones").text(`${data.razones}`);
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

let ValidarHorasCita = () => {
  let Id_Operador_Cita = $("#txtOperadorCita").val();
  if (Fecha_Cita != null && Id_Operador_Cita != null) {
    // Informar de que el operador o fecha a cambiado y la hora ya no la deseamos separar.
    if (Operador_Fecha_Cambio && Permitir_SocketIO) {
      let InfoAgendamiento = JSON.parse(
        sessionStorage.getItem("InfoAgendamiento")
      );
      citasSocket.emit("ActualizarHorasCita", {
        Tipo: 2,
        Hora: InfoAgendamiento.HoraActual,
        FechaCita: InfoAgendamiento.FechaCita,
        OperadorCita: InfoAgendamiento.OperadorCita,
      });
      console.log("Cambio de fecha u hora: ");
      console.log(InfoAgendamiento);
      // Poner en false las varables de control ya que no hay hora asignada y la fecha y hora cambiadas ya fueron resueltas.
      Operador_Fecha_Cambio = false;
      HoraAsignada = false;
    }
    // Hora antes de que se haga efecto de carga
    let HoraCambio = $("#txtHoraCita").val();
    console.log("Hora de cambio");
    console.log(HoraCambio);
    // Validaciones antes de petición
    $("#resumenCitaHora").attr("checked", false);
    $("#txtHoraCita").val("Cargando...");
    $("#txtHoraCita").attr("disabled", true);
    let fecha = moment(Fecha_Cita, "YYYY-MM-DD").unix();
    LimpiarClasestxtHora();
    $("#txtHoraCita").addClass("form-control-success");
    $("#txtHoraCita").addClass("CargandoGif");

    // Petición ajax de horas disponibles
    $.ajax({
      url: `${URL}/Citas/HorasDisponibles/${Id_Operador_Cita}/${fecha}`,
      type: "get",
      datatype: "json",
      success: function (res) {
        $("#txtHoraCita").attr("disabled", false);
        $("#txtHoraCita").removeClass("CargandoGif");
        $("#txtHoraCita").val("Seleccione...");
        $("#txtHoraCita").removeClass("form-control-success");
        let info = {
          HorasDisponibles: res.data.Horas,
          CantidadMaxima: res.data.Cantidad_Maxima,
          FechaCita: Fecha_Cita,
          OperadorCita: parseInt(Id_Operador_Cita),
          HoraActual: HoraCambio,
        };
        if (res.data.Cantidad_Maxima > 0) {
          Permitir_SocketIO = true;
        }
        sessionStorage.InfoAgendamiento = JSON.stringify(info);
        let arrayOperadores = sessionStorage.getItem("Operadores");
        for (let itemOperador of arrayOperadores) {
          if (itemOperador.Id_Operador == Id_Operador_Cita) {
            $("#ModalHD_Nombre_Operador").text(itemOperador.Nombre_Operador);
          }
        }
        moment.locale();
        let fechaModal = moment(Fecha_Cita).format("dddd DD [de] MMMM YYYY");
        $("#ModalHD_Fecha_Cita").text(fechaModal);
        MostrarHorasDisponibles();
      },
      error: function (error) {
        $("#txtHoraCita").removeClass("CargandoGif");
        $("#txtHoraCita").val("Seleccione...");
        $("#txtHoraCita").removeClass("form-control-success");
        console.log(error);
      },
    });
  }
};

let MostrarHorasDisponibles = () => {
  let InfoAgendamiento = JSON.parse(sessionStorage.getItem("InfoAgendamiento"));
  let CantidadMaxima = InfoAgendamiento.CantidadMaxima;
  let arrayhoras = InfoAgendamiento.HorasDisponibles;
  let contador = 0;
  $("#listaHorasDisponibles").empty();
  for (let itemHora of arrayhoras)
    if (CantidadMaxima > 0) {
      if (itemHora.Cantidad < CantidadMaxima) {
        contador++;
        $("#listaHorasDisponibles").append(`
          <div class="col-md-3">
            <div class="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input name="rbtnHoraDisponible" type="radio" class="with-gap"
                                id='hora_disponible${contador}' value="${itemHora.Hora}">
                            <label class="m-b-0" for='hora_disponible${contador}'></label>
                        </div>
                    </div>
                    <input type="button" class="form-control inputHoraDisponible" value="${itemHora.Hora}">
                </div>
            </div>
          </div>
        `);
      }
    } else {
      contador++;
      $("#listaHorasDisponibles").append(`
          <div class="col-md-3">
            <div class="form-group">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input name="rbtnHoraDisponible" type="radio" class="with-gap"
                                id='hora_disponible${contador}' value="${itemHora.Hora}">
                            <label class="m-b-0" for='hora_disponible${contador}'></label>
                        </div>
                    </div>
                    <input type="button" class="form-control inputHoraDisponible" value="${itemHora.Hora}">
                </div>
            </div>
          </div>
        `);
    }
  $(".inputHoraDisponible").click(function () {
    let padre = $(this).parent();
    let input = $(padre).find("input:radio[name=rbtnHoraDisponible]");
    $(input).trigger("click");
  });

  $("input:radio[name=rbtnHoraDisponible]").change(function () {
    $("#btnAgendarHora").prop("disabled", false);
  });
};

ActualizarHorasCitaSocket = (res) => {
  let data = res.data;
  console.log(data);
  if (sessionStorage.InfoAgendamiento) {
    let InfoAgendamiento = JSON.parse(
      sessionStorage.getItem("InfoAgendamiento")
    );
    if (
      InfoAgendamiento.OperadorCita == data.OperadorCita &&
      InfoAgendamiento.FechaCita == data.FechaCita
    ) {
      for (itemHora of InfoAgendamiento.HorasDisponibles) {
        if (itemHora.Hora == data.Hora) {
          if (data.Tipo == 1) {
            itemHora.Cantidad++;
          } else {
            itemHora.Cantidad--;
          }
        }
      }
      sessionStorage.InfoAgendamiento = JSON.stringify(InfoAgendamiento);
      MostrarHorasDisponibles();
    }
  }
};

let LimpiarClasestxtHora = () => {
  $("#txtHoraCita").parents("form-group").removeClass("has-success");
  $("#txtHoraCita").parents("form-group").removeClass("has-danger");
  $("#txtHoraCita").removeClass("form-control-danger");
  $("#txtHoraCita-error").remove();
};
