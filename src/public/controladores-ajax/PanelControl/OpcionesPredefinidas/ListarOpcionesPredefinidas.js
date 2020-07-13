let ListarOpcionesPredefinidas = () => {
  DataTableOpciones = $("#DataTableOpciones")
    .DataTable({
      responsive: true,
      ajax: {
        url: `${URL}/OpcionesPredefinidas`,
        error: function (error) {
          console.log("Eror al listar clientes " + error);
        },
        // success: function(datos){
        //     console.log(datos)
        // }
      },
      columns: [
        {
          data: "Categoria",
          // render: function (data, type, row) {
          //   return data;
          // },
        },
        {
          data: "Opcion",
          render: function (data, type, row) {
            if (type === "display") {
              let newString = "";
              if (data.length > 30) {
                newString = data.substring(0, 30);
                newString = newString + "...";
                return newString;
              } else {
                return data;
              }
            } else {
              return row.Opcion;
            }
          },
        },
        {
          data: "Id_OP",
          render: function (data, type, row) {
            if (type === "display") {
              return `
                  <button type="button" id="EditarOpcionesPredefinidas"
                    class="btn btn-info btn-sm"> <i class="fa fa-pencil"></i>
                  </button>
                  <button type="button" id="EliminarOpcionesPredefinidas"
                    class="btn btn-danger btn-sm"><i class="fa fa-close"></i>
                  </button>
                `;
            } else {
              return row.Categoria;
            }
          },
        },
      ],
      columnDefs: [
        { responsivePriority: 1, targets: 0 },
        { responsivePriority: 2, targets: -1 },
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
    .columns.adjust()
    .responsive.recalc();
};

$(document).ready(function () {
  $("#OpcionesPredefinidasTab").click(function () {
    // Comprobar si el data table ya está instanciado.
    if ($.fn.DataTable.isDataTable("#DataTableOpciones")) {
      RecargarDataTableOpciones();
    } else {
      ListarOpcionesPredefinidas();
    }

    Categorias = `
      <option value="Seleccione" selected disabled>
          Seleccione...
      </option>
      <option value="Operador">Operador</option>
      <option value="Llamada">Llamada</option>
      <option value="Visita">Visita</option>
      <option value="País LDI">País LDI</option>
      <option value="Servicios ilimitados">Servicios ilimitados</option>
      <option value="Servicios adicionales">Servicios adicionales</option>
      <option value="Aclaraciones oferta">Aclaraciones oferta</option>
      <option value="Notas oferta">Notas oferta</option>
  `;
  });
  $("#tab2_Opciones").click(function () {
    LimpiarFormOpciones("#txtOpcion", "#txtCategoria");
  });
});

$(document).on("click", "#EditarOpcionesPredefinidas", function () {
  let data = DataTableOpciones.row($(this).parents("tr")).data();
  CargarModalEditarOpciones(data);
});

$(document).on("click", "#EliminarOpcionesPredefinidas", function () {
  let data = DataTableOpciones.row($(this).parents("tr")).data();
  let Id_OP = data.Id_OP;
  EliminarOpcionesPredefinidas(Id_OP);
});

let RecargarDataTableOpciones = () => {
  DataTableOpciones.ajax.reload();
};

let LimpiarFormOpciones = (campo1, campo2) => {
  $(campo1).val("");
  $(campo1).removeClass("form-control-success");
  $(campo1).parent().removeClass("has-success");
  $(campo1).removeClass("form-control-danger");
  $(campo1).parent().removeClass("has-danger");
  $(campo2).empty();
  $(campo2).append(Categorias);
  $(campo2).removeClass("form-control-success");
  $(campo2).parent().removeClass("has-success");
  $(campo2).removeClass("form-control-danger");
  $(campo2).parent().removeClass("has-danger");
};

$("#ModificarOpcionesPredefinidas").on("hidden.bs.modal", function (e) {
  LimpiarFormOpciones("#txtOpcionEdit", "#txtCategoriaEdit");
});
