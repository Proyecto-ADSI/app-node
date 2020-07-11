// Iterador registrar línea.
var id = 0;
form = null;
$(function () {
  controlServicios = 1;
  var stepPlanCorp;
  var stepDoc;
  form = $("#Form_Registro_Clientes").show();

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
      CargarOperadores();
      CargarCalificaciones();
      CargarOpcionesPredefinidas();

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
      if ($(".switch_corporativo").bootstrapSwitch("state")) {
        if ($(".switch_doc").bootstrapSwitch("state")) {
          SubirDocumentos();
        } else {
          RegistrarCliente(null);
        }
      } else {
        RegistrarCliente(null);
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
        } else if (
          element[0].id == "txtCamara_Comercio" ||
          element[0].id == "txtCedula" ||
          element[0].id == "txtSoporte"
        ) {
          error.insertAfter(element.closest(".fileinput"));
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
          remote: {
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
          },
        },
        txtTelefono: {
          required: true,
          SoloNumeros: true,
          minlength: 7,
          maxlength: 7,
          remote: {
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
          },
        },
        txtExtension: {
          SoloNumeros: true,
          maxlength: 5,
          minlength: 2,
        },
        txtNIT: {
          ValidarNIT: true,
          minlength: 9,
          maxlength: 11,
          remote: {
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
          },
        },
        txtEncargado: {
          maxlength: 45,
          SoloLetras: true,
        },
        txtCorreo: {
          maxlength: 45,
          ValidarCorreo: true,
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
          required: true,
          maxlength: 3,
          SoloNumeros: true,
          ValidarCantidadLineas: true,
        },
        txtDetalle_Valor_Mensual: {
          required: true,
          maxlength: 45,
          SoloNumeros: true,
        },
        detalleLineasRadios: "required",
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
        txtCamara_Comercio: "required",
        txtCedula: "required",
        txtSoporte: "required",
      },
    });

  // Inicializar elementos:

  // bootstrap-switch
  $(".switch_corporativo").bootstrapSwitch({
    onText: "SI",
    offText: "NO",
    onColor: "success",
    offColor: "danger",
  });

  // Enlazar eventos de escucha:

  // Atajos formualrio

  $("input:radio[name=Validacion_UbicacionEmpresa]").click(function () {
    let estado = $("input:radio[name=Validacion_UbicacionEmpresa]").is(
      ":checked"
    );

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
        } else {
          form.steps("remove", 3);
        }
      });
    } else {
      form.steps("remove", 2);
    }
  });

  // Advertencia servicios
  EnlazarClickAdvertencias();

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
});

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

  files.push(doc1, doc2, doc3);

  if (typeof doc4 != "undefined") {
    files.push(doc4);
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
      objDocumentos.txtCamara_Comercio = docSoporte[0];
      objDocumentos.txtCedula = docSoporte[1];
      objDocumentos.txtSoporte = docSoporte[2];

      if (docSoporte.length == 4) {
        objDocumentos.txtDetalles = docSoporte[3];
      }

      RegistrarCliente(objDocumentos);
    },
    error: function (err) {
      console.log(err);
    },
  });
};

