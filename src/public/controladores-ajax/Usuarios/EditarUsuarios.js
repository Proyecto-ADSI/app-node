// Variables globales de control
var UsuarioBD;
var UsuarioValido = false;

// Para editar
var Id_UsuarioEditar;
var Id_EmpleadoEditar;
var form = null;
var form2 = null;
CargarDatosModalEditar = (Informacion) => {
  // Llenar formulario de empleado
  Id_EmpleadoEditar = Informacion.Id_Empleado;
  Id_UsuarioEditar = Informacion.Id_Usuario;

  if (Informacion.Id_Rol == "5") {
    $("#txtNombreAE").val(Informacion.Nombre);
    $("#txtCorreoAE").val(Informacion.Correo);
    $("#txtUsuarioAE").val(Informacion.Usuario);

    $("#inputFotografiaEditarAE").empty();
    $("#inputFotografiaEditarAE").append(`
    <input type="file" id="fileFotografiaAE" name="Fotografia" data-default-file="${URL}/Images/Usuarios/${Informacion.Imagen}" imagen="${Informacion.Imagen}"/>
  `);

    let dropify = $("#fileFotografiaAE").dropify({
      messages: {
        default: "Arrastre y suelte un archivo aquí o haz clic",
        replace: "Arrastre y suelte un archivo o haga clic para reemplazar",
        remove: "Eliminar",
        error: "Lo sentimos, el archivo es demasiado grande",
      },
    });

    dropify.on("dropify.afterClear", function (event, element) {
      $("#fileFotografiaAE").removeAttr("imagen");
    });
    $(".ModalEditarUsuariosAE").modal("show");
  } else {
    CargarTiposDocumentos(Informacion.Id_Documento);
    $("#txtDocumento").val(Informacion.Documento);
    $("#txtNombre").val(Informacion.Nombre);
    $("#txtApellidos").val(Informacion.Apellidos);
    $("#txtCorreo").val(Informacion.Correo);
    CargarSexos(Informacion.Id_Sexo);
    $("#txtCelular").val(Informacion.Celular);
    CargarTurnos(Informacion.Id_Turno);

    // Llenar formulario de usuario
    UsuarioBD = Informacion.Usuario;
    $("#txtUsuario").val(Informacion.Usuario);
    CargarRoles(Informacion.Id_Rol);

    $("#inputFotografiaEditar").empty();
    $("#inputFotografiaEditar").append(`
    <input type="file" id="fileFotografia" name="Fotografia" data-default-file="${URL}/Images/Usuarios/${Informacion.Imagen}" imagen="${Informacion.Imagen}"/>
  `);

    let dropify = $("#fileFotografia").dropify({
      messages: {
        default: "Arrastre y suelte un archivo aquí o haz clic",
        replace: "Arrastre y suelte un archivo o haga clic para reemplazar",
        remove: "Eliminar",
        error: "Lo sentimos, el archivo es demasiado grande",
      },
    });

    dropify.on("dropify.afterClear", function (event, element) {
      $("#fileFotografia").removeAttr("imagen");
    });

    // Mostrar Modal con formulario para editar
    $(".ModalEditarUsuarios").modal("show");
  }
};

