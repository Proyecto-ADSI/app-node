// Variables globales de control
var UsuarioBD;
var UsuarioValido = false;

// Para editar
var Id_Cliente;
var Id_DBL;
var Id_Plan_Corporativo;
var Id_Documentos;
var valDocSoporte = false;
var id = 0;
var form = null;

$(function () {
  controlServicios = 2;
  var stepPlanCorp;
  var stepDoc;
  form = $("#Form_Editar_Clientes").show();

  form.steps({
    headerTag: "h6",
    bodyTag: "section",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    onInit: function (event, currentIndex) {
      // Validacion de steps
      stepPlanCorp = form.steps("getStep", 2);
      stepDoc = form.steps("getStep", 3);
      form.steps("remove", 2);
      form.steps("remove", 2);

      // Inicializar selects del formulario
      CargarDatosUbicacion();

      if (sessionStorage.DetalleLineas) {
        sessionStorage.removeItem("DetalleLineas");
      }
    },
    onStepChanging: function (event, currentIndex, newIndex) {
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
    },
    onFinishing: function (event, currentIndex) {
      return (
        (form.validate().settings.ignore = ":disabled, .detalleLinea"),
        form.valid()
      );
    },
    onFinished: function (event, currentIndex) {
      if (sessionStorage.DatosUbicacion) {
        sessionStorage.removeItem("DatosUbicacion");
      }
      if (valDocSoporte) {
        SubirDocumentos();
      } else {
        let docSoporte = ObtenerValInputDocumentos();
        EditarCliente(docSoporte);
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
        txtRazonSocial: {
          required: true,
          minlength: 2,
          maxlength: 45,
          SoloAlfanumericos: true,
        },
        txtTelefono: {
          required: true,
          SoloNumeros: true,
          minlength: 7,
          maxlength: 7,
        },
        txtExtension: {
          SoloNumeros: true,
          minlength: 2,
          maxlength: 10,
        },
        txtNIT: {
          ValidarNIT: true,
          minlength: 9,
          maxlength: 11,
        },
        txtEncargado: {
          SoloLetras: true,
          maxlength: 45,
        },
        txtCorreo: {
          ValidarCorreo: true,
          maxlength: 45,
        },
        txtCodigoPostal: {
          SoloNumeros: true,
          maxlength: 5,
          minlength: 1,
        },
        txtCelular: {
          NumeroMovil: true,
          minlength: 10,
          maxlength: 10,
        },
        txtPais: "required",
        txtDepartamento: "required",
        txtMunicipio: "required",
        txtDetalle_Cantidad_Lineas: {
          maxlength: 3,
          required: true,
          SoloNumeros2: true,
          ValidarCantidadLineas: true,
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
      },
    });

  // Inicializar elementos:

  Informacion = JSON.parse(sessionStorage.getItem("DatosEditarCliente"));

  // DataTableServicios = $("#DataTableServicios")
  //   .DataTable({
  //     responsive: true,
  //     columns: [
  //       {
  //         render: function (data, type, row) {
  //           let text = data + " líneas";
  //           return text;
  //         },
  //       },
  //       {
  //         render: function (data, type, row) {
  //           return data;
  //         },
  //       },
  //       {
  //         render: function (data, type, row) {
  //           if (data == NA) {
  //             return data;
  //           }
  //           let text = data + " GB";
  //           return text;
  //         },
  //       },
  //       {
  //         render: function (data, type, row) {
  //           return data;
  //         },
  //       },
  //       {
  //         render: function (data, type, row) {
  //           return data;
  //         },
  //       },
  //       {
  //         render: function (data, type, row) {
  //           if (type === "display") {
  //             if (data.length == 0) {
  //               return NA;
  //             }
  //             let html = "";
  //             for (let item of data) {
  //               html =
  //                 html +
  //                 `
  //                 <div class="label label-table text-center" style="background-color:#00897b">
  //                 ${item}
  //                 </div>
  //               `;
  //             }
  //             return html;
  //           } else {
  //             let text = "";
  //             for (let item of data) {
  //               text = text + ", " + item;
  //             }
  //             return text;
  //           }
  //         },
  //       },
  //       {
  //         render: function (data, type, row) {
  //           if (type === "display") {
  //             if (data.length == 0) {
  //               return NA;
  //             }
  //             let html = "";
  //             for (let item of data) {
  //               html =
  //                 html +
  //                 `
  //                 <div class="label label-table text-center" style="background-color:#00897b">
  //                 ${item}
  //                 </div>
  //               `;
  //             }
  //             return html;
  //           } else {
  //             return data;
  //           }
  //         },
  //       },
  //       {
  //         render: function (data, type, row) {
  //           return data;
  //         },
  //       },
  //       {
  //         render: function (data, type, row) {
  //           if (type === "display") {
  //             if (data.length == 0) {
  //               return NA;
  //             }
  //             let html = "";
  //             for (let item of data) {
  //               html =
  //                 html +
  //                 `
  //                 <div class="label label-table text-center" style="background-color:#00897b">
  //                 ${item}
  //                 </div>
  //               `;
  //             }
  //             return html;
  //           } else {
  //             return data;
  //           }
  //         },
  //       },
  //       {
  //         render: function (data, type, row) {
  //           if (type === "display") {
  //             return `
  //               <button type="button" id="DetallesLineasDetalle" id_linea="${data}"
  //                 class="btn btn-primary btn-sm"><i class="mdi mdi-cellphone-android"></i>
  //               </button>
  //               <button type="button" id="DetallesLineasEditar" id_linea="${data}"
  //                 class="btn btn-info btn-sm"> <i class="fa fa-pencil"></i>
  //               </button>
  //               <button type="button" id="DetallesLineasEliminar" id_linea="${data}"
  //                 class="btn btn-danger btn-sm"><i class="fa fa-close"></i>
  //               </button>
  //             `;
  //           }
  //           return data;
  //         },
  //       },
  //     ],
  //     columnDefs: [
  //       { responsivePriority: 1, targets: 0 },
  //       { responsivePriority: 2, targets: -1 },
  //     ],
  //     language: {
  //       lengthMenu: "Mostrar _MENU_ registros",
  //       zeroRecords: "No se encontraron resultados",
  //       info:
  //         "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
  //       infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
  //       infoFiltered: "(filtrado de un total de _MAX_ registros)",
  //       sSearch: "Buscar:",
  //       oPaginate: {
  //         sFirst: "Primero",
  //         sLast: "Último",
  //         sNext: "Siguiente",
  //         sPrevious: "Anterior",
  //       },
  //       sProcessing: "Procesando...",
  //     },
  //   })
  //   .columns.adjust()
  //   .responsive.recalc();

  // bootstrap-switch
  $(".switch_corporativo").bootstrapSwitch({
    onText: "SI",
    offText: "NO",
    onColor: "success",
    offColor: "danger",
  });

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

  // Enlazar eventos de escucha:

  // Atajos formualrio

  $("input:radio[name=Validacion_UbicacionEmpresa]").click(function () {
    let estado = $("input:radio[name=Validacion_UbicacionEmpresa]").is(
      ":checked"
    );
    console.log(estado);
    if (estado) {
      CargarDatosUbicacionRadio();
    }
  });

  // Estado del switch Plan corporativo
  $(".switch_corporativo").on("switchChange.bootstrapSwitch", function (
    event,
    state
  ) {
    if (state) {
      form.steps("insert", 2, stepPlanCorp);

      // Rango Fecha corporativo
      $("#Fecha_Corporativo").datepicker({
        language: "es",
        format: "yyyy/mm/dd",
        autoclose: true,
        todayHighlight: true,
      });

      if (Id_Plan_Corporativo > 0) {
        CargarInformacionPlan();
      }

      $(".switch_doc").bootstrapSwitch({
        onText: "SI",
        offText: "NO",
        onColor: "success",
        offColor: "danger",
      });

      $(".switch_doc").on("switchChange.bootstrapSwitch", function (
        event,
        state
      ) {
        if (state) {
          form.steps("insert", 3, stepDoc);
          if (Id_Documentos > 0) {
            CargarInformacionDocumentos();
            // Eventos de escucha
            $("#txtCamara_Comercio").change(function () {
              valDocSoporte = true;
            });
            $("#txtCedula").change(function () {
              valDocSoporte = true;
            });
            $("#txtSoporte").change(function () {
              valDocSoporte = true;
            });
            $("#txtDetalles").change(function () {
              valDocSoporte = true;
            });
          }
        } else {
          form.steps("remove", 3);
          $.toast({
            heading: "¡Alerta!",
            text:
              '<p class="jq-toast-body">Se eliminarán los documentos registrados del cliente.</p>',
            position: "top-right",
            bgColor: "#00897b",
            textColor: "white",
            loaderBg: "#383f48",
            icon: "warning",
            hideAfter: 5000,
            stack: false,
            showHideTransition: "slide",
          });
        }
      });
    } else {
      form.steps("remove", 2);
      form.steps("remove", 2);

      $.toast({
        heading: "¡Alerta!",
        text:
          '<p class="jq-toast-body">Se eliminará la información registrada del plan corporativo y documentos del cliente.</p>',
        position: "top-right",
        bgColor: "#00897b",
        textColor: "white",
        loaderBg: "#272c33",
        icon: "warning",
        hideAfter: 5000,
        stack: false,
        showHideTransition: "slide",
      });
    }
  });

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

    CargarDepartamentos(arrayDepartamentos);
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

    CargarMunicipios(arrayMunicipios);
  });

  $("#txtMunicipio").change(function () {
    let Id_Municipio = parseInt($("#txtMunicipio option:selected").val());
    let Id_SubTipo = parseInt($("#txtSubTipo option:selected").val());

    PonerBarrios_Veredas(Id_Municipio, Id_SubTipo);
  });

  $("#txtSubTipo").change(function () {
    let Id_Municipio = parseInt($("#txtMunicipio option:selected").val());
    let Id_SubTipo = parseInt($("#txtSubTipo option:selected").val());

    PonerBarrios_Veredas(Id_Municipio, Id_SubTipo);
  });

  // $("#btnLimpiar").click(function () {
  //   LimpiarDetalleLinea();
  // });

  // $("#btnGuardarDetalleLineas").click(function () {
  //   form.validate().settings.ignore = ":disabled,:hidden, .valDetalle";
  //   if (form.valid()) {
  //     $("#txtDetalleId").val() == "0"
  //       ? RegistrarDetalleLinea()
  //       : EditarDetalleLinea();

  //     // Detalles líneas
  //     DetalleServiciosMoviles();
  //     // Editar linea
  //     ObtenerDataLineasEditar();
  //     // Eliminar línea.
  //     EliminarDetalleLinea();
  //   }
  // });

  // // Validación minutos ilimitados.
  // $("input:checkbox[name=txtDetalle_Validacion_Ilimitados]").change(
  //   function () {
  //     if ($(this).is(":checked")) {
  //       $("#txtDetalle_Minutos").prop("disabled", true);
  //     } else {
  //       $("#txtDetalle_Minutos").prop("disabled", false);
  //     }
  //   }
  // );

  // // Validación mensajes ilimitados.
  // $("input:checkbox[name=txtDetalle_Validacion_SMSIlimitados]").change(
  //   function () {
  //     if ($(this).is(":checked")) {
  //       $("#txtDetalle_Mensajes").prop("disabled", true);
  //     } else {
  //       $("#txtDetalle_Mensajes").prop("disabled", false);
  //     }
  //   }
  // );

  // // Validación minutos LDI
  // $("#txtDetalleMinutosLDI").on("change", function (e) {
  //   let minutosLDI = $("#txtDetalleMinutosLDI").val();
  //   if (minutosLDI.length > 0) {
  //     $("#txtDetalle_Cantidad_LDI").removeAttr("disabled");
  //   } else {
  //     $("#txtDetalle_Cantidad_LDI").attr("disabled", true);
  //   }
  // });

  // ************************************ Llenar formulario ********************************************************
  Id_Cliente = Informacion.Id_Cliente;
  Id_DBL = Informacion.Id_DBL;

  if (typeof Informacion.Id_Plan_Corporativo !== "undefined") {
    Id_Plan_Corporativo = parseInt(Informacion.Id_Plan_Corporativo);
  } else {
    Id_Plan_Corporativo = 0;
  }

  if (typeof Informacion.Id_Documentos !== "undefined") {
    Id_Documentos = parseInt(Informacion.Id_Documentos);
  } else {
    Id_Documentos = 0;
  }

  // Información de contacto.
  $("#txtRazonSocial").val(Informacion.Razon_Social);
  $("#txtTelefono").val(Informacion.Telefono);
  let Extension = obtenerValueValidado(Informacion.Extension);
  $("#txtExtension").val(Extension);
  let NIT_CDV = obtenerValueValidado(Informacion.NIT_CDV);
  $("#txtNIT").val(NIT_CDV);
  let Encargado = obtenerValueValidado(Informacion.Encargado);
  $("#txtEncargado").val(Encargado);
  let Correo = obtenerValueValidado(Informacion.Correo);
  $("#txtCorreo").val(Correo);
  let Celular = obtenerValueValidado(Informacion.Celular);
  if (Celular !== "") {
    // Código postal
    let regex = /("[^"]*"|[^ ]*) /g;
    let arrayStringCodigo = Celular.match(regex);
    let codigo = arrayStringCodigo[0];
    // Eliminar +
    codigo = codigo.substring(1);
    // Eliminar espacio final.
    codigo = codigo.trim();
    // Celular
    let regex2 = /3[\d]+$/g;
    let arrayString = Celular.match(regex2);
    let celular = arrayString[0];

    $("#txtCelular").val(celular);
    $("#txtCodigoPostal").val(codigo);
  } else {
    $("#txtEncargado").val(Celular);
  }

  // Ubicación.
  setTimeout(function () {
    let DatosUbicacion = JSON.parse(sessionStorage.getItem("DatosUbicacion"));
    CargarPaises(DatosUbicacion.Paises, Informacion.Id_Pais);
    CargarDepartamentos(
      DatosUbicacion.Departamentos,
      Informacion.Id_Pais,
      Informacion.Id_Departamento
    );
    CargarMunicipios(
      DatosUbicacion.Municipios,
      Informacion.Id_Departamento,
      Informacion.Id_Municipio
    );
    CargarSubTipos(
      DatosUbicacion.Subtipos,
      Informacion.Id_SubTipo_Barrio_Vereda
    );
    CargarBarrios_Veredas(
      DatosUbicacion.Barrios_Veredas,
      Informacion.Id_Barrios_Veredas
    );
  }, 2000);
  let Direccion = obtenerValueValidado(Informacion.Direccion);
  $("#txtDireccion").val(Direccion);

  // Datos básicos líneas.
  if (parseInt(Informacion.Id_Plan_Corporativo) > 0) {
  }
  CargarOperadores(Informacion.Id_Operador);
  CargarCalificaciones(Informacion.Id_Calificacion_Operador);
  CargarOpcionesPredefinidas();
  let arrayRazones = getArrayString(Informacion.Razones);
  if (arrayRazones.length > 0) {
    console.log(arrayRazones);
    // $("#txtRazones").val(arrayRazones).trigger("change");
    for (let item of arrayRazones) {
      let data = {
        id: `${item}`,
        text: `${item}`,
      };
      let newOption = new Option(data.text, data.id, true, true);
      // Append it to the select
      console.log("apennd 1");
      $("#txtRazones").append(newOption).trigger("change");
    }
  }
  // Servicios fijos
  if (Informacion.Servicios_Fijos) {
    let serviciosBD = Informacion.Servicios_Fijos;

    let serviciosFijos = {
      pagina: false,
      correo: false,
      ip: false,
      dominio: false,
      telefonia: false,
      television: false,
      id_linea_fija: parseInt(Informacion.Servicios_Fijos.Id_Linea_Fija),
    };

    if (serviciosBD.Pagina_Web == "1") {
      serviciosFijos.pagina = true;
    }
    if (serviciosBD.Correo_Electronico == "1") {
      serviciosFijos.correo = true;
    }
    if (serviciosBD.IP_Fija == "1") {
      serviciosFijos.ip = true;
    }
    if (serviciosBD.Dominio == "1") {
      serviciosFijos.dominio = true;
    }
    if (serviciosBD.Telefonia == "1") {
      serviciosFijos.telefonia = true;
    }
    if (serviciosBD.Television == "1") {
      serviciosFijos.television = true;
    }
    localStorage.ServiciosFijos = JSON.stringify(serviciosFijos);
  }

  // Convertir Servicios Móviles BD a JSON localStorage
  if (typeof Informacion.Servicios_Moviles !== "undefined") {
    let ArrayLineasGrupo = [];
    for (let lineaBD of Informacion.Servicios_Moviles) {
      if (ArrayLineasGrupo.length > 0) {
        let control = false;
        // Comprobar si el grupo ya está agregado.
        for (let linea of ArrayLineasGrupo) {
          if (linea.grupo === lineaBD.Grupo) {
            linea.cantidadLineas += 1;
            linea.id_lineas.push(lineaBD.Id_Linea_Movil);
            linea.NumerosLineas.push(lineaBD.Linea);

            control = true;
          }
        }
        if (!control) {
          let linea = CrearLineaSession(lineaBD);
          ArrayLineasGrupo.push(linea);
        }
      } else {
        let linea = CrearLineaSession(lineaBD);
        ArrayLineasGrupo.push(linea);
      }
    }
    localStorage.ServiciosMoviles = JSON.stringify(ArrayLineasGrupo);
  }

  let CargarInformacionPlan = () => {
    $("#Fecha_Corporativo #txtFecha_inicio").datepicker(
      "setDate",
      Informacion.Fecha_Inicio
    );
    $("#Fecha_Corporativo #txtFecha_fin").datepicker(
      "setDate",
      Informacion.Fecha_Fin
    );
  };

  // Plan Corporativo
  if (parseInt(Informacion.Id_Plan_Corporativo) > 0) {
    $(".switch_corporativo").trigger("click");
  }

  if (parseInt(Informacion.Clausula_Permanencia) == 1) {
    $("#switchClausula").children("label").children("span").trigger("click");
  }
  let Descripcion = obtenerValueValidado(Informacion.Descripcion);
  $("#txtDescripcion").val(Descripcion);

  // Documentos
  let CargarInformacionDocumentos = () => {
    $("#txtCamara_Comercio")
      .closest(".fileinput")
      .children(".form-control")
      .children("span")
      .text(Informacion.Camara_Comercio);
    $("#txtCedula")
      .closest(".fileinput")
      .children(".form-control")
      .children("span")
      .text(Informacion.Cedula_RL);
    $("#txtSoporte")
      .closest(".fileinput")
      .children(".form-control")
      .children("span")
      .text(Informacion.Soporte_Ingresos);
    $("#txtDetalles")
      .closest(".fileinput")
      .children(".form-control")
      .children("span")
      .text(Informacion.Detalles_Plan_Corporativo);
  };

  if (parseInt(Informacion.Id_Documentos) > 0) {
    $(".switch_doc").trigger("click");
    CargarInformacionDocumentos();
  }
});