let RegistrarCliente = (objDocumentos) => {
  ObtenerSession().then((data) => {
    let Id_Usuario = parseInt(data.session.Id_Usuario);
    let ValidacionDBL = false;
    // Formatear celular
    let codigo = $("#txtCodigoPostal").val();
    let celular = $("#txtCelular").val();
    if (celular !== "") {
      celular = "+" + codigo + " " + celular;
    }
    // Servicios Fijos
    let serviciosFijos = null;
    if (localStorage.ServiciosFijos) {
      ValidacionDBL = true;
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
      // Validación BDL
      if (arrayLineas.length > 0) {
        ValidacionDBL = true;
      }
    }

    // Validaciones DBL
    let Operador = $("#txtOperador").val();
    if (Operador !== null) {
      if (!isNaN(Operador)) {
        Operador = parseInt(Operador);
        ValidacionDBL = true;
      }
    }

    let calificacion = $("#txtCalificacion").val();
    if (calificacion !== null) {
      if (!isNaN(calificacion)) {
        calificacion = parseInt(calificacion);
        ValidacionDBL = true;
      }
    }

    let arrayRazones = $("#txtRazones").val();
    let stringRazones = "";
    if (arrayRazones.length > 0) {
      ValidacionDBL = true;
      for (let razon of arrayRazones) {
        stringRazones += razon + ", ";
      }
    }

    let datos = {
      // Notificacion
      Id_Usuario: Id_Usuario,
      // Cliente
      Razon_Social: $("#txtRazonSocial").val(),
      Telefono: $("#txtTelefono").val(),
      Extension:
        $("#txtExtension").val() === "" ? null : $("#txtExtension").val(),
      NIT_CDV: $("#txtNIT").val() === "" ? null : $("#txtNIT").val(),
      Encargado:
        $("#txtEncargado").val() == "" ? null : $("#txtEncargado").val(),
      Correo: $("#txtCorreo").val() == "" ? null : $("#txtCorreo").val(),
      Celular: celular == "" ? null : celular,
      Barrio_Vereda:
        parseInt($("#txtNombre_Lugar").val()) === NaN
          ? null
          : parseInt($("#txtNombre_Lugar").val()),
      Direccion:
        $("#txtDireccion").val() == "" ? null : $("#txtDireccion").val(),
      Estado_Cliente: 1,
      //DBL
      Id_Operador: Operador,
      Id_Calificacion_Operador: calificacion,
      Razones: stringRazones === "" ? null : stringRazones,
      Cantidad_Lineas: Cantidad_Total_Lineas,
      Valor_Mensual: Valor_Total_Mensual,
      ServiciosFijos: serviciosFijos,
      ServiciosMoviles: arrayLineas,
      Estado_DBL: 3,
      // Validacion
      Validacion_Cliente: true,
      Validacion_DBL: ValidacionDBL,
      Validacion_PLan_C: false,
      Validacion_Doc_S: false,
    };

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

    if ($(".switch_doc").bootstrapSwitch("state") === true) {
      datos.Validacion_Doc_S = true;

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
    $.ajax({
      url: `${URL}/Cliente`,
      dataType: "json",
      type: "post",
      contentType: "aplication/json",
      data: JSON.stringify(datos),
      processData: false,
      success: function (res) {
        if (res.data.ok) {
          // Se envía notifiación a coordinadores y administrador
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
            Redireccionar("/Directorio");
          }, 1000);
        } else {
          swal({
            title: "Error al registrar.",
            text: "Ha ocurrido un error al registrar, intenta de nuevo",
            type: "error",
            showCancelButton: false,
            confirmButtonColor: "#2F6885",
            confirmButtonText: "Continuar",
            closeOnConfirm: true,
          });
        }
      },
      error: function (error) {
        console.log(error);
        swal({
          title: "Error al registrar.",
          text: "Ha ocurrido un error al registrar, intenta de nuevo",
          type: "error",
          showCancelButton: false,
          confirmButtonColor: "#2F6885",
          confirmButtonText: "Continuar",
          closeOnConfirm: true,
        });
      },
    });
  });
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

let CargarPaises = (datos, Id_Pais) => {
  $("#txtPais").empty();
  if (Id_Pais) {
    for (let item of datos) {
      let opcion = null;
      if (parseInt(item.Id_Pais) == Id_Pais) {
        opcion = $("<option />", {
          text: `${item.Nombre_Pais}`,
          value: `${item.Id_Pais}`,
          selected: true,
        });
        $("#txtPais").append(opcion);
      } else {
        let opcion = $("<option />", {
          text: `${item.Nombre_Pais}`,
          value: `${item.Id_Pais}`,
        });
        $("#txtPais").append(opcion);
      }
    }
  } else {
    $("#txtPais").prepend("<option selected disabled >Seleccione...</option>");
    for (let item of datos) {
      let opcion = $("<option />", {
        text: `${item.Nombre_Pais}`,
        value: `${item.Id_Pais}`,
      });
      $("#txtPais").append(opcion);
    }
  }
};

