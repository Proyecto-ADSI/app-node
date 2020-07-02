Id_OP = null;

let CargarModalEditarOpciones = (data) => {
  Id_OP = data.Id_OP;
  $("#txtOpcionEdit").val(data.Opcion);
  $("#txtCategoriaEdit").empty();
  $("#txtCategoriaEdit").append(Categorias);
  let arrayConclusion = $("#txtCategoriaEdit option");
  for (let item of arrayConclusion) {
    let categoria = $(item).val();
    if (categoria == data.Categoria) {
      $(item).attr("selected", true);
    } else {
      $(item).removeAttr("selected");
    }
  }
  $("#ModificarOpcionesPredefinidas").modal("show");
};

let EditarOpcionesPredefinidas = () => {
  let datos = {
    Id_OP: parseInt(Id_OP),
    Opcion: $("#txtOpcionEdit").val(),
    Categoria: $("#txtCategoriaEdit").val(),
  };
  $.ajax({
    url: `${URL}/OpcionesPredefinidas`,
    dataType: "json",
    type: "put",
    contentType: "application/json",
    data: JSON.stringify(datos),
    processData: false,
  })
    .done((respuesta) => {
      if (respuesta.data.ok) {
        swal("Excelente", "¡Registro modificado correctamente!", "success");
        RecargarDataTableOpciones();
        $("#ModificarOpcionesPredefinidas").modal("hide");
        LimpiarFormOpciones("#txtOpcionEdit", "#txtCategoriaEdit");
      } else {
        swal(
          "Error al modificar",
          "Ha ocurrido un error al modificar, intenta de nuevo",
          "error"
        );
      }
    })
    .fail((error) => {
      console.log(error);
    });
};

$("#FormOpcionesPredefinidasEdit").validate({
  submitHandler: function () {
    EditarOpcionesPredefinidas();
  },
  rules: {
    txtOpcionEdit: {
      required: true,
      maxlength: 255,
    },
    txtCategoriaEdit: "required",
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
