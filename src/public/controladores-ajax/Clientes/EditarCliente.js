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
  MostrarLoaderGeneral();
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
      MostrarLoaderGeneral();
      if (valDocSoporte) {
        SubirDocumentos();
      } else {
        let docSoporte = ObtenerValInputDocumentos();
        EditarCliente(docSoporte);
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
            let value = $(element).val().trim();
            if (value.toLowerCase() == Razon_Social) {
              $("#txtRazonSocial-error").remove();
              return true;
            }
            let res = {
              url: `${URL}/Cliente/ValidarCliente/Disponibilidad`,
              type: "get",
              dataType: "json",
              data: {
                texto: function () {
                  return $("#txtRazonSocial").val().trim();
                },
              },
              dataFilter: function (res) {
                var json = JSON.parse(res);
                if (json.data.ok) {
                  return '"true"';
                } else {
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
            let value = $(element).val().trim();
            if (value.toLowerCase() == Telefono) {
              $("#txtTelefono-error").remove();
              return true;
            }
            let res = {
              url: `${URL}/Cliente/ValidarCliente/Disponibilidad`,
              type: "get",
              dataType: "json",
              data: {
                texto: function () {
                  return $("#txtTelefono").val().trim();
                },
              },
              dataFilter: function (res) {
                var json = JSON.parse(res);
                if (json.data.ok) {
                  return '"true"';
                } else {
                  return '"Teléfono ya registrado."';
                }
              },
            };
            return res;
          },
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
          remote: function (element) {
            let value = $(element).val().trim();
            if (value.toLowerCase() == NIT_CDV) {
              $("#txtNIT-error").remove();
              return true;
            }
            let res = {
              url: `${URL}/Cliente/ValidarCliente/Disponibilidad`,
              type: "get",
              dataType: "json",
              data: {
                texto: function () {
                  return $("#txtNIT").val().trim();
                },
              },
              dataFilter: function (res) {
                var json = JSON.parse(res);
                if (json.data.ok) {
                  return '"true"';
                } else {
                  return '"NIT ya registrado."';
                }
              },
            };
            return res;
          },
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
  $("#txtDetallle_Servicios_Ilimitados").select2({
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

  // ************************************ Llenar formulario ********************************************************
  Id_Cliente = Informacion.Id_Cliente;
  Id_DBL = Informacion.Id_DBL;

  Razon_Social = Informacion.Razon_Social.toLowerCase();
  Telefono = Informacion.Telefono;
  NIT_CDV = Informacion.NIT_CDV;

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
  let NIT_CDVFormateado = obtenerValueValidado(Informacion.NIT_CDV);
  $("#txtNIT").val(NIT_CDVFormateado);
  let Encargado = obtenerValueValidado(Informacion.Encargado);
  $("#txtEncargado").val(Encargado);
  let Correo = obtenerValueValidado(Informacion.Correo);
  $("#txtCorreo").val(Correo);
  let Celular = obtenerValueValidado(Informacion.Celular);
  if (Celular !== "") {
    let info = FormatearCelular(Celular);
    $("#txtCelular").val(info.celular);
    $("#txtCodigoPostal").val(info.codigo);
  } else {
    $("#txtEncargado").val(Celular);
  }

  // Ubicación.
  let ubicacion = {
    Id_Pais: Informacion.Id_Pais,
    Id_Departamento: Informacion.Id_Departamento,
    Id_Municipio: Informacion.Id_Municipio,
    Id_SubTipo_Barrio_Vereda: Informacion.Id_SubTipo_Barrio_Vereda,
    Id_Barrios_Veredas: Informacion.Id_Barrios_Veredas,
  };

  CargarDatosUbicacion(ubicacion);

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
    for (let item of arrayRazones) {
      let data = {
        id: `${item}`,
        text: `${item}`,
      };
      let newOption = new Option(data.text, data.id, true, true);
      // Append it to the select
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
      FormatearFecha(Informacion.Fecha_Inicio)
    );
    $("#Fecha_Corporativo #txtFecha_fin").datepicker(
      "setDate",
      FormatearFecha(Informacion.Fecha_Fin)
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
      // Establecer valor total mensual de la totalidad de lineas.
      Valor_Total_Mensual += parseInt(lineaItem.cargoBasicoMensual);
      GrupoLineas++;
      for (let i = 1; i <= parseInt(lineaItem.cantidadLineas); i++) {
        let linea = {
          numero: lineaItem.NumerosLineas[i - 1],
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
    Estado_DBL: 3,

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
      OcultarLoaderGeneral();
      if (respuesta.data.ok) {
        localStorage.removeItem("ServiciosMoviles");
        localStorage.removeItem("ServiciosFijos");
        sessionStorage.removeItem("DatosEditarCliente");
        sessionStorage.removeItem("DatosUbicacion");
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
      OcultarLoaderGeneral();
      swal({
        title: "Error al registrar.",
        text: "Ha ocurrido un error al registrar, intenta de nuevo",
        type: "error",
        showCancelButton: false,
        confirmButtonColor: "#2F6885",
        confirmButtonText: "Continuar",
        closeOnConfirm: true,
      });
      console.log(error);
    });
};

let CrearLineaSession = (lineaBD) => {
  let serviciosIlimitados = getArrayString(lineaBD.Servicios_Ilimitados);
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
    serviciosIlimitados: serviciosIlimitados,
    minutosLDI: minutosLDI,
    cantidadLDI: lineaBD.Cantidad_LDI,
    serviciosAdicionales: serviciosAdicionales,
  };

  return linea;
};

let CargarDatosUbicacion = (ubicacion) => {
  $.ajax({
    url: `${URL}/Cliente/Datos/Ubicacion`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      sessionStorage.DatosUbicacion = JSON.stringify(datos.data);
      CargarPaises(datos.data.Paises, ubicacion.Id_Pais);
      CargarDepartamentos(datos.data.Departamentos, ubicacion.Id_Departamento);
      CargarMunicipios(datos.data.Municipios, ubicacion.Id_Municipio);
      CargarSubTipos(datos.data.Subtipos, ubicacion.Id_SubTipo_Barrio_Vereda);
      CargarBarrios_Veredas(
        datos.data.Barrios_Veredas,
        ubicacion.Id_Barrios_Veredas
      );
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
        } else if (item.Categoria == "Servicios ilimitados") {
          let newOption = new Option(data.text, data.id, false, false);
          $("#txtDetallle_Servicios_Ilimitados")
            .append(newOption)
            .trigger("change");
        } else if (item.Categoria == "Servicios adicionales") {
          let newOption = new Option(data.text, data.id, false, false);
          $("#txtDetalle_Servicios_Adicionales")
            .append(newOption)
            .trigger("change");
        } else if (item.Categoria == "País LDI") {
          let newOption = new Option(data.text, data.id, false, false);
          $("#txtDetalleMinutosLDI").append(newOption).trigger("change");
        }
      }
      OcultarLoaderGeneral();
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
