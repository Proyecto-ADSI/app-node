$(function () {
  ObtenerSession().then((data) => {
    let Id_Usuario = data.session.Id_Usuario;

    DataTableNotificaciones = $("#NotificacionsDataTable").DataTable({
      ajax: {
        url: `${URL}/Notificaciones/${Id_Usuario}`,
        error: function (error) {
          console.log("Eror al listar Notificacions " + error);
        },
        // success: function(res){
        //     console.log(res)
        // }
      },
      columns: [
        {
          data: "Usuario",
          render: function (data, datatype, row) {
            if (datatype === "display") {
              return `
                            <div class="row">
                               <div class="col-md-3">
                                   <span class="round MyStyle_FondoRound">
                                    <img src="/assets/images/usuarios/${row.Imagen}" alt="user" width="50">
                                   </span>
                               </div>
                               <div class="col-md-4">
                                   <h6>${data}</h6><small class="text-muted">${row.Nombre_Rol}</small>
                               </div>
                           </div>
                            `;
            } else {
              return data;
            }
          },
        },
        {
          data: "Fecha_Notificacion",
        },
        {
          data: "Categoria",
          render: function (data, datatype, row) {
            if (datatype === "display") {
              // Colores
              // Rojo
              let usuarios = "#D3180F ";
              // Azul
              let clientes = "#165CE9";
              // Violeta
              let llamadas = "#6F12E5";
              // Verde
              let citas = "#08942C ";
              // Naranja
              let visitas = "#D2960D ";

              let Id_Categoria = parseInt(row.Id_Categoria_N);
              let color = null;
              switch (Id_Categoria) {
                case 1:
                  color = usuarios;
                  break;
                case 2:
                  color = clientes;
                  break;
                case 3:
                  color = llamadas;
                  break;
                case 4:
                  color = citas;
                  break;
                case 5:
                  color = visitas;
                  break;
                default:
                  color = "#0DB0BA";
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
              return data;
            }
          },
        },
        {
          data: "Mensaje",
        },
        {
          data: "Id_NU",
          render: function (data, datatype, row) {
            if (datatype === "display") {
              return `
                            <div title="Editar" class="text-center d-inline-block">
                                <button id="btnEditar" id_nu="${data}" id_categoria="${row.Id_Categoria_N}" id_notificacion_registro="${row.Id_Registro}"
                                    class="btn btn-sm btn-primary">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </div>
                            <div title="Eliminar" class="text-center d-inline-block">
                                <button id="btnEliminar" id_notificacion="${data}"  class="btn btn-sm btn-danger">
                                    <i class="fa fa-close"></i>
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
});

// Editar Notificacions y empleado
$(document).on("click", "#btnEditar", function () {
  let IdNU = parseInt($(this).attr("id_nu"));
  let IdCategoria = parseInt($(this).attr("id_categoria"));
  let IdRegistroNotificacion = $(this).attr("id_notificacion_registro");
  VerDetalleNotificacion(IdRegistroNotificacion, IdNU, IdCategoria);
});
// Eliminar Notificacions y empleado
$(document).on("click", "#btnEliminar", function () {
  let id_notificacion = parseInt($(this).attr("id_notificacion"));
  EliminarNotificacion(id_notificacion);
});
