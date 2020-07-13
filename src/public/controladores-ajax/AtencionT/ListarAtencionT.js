$(function () {
  ATDataTable = $("#ATDataTable").DataTable({
    cache: true,
    ajax: {
      url: `${URL}/AtencionTel`,
      error: function (error) {
        console.log("Eror al listar " + error);
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
        data: "Fecha_Llamada",
        render: function (data, datatype, row) {
          if (datatype === "display") {
            return data;
          } else {
            return row.Fecha_Filtro;
          }
        },
      },
      {
        data: "Usuario",
      },
      {
        data: "Medio_Envio",
        render: function (data, datatype, row) {
          if (datatype === "display") {
            let texto = null;
            let medio = parseInt(data);
            switch (medio) {
              case 1:
                texto = `
                    <i class="mdi mdi-email"></i> Correo
                `;
                break;
              case 2:
                texto = `
                <i class="mdi mdi-whatsapp"></i> Whatsapp
            `;
                break;
              case 3:
                texto = `
                    <i class="mdi mdi-email"></i> Correo <i class="mdi mdi-whatsapp"></i> Whatsapp
                    `;
                break;
            }
            return `
                  <div class="text-center">
                      <div class="label label-table text-center fondo-verde">
                          ${texto}
                      </div>
                  </div>
                `;
          } else {
            return data;
          }
        },
      },
      {
        data: "Nombre_Operador",
        render: function (data, datatype, row) {
          if (datatype === "display") {
            return `
              <div class="text-center">
                  <div class="label label-table text-center" style="background-color:${row.Color}">
                      ${data}
                  </div>
              </div>
            `;
          } else {
            return data;
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

  // Habilitar los tooltips
  InicializarToltips();
});

$(document).on("click", "#btnDetalles", function () {
  let datosCliente = ATDataTable.row($(this).parents("tr")).data();
  CargarDatosModalDetalles(datosCliente);
});

$("#Filtro_NIT").on("keyup", function () {
  ATDataTable.columns(0).search(this.value).draw();
});

$("#Filtro_RazonSocial").on("keyup", function () {
  ATDataTable.columns(1).search(this.value).draw();
});

$("#Filtro_Fecha").on("keyup", function () {
  ATDataTable.columns(2).search(this.value).draw();
});

$("#Filtro_Usuario").on("keyup", function () {
  ATDataTable.columns(3).search(this.value).draw();
});

$("#Filtro_MedioE").on("change", function () {
    ATDataTable.columns(4).search(this.value).draw();
  });

$("#Filtro_Operador").on("keyup", function () {
  ATDataTable.columns(5).search(this.value).draw();
});

let LimpiarFiltro = () => {
  $("#Filtro_NIT").val("");
  $("#Filtro_RazonSocial").val("");
  $("#Filtro_Fecha").val("");
  $("#Filtro_Usuario").val("");
  $("#Filtro_MedioE").val("");
  $("#Filtro_Operador").val("");

  ATDataTable.columns().search("").draw();
};
