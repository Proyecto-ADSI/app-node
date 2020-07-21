function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

token = getParameterByName("token");
if (token === "") {
  location.href = "/Login";
}

let ValidarToken = (token) => {
  $.ajax({
    url: `${URL}/Usuarios/ValidarToken/${token}`,
    dataType: "json",
    type: "get",
    success: function (res) {
      if (!res.data) {
        swal(
          {
            title: "¡Token inválido!",
            text: "No se puede validar correo, intenta nuevamente.",
            type: "warning",
            showCancelButton: false,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Cerrar",
            closeOnConfirm: false,
          },
          function () {
            localStorage.removeItem("Id_UsuarioValidar");
            location.href = "/Login";
          }
        );
        if (localStorage.Id_UsuarioValidar) {
          localStorage.removeItem("Id_UsuarioValidar");
        }
      } else {
        let Id_Usuario = res.data.Id_Usuario;
        $.ajax({
          url: `${URL}/Empleados/ValidarCorreo/${Id_Usuario}`,
          dataType: "json",
          type: "get",
          success: function (res) {
            if (res.data) {
              // Recargar data tables de usuarios
              usuariosSocket = io("/Usuarios");
              usuariosSocket.emit("RecargarDataTableUsuarios");
              swal({
                title: "¡Correo validado!",
                text:
                  "El correo ha sido validado correctamente ya puedes inicar sesión.",
                type: "success",
                showCancelButton: false,
                showConfirmButton: false,
              });
              setTimeout(function () {
                location.href = "/Login";
              }, 3000);

              if (localStorage.Id_UsuarioValidar) {
                localStorage.removeItem("Id_UsuarioValidar");
              }
            }
          },
          error: function (error) {
            console.log(error);
          },
        });
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

$(function () {
  ValidarToken(token);
});
