ObtenerCliente = (Id_Cliente, Modal) => {
  $.ajax({
    url: `${URL}/Cliente/${Id_Cliente}`,
    type: "get",
    datatype: "json",
    success: function (datos) {
      if (Modal == 1) {
        CargarDatosModalDetalles(datos.data);
      } else if (Modal == 2) {
        sessionStorage.DatosEditarCliente = JSON.stringify(datos.data);
        location.href = "/App/Admin/Directorio/Editar";
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

$(function () {
  if (sessionStorage.IdRegistroNotificacion) {
    OcultarContador();
    let Id_Cliente = parseInt(sessionStorage.getItem("IdRegistroNotificacion"));
    ObtenerCliente(Id_Cliente, 1);
    sessionStorage.removeItem("IdRegistroNotificacion");
    CambiarEstadoVisitaNotificacion();
  }
  DataTable = $("#ClientesDataTable").DataTable({
    cache: true,
    ajax: {
      url: `${URL}/Cliente`,
      error: function (error) {
        console.log("Eror al listar clientes " + error);
      },
      // success: function(datos){
      //     console.log(datos)
      // }
    },
    aoColumns: [
      { mData: "Id_Cliente", sClass: "MyStyle_Id_Principal_Column" },
      { mData: "NIT_CDV" },
      { mData: "Razon_Social" },
      { mData: "Telefono" },
      { mData: "Operador" },
      { mData: "Corporativo" },
      { mData: "Municipio" },
      {
        defaultContent: `

                  
                    <input type="checkbox" id="switch_cliente" class="js-switch"/>

                    <button id="btnDetalles" class="btn btn-primary" title="Detalles">
                        <i class="fa  fa-eye"></i>
                    </button>
                    
                    <button id="btnEditar" class="btn btn-info" title="Editar">
                        <i class="fa fa-pencil"></i>
                    </button>
                    
                    <button id="btnEliminar" class="btn btn-danger"  title="Eliminar">
                        <i class="fa fa-close"></i> 
                    </button>

                    
            `,
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

  // Habilitar los tooltips
  InicializarToltips();
  // Importar archivo de clientes.
  $("#archivoClientes").dropify();
});

// Cargar Modal
// 1 -> Detalles
// 2 -> Editar

// Detalles - abrir modal y cargar datos
$(document).on("click", "#btnDetalles", function () {
  fila = $(this).closest("tr");

  Id_Cliente = parseInt(fila.find("td:eq(0)").text());

  ObtenerCliente(Id_Cliente, 1);
});

// Editar - abrir modal y cargar datos
$(document).on("click", "#btnEditar", function () {
  fila = $(this).closest("tr");

  Id_Cliente = parseInt(fila.find("td:eq(0)").text());

  ObtenerCliente(Id_Cliente, 2);
});

// Cambiar estado -> Inhabilitar/Habilitar

$(document).on("click", ".switchery ", function () {
  let fila = $(this).closest("tr");
  let switchElem = fila.find(".js-switch")[0];
  let Id_Cliente_Estado = parseInt(fila.find("td:eq(0)").text());

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
  fila = $(this).closest("tr");

  Id_Cliente = parseInt(fila.find("td:eq(0)").text());

  EliminarCliente(Id_Cliente);
});

Recargar_CE_DataTable = () => {
  DataTable.ajax.reload();
};
