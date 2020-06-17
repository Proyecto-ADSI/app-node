var Citas7 = null;

// $("#CitasDataTable tbody").on("click", "#SinRecordar", function () {
//   let Citas = DataTableCitas.row($(this).parents("tr")).data();

//   let DataCitas = {
//     Id_Cita: parseInt(Citas.Id_Cita),
//     Estadovg: 2,
//   };

//   $.ajax({
//     url: `${URL}/Citas/CambioEstado`,
//     type: "put",
//     dataType: "json",
//     contentType: "application/json",
//     data: JSON.stringify(DataCitas),
//     processData: false,
//     success: function (data) {
//       RecargarDataTable();
//       GuardarFilaSeleccionada = [];
//     },
//     error: function (error) {
//       console.log(error);
//     },
//   });
// });

// $("#CitasDataTable tbody").on("click", "#SinGestionar", function () {
//   let Citas1 = DataTableCitas.row($(this).parents("tr")).data();

//   let DataCitas = {
//     Id_Cita: parseInt(Citas1.Id_Cita),
//     Estadovg: 4,
//   };

//   $.ajax({
//     url: `${URL}/Citas/CambioEstado`,
//     type: "put",
//     dataType: "json",
//     contentType: "application/json",
//     data: JSON.stringify(DataCitas),
//     processData: false,
//     success: function (data) {
//       RecargarDataTable();
//       GuardarFilaSeleccionada = [];
//     },
//     error: function (error) {
//       console.log(error);
//     },
//   });
// });
$("#CitasDataTable tbody").on("click", "#Verificar", function () {
  let Citas2 = DataTableCitas.row($(this).parents("tr")).data();

  let DataCitas = {
    Id_Cita: parseInt(Citas2.Id_Cita),
    Estadovg: 4,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "put",
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
  let Citas3 = DataTableCitas.row($(this).parents("tr")).data();

  let DataCitas = {
    Id_Cita: parseInt(Citas3.Id_Cita),
    Estadovg: 13,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "put",
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
  let Citas4 = DataTableCitas.row($(this).parents("tr")).data();

  let DataCitas = {
    Id_Cita: parseInt(Citas4.Id_Cita),
    Estadovg: 8,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "put",
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
  let Citas5 = DataTableCitas.row($(this).parents("tr")).data();

  let DataCitas = {
    Id_Cita: parseInt(Citas5.Id_Cita),
    Estadovg: 9,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "put",
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
  let Citas6 = DataTableCitas.row($(this).parents("tr")).data();

  let DataCitas = {
    Id_Cita: parseInt(Citas6.Id_Cita),
    Estadovg: 17,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "put",
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
  Citas7 = DataTableCitas.row($(this).parents("tr")).data();

  let DataCitas = {
    Id_Cita: parseInt(Citas7.Id_Cita),
    Estadovg: 14,
  };

  $.ajax({
    url: `${URL}/Citas/CambioEstado`,
    type: "put",
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

$("#Novedades-Enviar").on("click", function () {
  let Novedades = {
    Id_Novedad: null,
    Descripcion: $("#Novedad").val(),
    Estado_Novedad: parseInt(1),
    Id_Cita: parseInt(Citas7.Id_Cita),
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
});