CargarTiposDocumentos = (Id_Documento) => {
  $.ajax({
    url: `${URL}/Documentos`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      ListarTipoDocumentos(Id_Documento, datos);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

ListarTipoDocumentos = (Id_Documento, datos) => {
  $("#txtTipoDocumento").empty();
  $("#txtTipoDocumento").prepend("<option disabled >Seleccione...</option>");

  for (let item of datos.data) {
    if (item.Id_Documento == Id_Documento) {
      var $opcion = $("<option />", {
        text: `${item.Nombre}`,
        value: `${item.Id_Documento}`,
        selected: true,
      });
    } else {
      var $opcion = $("<option />", {
        text: `${item.Nombre}`,
        value: `${item.Id_Documento}`,
      });
    }

    $("#txtTipoDocumento").append($opcion);
  }
};

CargarSexos = (Id_Sexo) => {
  $.ajax({
    url: `${URL}/Sexo`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      ListarSexos(Id_Sexo, datos);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

ListarSexos = (Id_Sexo, datos) => {
  $("#txtSexo").empty();
  $("#txtSexo").prepend("<option disabled >Seleccione...</option>");

  for (let item of datos.data) {
    if (item.Id_Sexo == Id_Sexo) {
      var $opcion = $("<option />", {
        text: `${item.Nombre}`,
        value: `${item.Id_Sexo}`,
        selected: true,
      });
    } else {
      var $opcion = $("<option />", {
        text: `${item.Nombre}`,
        value: `${item.Id_Sexo}`,
      });
    }

    $("#txtSexo").append($opcion);
  }
};

CargarTurnos = (Id_Turno) => {
  $.ajax({
    url: `${URL}/Turnos`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      ListarTurnos(Id_Turno, datos);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

ListarTurnos = (Id_Turno, datos) => {
  $("#txtTurno").empty();
  $("#txtTurno").prepend("<option disabled >Seleccione...</option>");

  for (let item of datos.data) {
    if (item.Id_Turno == Id_Turno) {
      var $opcion = $("<option />", {
        text: `${item.Nombre}`,
        value: `${item.Id_Turno}`,
        selected: true,
      });
    } else {
      var $opcion = $("<option />", {
        text: `${item.Nombre}`,
        value: `${item.Id_Turno}`,
      });
    }

    $("#txtTurno").append($opcion);
  }
};

CargarRoles = (Id_Rol) => {
  $.ajax({
    url: `${URL}/Rol`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      ListarRoles(Id_Rol, datos);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

ListarRoles = (Id_Rol, datos) => {
  $("#txtRol").empty();
  $("#txtRol").prepend("<option disabled >Seleccione...</option>");

  for (let item of datos.data) {
    if (item.Id_Rol == Id_Rol) {
      var $opcion = $("<option />", {
        text: `${item.Nombre}`,
        value: `${item.Id_Rol}`,
        selected: true,
      });
    } else {
      var $opcion = $("<option />", {
        text: `${item.Nombre}`,
        value: `${item.Id_Rol}`,
      });
    }

    $("#txtRol").append($opcion);
  }
};

let CargarImagenEditar = () => {
  let formData = new FormData();
  let files = $("#fileFotografia")[0].files[0];
  formData.append("Img_Usuario", files);

  $.ajax({
    url: `${URL}/Usuarios/CargarImagenUsuario`,
    type: "post",
    data: formData,
    contentType: false,
    processData: false,
  })
    .done((respuesta) => {
      let imagen = respuesta.data.pathArchivo;
      EditarUsuario(imagen);
    })
    .fail((error) => {
      console.log(error);
    });
};
let CargarImagenEditarAE = () => {
  let formData = new FormData();
  let files = $("#fileFotografiaAE")[0].files[0];
  formData.append("Img_Usuario", files);
  $.ajax({
    url: `${URL}/Usuarios/CargarImagenUsuario`,
    type: "post",
    data: formData,
    contentType: false,
    processData: false,
  })
    .done((respuesta) => {
      let imagen = respuesta.data.pathArchivo;
      EditarUsuarioAE(imagen);
    })
    .fail((error) => {
      console.log(error);
    });
};

let RecargarDataTableUsuarios = () => {
  DataTableUsuarios.ajax.reload();
  $(".ModalEditarUsuarios").modal("hide");
  $(".ModalEditarUsuariosAE").modal("hide");
  swal({
    title: "Información modificada correctamente.",
    type: "success",
    showCancelButton: false,
    confirmButtonColor: "#00897b",
    confirmButtonText: "Continuar",
    closeOnConfirm: true,
  });
};

let EditarUsuario = (imagen) => {
  var datos = {
    // Empleado
    Id_Empleado: parseInt(Id_EmpleadoEditar),
    Tipo_Documento: parseInt($("#txtTipoDocumento").val()),
    Documento: $("#txtDocumento").val(),
    Nombre: $("#txtNombre").val(),
    Apellidos: $("#txtApellidos").val(),
    Correo: $("#txtCorreo").val(),
    Sexo: parseInt($("#txtSexo").val()),
    Celular: $("#txtCelular").val(),
    Imagen: imagen,
    Turno: parseInt($("#txtTurno").val()),

    // Usuario
    Id_Usuario: parseInt(Id_UsuarioEditar),
    Usuario: $("#txtUsuario").val(),
    Rol: parseInt($("#txtRol").val()),
    EditarAE: false,
  };

  // console.log(datos);

  $.ajax({
    url: `${URL}/Usuarios`,
    type: "put",
    dataType: "json",
    data: JSON.stringify(datos),
    contentType: "application/json",
    processData: false,
  })
    .done((respuesta) => {
      if (respuesta.data.ok) {
        RecargarDataTableUsuarios();
      } else {
        swal(
          {
            title: "Error al modificar.",
            text: "Ha ocurrido un error al modificar, intenta de nuevo",
            type: "danger",
            showCancelButton: false,
            confirmButtonColor: "#2F6885",
            confirmButtonText: "Continuar",
            closeOnConfirm: false,
          },
          function (isConfirm) {
            if (isConfirm) {
              console.log(respuesta.data);
            }
          }
        );
      }
    })
    .fail((error) => {
      console.log(error);
      swal({
        title: "Error en el servidor.",
        text: "Ha ocurrido un error al modificar, intenta de nuevo",
        type: "error",
        showCancelButton: false,
        confirmButtonColor: "#2F6885",
        confirmButtonText: "Continuar",
        closeOnConfirm: true,
      });
    });
};

let EditarUsuarioAE = (imagen) => {
  var datos = {
    // Empleado
    Id_Empleado: parseInt(Id_EmpleadoEditar),
    Nombre: $("#txtNombreAE").val(),
    Correo: $("#txtCorreoAE").val(),
    Imagen: imagen,
    // Usuario
    Id_Usuario: parseInt(Id_UsuarioEditar),
    Usuario: $("#txtUsuarioAE").val(),
    EditarAE: true,
    CambiarContrasena: false,
  };

  if ($("#checkbox_contrasena").is(":checked")) {
    datos.CambiarContrasena = true;
    Object.defineProperty(datos, "Contrasena", {
      value: $("#txtContrasenaAE").val(),
      enumerable: true,
    });
  }
  $.ajax({
    url: `${URL}/Usuarios`,
    type: "put",
    dataType: "json",
    data: JSON.stringify(datos),
    contentType: "application/json",
    processData: false,
    success: function (res) {
      console.log(res);
      if (res.data.ok) {
        RecargarDataTableUsuarios();
      } else {
        console.log(res.data);
        swal({
          title: "Error al modificar.",
          text: "Ha ocurrido un error al modificar, intenta de nuevo",
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
        title: "Error en el servidor.",
        text: "Ha ocurrido un error al modificar, intenta de nuevo",
        type: "error",
        showCancelButton: false,
        confirmButtonColor: "#2F6885",
        confirmButtonText: "Continuar",
        closeOnConfirm: true,
      });
    },
  });
};
$(function () {
  // Formulario normal
  form = $("#FormEditarUsuario").show();
  form.steps({
    headerTag: "h6",
    bodyTag: "section",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    onStepChanging: function (event, currentIndex, newIndex) {
      return (
        currentIndex > newIndex ||
        (!(3 === newIndex && Number($("#age-2").val()) < 18) &&
          (currentIndex < newIndex &&
            (form.find(".body:eq(" + newIndex + ") label.error").remove(),
            form
              .find(".body:eq(" + newIndex + ") .error")
              .removeClass("error")),
          (form.validate().settings.ignore = ":disabled,:hidden"),
          form.valid()))
      );
    },
    onFinishing: function (event, currentIndex) {
      return (form.validate().settings.ignore = ":disabled"), form.valid();
    },
    onFinished: function (event, currentIndex) {
      let files = $("#fileFotografia")[0].files;
      if (files.length == 0) {
        let imagen = $("#fileFotografia").attr("imagen");
        if (typeof imagen == "undefined") {
          imagen = "defect.jpg";
        }
        EditarUsuario(imagen);
      } else {
        CargarImagenEditar();
      }
    },
  }),
    form.validate({
      ignore: "input[type=hidden]",
      successClass: "text-success",
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
      rules: {
        txtTipoDocumento: "required",
        txtDocumento: {
          required: true,
          SoloNumeros: true,
          minlength: 5,
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
                UsuarioForm = $("#txtUsuario").val();

                if (UsuarioBD == UsuarioForm) {
                  UsuarioValido = true;
                } else {
                  UsuarioValido = false;
                  return UsuarioForm;
                }
              },
            },
            dataFilter: function (res) {
              var json = JSON.parse(res);
              if (json.data == true || UsuarioValido == true) {
                return '"true"';
              } else {
                return '"Usuario no disponible"';
              }
            },
          },
        },
        txtRol: "required",
      },
    });

  // Formulario asesor externo
  form2 = $("#FormEditarUsuarioAE").show();
  form2.steps({
    headerTag: "h6",
    bodyTag: "section",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    onStepChanging: function (event, currentIndex, newIndex) {
      return (
        currentIndex > newIndex ||
        (!(3 === newIndex && Number($("#age-2").val()) < 18) &&
          (currentIndex < newIndex &&
            (form2.find(".body:eq(" + newIndex + ") label.error").remove(),
            form2
              .find(".body:eq(" + newIndex + ") .error")
              .removeClass("error")),
          (form2.validate().settings.ignore = ":disabled,:hidden"),
          form2.valid()))
      );
    },
    onFinishing: function (event, currentIndex) {
      return (form2.validate().settings.ignore = ":disabled"), form2.valid();
    },
    onFinished: function (event, currentIndex) {
      let files = $("#fileFotografiaAE")[0].files;
      if (files.length == 0) {
        let imagen = $("#fileFotografiaAE").attr("imagen");
        if (typeof imagen == "undefined") {
          imagen = "defect.jpg";
        }
        EditarUsuarioAE(imagen);
      } else {
        CargarImagenEditarAE();
      }
    },
  }),
    form2.validate({
      ignore: "input[type=hidden]",
      successClass: "text-success",
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
        error.insertAfter(element.parent(".input-group"));
      },
      rules: {
        txtNombreAE: {
          required: true,
          SoloLetras: true,
          minlength: 2,
          maxlength: 30,
        },
        txtCorreoAE: {
          required: true,
          ValidarCorreo: true,
        },
        txtUsuarioAE: {
          required: true,
          minlength: 5,
          remote: {
            url: `${URL}/Usuarios/Validacion/Disponible`,
            type: "get",
            dataType: "json",
            data: {
              txtUsuario: function () {
                UsuarioForm = $("#txtUsuario").val();

                if (UsuarioBD == UsuarioForm) {
                  UsuarioValido = true;
                } else {
                  UsuarioValido = false;
                  return UsuarioForm;
                }
              },
            },
            dataFilter: function (res) {
              var json = JSON.parse(res);
              if (json.data == true || UsuarioValido == true) {
                return '"true"';
              } else {
                return '"Usuario no disponible"';
              }
            },
          },
        },
        txtContrasenaAE: {
          required: true,
          minlength: 5,
        },
        txtConfirmarContrasenaAE: {
          required: true,
          equalTo: "#txtContrasenaAE",
        },
      },
    });

  $("#checkbox_contrasena").click(function () {
    if ($(this).is(":checked")) {
      $("#txtContrasenaAE").removeAttr("disabled");
      $("#txtConfirmarContrasenaAE").removeAttr("disabled");
    } else {
      $("#txtContrasenaAE").attr("disabled", true);
      $("#txtConfirmarContrasenaAE").attr("disabled", true);
    }
  });
});
