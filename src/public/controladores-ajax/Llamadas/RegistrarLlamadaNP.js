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
      CargarRazonesOperador();
      CargarRazonesLlamada();
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
        // },
        // txtTelefono: {
        //   required: true,
        //   SoloNumeros: true,
        //   minlength: 5,
        //   maxlength: 10,
        // },
        txtNIT: {
          ValidarNIT: true,
          minlength: 5,
        },
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
        // txtDetalle_Cantidad_Lineas: {
        //   required: true,
        //   SoloNumeros: true,
        // },
        // txtDetalle_Valor_Mensual: {
        //   required: true,
        //   SoloNumeros: true,
        // },
        // detalleLineasRadios: "required",
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
  $("#Fecha_LP").bootstrapMaterialDatePicker({
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
      // $("#Fecha_Corporativo").datepicker({
      //   language: "es",
      //   format: "yyyy/mm/dd",
      //   autoclose: true,
      //   todayHighlight: true,
      // });

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

      // Detalles líneas

      $(document).on("click", "#DetallesLineasDetalle", function () {
        let idLinea = $(this).attr("id_linea");
        let DetalleLineas = JSON.parse(sessionStorage.getItem("DetalleLineas"));

        DetalleLineas.forEach(function (linea, indice, array) {
          if (linea.id == idLinea) {
            let minutos = "";

            if (linea.minIlimitados) {
              minutos += "Ilimitados";
            } else {
              minutos += linea.minutos;
            }

            if (linea.todoOperador) {
              minutos += ",todo operador";
            }

            if (linea.minOtro != "") {
              minutos += "," + linea.minOtro;
            }

            let Valor_Total_Mensual = 0;
            // Establecer valor total mensual de las lineas.
            if (linea.valValorLineas == "1") {
              Valor_Total_Mensual += parseInt(linea.valorMensual);
            } else if (linea.valValorLineas == "2") {
              Valor_Total_Mensual +=
                parseInt(linea.valorMensual) * parseInt(linea.cantidadLineas);
            }

            $("#tbodyModalLinea").empty();
            $("#tbodyModalLinea").append(`
                                <tr id="txtIdLineasModalNumeros" style="display:none" >
                                    <td>${linea.id}</td>
                                </tr>
                                    <tr>
                                        <td> Cantidad líneas </td>
                                        <td><p id="txtIncrementarLineas" class="float-right"> ${
                                          linea.cantidadLineas
                                        }</p></td>
                                    </tr>
                                    <tr>
                                        <td><h5 class="text-danger font-weight-bold text-uppercase">Pago mensual</h5></td>
                                        <td>
                                            <i class="fa fa-dollar text-danger"></i>
                                            <h5 class="float-right text-danger font-weight-bold">
                                                ${Valor_Total_Mensual}
                                            </h5>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Navegación</td>
                                        <td>
                                        ${linea.navegacion + " " + linea.unidad}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Minutos</td>
                                        <td>
                                            ${minutos}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Otros</td>
                                        <td>

                                        ${
                                          linea.mensajes
                                            ? '<input type="radio" class="with-gap" id="radio_tbl" checked> <label for="radio_tbl1">Mensajes</label>'
                                            : ""
                                        }

                                        ${
                                          linea.redes
                                            ? '<input type="radio" class="with-gap" id="radio_tbl" checked><label for="radio_tbl">Redes</label>'
                                            : ""
                                        }
                                        
                                        ${
                                          linea.llamadas
                                            ? '<input type="radio" class="with-gap" id="radio_tbl" checked>  <label for="radio_tbl1">Llamadas</label>'
                                            : ""
                                        }
                
                                        ${
                                          linea.roaming
                                            ? '<input type="radio" class="with-gap" id="radio_tbl" checked> <label for="radio_tbl">Roaming</label>'
                                            : ""
                                        }
                                        </td>
                                    </tr>


                                    `);

            // TouchSpin
            // $("#txtIncrementarLineas").TouchSpin({
            //     min: 0,
            //     max: 1000000000,
            //     stepinterval: 50,
            //     maxboostedstep: 10000000,
            // });

            if (typeof linea.NumerosLineas !== "undefined") {
              $("#ModalNumerosLineas").empty();

              AgregarInput(linea.NumerosLineas.length, linea.NumerosLineas);
            } else {
              $("#ModalNumerosLineas").empty();
              AgregarInput(linea.cantidadLineas, 0, false);
            }

            $(".txtNumeroLinea").each(function () {
              $(this).rules("add", {
                ValidarCelular: true,
                minlength: 10,
                maxlength: 10,
              });
            });

            $("#LineasModal").modal("show");
          }
        });
      });

      // Editar linea

      $(document).on("click", "#DetallesLineasEditar", function () {
        let idLinea = $(this).attr("id_linea");
        let DetalleLineas = JSON.parse(sessionStorage.getItem("DetalleLineas"));

        DetalleLineas.forEach(function (valor, indice, array) {
          // console.log(valor);
          if (valor.id == idLinea) {
            $("#txtDetalleId").val(valor.id);
            $("#txtDetalle_Cantidad_Lineas").val(valor.cantidadLineas);
            $("#txtDetalle_Valor_Mensual").val(valor.valorMensual);
            valor.valValorLineas == "1"
              ? $("#txtDetalle_radio").prop("checked", true)
              : $("#txtDetalle_radio2").prop("checked", true);
            $("#txtDetalleNavegacion").val(valor.navegacion);
            // $('#txtDetalleUnidad').val(),

            if (valor.minIlimitados) {
              if (
                !$("input:checkbox[name=txtDetalle_Validacion_Ilimitados]").is(
                  ":checked"
                )
              ) {
                $(
                  "input:checkbox[name=txtDetalle_Validacion_Ilimitados]"
                ).trigger("click");
              }
            } else {
              $("#txtDetalle_Minutos").val(valor.minutos);
            }
            valor.todoOperador
              ? $("input:checkbox[name=txtDetalle_Minutos_TO]").prop(
                  "checked",
                  true
                )
              : "";
            valor.minOtro != ""
              ? $("#txtDetalle_Minutos_Otro").val(valor.minOtro)
              : $("#txtDetalle_Minutos_Otro").val("");
            valor.mensajes
              ? $("input:checkbox[name=txtDetalle_Mensajes]").prop(
                  "checked",
                  true
                )
              : "";
            valor.redes
              ? $("input:checkbox[name=txtDetalle_Redes]").prop("checked", true)
              : "";
            valor.llamadas
              ? $("input:checkbox[name=txtDetalle_Llamadas]").prop(
                  "checked",
                  true
                )
              : "";
            valor.roaming
              ? $("input:checkbox[name=txtDetalle_Roaming]").prop(
                  "checked",
                  true
                )
              : "";
          }
        });
      });

      // Eliminar línea.

      $(document).on("click", "#DetallesLineasEliminar", function () {
        let idLinea = $(this).attr("id_linea");
        let DetalleLineas = JSON.parse(sessionStorage.getItem("DetalleLineas"));

        DetalleLineas.forEach(function (valor, indice, array) {
          if (valor.id == idLinea) {
            DetalleLineas.splice(indice, 1);
          }
        });
        sessionStorage.DetalleLineas = JSON.stringify(DetalleLineas);
        ListarDetalleLineas();
      });
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
  $("#txtNIT").change(function(){
    let nit = $("#txtNIT")
    let validacion = form.validate().element(nit)
    if(validacion){
      $("#resumenCitaNIT").attr("checked", true);
    }else{
      $("#resumenCitaNIT").removeAttr("checked");
    }
  })

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
  // Array Lineas
  let arrayLineas = [];

  let Cantidad_Total_Lineas = 0;
  let Valor_Total_Mensual = 0;

  if (sessionStorage.DetalleLineas) {
    let DetalleLineas = JSON.parse(sessionStorage.DetalleLineas);

    let GrupoLineas = 0;
    for (let lineaItem of DetalleLineas) {
      let minutos = "";

      if (lineaItem.minIlimitados) {
        minutos += "Ilimitados";
      } else {
        minutos += lineaItem.minutos;
      }

      if (lineaItem.todoOperador) {
        minutos += ",todo operador";
      }

      if (lineaItem.minOtro != "") {
        minutos += "," + lineaItem.minOtro;
      }

      // Establecer valor total mensual de las lineas.
      if (lineaItem.valValorLineas == "1") {
        Valor_Total_Mensual += parseInt(lineaItem.valorMensual);
      } else if (lineaItem.valValorLineas == "2") {
        Valor_Total_Mensual +=
          parseInt(lineaItem.valorMensual) * parseInt(lineaItem.cantidadLineas);
      }

      GrupoLineas++;
      for (let i = 0; i < parseInt(lineaItem.cantidadLineas); i++) {
        let linea = {
          minutos: minutos,
          navegacion: lineaItem.navegacion + " " + lineaItem.unidad,
          mensajes: lineaItem.mensajes ? 1 : 0,
          redes: lineaItem.redes ? 1 : 0,
          llamadas: lineaItem.llamadas ? 1 : 0,
          roaming: lineaItem.roaming ? 1 : 0,
          cargo: lineaItem.valorMensual,
          grupo: GrupoLineas,
        };

        if (typeof lineaItem.NumerosLineas !== "undefined") {
          Object.defineProperty(linea, "numero", {
            value: lineaItem.NumerosLineas[i],
            enumerable: true,
          });
        }

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
        stringRazones += razon;
      } else {
        stringRazones += ", " + razon;
      }
    });
  }

  let Id_Estado_Llamada = parseInt($("#txtConclusion").val());
  let txtDuracion_Llamada =
    "00:" + $("#txtMinutosL").text() + ":" + $("#txtSegundosL").text();
  let datos = {
    // Llamada
    Id_Usuario: parseInt(sessionStorage.getItem("Id_Usuario")),
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
    DetalleLineas: arrayLineas,

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

  $.ajax({
    url: `${URL}/Llamadas/LlamadaNP`,
    dataType: "json",
    type: "post",
    contentType: "aplication/json",
    data: JSON.stringify(datos),
    processData: false,
    success: function (respuesta) {
      console.log(respuesta);

      if (respuesta.data.ok) {
        // Si se registra cita se envía notifiación a coordinadores y administrador
        if (respuesta.data.okCita) {
          let datosNotificacion = respuesta.data.notificacion;

          // Fecha
          let fecha = new Date();
          let horas = fecha.getHours();
          let minutos = fecha.getMinutes();

          horas < 10 ? (horas = "0" + horas) : (horas = horas);
          minutos < 10 ? (minutos = "0" + minutos) : (minutos = minutos);
          let dd = "AM";
          let h = horas;
          if (h >= 12) {
            h = horas - 12;
            dd = "PM";
          }
          if (h == 0) {
            h = 12;
          }
          let tiempo = horas + ":" + minutos + " " + dd;

          Object.defineProperties(datosNotificacion, {
            Usuario: {
              value: sessionStorage.getItem("Usuario"),
              enumerable: true,
            },
            Hora: {
              value: tiempo,
              enumerable: true,
            },
          });

          // Generar Notificacion.
          console.log(datosNotificacion);
        }

        swal(
          {
            title: "Registro exitoso.",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#2F6885",
            confirmButtonText: "Continuar",
            closeOnConfirm: false,
          },
          function (isConfirm) {
            if (isConfirm) {
              sessionStorage.removeItem("DetalleLineas");
              location.href = "Llamadas.html";
            }
          }
        );
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
      }else{
        $("#resumenCitaFecha").removeAttr("checked")
      }
    });

  $("#btnHoraCita").change(function(){
    $("#resumenCitaHora").attr("checked", true);
  })


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

let CargarRazonesOperador = () => {
  $.ajax({
    url: `${URL}/Razones/Operador`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      $("#txtRazones").empty();

      for (let item of datos.data) {
        let $opcion = $("<option />", {
          text: `${item.Razon}`,
          value: `${item.Razon}`,
        });

        $("#txtRazones").append($opcion);
      }

      //  Select razones
      $("#txtRazones").select2({
        tags: true,
        tokenSeparators: [","],
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let CargarRazonesLlamada = () => {
  $.ajax({
    url: `${URL}/Razones/Llamada`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      $("#txtRazonesLlamada").empty();

      for (let item of datos.data) {
        let $opcion = $("<option />", {
          text: `${item.Razon}`,
          value: `${item.Razon}`,
        });

        $("#txtRazonesLlamada").append($opcion);
      }

      //  Select razones
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
    if (item.Nombre_Municipio == "Medellín") {
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
  let DetalleLineas = [];
  if (sessionStorage.DetalleLineas) {
    DetalleLineas = JSON.parse(sessionStorage.getItem("DetalleLineas"));
  }

  let arrayDetalleLinea = {
    id: uuid.v4(),
    cantidadLineas: $("#txtDetalle_Cantidad_Lineas").val(),
    valorMensual: $("#txtDetalle_Valor_Mensual").val(),
    valValorLineas: $("input:radio[name=detalleLineasRadios]:checked").val(),
    navegacion: $("#txtDetalleNavegacion").val(),
    unidad: $("#txtDetalleUnidad").val(),
    minutos: $("#txtDetalle_Minutos").val(),
    minIlimitados: $(
      "input:checkbox[name=txtDetalle_Validacion_Ilimitados]"
    ).is(":checked"),
    todoOperador: $("input:checkbox[name=txtDetalle_Minutos_TO]").is(
      ":checked"
    ),
    minOtro: $("#txtDetalle_Minutos_Otro").val(),
    mensajes: $("input:checkbox[name=txtDetalle_Mensajes]").is(":checked"),
    llamadas: $("input:checkbox[name=txtDetalle_Llamadas]").is(":checked"),
    redes: $("input:checkbox[name=txtDetalle_Redes]").is(":checked"),
    roaming: $("input:checkbox[name=txtDetalle_Roaming]").is(":checked"),
  };

  DetalleLineas.push(arrayDetalleLinea);

  sessionStorage.DetalleLineas = JSON.stringify(DetalleLineas);

  LimpiarDetalleLinea();
  ListarDetalleLineas();
};

let ListarDetalleLineas = () => {
  if (sessionStorage.DetalleLineas) {
    let DetalleLineas;
    let Cantidad_Lineas = 0;
    let Valor_Mensual = 0;
    let contador = 0;
    DetalleLineas = JSON.parse(sessionStorage.getItem("DetalleLineas"));

    $("#TblRegistroDetalleLineas").empty();

    for (let item of DetalleLineas) {
      contador++;

      Cantidad_Lineas += parseInt(item.cantidadLineas);

      if (parseInt(item.valValorLineas) == 1) {
        Valor_Mensual += parseInt(item.valorMensual);
      } else if (parseInt(item.valValorLineas) == 2) {
        Valor_Mensual +=
          parseInt(item.valorMensual) * parseInt(item.cantidadLineas);
      }

      $("#TblRegistroDetalleLineas").append(`
                <tr>
                    <td>${contador}</td>
                    <td>${item.cantidadLineas}</td>
                    <td>
                        <i class="fa fa-dollar"></i>
                        <div class="float-right">${item.valorMensual}</div> 
                    </td>
                    <td>${item.navegacion + " " + item.unidad}</td>
                    <td>${item.minIlimitados ? "Ilimitados " : item.minutos}${
        item.todoOperador ? " todo operador " : ""
      } ${item.minOtro != "" ? item.minOtro : ""}</td>
                    <td>
                        ${
                          item.mensajes
                            ? '<input type="radio" class="with-gap" id="radio_tbl" checked> <label for="radio_tbl1">Mensajes</label>'
                            : ""
                        }

                        ${
                          item.redes
                            ? '<input type="radio" class="with-gap" id="radio_tbl" checked><label for="radio_tbl">Redes</label>'
                            : ""
                        }
                        
                        ${
                          item.llamadas
                            ? '<input type="radio" class="with-gap" id="radio_tbl" checked>  <label for="radio_tbl1">Llamadas</label>'
                            : ""
                        }

                        ${
                          item.roaming
                            ? '<input type="radio" class="with-gap" id="radio_tbl" checked> <label for="radio_tbl">Roaming</label>'
                            : ""
                        }
                        
                    </td>
                    <td>
                        <span class="label label-info">${
                          parseInt(item.valValorLineas) == 1
                            ? "En total"
                            : "Por línea"
                        }</span>
                    </td>
                    <td>

                        <button type="button" id="DetallesLineasEditar" id_linea="${
                          item.id
                        }" class="btn btn-outline-info btn-sm">
                            <i class="fa fa-pencil"></i>
                        </button>
                
                        <button type="button" id="DetallesLineasEliminar" id_linea="${
                          item.id
                        }" class="btn btn-outline-danger btn-sm">
                            <i class="fa fa-close"></i>
                        </button>
                    </td>
                </tr>

            `);
    }

    $("#tFootRegistroDetalleCliente").empty();
    $("#tFootRegistroDetalleCliente").append(`
            <tr>
                <td>
                    <h5 class="box-title">Total:</h5>
                </td>
                <td>${Cantidad_Lineas}</td>
                <td>
                    <i class="fa fa-dollar"></i>
                    <div class="float-right">${Valor_Mensual}</div> 
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        `);
  }
};

let EditarDetalleLinea = () => {
  let idLinea = $("#txtDetalleId").val();
  let DetalleLineas = JSON.parse(sessionStorage.getItem("DetalleLineas"));

  DetalleLineas.forEach(function (valor, indice, array) {
    if (valor.id == idLinea) {
      DetalleLineas.splice(indice, 1);
    }
  });

  let arrayDetalleLinea = {
    id: $("#txtDetalleId").val(),
    cantidadLineas: $("#txtDetalle_Cantidad_Lineas").val(),
    valorMensual: $("#txtDetalle_Valor_Mensual").val(),
    valValorLineas: $("input:radio[name=detalleLineasRadios]:checked").val(),
    navegacion: $("#txtDetalleNavegacion").val(),
    unidad: $("#txtDetalleUnidad").val(),
    minutos: $("#txtDetalle_Minutos").val(),
    minIlimitados: $(
      "input:checkbox[name=txtDetalle_Validacion_Ilimitados]"
    ).is(":checked"),
    todoOperador: $("input:checkbox[name=txtDetalle_Minutos_TO]").is(
      ":checked"
    ),
    minOtro: $("#txtDetalle_Minutos_Otro").val(),
    mensajes: $("input:checkbox[name=txtDetalle_Mensajes]").is(":checked"),
    llamadas: $("input:checkbox[name=txtDetalle_Llamadas]").is(":checked"),
    redes: $("input:checkbox[name=txtDetalle_Redes]").is(":checked"),
    roaming: $("input:checkbox[name=txtDetalle_Roaming]").is(":checked"),
  };

  DetalleLineas.push(arrayDetalleLinea);

  sessionStorage.DetalleLineas = JSON.stringify(DetalleLineas);

  LimpiarDetalleLinea();
  ListarDetalleLineas();
};

let LimpiarDetalleLinea = () => {
  $("#txtDetalleId").val(0);
  $("#txtDetalle_Cantidad_Lineas").val("");
  $("#txtDetalle_Valor_Mensual").val("");
  $("input:radio[name=detalleLineasRadios]:checked").prop("checked", false);
  $("#txtDetalleNavegacion").val("");
  // $('#txtDetalleUnidad').val(),
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
  $("input:checkbox[name=txtDetalle_Minutos_TO]").prop("checked", false);
  $("#txtDetalle_Minutos_Otro").val("");
  $("input:checkbox[name=txtDetalle_Mensajes]").prop("checked", false);
  $("input:checkbox[name=txtDetalle_Llamadas]").prop("checked", false);
  $("input:checkbox[name=txtDetalle_Redes]").prop("checked", false);
  $("input:checkbox[name=txtDetalle_Roaming]").prop("checked", false);
};
