let RegistrarDocumento = () => {
  let datos = {
    Nombre: $("#TxtDocumento").val(),
    Estado: parseInt(1),
  };

  $.ajax({
    url: `${URL}/Documentos`,
    dataType: "json",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(datos),
    processData: false,
  })
    .done((respuesta) => {
      if (respuesta.data.ok) {
        swal(
          {
            title: "Felicidades",
            text: "Has creado un documento correctamente",
            type: "success",
            confirmButtonClass: "btn-success",
            confirmButtonText: "Ok",
          },
          function () {
            ListarDocumento();
          }
        );
      } else {
        swal(
          {
            title: "Error",
            text: "No has crear un documento",
            type: "error",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Ok",
          },
          function () {
            location.href = "/App/Administrador/Panel Control/Panel.html";
          }
        );
      }
    })
    .fail((error) => {
      swal(
        {
          title: "Error",
          text: "No has crear un documento",
          type: "error",
          confirmButtonClass: "btn-danger",
          confirmButtonText: "Ok",
        },
        function () {
          location.href = "/App/Administrador/Panel Control/Panel.html";
        }
      );
    });
};
$(function () {
  $("#FormDocumento").validate({
    submitHandler: function () {
      RegistrarDocumento();

      $("#TxtDocumento").val("");

      $("#FormDocumento .form-group").removeClass("has-success");
      $("#FormDocumento .form-control").removeClass("form-control-sucess");
    },
    rules: {
      Documento: {
        required: true,
        SoloAlfanumericos: true,
        minlength: 2,
        maxlength: 45,
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
      error.insertAfter(element.parent(".input-group"));
    },
  });
});
