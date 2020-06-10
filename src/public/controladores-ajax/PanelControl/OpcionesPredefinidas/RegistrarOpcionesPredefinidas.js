let RegistrarOpcionesPredefinidas = () => {
  let datos = {
    Opcion: $("#txtOpcion").val(),
    Categoria: $("#txtCategoria").val(),
  };
  $.ajax({
    url: `${URL}/OpcionesPredefinidas`,
    dataType: "json",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(datos),
    processData: false,
    success: function (res) {
      if (res.data.ok) {
        $("#txtOpcion").val("");
        $("#txtCategoria").empty();
        $("#txtCategoria").append(Categorias);

        $("#FormOpcionesPredefinidas .form-group").removeClass("has-success");
        $("#FormOpcionesPredefinidas .form-control").removeClass(
          "form-control-success"
        );
        ListarOpcionesPredefinidas();
        swal({
          title: "¡Registro exitoso!",
          type: "success",
          confirmButtonClass: "btn-success",
          confirmButtonText: "Ok",
          closeOnConfirm: true,
        });
      } else {
        swal({
          title: "Error",
          text: "Error al registrar",
          type: "error",
          confirmButtonClass: "btn-danger",
          confirmButtonText: "Ok",
          closeOnConfirm: true,
        });
      }
    },
    error: function (error) {
      swal({
        title: "Error",
        text: "Error al registrar",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
        closeOnConfirm: true,
      });
    },
  });
};
$(function () {
  $("#FormOpcionesPredefinidas").validate({
    submitHandler: function () {
      RegistrarOpcionesPredefinidas();
    },
    rules: {
      txtOpcion: {
        required: true,
        SoloAlfanumericos: true,
        minlength: 2,
        maxlength: 45,
      },
      txtCategoria: "required",
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
      error.insertAfter(element);
    },
  });
});