let CargarDepartamentos = (datos, Id_Departamento) => {
  $("#txtDepartamento").empty();
  if (Id_Departamento) {
    for (let item of datos) {
      let opcion = null;
      if (parseInt(item.Id_Departamento) == Id_Departamento) {
        opcion = $("<option />", {
          text: `${item.Nombre_Departamento}`,
          value: `${item.Id_Departamento}`,
          selected: true,
        });
        $("#txtDepartamento").append(opcion);
      } else {
        let opcion = $("<option />", {
          text: `${item.Nombre_Departamento}`,
          value: `${item.Id_Departamento}`,
        });
        $("#txtDepartamento").append(opcion);
      }
    }
  } else {
    $("#txtDepartamento").prepend(
      "<option selected disabled >Seleccione...</option>"
    );
    for (let item of datos) {
      let opcion = $("<option />", {
        text: `${item.Nombre_Departamento}`,
        value: `${item.Id_Departamento}`,
      });

      $("#txtDepartamento").append(opcion);
    }
  }
};

let CargarMunicipios = (datos, Id_Municipio) => {
  $("#txtMunicipio").empty();
  if (Id_Municipio) {
    for (let item of datos) {
      let opcion = null;
      if (parseInt(item.Id_Municipio) == Id_Municipio) {
        opcion = $("<option />", {
          text: `${item.Nombre_Municipio}`,
          value: `${item.Id_Municipio}`,
          selected: true,
        });
        $("#txtMunicipio").append(opcion);
      } else {
        let opcion = $("<option />", {
          text: `${item.Nombre_Municipio}`,
          value: `${item.Id_Municipio}`,
        });
        $("#txtMunicipio").append(opcion);
      }
    }
  } else {
    $("#txtMunicipio").prepend(
      "<option selected disabled >Seleccione...</option>"
    );
    for (let item of datos) {
      let opcion = $("<option />", {
        text: `${item.Nombre_Municipio}`,
        value: `${item.Id_Municipio}`,
      });

      $("#txtMunicipio").append(opcion);
    }
  }
};

let CargarSubTipos = (datos, Id_SubTipo) => {
  $("#txtSubTipo").empty();
  if (Id_SubTipo) {
    for (let item of datos) {
      let opcion = null;
      if (parseInt(item.Id_SubTipo_Barrio_Vereda) == Id_SubTipo) {
        opcion = $("<option />", {
          text: `${item.SubTipo}`,
          value: `${item.Id_SubTipo_Barrio_Vereda}`,
          selected: true,
        });
        $("#txtSubTipo").append(opcion);
      } else {
        let opcion = $("<option />", {
          text: `${item.SubTipo}`,
          value: `${item.Id_SubTipo_Barrio_Vereda}`,
        });
        $("#txtSubTipo").append(opcion);
      }
    }
  } else {
    $("#txtSubTipo").prepend(
      "<option selected disabled >Seleccione...</option>"
    );
    for (let item of datos) {
      let opcion = $("<option />", {
        text: `${item.SubTipo}`,
        value: `${item.Id_SubTipo_Barrio_Vereda}`,
      });
      $("#txtSubTipo").append(opcion);
    }
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

  CargarPaises(Paises, Id_Pais);
  CargarDepartamentos(Departamentos, Id_Departamento);
  CargarMunicipios(Municipios, Id_Municipio);
  CargarSubTipos(Subtipos, Id_SubTipo);
  PonerBarrios_Veredas(Id_Municipio, Id_SubTipo);
};

let CargarOperadores = () => {
  $.ajax({
    url: `${URL}/Operador`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      $("#txtOperador").empty();
      $("#txtOperador").prepend(
        "<option selected disabled value='0'>Seleccione...</option>"
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
        "<option selected disabled value='0'>Seleccione...</option>"
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
      $("#txtDetallle_Servicios_Ilimitados").empty();
      $("#txtDetalle_Servicios_Adicionales").empty();
      $("#txtDetalleMinutosLDI").empty();

      for (let item of datos.data) {
        let opcion = $("<option />", {
          text: `${item.Opcion}`,
          value: `${item.Opcion}`,
        });

        if (item.Categoria == "Operador") {
          $("#txtRazones").append(opcion);
        } else if (item.Categoria == "Servicios ilimitados") {
          $("#txtDetallle_Servicios_Ilimitados").append(opcion);
        } else if (item.Categoria == "Servicios adicionales") {
          $("#txtDetalle_Servicios_Adicionales").append(opcion);
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
    },
    error: function (error) {
      console.log(error);
    },
  });
};
