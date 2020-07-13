$(document).ready(function () {
  $("#OperadoresTab").click(function () {
    // Comprobar si el data table ya está instanciado.
    if ($.fn.DataTable.isDataTable("#DataTableOperadores")) {
      RecargarDataTableOperadores();
    } else {
      ListarOperador();
    }
  });

  $("#tab2_Operadores").click(function () {
    LimpiarFormOperador();
  });
});

let ListarOperador = () => {
  DataTableOperadores = $("#DataTableOperadores").DataTable({
    ajax: {
      url: `${URL}/Operador`,
      error: function (error) {
        console.log(error);
      },
      // success: function(res){
      //     console.log(res)
      // }
    },
    columns: [
      {
        data: "Nombre_Operador",
        render: function (data, datatype, row) {
          if (datatype === "display") {
            return `
                    <div class="row">
                      <div class="col-md-3">
                        <span class="round MyStyle_FondoRound">
                            <img src="${URL}/Images/Usuarios/${row.Imagen_Operador}" alt="user" width="50">
                        </span>
                      </div>
                      <div class="col-md-4">
                        <h6>${data}</h6>
                        <small>
                        <i class="fa fa-spin fa-circle-o-notch" id="Circulo" style="color:${row.Color}; font-size:22px;"></i>
                        </small>
                      </div>
                    </div>
                  `;
          } else {
            return data;
          }
        },
      },
      {
        data: "Genera_Oferta",
        render: function (data, datatype, row) {
          if (datatype == "display") {
            // Colores
            // Rojo
            let no = "#D3180F ";
            // Verde
            let si = "#08942C";

            let color = null;
            switch (data) {
              case "Si":
                color = si;
                break;
              case "No":
                color = no;
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
        data: "Estado_Operador",
        render: function (data, datatype) {
          if (datatype === "display") {
            return `
              <input type="checkbox" class="js-switch"/>
              <button id="btnEditarOperador" class="btn btn-sm btn-info" title="Editar">
                  <i class="fa fa-pencil"></i>
              </button>
              
              <button id="btnEliminarOperador" class="btn btn-sm btn-danger"  title="Eliminar">
                  <i class="fa fa-close"></i> 
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
    createdRow: function (row, data, index) {
      let Estado_Operador = data.Estado_Operador;
      let switchElem = Array.prototype.slice.call($(row).find(".js-switch"));

      switchElem.forEach(function (html) {
        let s = new Switchery(html, {
          color: "#26c6da",
          secondaryColor: "#f62d51",
          size: "small",
          className: "switchery SwitchOperador",
        });
        if (Estado_Operador == 0) {
          s.setPosition(false, true);
        } else if (Estado_Operador == 1) {
          s.setPosition(true, true);
        }
      });
    },
  });
};

// Cambiar estado
$(document).on("click", ".SwitchOperador", function () {
  let fila = $(this).closest("tr");
  let switchElem = fila.find(".js-switch")[0];
  let datos = DataTableOperadores.row($(this).parents("tr")).data();
  let Id_Operador = datos.Id_Operador;

  // Cambiar Estado Documento
  let Estado;
  if (switchElem.checked) {
    Estado = 1;
  } else {
    Estado = 0;
  }

  $.ajax({
    url: `${URL}/Operador/${Id_Operador}/${Estado}`,
    type: "patch",
    datatype: "json",
    success: function (datos) {},
    error: function (error) {
      console.log(error);
    },
  });
});

// Editar
$(document).on("click", "#btnEditarOperador", function () {
  let data = DataTableOperadores.row($(this).parents("tr")).data();
  CargarModalEditarOperadores(data);
});

// Eliminar
$(document).on("click", "#btnEliminarOperador", function () {
  let data = DataTableOperadores.row($(this).parents("tr")).data();
  let Id_Operador = data.Id_Operador;
  EliminarOperador(Id_Operador);
});

let RecargarDataTableOperadores = () => {
  DataTableOperadores.ajax.reload();
};

let EliminarClasesValidate = (elemento, tipo) => {
  switch (tipo) {
    case 1:
      $(elemento).removeClass("form-control-success");
      $(elemento).parent().removeClass("has-success");
      $(elemento).removeClass("form-control-danger");
      $(elemento).parent().removeClass("has-danger");
      break;
    case 2:
      $(elemento).removeClass("form-control-success");
      $(elemento).parents(".form-group").removeClass("has-success");
      $(elemento).removeClass("form-control-danger");
      $(elemento).parents(".form-group").removeClass("has-danger");
      break;
  }
};

let EliminarElementosValidate = (elemento) => {
  $(elemento).remove();
};
