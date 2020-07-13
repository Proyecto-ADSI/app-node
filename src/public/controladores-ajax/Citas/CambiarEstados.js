var Citas2 = null;
var EstadoModal = null;



$("#CitasDataTable tbody").on("click", "#Verificar", function () {
   Citas2 = DataTableCitas.row($(this).parents("tr")).data();

  let DataCitas = {
    Id_Cita: parseInt(Citas2.Id_Cita),
    Estado: 4,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "patch",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(DataCitas),
    processData: false,
    success: function (data) {
      RecargarDataTable();
      GuardarFilaSeleccionada = [];
    },
    error: function (error) {
      console.log(error);
    },
  });
});
$("#CitasDataTable tbody").on("click", "#Invalida", function () {
   Citas2 = DataTableCitas.row($(this).parents("tr")).data();
   EstadoModal = 12

  let DataCitas = {
    Id_Cita: parseInt(Citas2.Id_Cita),
    Estado: 12,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "patch",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(DataCitas),
    processData: false,
    success: function (data) {
      RecargarDataTable();
      GuardarFilaSeleccionada = [];
      $("#Novedades-Modal").modal("show");
    },
    error: function (error) {
      console.log(error);
    },
  });
});

$("#CitasDataTable tbody").on("click", "#Desarrollo", function () {
   Citas2 = DataTableCitas.row($(this).parents("tr")).data();

  let DataCitas = {
    Id_Cita: parseInt(Citas2.Id_Cita),
    Estado: 8,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "patch",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(DataCitas),
    processData: false,
    success: function (data) {
      RecargarDataTable();
      GuardarFilaSeleccionada = [];
    },
    error: function (error) {
      console.log(error);
    },
  });
});

$("#CitasDataTable tbody").on("click", "#Realizada", function () {
   Citas2 = DataTableCitas.row($(this).parents("tr")).data();

  let DataCitas = {
    Id_Cita: parseInt(Citas2.Id_Cita),
    Estado: 9,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "patch",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(DataCitas),
    processData: false,
    success: function (data) {
      RecargarDataTable();
      GuardarFilaSeleccionada = [];
    },
    error: function (error) {
      console.log(error);
    },
  });
});

$("#CitasDataTable tbody").on("click", "#Reagendada", function () {
   Citas2 = DataTableCitas.row($(this).parents("tr")).data();
   EstadoModal = 16

  let DataCitas = {
    Id_Cita: parseInt(Citas2.Id_Cita),
    Estado: 16,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "patch",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(DataCitas),
    processData: false,
    success: function (data) {
      RecargarDataTable();
      GuardarFilaSeleccionada = [];
      $("#Novedades-Modal").modal("show");
    },
    error: function (error) {
      console.log(error);
    },
  });
});

$("#CitasDataTable tbody").on("click", "#Cancelada", function () {
  Citas2 = DataTableCitas.row($(this).parents("tr")).data();
  EstadoModal = 14

  let DataCitas = {
    Id_Cita: parseInt(Citas2.Id_Cita),
    Estado: 14,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "patch",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(DataCitas),
    processData: false,
    success: function (data) {
      RecargarDataTable();
      GuardarFilaSeleccionada = [];
      $("#Novedades-Modal").modal("show");
    },
    error: function (error) {
      console.log(error);
    },
  });
});

let RegistrarNovedad = () =>{

  let Novedades = {
    Id_Novedad: null,
    Descripcion: $("#Novedad").val(),
    Estado_Novedad: EstadoModal,
    Id_Cita: parseInt(Citas2.Id_Cita),
  };

  $.ajax({
    url: `${URL}/Novedades`,
    type: "post",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(Novedades),
    processData: false,
    success: function (data) {
      swal("Excelente", "Novedad registrada exitosamente", "success");
      $("#Novedades-Modal").modal("hide");
    },
    error: function (error) {
      console.log(error);
    },
  });
}


$(function (){



  $("#Novedades_Form").validate({
      submitHandler: function(){
              RegistrarNovedad();
              RecargarDataTable();

              $("#Novedad").val("");

              $("#Novedades_Form .form-group").removeClass("has-success")
              $("#Novedades_Form .form-control").removeClass("form-control-sucess")
      },
      rules:{
          Novedadd: {
              required:true,
              SoloAlfanumericos:true,
              minlength:5,
              maxlength:45
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
      },
      errorPlacement: function (error, element) {
              error.insertAfter(element.parent(".input-group"));
          
      }
      
  });
})
