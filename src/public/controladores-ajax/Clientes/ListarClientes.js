ObtenerCliente = (Id_Cliente) => {
  $.ajax({
    url: `${URL}/Cliente/${Id_Cliente}`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      CargarDatosModalDetalles(datos.data);
    },
    error: function (error) {
      console.log(error);
    },
  });
};

$(function () {
  ObtenerSession().then((data) => {
    Id_Rol = parseInt(data.session.Id_Rol);

    // Ver registro después de click en notificacion notificación.
    if (sessionStorage.IdRegistroNotificacion) {
      OcultarContador();
      let Id_Cliente = parseInt(
        sessionStorage.getItem("IdRegistroNotificacion")
      );
      ObtenerCliente(Id_Cliente, 1);
      sessionStorage.removeItem("IdRegistroNotificacion");
      CambiarEstadoVisitaNotificacion();
    }
    DataTable = $("#ClientesDataTable").DataTable({
      ajax: {
        url: `${URL}/Cliente`,
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
              let btns = null;

              switch (Id_Rol) {
                case 1:
                  //Administrador
                  btns = `
                    <input type="checkbox" id="switch_cliente" class="js-switch"/>
    
                    <button id="btnDetalles" class="btn btn-sm btn-primary" title="Detalles">
                        <i class="fa  fa-eye"></i>
                    </button>
                    
                    <button id="btnEditar" class="btn btn-sm btn-info" title="Editar">
                        <i class="fa fa-pencil"></i>
                    </button>
                    
                    <button id="btnEliminar" class="btn btn-sm btn-danger"  title="Eliminar">
                        <i class="fa fa-close"></i> 
                    </button>
                  `;
                  break;
                case 2:
                  //Coordinador
                  btns = `
                    <button id="btnDetalles" class="btn btn-sm btn-primary" title="Detalles">
                        <i class="fa  fa-eye"></i>
                    </button>
                    
                    <button id="btnEditar" class="btn btn-sm btn-info" title="Editar">
                        <i class="fa fa-pencil"></i>
                    </button>
                   
                  `;
                  break;
                case 3:
                  //Contact center
                  btns = `
                    <button id="btnDetalles" class="btn btn-sm btn-primary" title="Detalles">
                        <i class="fa  fa-eye"></i>
                    </button>
                  
                  `;
                  break;
              }
              return btns;
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
      createdRow: function (row, data, index) {
        let Estado_Cliente = parseInt(data.Estado_Cliente);
        let switchElem = Array.prototype.slice.call($(row).find(".js-switch"));
        switchElem.forEach(function (html) {
          let s = new Switchery(html, {
            color: "#26c6da",
            secondaryColor: "#f62d51",
            size: "small",
          });

          if (Estado_Cliente == 0) {
            s.setPosition(false, true);
          } else if (Estado_Cliente == 1) {
            s.setPosition(true, true);
          }
        });
      },
    });
  });

  // Habilitar los tooltips
  InicializarToltips();
  // Importar archivo de clientes.
  $("#archivoClientes").dropify();

  // Inicializar filtros
  $("#Filtro_Operador").select2({
    placeholder: "Seleccione un operador...",
    allowClear: true,
    containerCssClass: "form-control custom-select",
    minimumInputLength: 2,
    ajax: {
      url: `${URL}/Empleados`,
      dataType: "json",
      delay: 250,
      type: "get",
      data: function (params) {
        var query = {
          texto: params.term,
        };
        return query;
      },
      processResults: function (respuesta) {
        return {
          results: respuesta.data.results,
        };
      },
      cache: true,
    },
  });
});

// Cargar Modal
// 1 -> Detalles
// 2 -> Editar

// Detalles - abrir modal y cargar datos
$(document).on("click", "#btnDetalles", function () {
  let datosCliente = DataTable.row($(this).parents("tr")).data();
  CargarDatosModalDetalles(datosCliente);
});

// Editar - abrir modal y cargar datos
$(document).on("click", "#btnEditar", function () {
  let datosCliente = DataTable.row($(this).parents("tr")).data();
  sessionStorage.DatosEditarCliente = JSON.stringify(datosCliente);
  Redireccionar("/Directorio/Editar");
});

// Cambiar estado -> Inhabilitar/Habilitar
$(document).on("click", ".switchery ", function () {
  let fila = $(this).closest("tr");
  let switchElem = fila.find(".js-switch")[0];

  let datosCliente = DataTable.row($(this).parents("tr")).data();
  let Id_Cliente_Estado = datosCliente.Id_Cliente;

  // Cambiar Estado Cliente
  let Estado;
  if (switchElem.checked) {
    Estado = 1;
  } else {
    Estado = 0;
  }

  $.ajax({
    url: `${URL}/Cliente/CambiarEstado/${Id_Cliente_Estado}/${Estado}`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      if (datos.data.ok) {
        Recargar_CE_DataTable();
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
});

// Eliminar - abrir modal y cargar datos
$(document).on("click", "#btnEliminar", function () {
  let datosCliente = DataTable.row($(this).parents("tr")).data();
  let Id_Cliente = datosCliente.Id_Cliente;
  EliminarCliente(Id_Cliente);
});

Recargar_CE_DataTable = () => {
  DataTable.ajax.reload();
};

$("#Filtro-DirectorioNit").on("keyup", function () {
  DataTable.columns(0).search(this.value).draw();
});

$("#Filtro-DirectorioRazon").on("keyup", function () {
  DataTable.columns(1).search(this.value).draw();
});

$("#Filtro-DirectorioTele").on("keyup", function () {
  DataTable.columns(2).search(this.value).draw();
});

$("#Filtro-DirectorioOp").on("keyup", function () {
  DataTable.columns(3).search(this.value).draw();
});

$("#Filtro-DirectorioCorpo").on("keyup", function () {
  DataTable.columns(4).search(this.value).draw();
});
$("#Filtro-DirectorioMuni").on("keyup", function () {
  DataTable.columns(5).search(this.value).draw();
});

let LimpiarFiltroDirec = () => {
  $("#Filtro-DirectorioRazon").val("");
  $("#Filtro-DirectorioTele").val("");
  $("#Filtro-DirectorioNit").val("");
  $("#Filtro-DirectorioOp").val("");
  $("#Filtro-DirectorioCorpo").val("");
  $("#Filtro-DirectorioMuni").val("");

  DataTable.columns().search("").draw();
};
