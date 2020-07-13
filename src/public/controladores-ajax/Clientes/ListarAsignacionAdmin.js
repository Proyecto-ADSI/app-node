$(function () {
  DataTableAsignacion = $("#AsignacionDataTable").DataTable({
    ajax: {
      url: `${URL}/Asignacion`,
      error: function (error) {
        console.log("Eror al listar " + error);
      },
      //   success: function (res) {
      //     console.log(res);
      //   },
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
                          <img src="${URL}/Images/Usuarios/${row.Imagen}" alt="user" width="50">
                      </span>
                    </div>
                    <div class="col-md-4">
                      <h6>${data}</h6><small class="text-muted">${row.Celular}</small>
                    </div>
                  </div>
                `;
          } else {
            return data;
          }
        },
      },
      {
        data: "Nombre",
      },
      {
        data: "Cantidad_Empresas",
        render: function (data, datatype, row) {
          if (datatype === "display") {
            return `
                    <div class="text-center">
                        <div class="label label-table text-center fondo-verde cantidad_empresas">
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
        data: "Id_Usuario",
        render: function (data, datatype, row) {
          if (datatype === "display") {
            return `
                              <div class="text-center">
                                <div title="Ver empresas" class="text-center d-inline-block">
                                        <button id="btnDetalles" class="btn btn-sm btn-primary">
                                            <i class="fa fa-eye"></i>
                                        </button>
                                    </div>
                                    <div title="Eliminar" class="text-center d-inline-block">
                                        <button id="btnEliminar"  class="btn btn-sm btn-danger">
                                            <i class="fa fa-close"></i>
                                        </button>
                                    </div>
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

  //   DataTable empresas asignadas
  DataTableEmpresasAsignadas = $("#EmpresasAsignadasDataTable")
    .DataTable({
      columns: [
        {
          // NIT
          render: function (data, datatype, row) {
            return data;
          },
        },
        {
          // Razón social
          render: function (data, datatype, row) {
            return data;
          },
        },
        {
          // Teléfono
          render: function (data, datatype, row) {
            return data;
          },
        },
        {
          // Fecha asignación
          render: function (data, datatype, row) {
            return data;
          },
        },
        {
          // data: "Id_Cliente",
          render: function (data, datatype) {
            if (datatype === "display") {
              return `
              <div class="text-center">
                <button id="btnEliminar" class="btn btn-sm btn-danger"  title="Eliminar asignación">
                  <i class="fa fa-close"></i> 
                </button>
              <div>
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
    })
    // .columns.adjust()
    // .responsive.recalc();

    // $("#ModalDetallesAsignacion").on("shown.bs.modal",function(){
    //   DataTableEmpresasAsignadas.responsive.recalc();
    // });
});

// Editar Notificacions y empleado
$(document).on("click", "#btnDetalles", function () {
  let datos = DataTableAsignacion.row($(this).parents("tr")).data();
  let empresas = datos.Empresas;
  console.log(empresas);
  DataTableEmpresasAsignadas.clear().draw();
  for(let empresa of empresas){
    let data = [
      empresa.NIT_CDV,
      empresa.Razon_Social,
      empresa.Telefono,
      empresa.Fecha_Control,
      empresa.Id_Cliente,
    ];
    DataTableEmpresasAsignadas.row.add(data).draw();
  }
  $("#ModalDetallesAsignacion").modal("show");
});


//   // Eliminar Notificacions y empleado
//   $(document).on("click", "#btnEliminar", function () {
//     let id_notificacion = parseInt($(this).attr("id_notificacion"));
//     EliminarNotificacion(id_notificacion);
//   });
