
const URL = 'http://localhost:8081'

function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

let ValidarToken = (token) => {

  $.ajax({
    url: `${URL}/Usuarios/ValidarToken/${token}`,
    dataType: 'json',
    type: 'get',
  }).done(respuesta => {

    if (!respuesta.data) {

      swal({
        title: "¡Token inválido!",
        text: "No se puede recuperar contraseña, intenta nuevamente.",
        type: "warning",
        showCancelButton: false,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Cerrar",
        closeOnConfirm: false
      },
        function () {

          localStorage.removeItem("Restablecer_Usuario");
          location.href = "../Login/Login.html";

        });

      if (localStorage.Restablecer_Usuario) {
        localStorage.removeItem("Restablecer_Usuario");
      }

    } else {
      localStorage.Restablecer_Usuario = respuesta.data.Id_Usuario;
    }

  }).fail(error => {

    console.error(error);

  });
}

let RestablecerContrasena = () => {

  let datos = {
    Id_Usuario: parseInt(localStorage.getItem("Restablecer_Usuario")),
    Contrasena: $("#ConfirmarContrasena").val()
  }

  $.ajax({

    url: `${URL}/Usuarios`,
    type: 'patch',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(datos),
    processData: false

  }).done(respuesta => {

    if (respuesta.data.ok) {
      swal({
        title: "Contraseña restablecida correctamente",
        text: "Se ha restablecido correctamente la contraseña.",
        type: "success",
        showCancelButton: false,
        confirmButtonClass: "btn-sucess",
        confirmButtonText: "Continuar",
        closeOnConfirm: false
      },
        function () {

          localStorage.removeItem("Restablecer_Usuario");
          location.href = "../Login/Login.html";

        });
    }

  }).fail(error => {
    console.error(error);
  });

}

$(function () {

  token = getParameterByName('token');
  ValidarToken(token);


  $("#FormRecuperarContrasena").validate({
    submitHandler: function () {
      RestablecerContrasena();
    },
    rules: {
      Contrasena: {
        required: true,
        minlength: 5
      },
      ConfirmarContrasena: {
        required: true,
        minlength: 5,
        equalTo: "#Contrasena"
      }
    },
    messages: {
      ConfirmarContrasena: {
        equalTo: "Las contraseñas no coinciden"
      }
    },
    errorClass: "form-control-feedback",
    errorElement: "div",
    highlight: function (element) {
      $(element).parents(".form-group").addClass("has-danger").removeClass("has-success");
      $(element).addClass("form-control-danger").removeClass("form-control-success");
    },
    unhighlight: function (element) {
      $(element).parents(".form-group").addClass("has-success").removeClass("has-danger");
      $(element).addClass("form-control-success").removeClass("form-control-danger");
    }
  })


});