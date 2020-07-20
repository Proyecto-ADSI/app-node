$(function () {
  $("#Filtro_Negociacion").select2({
    placeholder: "Seleccione...",
    allowClear: true,
    containerCssClass: "form-control custom-select",
  });
  $("#Filtro_Registro").select2({
    placeholder: "Seleccione...",
    allowClear: true,
    containerCssClass: "form-control custom-select",
  });

  OfertaDataTable = $("#OfertaDataTable").DataTable({
    cache: true,
    responsive: true,
    ajax: {
      url: `${URL}/Ofertas`,
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
        data: "Acciones",
        render: function (data, datatype, row) {
          let fechaRegistro = "";
          let fechaFiltro = "";
          for (let accion of data) {
            if (accion.Id_Estado_Oferta == 1) {
              fechaRegistro = accion.Fecha_Accion;
              fechaFiltro = accion.Fecha_Filtro;
            }
          }
          if (datatype === "display") {
            return fechaRegistro;
          } else {
            return fechaFiltro;
          }
        },
      },
      {
        data: "Nombre_Operador_O",
        render: function (data, datatype, row) {
          if (datatype === "display") {
            return `
              <div class="label label-table text-center" style="background-color:${row.Color_O}">
                ${data}
              </div>
              `;
          } else {
            return row.Id_Operador_O;
          }
        },
      },
      {
        data: "Tipo_Oferta",
        render: function (data, datatype, row) {
          if (datatype === "display") {
            let color = null;
            let texto = "";
            let tipo = parseInt(data);
            switch (tipo) {
              case 1:
                color = "#1976d2";
                texto = "Estándar";
                break;
              case 2:
                color = "#5c4ac7";
                texto = "Personalizada";
                break;
            }
            return `
              <div class="label label-table text-center" style="background-color:${color}">
                ${texto}
              </div>
              `;
          } else {
            return data;
          }
        },
      },
      {
        data: "Estado_Oferta",
        render: function (data, datatype, row) {
          if (datatype === "display") {
            let color = null;
            let id = parseInt(row.Id_Estado_Oferta);
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
              <div class="label label-table text-center" style="background-color:${color}">
                ${data}
              </div>
              `;
          } else {
            return row.Id_Estado_Oferta;
          }
        },
      },
      {
        data: "Acciones",
        className: "none",
        render: function (data, datatype, row) {
          let idUsuario = "";
          let usuario = NA;
          let rol = NA;
          let imagen = "defect.jpg";
          for (let accion of data) {
            if (accion.Id_Estado_Oferta == 2) {
              idUsuario = accion.Id_Usuario;
              usuario = accion.Usuario;
              rol = accion.Rol;
              imagen = accion.Imagen;
            }
          }
          if (datatype === "display") {
            return `
              <div class="row">
                <div class="col-md-3">
                  <span class="round MyStyle_FondoRound">
                      <img src="${URL}/Images/Usuarios/${imagen}" alt="user" width="50">
                  </span>
                </div>
                <div class="col-md-4 m-l-20">
                  <h6>${usuario}</h6><small class="text-muted">${rol}</small>
                </div>
              </div>
            `;
          } else {
            return idUsuario;
          }
        },
      },
      {
        data: "Acciones",
        className: "none",
        render: function (data, datatype, row) {
          let idUsuario = "";
          let usuario = NA;
          let rol = NA;
          let imagen = "defect.jpg";
          for (let accion of data) {
            if (accion.Id_Estado_Oferta == 1) {
              idUsuario = accion.Id_Usuario;
              usuario = accion.Usuario;
              rol = accion.Rol;
              imagen = accion.Imagen;
            }
          }
          if (datatype === "display") {
            return `
              <div class="row">
                <div class="col-md-3">
                  <span class="round MyStyle_FondoRound">
                      <img src="${URL}/Images/Usuarios/${imagen}" alt="user" width="50">
                  </span>
                </div>
                <div class="col-md-4 m-l-20">
                  <h6>${usuario}</h6><small class="text-muted">${rol}</small>
                </div>
              </div>
            `;
          } else {
            return idUsuario;
          }
        },
      },
      {
        data: "Id_Oferta",
        className: "all",
        render: function (data, datatype) {
          if (datatype === "display") {
            return `
                    <div class="text-center">
                    <div class="btn-group">
                        <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" data-toggle="modal" data-target=".ModalEditarCitas"><i class="fa fa-edit"></i> Editar cita</a>
                            <a class="dropdown-item"><i class="fa fa-phone-square"></i> Llamar</a>
                        </div>
                      </div>
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
        svious: "Anterior",
      },
      sProcessing: "Procesando...",
    },
    createdRow: function (row, data, index) {
      if (
        $("#Filtro_Operador").find("option[value='" + data.Id_Operador_O + "']")
          .length == 0
      ) {
        let newOption = new Option(
          data.Nombre_Operador_O,
          data.Id_Operador_O,
          false,
          false
        );
        $("#Filtro_Operador").append(newOption).trigger("change");
      }
      let valNegociacion = true;
      let idUsuario = 0;
      let usuario = NA;
      for (let accion of data.Acciones) {
        if (accion.Id_Estado_Oferta == 1) {
          idUsuario = accion.Id_Usuario;
          usuario = accion.Usuario;
          if (
            $("#Filtro_Registro").find("option[value='" + idUsuario + "']")
              .length == 0
          ) {
            let newOption = new Option(usuario, idUsuario, false, false);
            $("#Filtro_Registro").append(newOption).trigger("change");
          }
        } else if (accion.Id_Estado_Oferta == 2) {
          valNegociacion = false;
          idUsuario = accion.Id_Usuario;
          usuario = accion.Usuario;
          if (
            $("#Filtro_Negociacion").find("option[value='" + idUsuario + "']")
              .length == 0
          ) {
            let newOption = new Option(usuario, idUsuario, false, false);
            $("#Filtro_Negociacion").append(newOption).trigger("change");
          }
        }
      }

      // Validar que no se haya agregado un usuario a select negociación
      if (valNegociacion) {
        idUsuario = 0;
        usuario = NA;
        if (
          $("#Filtro_Negociacion").find("option[value='" + idUsuario + "']")
            .length == 0
        ) {
          let newOption = new Option(usuario, idUsuario, false, false);
          $("#Filtro_Negociacion").append(newOption).trigger("change");
        }
      }
    },
  });

  // Habilitar los tooltips
  InicializarToltips();
});

$(document).on("click", "#btnDetalles", function () {
  let data = OfertaDataTable.row($(this).parents("tr")).data();
  CargarDatosModalDetalles(data);
});

$("#Filtro_NIT").on("keyup", function () {
  OfertaDataTable.columns(0).search(this.value).draw();
});

$("#Filtro_RazonSocial").on("keyup", function () {
  OfertaDataTable.columns(1).search(this.value).draw();
});

$("#Filtro_Fecha").on("keyup", function () {
  OfertaDataTable.columns(2).search(this.value).draw();
});

$("#Filtro_Operador").on("change", function () {
  if (this.value) {
    if (this.value != 0) {
      OfertaDataTable.columns(3).search(this.value).draw();
    }
  }
});

$("#Filtro_Tipo").on("change", function () {
  OfertaDataTable.columns(4).search(this.value).draw();
});

$("#Filtro_Estado").on("change", function () {
  OfertaDataTable.columns(5).search(this.value).draw();
});

$("#Filtro_Negociacion").on("change", function () {
  if (this.value) {
    OfertaDataTable.columns(6).search(this.value).draw();
  }
});
$("#Filtro_Registro").on("change", function () {
  if (this.value) {
    OfertaDataTable.columns(7).search(this.value).draw();
  }
});

let LimpiarFiltro = () => {
  $("#Filtro_NIT").val("");
  $("#Filtro_RazonSocial").val("");
  $("#Filtro_Fecha").val("");
  $("#Filtro_Operador").val("");
  $("#Filtro_Tipo").val("");
  $("#Filtro_Estado").val("");
  $("#Filtro_Negociacion").val("").trigger("change");
  $("#Filtro_Registro").val("").trigger("change");

  OfertaDataTable.columns().search("").draw();
};
