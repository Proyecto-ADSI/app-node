$(function () {
  ObtenerSession().then((data) => {
    Id_Usuario = data.session.Id_Usuario;

    DataTableAsignacionC = $("#AsignacionContactDataTable").DataTable({
      ajax: {
        url: `${URL}/Asignacion/ObtenerEmpresas/${Id_Usuario}`,
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
          data: "Telefono",
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
          data: "Corporativo",
          render: function (data, datatype) {
            if (datatype === "display") {
              let color = null;

              if (data == "Si") {
                color = "#00897b";
              } else {
                color = "#ef5350";
              }

              return `
                    <div class="text-center">
                        <div class="label label-table text-center" style="background-color:${color}">
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
          data: "Nombre_Municipio",
        },
        {
          data: "Id_Cliente",
          render: function (data, datatype) {
            if (datatype === "display") {
              return `
                    <button id="btnDetalles" class="btn btn-sm btn-primary" title="Detalles">
                        <i class="fa  fa-eye"></i>
                    </button>
                    <button id="btnLlamar" class="btn btn-sm btn-primary" title="Llamar">
                        <i class="fa  fa-phone"></i>
                    </button>
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

$(document).on("click", "#btnDetalles", function () {
  let datosCliente = DataTableAsignacionC.row($(this).parents("tr")).data();
  CargarDatosModalDetalles(datosCliente);
});

$(document).on("click", "#btnLlamar", function () {
  let datosCliente = DataTableAsignacionC.row($(this).parents("tr")).data();
  sessionStorage.ClientePrecargado = JSON.stringify(datosCliente);
  Redireccionar("/Llamadas/RegistrarP");
});