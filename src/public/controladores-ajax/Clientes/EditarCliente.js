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
      if(valDocSoporte){
        SubirDocumentos();
      }else{
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
          minlength: 5,
          SoloAlfanumericos: true,
        },
        txtTelefono: {
          required: true,
          SoloNumeros: true,
          minlength: 5,
          maxlength: 10,
        },
        txtNIT: {
          ValidarNIT: true,
          minlength: 5,
        },
        txtEncargado: {
          SoloLetras: true,
        },
        txtExt_Tel_Contacto: {
          SoloNumeros: true,
          minlength: 2,
          maxlength: 10,
        },
        // txtPais: "required",
        // txtDepartamento: "required",
        // txtMunicipio: "required",
        // txtSubTipo: "required",
        // txtNombre_Lugar: "required",
        // txtDireccion: "required",
        txtOperador: "required",
        txtDetalle_Cantidad_Lineas: {
          required: true,
          SoloNumeros: true,
          ValidarCantidadLineas: true,
        },
        txtDetalle_Valor_Mensual: {
          required: true,
          SoloNumeros: true,
        },
        detalleLineasRadios: "required",
        txtDetalleNavegacion: {
          SoloNumeros: true,
        },
        txtDetalle_Minutos: {
          SoloAlfanumericos: true,
        },
        txtDetalle_Minutos_Otro: {
          SoloAlfanumericos: true,
        },
      },
    });

  // // Inicializar elementos:

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
            $("#txtCamara_Comercio").change(function(){
                valDocSoporte = true;
            });
            $("#txtCedula").change(function(){
                valDocSoporte = true;
            });
            $("#txtSoporte").change(function(){
                valDocSoporte = true;
            });
            $("#txtDetalles").change(function(){
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

  $("#btnLimpiar").click(function () {
    LimpiarDetalleLinea();
  });

  $("#btnGuardarDetalleLineas").click(function () {
    form.validate().settings.ignore = ":disabled,:hidden, .valDetalle";
    if (form.valid()) {
      $("#txtDetalleId").val() == "0"
        ? RegistrarDetalleLinea()
        : EditarDetalleLinea();
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

        $("#ModalNumerosLineas").empty();
        if (typeof linea.NumerosLineas !== "undefined") {
          if (typeof linea.id_lineas !== "undefined") {
            AgregarInput(
              linea.NumerosLineas.length,
              linea.NumerosLineas,
              linea.id_lineas
            );
          } else {
            AgregarInput(linea.NumerosLineas.length, linea.NumerosLineas);
          }
        } else {
          AgregarInput(linea.cantidadLineas, 0, 0, false);
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

  $(document).on("click", "#DetallesLineasEditar", function () {
    let idLinea = $(this).attr("id_linea");
    let DetalleLineas = JSON.parse(sessionStorage.getItem("DetalleLineas"));

    DetalleLineas.forEach(function (valor, indice, array) {
      if (valor.id == idLinea) {
        $("#txtDetalleId").val(valor.id);
        $("#txtDetalleId").attr("grupo", valor.grupo);
        $("#txtDetalle_Cantidad_Lineas").val(valor.cantidadLineas);
        $("#txtDetalle_Cantidad_Lineas").attr("id_linea", valor.id);
        $("#txtDetalle_Valor_Mensual").val(valor.valorMensual);
        valor.valValorLineas == "1"
          ? $("#txtDetalle_radio").prop("checked", true)
          : $("#txtDetalle_radio2").prop("checked", true);
        $("#txtDetalleNavegacion").val(valor.navegacion);
        // $('#txtDetalleUnidad').val(),
        valor.minIlimitados
          ? $("input:checkbox[name=txtDetalle_Validacion_Ilimitados]").trigger(
              "click"
            )
          : $("#txtDetalle_Minutos").val(valor.minutos);
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
          ? $("input:checkbox[name=txtDetalle_Mensajes]").prop("checked", true)
          : "";
        valor.redes
          ? $("input:checkbox[name=txtDetalle_Redes]").prop("checked", true)
          : "";
        valor.llamadas
          ? $("input:checkbox[name=txtDetalle_Llamadas]").prop("checked", true)
          : "";
        valor.roaming
          ? $("input:checkbox[name=txtDetalle_Roaming]").prop("checked", true)
          : "";
      }
    });
  });

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

  Informacion = JSON.parse(sessionStorage.getItem("DatosEditarCliente"));

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
  $("#txtNIT").val(Informacion.NIT_CDV);
  $("#txtEncargado").val(Informacion.Encargado);
  $("#txtExt_Tel_Contacto").val(Informacion.Ext_Tel_Contacto);

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

  $("#txtDireccion").val(Informacion.Direccion);

  // Datos básicos líneas.
  if (parseInt(Informacion.Id_Plan_Corporativo) > 0) {
  }
  CargarOperadores(Informacion.Id_Operador);
  CargarCalificaciones(Informacion.Id_Calificacion_Operador);
  CargarRazones(Informacion.Razones);

  // Detalle líneas.
  if (typeof Informacion.Detalle_Lineas !== "undefined") {
    let ArrayLineasGrupo = [];
    for (let lineaBD of Informacion.Detalle_Lineas) {
      if (ArrayLineasGrupo.length > 0) {
        let control = false;
        // Comprobar si el grupo ya está agregado.
        for (let linea of ArrayLineasGrupo) {
          if (linea.grupo === lineaBD.Grupo) {
            linea.cantidadLineas += 1;
            linea.id_lineas.push(lineaBD.Id_Linea);
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
    sessionStorage.DetalleLineas = JSON.stringify(ArrayLineasGrupo);
    ListarDetalleLineas();
  }

  let CargarInformacionPlan = () => {
    $("#Fecha_Corporativo #txtFecha_inicio").datepicker("setDate", Informacion.Fecha_Inicio);
    $("#Fecha_Corporativo #txtFecha_fin").datepicker("setDate", Informacion.Fecha_Fin);
  };

  // Plan Corporativo
  if (parseInt(Informacion.Id_Plan_Corporativo) > 0) {
    $(".switch_corporativo").trigger("click");
  }

  if(parseInt(Informacion.Clausula_Permanencia) == 1){
    $("#switchClausula").children("label").children("span").trigger("click");
  }

  $("#txtDescripcion").val(Informacion.Descripcion)
  
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

let ObtenerValInputDocumentos = () =>{
  
  let objDocumentos = {
    txtCamara_Comercio: $("#txtCamara_Comercio").closest(".fileinput").children(".form-control").children("span").text(),
    txtCedula : $("#txtCedula").closest(".fileinput").children(".form-control").children("span").text(),
    txtSoporte : $("#txtSoporte").closest(".fileinput").children(".form-control").children("span").text(),
    txtDetalles : $("#txtDetalles").closest(".fileinput").children(".form-control").children("span").text()
  };
  
  return objDocumentos;
}

let ObtenerValInputDoc = (selector) =>{
  let doc = $(selector).closest(".fileinput").children(".form-control").children("span").text();
  return doc;
}
// FUNCIONES:
let SubirDocumentos = () => {
  let formData = new FormData();

  let objDocumentos = {
    txtCamara_Comercio: null,
    txtCedula : null,
    txtSoporte : null,
    txtDetalles : null
  };

  let files = [];
  let doc1 = $("#txtCamara_Comercio")[0].files[0];
  let doc2 = $("#txtCedula")[0].files[0];
  let doc3 = $("#txtSoporte")[0].files[0];
  let doc4 = $("#txtDetalles")[0].files[0];
  
  if(typeof doc1 != "undefined"){
    files.push(doc1);
  }else{
    objDocumentos.txtCamara_Comercio = ObtenerValInputDoc("#txtCamara_Comercio");
  }

  if(typeof doc2 != "undefined"){
    files.push(doc2);
  }else{
    objDocumentos.txtCedula = ObtenerValInputDoc("#txtCedula");
  }

  if(typeof doc3 != "undefined"){
    files.push(doc3);
  }else{
    objDocumentos.txtSoporte = ObtenerValInputDoc("#txtSoporte");
  }

  if(typeof doc4 != "undefined"){
    files.push(doc4);
  }else{
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

      for(let doc of docSoporte){
        if(objDocumentos.txtCamara_Comercio == null){
          objDocumentos.txtCamara_Comercio = doc;
        }else if(objDocumentos.txtCedula == null){
          objDocumentos.txtCedula = doc;
        }else if(objDocumentos.txtSoporte == null){
          objDocumentos.txtSoporte = doc;
        }else if(objDocumentos.txtDetalles == null){
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
  // Array Lineas
  let arrayLineas = [];

  let Cantidad_Total_Lineas = 0;
  let Valor_Total_Mensual = 0;
  let GrupoLineas = 0;

  if (sessionStorage.DetalleLineas) {
    let DetalleLineas = JSON.parse(sessionStorage.DetalleLineas);

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
      for (let i = 1; i <= parseInt(lineaItem.cantidadLineas); i++) {
        let linea = {
          id: parseInt(lineaItem.id_lineas[i - 1]),
          numero: lineaItem.NumerosLineas[i - 1],
          minutos: minutos,
          navegacion: lineaItem.navegacion + " " + lineaItem.unidad,
          mensajes: lineaItem.mensajes ? 1 : 0,
          redes: lineaItem.redes ? 1 : 0,
          llamadas: lineaItem.llamadas ? 1 : 0,
          roaming: lineaItem.roaming ? 1 : 0,
          cargo: lineaItem.valorMensual,
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
    NIT_CDV: $("#txtNIT").val(),
    Encargado: $("#txtEncargado").val(),
    Ext_Tel_Contacto: $("#txtExt_Tel_Contacto").val(),
    Barrio_Vereda: parseInt($("#txtNombre_Lugar").val()),
    Direccion: $("#txtDireccion").val(),
    //DBL
    Id_DBL: parseInt(Id_DBL),
    Id_Operador: parseInt($("#txtOperador").val()),
    Id_Calificacion_Operador: parseInt($("#txtCalificacion").val()),
    Razones: stringRazones,
    Cantidad_Lineas: Cantidad_Total_Lineas,
    Valor_Mensual: Valor_Total_Mensual.toString(),
    DetalleLineas: arrayLineas,

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
        value: $("#txtDescripcion").val(),
        enumerable: true,
      },
    });
  }

  if ($(".switch_doc").bootstrapSwitch("state")) {
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
        value:  objDocumentos.txtCamara_Comercio,
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
    type: "put",
    dataType: "json",
    data: JSON.stringify(datos),
    contentType: "application/json",
    processData: false,
  })
    .done((respuesta) => {
      console.log(respuesta);

      if (respuesta.data.ok) {
        swal(
          {
            title: "¡Cliente modificado correctamente!",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#2F6885",
            confirmButtonText: "Continuar",
            closeOnConfirm: false,
          },
          function (isConfirm) {
            if (isConfirm) {
              sessionStorage.removeItem("DetalleLineas");
              Redireccionar("/Directorio");
            }
          }
        );
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
            location.href = "AgregarEmpresa.html";
            console.log(error);
          }
        }
      );
    });
};

let CrearLineaSession = (lineaBD) => {
  let regex = /(\d+)/g;
  let regex2 = /([A-Za-z]+)/g;
  let regex3 = /(\w+)/g;
  let navegacion = lineaBD.Navegacion.match(regex);
  let unidad = lineaBD.Navegacion.match(regex2);
  let minutosRegex = lineaBD.Minutos.match(regex3);

  let ilimitados = false;
  let minutos = "";
  let todoOperador = false;
  let minOtro = "";

  if (minutosRegex[0] === "Ilimitados") {
    ilimitados = true;

    if (lineaBD.Minutos.indexOf(",todo operador") != -1) {
      todoOperador = true;

      let posicion = lineaBD.Minutos.indexOf(",todo operador");
      let inicioIndex = posicion + 15;
      minOtro = lineaBD.Minutos.substring(inicioIndex);
    } else {
      minOtro = lineaBD.Minutos.substring(11);
    }
  } else {
    minutos = minutosRegex[0];
    if (lineaBD.Minutos.indexOf(",todo operador") != -1) {
      todoOperador = true;

      let posicion = lineaBD.Minutos.indexOf(",todo operador");
      let inicioIndex = posicion + 15;
      minOtro = lineaBD.Minutos.substring(inicioIndex);
    } else {
      minOtro = lineaBD.Minutos.substring(minutos.length + 1);
    }
  }

  let arrayId = [lineaBD.Id_Linea];
  let arrayNumeros = [lineaBD.Linea];
  let linea = {
    id: uuid.v4(),
    grupo: lineaBD.Grupo,
    id_lineas: arrayId,
    NumerosLineas: arrayNumeros,
    cantidadLineas: 1,
    valorMensual: lineaBD.Cargo_Basico,
    valValorLineas: "2",
    navegacion: navegacion[0],
    unidad: unidad[0],
    minutos: minutos,
    minIlimitados: ilimitados,
    todoOperador: todoOperador,
    minOtro: minOtro,
    mensajes: lineaBD.Mensajes === "1" ? true : false,
    llamadas: lineaBD.Llamadas_Inter === "1" ? true : false,
    redes: lineaBD.Redes_Sociales === "1" ? true : false,
    roaming: lineaBD.Roaming === "1" ? true : false,
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

      for (let item of datos.data) {
        if (item.Id_Operador == Id_Operador) {
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
      for (let item of datos.data) {
        if (item.Id_Calificacion_Operador == Id_Calificacion_Operador) {
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

let CargarRazones = (stringRazones) => {
  let regex = /("[^"]*"|[^,]*),/g;
  let arrayRazones = stringRazones.match(regex);

  let arrayRazonesFormatiado = [];

  for (let razon of arrayRazones) {
    let nuevaRazon = razon.trim();
    nuevaRazon = nuevaRazon.replace(/,/g, "");
    arrayRazonesFormatiado.push(nuevaRazon);
  }

  $.ajax({
    url: `${URL}/Razones/Operador`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      $("#txtRazones").empty();

      let arrayRazonesBD = datos.data;
      let arrayRazonesE = [];
      let opcion = null;

      for (let razon of arrayRazonesFormatiado) {
        for (let item of arrayRazonesBD) {
          if (item.Razon === razon) {
            opcion = $("<option />", {
              text: `${item.Razon}`,
              value: `${item.Razon}`,
              selected: true,
            });

            arrayRazonesE.push(item);
          }

          $("#txtRazones").append(opcion);
        }
      }

      // Eliminar razones ya agregadas.
      for (let razon of arrayRazonesE) {
        arrayRazonesBD.forEach(function (item, index, array) {
          if (razon.Id_Razon_Calificacion == item.Id_Razon_Calificacion) {
            arrayRazonesBD.splice(index, 1);
          }
        });
      }

      // Agregar razones no seleccionadas.
      if (arrayRazonesBD.length > 0) {
        for (let item of arrayRazonesBD) {
          let opcion2 = $("<option />", {
            text: `${item.Razon}`,
            value: `${item.Razon}`,
          });

          $("#txtRazones").append(opcion2);
        }
      }

      //  Select razones
      $(".Select_Razones").select2({
        tags: true,
        tokenSeparators: [","],
      });
    },
    error: function (error) {
      console.log(error);
    },
  });
};

// // Detalle Líneas

let RegistrarDetalleLinea = () => {
  let DetalleLineas = [];
  if (sessionStorage.DetalleLineas) {
    DetalleLineas = JSON.parse(sessionStorage.getItem("DetalleLineas"));
  }

  let arrayIds = [];
  let arrayNumeros = [];
  let cantidadLineas = parseInt($("#txtDetalle_Cantidad_Lineas").val());
  for (let i = 1; i <= cantidadLineas; i++) {
    arrayIds.push("0");
    arrayNumeros.push("0");
  }

  let arrayDetalleLinea = {
    id: uuid.v4(),
    cantidadLineas: $("#txtDetalle_Cantidad_Lineas").val(),
    id_lineas: arrayIds,
    NumerosLineas: arrayNumeros,
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
                        <button type="button" id="DetallesLineasDetalle" id_linea="${
                          item.id
                        }"  class="btn btn-outline-primary btn-sm">
                            <i class="fa  fa-eye"></i>
                        </button>

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

  for (let linea of DetalleLineas) {
    if (linea.id == idLinea) {
      let lineasNuevas =
        parseInt($("#txtDetalle_Cantidad_Lineas").val()) -
        parseInt(linea.cantidadLineas);

      for (let i = 0; i < lineasNuevas; i++) {
        linea.id_lineas.push("0");
        linea.NumerosLineas.push("0");
      }

      // Editar información de línea.
      linea.cantidadLineas = $("#txtDetalle_Cantidad_Lineas").val();
      linea.valorMensual = $("#txtDetalle_Valor_Mensual").val();
      linea.valValorLineas = $(
        "input:radio[name=detalleLineasRadios]:checked"
      ).val();
      linea.navegacion = $("#txtDetalleNavegacion").val();
      linea.unidad = $("#txtDetalleUnidad").val();
      linea.minutos = $("#txtDetalle_Minutos").val();
      linea.minIlimitados = $(
        "input:checkbox[name=txtDetalle_Validacion_Ilimitados]"
      ).is(":checked");
      linea.todoOperador = $("input:checkbox[name=txtDetalle_Minutos_TO]").is(
        ":checked"
      );
      linea.minOtro = $("#txtDetalle_Minutos_Otro").val();
      linea.mensajes = $("input:checkbox[name=txtDetalle_Mensajes]").is(
        ":checked"
      );
      linea.llamadas = $("input:checkbox[name=txtDetalle_Llamadas]").is(
        ":checked"
      );
      linea.redes = $("input:checkbox[name=txtDetalle_Redes]").is(":checked");
      linea.roaming = $("input:checkbox[name=txtDetalle_Roaming]").is(
        ":checked"
      );

      sessionStorage.DetalleLineas = JSON.stringify(DetalleLineas);
    }
  }

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

// Números

function AgregarInput(cantidad, numeros, ids, click) {
  for (let i = 1; i <= cantidad; i++) {
    id++;
    let objTo = document.getElementById("ModalNumerosLineas");
    let divtest = document.createElement("div");
    divtest.setAttribute("class", "form-group removeclass" + id);

    if (Array.isArray(numeros)) {
      if (Array.isArray(ids)) {
        if (numeros[i - 1] == "0") {
          if (ids[i - 1] == "0") {
            divtest.innerHTML = `
                    <div class="row form-group">
                        <div class="col-md-12">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">
                                        <i class="fa fa-mobile"></i>
                                    </span>
                                </div>
                                <input type="text" class="form-control txtNumeroLinea" name="txtNumeroLinea" 
                                placeholder="Ingresa un número" id_linea_numero="0">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-danger" type="button" onclick="Eliminarinput(${id})">
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
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">
                                        <i class="fa fa-mobile"></i>
                                    </span>
                                </div>
                                <input type="text" class="form-control txtNumeroLinea" name="txtNumeroLinea" 
                                placeholder="Ingresa un número" id_linea_numero="${
                                  ids[i - 1]
                                }">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-danger" type="button" onclick="Eliminarinput(${id})">
                                        <i class="fa fa-minus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
          }
        } else {
          if (ids[i - 1] == "0") {
            divtest.innerHTML = `
                        <div class="row form-group">
                            <div class="col-md-12">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1">
                                            <i class="fa fa-mobile"></i>
                                        </span>
                                    </div>
                                    <input type="text" class="form-control txtNumeroLinea" name="txtNumeroLinea" 
                                    placeholder="Ingresa un número" value="${
                                      numeros[i - 1]
                                    }" id_linea_numero="0">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-danger" type="button" onclick="Eliminarinput(${id})">
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
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1">
                                            <i class="fa fa-mobile"></i>
                                        </span>
                                    </div>
                                    <input type="text" class="form-control txtNumeroLinea" name="txtNumeroLinea" 
                                    placeholder="Ingresa un número" value="${
                                      numeros[i - 1]
                                    }" id_linea_numero="${ids[i - 1]}">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-danger" type="button" onclick="Eliminarinput(${id})">
                                            <i class="fa fa-minus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
          }
        }
      }
    } else {
      if (click) {
        let cantidadLineas = parseInt($("#txtIncrementarLineas").html());
        cantidadLineas++;
        $("#txtIncrementarLineas").html(cantidadLineas);
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
                            <input type="text" class="form-control txtNumeroLinea" name="txtNumeroLinea" 
                            placeholder="Ingresa un número" id_linea_numero="0">
                            <div class="input-group-append">
                                <button class="btn btn-outline-danger" type="button" onclick="Eliminarinput(${id})">
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
}

function RegistrarNumeros() {
  if (ValidarNumerosLineas()) {
    let DetalleLineas = JSON.parse(sessionStorage.getItem("DetalleLineas"));
    let idLinea = $("#txtIdLineasModalNumeros td").html();
    let arrayInputs = $('input:text[name="txtNumeroLinea"]');
    let arrayNumeros = [];
    let arrayIds = [];
    DetalleLineas.forEach(function (linea, indice, array) {
      if (linea.id == idLinea) {
        linea.cantidadLineas = parseInt($("#txtIncrementarLineas").html());

        for (let numero of arrayInputs) {
          let numVal = $(numero).val() == "" ? "0" : $(numero).val();
          arrayNumeros.push(numVal);
          arrayIds.push($(numero).attr("id_linea_numero"));
        }

        Object.defineProperty(linea, "NumerosLineas", {
          value: arrayNumeros,
          enumerable: true,
        });

        Object.defineProperty(linea, "id_lineas", {
          value: arrayIds,
          enumerable: true,
        });

        sessionStorage.DetalleLineas = JSON.stringify(DetalleLineas);

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
              ListarDetalleLineas();
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
