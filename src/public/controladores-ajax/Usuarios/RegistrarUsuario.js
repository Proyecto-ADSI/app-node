//API
let RegistrarUsuario = (imagen) => {
  if (localStorage.Id_Empleado) {
    //Objeto JSON
    var datos = {
      // Empleado
      Id_Empleado: parseInt(localStorage.getItem("Id_Empleado")),

      // Usuario
      Usuario: $("#txtUsuario").val(),
      Contrasena: $("#txtContrasena").val(),
      Rol: parseInt($("#txtRol").val()),
    };

    localStorage.removeItem("Id_Empleado");
  } else {
    //Objeto JSON
    var datos = {
      // Empleado
      Tipo_Documento: parseInt($("#txtTipoDocumento").val()),
      Documento: $("#txtDocumento").val(),
      Nombre: $("#txtNombre").val(),
      Apellidos: $("#txtApellidos").val(),
      Email: $("#txtEmail").val(),
      Sexo: parseInt($("#txtSexo").val()),
      Celular: $("#txtCelular").val(),
      Imagen: imagen,
      Turno: parseInt($("#txtTurno").val()),

      // Usuario
      Usuario: $("#txtUsuario").val(),
      Contrasena: $("#txtContrasena").val(),
      Rol: parseInt($("#txtRol").val()),
    };
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
      if (respuesta.data.ok) {
        swal(
          {
            title: "Usuario registrado correctamente.",
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#2F6885",
            confirmButtonText: "Continuar",
            closeOnConfirm: false,
          },
          function (isConfirm) {
            if (isConfirm) {
              Redireccionar("/Usuarios");
            }
          }
        );
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
      console.log(xhr.status + ": " + xhr.responseText);
    },
  });
};

let CargarImagenRegistro = () => {
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
    .done((res) => {
      let imagen = res.data.pathArchivo;
      RegistrarUsuario(imagen);
    })
    .fail((error) => {
      console.log(error);
    });
};

CargarTiposDocumentos = () => {
  $.ajax({
    url: `${URL}/Documento`,
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

CargarRoles = () => {
  $.ajax({
    url: `${URL}/Rol`,
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
  CargarRoles();

  $("#FormRegistroUsuario").validate({
    submitHandler: function (form, event) {
      // Validar si se envía imagen.

      let files = $("#fileFotografia")[0].files;

      if (files.length == 0) {
        RegistrarUsuario("defect.jpg");
      } else {
        CargarImagenRegistro();
      }
    },
    // rules: {
    //     txtTipoDocumento: "required",
    //     txtDocumento: {
    //         required: true,
    //         number: true,
    //         minlength: 5
    //     },
    //     txtNombre: {
    //         required: true,
    //         SoloLetras: true,
    //         minlength: 2,
    //         maxlength: 30
    //     },
    //     txtApellidos: {
    //         required: true,
    //         SoloLetras: true,
    //         minlength: 2,
    //         maxlength: 30
    //     },
    //     txtEmail: {
    //         required: true,
    //         ValidarCorreo: true
    //     },
    //     txtSexo: "required",
    //     txtCelular: {
    //         NumeroMovil: true,
    //         minlength: 10,
    //         maxlength: 10
    //     },
    //     txtTurno: "required",
    //     txtUsuario: {
    //         required: true,
    //         minlength: 5,
    //         remote: {
    //             url: `${URL}/Usuarios/Validacion/Disponible`,
    //             type: 'get',
    //             dataType: 'json',
    //             data: {
    //                 txtUsuario: function () {
    //                     return $("#txtUsuario").val();
    //                 }
    //             },
    //             dataFilter: function (res) {
    //                 var json = JSON.parse(res);
    //                 if (json.data) {
    //                     return '"true"';
    //                 } else {
    //                     return '"Usuario no disponible"';
    //                 }
    //             }
    //         }
    //     },
    //     txtRol: "required",
    //     txtContrasena: {
    //         required: true,
    //         minlength: 5
    //     },
    //     txtConfirmarContrasena: {
    //         required: true,
    //         equalTo: "#txtContrasena"
    //     },
    //     ListaEmpleados: "required"
    // },
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
});
