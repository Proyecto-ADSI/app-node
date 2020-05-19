ObtenerCliente = (Id_Cliente) => {
    $.ajax({
      url: `${URL}/Cliente/${Id_Cliente}`,
      type: "get",
      datatype: "json",
      success: function (datos) {
        CargarDatosModalDetalles(datos);
      },
      error: function (error) {
        console.log(error);
      },
    });
  };
  
  $(function () {
  
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

                      <button id="btnDetalles" class="btn btn-outline-primary" title="Detalles">
                          <i class="fa  fa-eye"></i>
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
      }
    });
  
    // Habilitar los tooltips
    InicializarToltips();
  });
  
  // Cargar Modal
  // 1 -> Detalles
  // 2 -> Editar
  
  // Detalles - abrir modal y cargar datos
  $(document).on("click", "#btnDetalles", function () {
    fila = $(this).closest("tr");
  
    Id_Cliente = parseInt(fila.find("td:eq(0)").text());
  
    ObtenerCliente(Id_Cliente);
  });
  
  