let ObtenerValInputDocumentos = () => {
  let objDocumentos = {
    txtCamara_Comercio: $("#txtCamara_Comercio")
      .closest(".fileinput")
      .children(".form-control")
      .children("span")
      .text(),
    txtCedula: $("#txtCedula")
      .closest(".fileinput")
      .children(".form-control")
      .children("span")
      .text(),
    txtSoporte: $("#txtSoporte")
      .closest(".fileinput")
      .children(".form-control")
      .children("span")
      .text(),
    txtDetalles: $("#txtDetalles")
      .closest(".fileinput")
      .children(".form-control")
      .children("span")
      .text(),
  };

  return objDocumentos;
};

let ObtenerValInputDoc = (selector) => {
  let doc = $(selector)
    .closest(".fileinput")
    .children(".form-control")
    .children("span")
    .text();
  return doc;
};
// FUNCIONES:
let SubirDocumentos = () => {
  let formData = new FormData();

  let objDocumentos = {
    txtCamara_Comercio: null,
    txtCedula: null,
    txtSoporte: null,
    txtDetalles: null,
  };

  let files = [];
  let doc1 = $("#txtCamara_Comercio")[0].files[0];
  let doc2 = $("#txtCedula")[0].files[0];
  let doc3 = $("#txtSoporte")[0].files[0];
  let doc4 = $("#txtDetalles")[0].files[0];

  if (typeof doc1 != "undefined") {
    files.push(doc1);
  } else {
    objDocumentos.txtCamara_Comercio = ObtenerValInputDoc(
      "#txtCamara_Comercio"
    );
  }

  if (typeof doc2 != "undefined") {
    files.push(doc2);
  } else {
    objDocumentos.txtCedula = ObtenerValInputDoc("#txtCedula");
  }

  if (typeof doc3 != "undefined") {
    files.push(doc3);
  } else {
    objDocumentos.txtSoporte = ObtenerValInputDoc("#txtSoporte");
  }

  if (typeof doc4 != "undefined") {
    files.push(doc4);
  } else {
    objDocumentos.txtDetalles = ObtenerValInputDoc("#txtDetalles");
  }

  files.forEach(function (file, i) {
    formData.append("doc_" + i, file);
  });
  $.ajax({
    url: `${URL}/Cliente/SubirDocSoporte`,
    type: "post",
    data: formData,
    contentType: false,
    processData: false,
    success: function (res) {
      let docSoporte = res.data.pathArchivo;

      for (let doc of docSoporte) {
        if (objDocumentos.txtCamara_Comercio == null) {
          objDocumentos.txtCamara_Comercio = doc;
        } else if (objDocumentos.txtCedula == null) {
          objDocumentos.txtCedula = doc;
        } else if (objDocumentos.txtSoporte == null) {
          objDocumentos.txtSoporte = doc;
        } else if (objDocumentos.txtDetalles == null) {
          objDocumentos.txtDetalles = doc;
        }
      }
      EditarCliente(objDocumentos);
    },
    error: function (err) {
      console.log(err);
    },
  });
};

