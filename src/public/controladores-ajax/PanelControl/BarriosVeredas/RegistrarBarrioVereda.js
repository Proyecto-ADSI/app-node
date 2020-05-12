let RegistrarBarrioVereda = () => {
  let datos = {
    Codigo: $("#TxtCodigo").val(),
    Nombre: $("#TxtBarrioVereda").val(),
    Id_SubTipo_Barrio_Vereda: parseInt(
      $("#SelectSubTipo1 option:selected").val()
    ),
    Id_Municipio: parseInt($("#SelectMunicipio1 option:selected").val()),
    Estado: parseInt(1),
  };

  $.ajax({
    url: `${URL}/BarriosVeredas`,
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
            text: "Barrio o vereda registrado correctamente",
            type: "success",
            confirmButtonClass: "btn-success",
            confirmButtonText: "Ok",
          },
          function () {
            $("#TxtCodigo").val("");
            $("#TxtBarrioVereda").val("");
            $("#SelectSubTipo1").val("");
            $("#SelectMunicipio1").val("");
            ListarBarrioVereda();
          }
        );
      } else {
        swal(
          {
            title: "Error",
            text: "Error al registrar",
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
          text: "Error al registrar",
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

let ListarSubTipo1 = () => {
  $.ajax({
    url: `${URL}/SubTipo`,
    dataType: "json",
    type: "GET",
  })
    .done((respuesta) => {
      $("#SelectSubTipo1").empty();
      $("#SelectSubTipo1").append(`

        <option selected disabled value="">Seleccione un sub tipo</option>

            `);
      for (let item of respuesta.data) {
        $("#SelectSubTipo1").append(`
                <option value='${item.Id_SubTipo_Barrio_Vereda}'>${item.SubTipo}</option> 
              `);
      }
    })
    .fail((error) => {
      console.log(error);
    });
};


$(function () {
  $("#FormBarrioVereda").validate({
    submitHandler: function () {
      RegistrarBarrioVereda();
    },
    rules: {
      Codigo: {
        required: true,
        SoloNumeros: true,
        minlength: 2,
        maxlength: 45,
      },
      BarrioVereda: {
        required: true,
        SoloAlfanumericos: true,
        minlength: 2,
        maxlength: 45,
      },
      SeleSubTipo1: {
        required: true,
      },
      SeleMunicipio1: {
        required: true,
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

