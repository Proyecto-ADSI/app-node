// Variables de control
RegistrarAsesorExterno = false;
SeleccionarEmpleado = false;
RegistrarEmpleado = true;

let RegistrarUsuario = (imagen) => {
  MostrarLoaderGeneral();
  let datos = {
    // Usuario
    Usuario: $("#txtUsuario").val(),
    Contrasena: $("#txtContrasena").val(),
    Rol: parseInt($("#txtRol").val()),
    // Variables de control
    RegistrarEmpleado: RegistrarEmpleado,
    SeleccionarEmpleado: SeleccionarEmpleado,
    RegistrarAsesorExterno: RegistrarAsesorExterno,
  };

  if (RegistrarEmpleado) {
    datos.RegistrarEmpleado = true;
    Object.defineProperties(datos, {
      Tipo_Documento: {
        value: parseInt($("#txtTipoDocumento").val()),
        enumerable: true,
      },
      Documento: {
        value: $("#txtDocumento").val(),
        enumerable: true,
      },
      Nombre: {
        value: $("#txtNombre").val(),
        enumerable: true,
      },
      Apellidos: {
        value: $("#txtApellidos").val(),
        enumerable: true,
      },
      Email: {
        value: $("#txtEmail").val(),
        enumerable: true,
      },
      Sexo: {
        value: parseInt($("#txtSexo").val()),
        enumerable: true,
      },
      Celular: {
        value: $("#txtCelular").val(),
        enumerable: true,
      },
      Imagen: {
        value: imagen,
        enumerable: true,
      },
      Turno: {
        value: parseInt($("#txtTurno").val()),
        enumerable: true,
      },
    });
  } else if (SeleccionarEmpleado) {
    datos.SeleccionarEmpleado = true;
    Object.defineProperty(datos, "Id_Empleado", {
      value: parseInt(localStorage.getItem("Id_Empleado")),
      enumerable: true,
    });
  } else if (RegistrarAsesorExterno) {
    datos.RegistrarAsesorExterno = true;
    datos.Rol = parseInt($("#txtRol2").val());
    Object.defineProperties(datos, {
      Nombre: {
        value: $("#txtNombreOperador").val(),
        enumerable: true,
      },
      Email: {
        value: $("#txtEmailOperador").val(),
        enumerable: true,
      },
      Imagen: {
        value: imagen,
        enumerable: true,
      },
    });
  }

  $.ajax({
    url: `${URL}/Usuarios`,
    dataType: "json",
    type: "post",
    contentType: "aplication/json",
    data: JSON.stringify(datos),
    cache: false,
    processData: false,
    success: function (respuesta) {
      OcultarLoaderGeneral();
      if (respuesta.data.ok) {
        clientesSocket.emit("Asignacion");
        swal({
          title: "Registro exitoso.",
          type: "success",
          showCancelButton: false,
          showConfirmButton: false,
        });
        setTimeout(function () {
          Redireccionar("/Usuarios");
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
    error: function (xhr, errmsg, err) {
      OcultarLoaderGeneral();
      console.log(xhr.status + ": " + xhr.responseText);
    },
  });
};

let CargarImagenRegistro = () => {
  MostrarLoaderGeneral();
  let formData = new FormData();
  let files = null;
  if (RegistrarEmpleado) {
    files = $("#fileFotografia")[0].files[0];
  } else {
    files = $("#fileFotografiaOperador")[0].files[0];
  }
  formData.append("Img_Usuario", files);

  $.ajax({
    url: `${URL}/Usuarios/CargarImagenUsuario`,
    type: "post",
    data: formData,
    contentType: false,
    processData: false,
    success: function (res) {
      let imagen = res.data.pathArchivo;
      RegistrarUsuario(imagen);
    },
    error: function (err) {
      console.log(err);
    },
  });
};

CargarTiposDocumentos = () => {
  $.ajax({
    url: `${URL}/Documentos`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      ListarTipoDocumentos(datos);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

ListarTipoDocumentos = (datos) => {
  $("#txtTipoDocumento").empty();
  $("#txtTipoDocumento").prepend(
    "<option selected disabled >Seleccione...</option>"
  );
  for (let item of datos.data) {
    let $opcion = $("<option />", {
      text: `${item.Nombre}`,
      value: `${item.Id_Documento}`,
    });

    $("#txtTipoDocumento").append($opcion);
  }
};

CargarSexos = () => {
  $.ajax({
    url: `${URL}/Sexo`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      ListarSexos(datos);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

ListarSexos = (datos) => {
  $("#txtSexo").empty();
  $("#txtSexo").prepend("<option selected disabled >Seleccione...</option>");
  for (let item of datos.data) {
    let $opcion = $("<option />", {
      text: `${item.Nombre}`,
      value: `${item.Id_Sexo}`,
    });

    $("#txtSexo").append($opcion);
  }
};

CargarTurnos = () => {
  $.ajax({
    url: `${URL}/Turnos`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      ListarTurnos(datos);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

ListarTurnos = (datos) => {
  $("#txtTurno").empty();
  $("#txtTurno").prepend("<option selected disabled >Seleccione...</option>");
  for (let item of datos.data) {
    let $opcion = $("<option />", {
      text: `${item.Nombre}`,
      value: `${item.Id_Turno}`,
    });

    $("#txtTurno").append($opcion);
  }
};

CargarRoles = (Id_Rol) => {
  $.ajax({
    url: `${URL}/Rol/ValUsuario/${Id_Rol}`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      ListarRoles(datos);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

ListarRoles = (datos) => {
  $("#txtRol").empty();
  $("#txtRol").prepend("<option selected disabled >Seleccione...</option>");
  for (let item of datos.data) {
    let $opcion = $("<option />", {
      text: `${item.Nombre}`,
      value: `${item.Id_Rol}`,
    });
    $("#txtRol").append($opcion);
  }
};

$(function () {
  // Inicializar selects del formulario
  CargarTiposDocumentos();
  CargarSexos();
  CargarTurnos();
  ObtenerSession().then((data) => {
    let Id_Rol = data.session.Id_Rol;
    CargarRoles(Id_Rol);
  });

  $("#FormRegistroUsuario").validate({
    submitHandler: function (form, event) {
      // Validar si se envía imagen.

      if (RegistrarEmpleado || RegistrarAsesorExterno) {
        let files = null;
        if (RegistrarAsesorExterno) {
          files = $("#fileFotografiaOperador")[0].files;
        }
        if (RegistrarEmpleado) {
          files = $("#fileFotografia")[0].files;
        }
        if (files.length == 0) {
          RegistrarUsuario("defect.jpg");
        } else {
          CargarImagenRegistro();
        }
      } else {
        RegistrarUsuario(null);
      }
    },
    onkeyup: function (element) {
      if (element.id == "txtDocumento" || element.id == "txtUsuario") {
        return false;
      }
    },
    rules: {
      txtTipoDocumento: "required",
      txtDocumento: {
        required: true,
        number: true,
        minlength: 5,
        remote: {
          url: `${URL}/Empleados/Validacion/Disponible`,
          type: "get",
          dataType: "json",
          data: {
            txtDocumento: function () {
              return $("#txtDocumento").val();
            },
          },
          dataFilter: function (res) {
            var json = JSON.parse(res);
            if (json.data) {
              return '"true"';
            } else {
              return '"Documento ya registrado"';
            }
          },
        },
      },
      txtNombre: {
        required: true,
        SoloLetras: true,
        minlength: 2,
        maxlength: 30,
      },
      txtApellidos: {
        required: true,
        SoloLetras: true,
        minlength: 2,
        maxlength: 30,
      },
      txtEmail: {
        required: true,
        ValidarCorreo: true,
      },
      txtSexo: "required",
      txtCelular: {
        NumeroMovil: true,
        minlength: 10,
        maxlength: 10,
      },
      txtTurno: "required",
      txtUsuario: {
        required: true,
        minlength: 5,
        remote: {
          url: `${URL}/Usuarios/Validacion/Disponible`,
          type: "get",
          dataType: "json",
          data: {
            txtUsuario: function () {
              return $("#txtUsuario").val();
            },
          },
          dataFilter: function (res) {
            var json = JSON.parse(res);
            if (json.data) {
              return '"true"';
            } else {
              return '"Usuario no disponible"';
            }
          },
        },
      },
      txtRol: "required",
      txtContrasena: {
        required: true,
        minlength: 5,
      },
      txtConfirmarContrasena: {
        required: true,
        equalTo: "#txtContrasena",
      },
      ListaEmpleados: "required",
      txtEmailOperador: {
        required: true,
        ValidarCorreo: true,
      },
      txtNombreOperador: {
        required: true,
        SoloAlfanumericos: true,
        minlength: 2,
        maxlength: 20,
      },
    },
    messages: {
      txtConfirmarContrasena: {
        equalTo: "Las contraseñas no coinciden",
      },
    },
    errorClass: "form-control-feedback",
    errorElement: "div",
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
    errorPlacement: function (error, element) {
      if (element[0].id == "ListaEmpleados") {
        $(element).parents(".form-group").append(error);
      } else {
        error.insertAfter(element.parent(".input-group"));
      }
    },
  });

  $(".ListarEmpleados").select2({
    placeholder: "Seleccione un empleado",
    language: "es",
    allowClear: true,
    containerCssClass: "form-control custom-select",
    maximumInputLength: 20,
    ajax: {
      url: `${URL}/Empleados`,
      dataType: "json",
      delay: 250,
      type: "get",
      data: function (params) {
        var query = {
          palabra: params.term,
        };
        return query;
      },
      processResults: function (respuesta) {
        return {
          results: respuesta.data.results,
        };
      },
      cache: true,
    },
  });

  // Guardar en LocalStorage
  $(".ListarEmpleados").on("select2:select", function (e) {
    $(this).trigger("blur");
    var Id_Empleado = $(e.currentTarget).val();
    localStorage.Id_Empleado = Id_Empleado;
  });

  // Eliminar selección de LocalStorage
  $("#FormularioEmpleado").click(function () {
    if (localStorage.Id_Empleado) {
      localStorage.removeItem("Id_Empleado");
    }
  });

  $("#tabRegistarEmpleado").click(function () {
    RegistrarAsesorExterno = false;
    SeleccionarEmpleado = false;
    RegistrarEmpleado = true;
    $("#valRolesUsuarios1").removeAttr("style");
    $("#valRolesUsuarios2").attr("style", "display:none");
  });

  $("#tabSeleccionarEmpleado").click(function () {
    RegistrarAsesorExterno = false;
    SeleccionarEmpleado = true;
    RegistrarEmpleado = false;
    $("#valRolesUsuarios1").removeAttr("style");
    $("#valRolesUsuarios2").attr("style", "display:none");
  });

  $("#tabRegistarAE").click(function () {
    RegistrarAsesorExterno = true;
    SeleccionarEmpleado = false;
    RegistrarEmpleado = false;
    $("#valRolesUsuarios2").removeAttr("style");
    $("#valRolesUsuarios1").attr("style", "display:none");
  });

  $("#btnRegresar").click(function () {
    Redireccionar("/Usuarios");
  });
});