let EditarCliente = (objDocumentos) => {
  // Formatear celular
  let codigo = $("#txtCodigoPostal").val();
  let celular = $("#txtCelular").val();
  if (celular !== "") {
    celular = "+" + codigo + " " + celular;
  }
  // Servicios Fijos
  let serviciosFijos = null;
  if (localStorage.ServiciosFijos) {
    let localServiciosFijos = JSON.parse(
      localStorage.getItem("ServiciosFijos")
    );
    serviciosFijos = {
      id_linea_fija: localServiciosFijos.id_linea_fija,
      correo: localServiciosFijos.correo ? 1 : 0,
      dominio: localServiciosFijos.dominio ? 1 : 0,
      ip: localServiciosFijos.ip ? 1 : 0,
      pagina: localServiciosFijos.pagina ? 1 : 0,
      telefonia: localServiciosFijos.telefonia ? 1 : 0,
      television: localServiciosFijos.television ? 1 : 0,
    };
  }

  // Array Lineas
  let arrayLineas = [];

  let Cantidad_Total_Lineas = 0;
  let Valor_Total_Mensual = 0;
  let GrupoLineas = 0;

  if (localStorage.ServiciosMoviles) {
    let ServiciosMoviles = JSON.parse(localStorage.ServiciosMoviles);

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
      for (let i = 1; i <= parseInt(lineaItem.cantidadLineas); i++) {
        let linea = {
          numero: lineaItem.NumerosLineas[i - 1],
          minutos: lineaItem.minutos === "" ? null : lineaItem.minutos,
          navegacion: lineaItem.navegacion === "" ? null : lineaItem.navegacion,
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
  for (let razon of arrayRazones) {
    stringRazones += razon + ", ";
  }

  let datos = {
    // Cliente
    Id_Cliente: parseInt(Id_Cliente),
    Razon_Social: $("#txtRazonSocial").val(),
    Telefono: $("#txtTelefono").val(),
    Extension:
      $("#txtExtension").val() === "" ? null : $("#txtExtension").val(),
    NIT_CDV: $("#txtNIT").val() === "" ? null : $("#txtNIT").val(),
    Encargado: $("#txtEncargado").val() == "" ? null : $("#txtEncargado").val(),
    Correo: $("#txtCorreo").val() == "" ? null : $("#txtCorreo").val(),
    Celular: celular == "" ? null : celular,
    Barrio_Vereda:
      parseInt($("#txtNombre_Lugar").val()) === NaN
        ? null
        : parseInt($("#txtNombre_Lugar").val()),
    Direccion: $("#txtDireccion").val() == "" ? null : $("#txtDireccion").val(),
    //DBL
    Id_DBL: parseInt(Id_DBL),
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

    // Validacion
    Validacion_PLan_C: false,
    Validacion_Doc_S: false,
  };

  if (Id_Plan_Corporativo > 0) {
    Object.defineProperty(datos, "Id_Plan_Corporativo", {
      value: Id_Plan_Corporativo,
      enumerable: true,
    });
  }

  if (Id_Documentos > 0) {
    Object.defineProperty(datos, "Id_Documentos", {
      value: Id_Documentos,
      enumerable: true,
    });
  }

  if ($(".switch_corporativo").bootstrapSwitch("state")) {
    let switchClausula = $("#switchClausula")
      .children("label")
      .children("input");

    datos.Validacion_PLan_C = true;

    // Validar si existe la propiedad en el objeto.
    if (datos.hasOwnProperty("Id_Plan_Corporativo") == false) {
      Object.defineProperty(datos, "Id_Plan_Corporativo", {
        value: Id_Plan_Corporativo,
        enumerable: true,
      });
    }

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

  if ($(".switch_doc").bootstrapSwitch("state") == true) {
    datos.Validacion_Doc_S = true;

    // Validar si existe la propiedad en el objeto.
    if (datos.hasOwnProperty("Id_Documentos") == false) {
      Object.defineProperty(datos, "Id_Documentos", {
        value: Id_Documentos,
        enumerable: true,
      });
    }

    Object.defineProperties(datos, {
      Camara_Comercio: {
        value: objDocumentos.txtCamara_Comercio,
        enumerable: true,
      },
      Cedula_RL: {
        value: objDocumentos.txtCedula,
        enumerable: true,
      },
      Soporte_Ingresos: {
        value: objDocumentos.txtSoporte,
        enumerable: true,
      },
      Detalles_Plan_Corporativo: {
        value: objDocumentos.txtDetalles,
        enumerable: true,
      },
    });
  }
  console.log(datos);
  $.ajax({
    url: `${URL}/Cliente`,
    type: "put",
    dataType: "json",
    data: JSON.stringify(datos),
    contentType: "application/json",
    processData: false,
  })
    .done((respuesta) => {
      console.log(respuesta);
      if (respuesta.data.ok) {
        localStorage.removeItem("ServiciosMoviles");
        localStorage.removeItem("ServiciosFijos");
        swal({
          title: "¡Cliente modificado correctamente!",
          type: "success",
          showCancelButton: false,
          showConfirmButton: false,
        });
        setTimeout(function () {
          Redireccionar("/Directorio");
        }, 1000);
      } else {
        swal({
          title: "¡Error al modificar!",
          text: "Ha ocurrido un error al modificar, intenta de nuevo",
          type: "error",
          showCancelButton: false,
          confirmButtonColor: "#2F6885",
          confirmButtonText: "Continuar",
          closeOnConfirm: true,
        });
      }
    })
    .fail((error) => {
      swal({
        title: "Error al registrar.",
        text: "Ha ocurrido un error al registrar, intenta de nuevo",
        type: "error",
        showCancelButton: false,
        confirmButtonColor: "#2F6885",
        confirmButtonText: "Continuar",
        closeOnConfirm: true,
      });
    });
};

let CrearLineaSession = (lineaBD) => {
  let redesSociales = getArrayString(lineaBD.Redes_Sociales);
  let minutosLDI = getArrayString(lineaBD.Minutos_LDI);
  let serviciosAdicionales = getArrayString(lineaBD.Servicios_Adicionales);

  if (lineaBD.Navegacion == NA) {
    lineaBD.Navegacion = "";
  }
  if (lineaBD.Minutos == NA) {
    lineaBD.Minutos = "";
  }
  if (lineaBD.Mensajes == NA) {
    lineaBD.Mensajes = "";
  }
  if (lineaBD.Cantidad_LDI == NA) {
    lineaBD.Cantidad_LDI = "";
  }
  let arrayId = [lineaBD.Id_Linea_Movil];
  let arrayNumeros = [lineaBD.Linea];
  let linea = {
    id: uuid.v4(),
    grupo: lineaBD.Grupo,
    id_lineas: arrayId,
    NumerosLineas: arrayNumeros,
    cantidadLineas: 1,
    cargoBasicoMensual: lineaBD.Cargo_Basico,
    navegacion: lineaBD.Navegacion,
    minutos: lineaBD.Minutos,
    mensajes: lineaBD.Mensajes,
    redesSociales: redesSociales,
    minutosLDI: minutosLDI,
    cantidadLDI: lineaBD.Cantidad_LDI,
    serviciosAdicionales: serviciosAdicionales,
  };

  return linea;
};

let CargarDatosUbicacion = () => {
  $.ajax({
    url: `${URL}/Cliente/Datos/Ubicacion`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      sessionStorage.DatosUbicacion = JSON.stringify(datos.data);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let CargarPaises = (datos, Id_Pais) => {
  $("#txtPais").empty();
  for (let item of datos) {
    if (item.Id_Pais == Id_Pais) {
      var $opcion = $("<option />", {
        text: `${item.Nombre_Pais}`,
        value: `${item.Id_Pais}`,
        selected: true,
      });
    } else {
      var $opcion = $("<option />", {
        text: `${item.Nombre_Pais}`,
        value: `${item.Id_Pais}`,
      });
    }
    $("#txtPais").append($opcion);
  }
};

let CargarDepartamentos = (datos, Id_Departamento) => {
  $("#txtDepartamento").empty();
  for (let item of datos) {
    if (item.Id_Departamento == Id_Departamento) {
      var $opcion = $("<option />", {
        text: `${item.Nombre_Departamento}`,
        value: `${item.Id_Departamento}`,
        selected: true,
      });
    } else {
      var $opcion = $("<option />", {
        text: `${item.Nombre_Departamento}`,
        value: `${item.Id_Departamento}`,
      });
    }
    $("#txtDepartamento").append($opcion);
  }
};

let CargarMunicipios = (datos, Id_Municipio) => {
  $("#txtMunicipio").empty();
  for (let item of datos) {
    if (item.Id_Municipio == Id_Municipio) {
      var $opcion = $("<option />", {
        text: `${item.Nombre_Municipio}`,
        value: `${item.Id_Municipio}`,
        selected: true,
      });
    } else {
      var $opcion = $("<option />", {
        text: `${item.Nombre_Municipio}`,
        value: `${item.Id_Municipio}`,
      });
    }
    $("#txtMunicipio").append($opcion);
  }
};

let CargarSubTipos = (datos, Id_SubTipo_Barrio_Vereda) => {
  $("#txtSubTipo").empty();
  for (let item of datos) {
    if (item.Id_SubTipo_Barrio_Vereda == Id_SubTipo_Barrio_Vereda) {
      var $opcion = $("<option />", {
        text: `${item.SubTipo}`,
        value: `${item.Id_SubTipo_Barrio_Vereda}`,
        selected: true,
      });
    } else {
      var $opcion = $("<option />", {
        text: `${item.SubTipo}`,
        value: `${item.Id_SubTipo_Barrio_Vereda}`,
      });
    }
    $("#txtSubTipo").append($opcion);
  }
};

let CargarBarrios_Veredas = (datos, Id_Barrios_Veredas) => {
  $("#txtNombre_Lugar").empty();
  if (Id_Barrios_Veredas) {
    for (let item of datos) {
      let opcion = null;
      if (parseInt(item.Id_Barrios_Veredas) == Id_Barrios_Veredas) {
        opcion = $("<option />", {
          text: `${item.Nombre_Barrio_Vereda}`,
          value: `${item.Id_Barrios_Veredas}`,
          selected: true,
        });
        $("#txtNombre_Lugar").append(opcion);
      } else {
        let opcion = $("<option />", {
          text: `${item.Nombre_Barrio_Vereda}`,
          value: `${item.Id_Barrios_Veredas}`,
        });
        $("#txtNombre_Lugar").append(opcion);
      }
    }
  } else {
    $("#txtNombre_Lugar").prepend(
      "<option selected disabled >Seleccione...</option>"
    );
    for (let item of datos) {
      let $opcion = $("<option />", {
        text: `${item.Nombre_Barrio_Vereda}`,
        value: `${item.Id_Barrios_Veredas}`,
      });

      $("#txtNombre_Lugar").append($opcion);
    }
  }
};

let PonerBarrios_Veredas = (Id_Municipio, Id_SubTipo, Id_Barrio_Veredas) => {
  let DatosUbicacion = JSON.parse(sessionStorage.getItem("DatosUbicacion"));
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
    CargarBarrios_Veredas(arrayBarrios_Veredas, Id_Barrio_Veredas);
  } else {
    CargarBarrios_Veredas(arrayBarrios_Veredas);
  }
};

let CargarDatosUbicacionRadio = () => {
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

  CargarPaises(Paises, Id_Pais);
  CargarDepartamentos(Departamentos, Id_Departamento);
  CargarMunicipios(Municipios, Id_Municipio);
  CargarSubTipos(Subtipos, Id_SubTipo);
  PonerBarrios_Veredas(Id_Municipio, Id_SubTipo);
};

let CargarOperadores = (Id_Operador) => {
  $.ajax({
    url: `${URL}/Operador`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      $("#txtOperador").empty();

      if (Id_Operador == "0") {
        $("#txtOperador").prepend(
          "<option selected disabled>Seleccione</option>"
        );
      }
      for (let item of datos.data) {
        if (item.Id_Operador == Id_Operador && Id_Operador !== "0") {
          var $opcion = $("<option />", {
            text: `${item.Nombre_Operador}`,
            value: `${item.Id_Operador}`,
            selected: true,
          });
        } else {
          var $opcion = $("<option />", {
            text: `${item.Nombre_Operador}`,
            value: `${item.Id_Operador}`,
          });
        }

        $("#txtOperador").append($opcion);
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
      if (Id_Calificacion_Operador == "0") {
        $("#txtCalificacion").prepend(
          "<option selected disabled>Seleccione</option>"
        );
      }
      for (let item of datos.data) {
        if (
          item.Id_Calificacion_Operador == Id_Calificacion_Operador &&
          Id_Calificacion_Operador !== "0"
        ) {
          var $opcion = $("<option />", {
            text: `${item.Calificacion}`,
            value: `${item.Id_Calificacion_Operador}`,
            selected: true,
          });
        } else {
          var $opcion = $("<option />", {
            text: `${item.Calificacion}`,
            value: `${item.Id_Calificacion_Operador}`,
          });
        }

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
      for (let item of datos.data) {
        let data = {
          id: `${item.Opcion}`,
          text: `${item.Opcion}`,
        };

        if (item.Categoria == "Operador") {
          // Agregar opción al select2 si no está agregada.
          if (
            !$("#txtRazones").find("option[value='" + data.id + "']").length
          ) {
            let newOption = new Option(data.text, data.id, false, false);
            $("#txtRazones").append(newOption).trigger("change");
          }
        } else if (item.Categoria == "Redes Sociales") {
          let newOption = new Option(data.text, data.id, false, false);
          $("#txtDetallle_Redes_Sociales").append(newOption).trigger("change");
        } else if (item.Categoria == "Servicios Adicionales") {
          let newOption = new Option(data.text, data.id, false, false);
          $("#txtDetalle_Servicios_Adicionales")
            .append(newOption)
            .trigger("change");
        } else if (item.Categoria == "País LDI") {
          let newOption = new Option(data.text, data.id, false, false);
          $("#txtDetalleMinutosLDI").append(newOption).trigger("change");
        }
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

let obtenerValueValidado = (value) => {
  let valueValidado = value;
  if (value === NA) {
    valueValidado = "";
  }
  return valueValidado;
};
