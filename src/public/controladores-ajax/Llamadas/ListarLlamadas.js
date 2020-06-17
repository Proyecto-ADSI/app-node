// ObtenerCliente = (Id_Cliente, Modal) => {
//   $.ajax({
//     url: `${URL}/Cliente/${Id_Cliente}`,
//     type: "get",
//     datatype: "json",
//     success: function (datos) {
//       if (Modal == 1) {
//         CargarDatosModalDetalles(datos.data);
//       } else if (Modal == 2) {
//         sessionStorage.DatosEditarCliente = JSON.stringify(datos.data);
//         location.href = "/App/Admin/Directorio/Editar";
//       }
//     },
//     error: function (error) {
//       console.log(error);
//     },
//   });
// };

$(function () {
  ObtenerSession().then((data) => {
    Id_Rol = parseInt(data.session.Id_Usuario);

    // Ver registro después de click en notificacion notificación.
    // if (sessionStorage.IdRegistroNotificacion) {
    //   OcultarContador();
    //   let Id_Cliente = parseInt(
    //     sessionStorage.getItem("IdRegistroNotificacion")
    //   );
    //   ObtenerCliente(Id_Cliente, 1);
    //   sessionStorage.removeItem("IdRegistroNotificacion");
    //   CambiarEstadoVisitaNotificacion();
    // }

    DataTable = $("#LlamadasDataTable").DataTable({
      cache: true,
      ajax: {
        url: `${URL}/Llamadas`,
        error: function (error) {
          console.log("Eror al listar clientes " + error);
        },
        // success: function(datos){
        //     console.log(datos)
        // }
      },
      columns: [
        {
          data: "NIT_CDV",
        },
        {
          data: "Razon_Social",
        },
        {
          data: "Nombre_Municipio",
        },
        {
          data: "Fecha_Llamada",
        },
        {
          data: "Usuario",
        },
        {
          data: "Estado_Llamada",
          render: function (data, datatype, row) {
            if (datatype === "display") {
              let color = null;
              let id = parseInt(row.Id_Estado_Llamada);
              switch (id) {
                case 1:
                  color = "#ef5350";
                  break;
                case 2:
                  color = "#5c4ac7";
                  break;
                case 3:
                  color = "#00897b";
                  break;
              }

              return `
                <div class="text-center">
                    <div class="label label-table text-center" style="background-color:${color}">
                        ${data}
                    </div>
                </div>
              `;
            } else {
              return row.Id_Estado_Llamada;
            }
          },
        },
        {
          data: "Id_Llamada",
          render: function (data, datatype) {
            if (datatype === "display") {
              return `
                <div class="text-center">
                  <button id="btnDetalles" class="btn btn-sm btn-primary" title="Detalles">
                    <i class="fa  fa-eye"></i>
                  </button>
                </div>
                
              `;
            } else {
              return data;
            }
          },
        },
      ],
      language: {
        lengthMenu: "Mostrar _MENU_ registros",
        zeroRecords: "No se encontraron resultados",
        info:
          "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
        infoFiltered: "(filtrado de un total de _MAX_ registros)",
        sSearch: "Buscar:",
        oPaginate: {
          sFirst: "Primero",
          sLast: "Último",
          sNext: "Siguiente",
          sPrevious: "Anterior",
        },
        sProcessing: "Procesando...",
      },
    });
  });

  // Habilitar los tooltips
  InicializarToltips();
});

// Cargar Modal
// 1 -> Detalles

// Detalles - abrir modal y cargar datos
$(document).on("click", "#btnDetalles", function () {
  let datosCliente = DataTable.row($(this).parents("tr")).data();
  CargarDatosModalDetalles(datosCliente);
});

$("#Filtro_NIT").on("keyup", function () {
  DataTable.columns(0).search(this.value).draw();
});

$("#Filtro_RazonSocial").on("keyup", function () {
  DataTable.columns(1).search(this.value).draw();
});

$("#Filtro_Municipio").on("keyup", function () {
  DataTable.columns(2).search(this.value).draw();
});

$("#Filtro_Fecha").on("keyup", function () {
  DataTable.columns(3).search(this.value).draw();
});

$("#Filtro_Usuario").on("keyup", function () {
  DataTable.columns(4).search(this.value).draw();
});
$("#Filtro_Estado").on("change", function () {
  DataTable.columns(5).search(this.value).draw();
});

let LimpiarFiltro = () => {
  $("#Filtro_NIT").val("");
  $("#Filtro_RazonSocial").val("");
  $("#Filtro_Municipio").val("");
  $("#Filtro_Fecha").val("");
  $("#Filtro_Usuario").val("");
  $("#Filtro_Estado").val("");

  DataTable.columns().search("").draw();
};
