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

  ObtenerSession().then((data) => {
    Id_Usuario = data.session.Id_Usuario;
    let Id_Rol = data.session.Id_Rol;

    OfertaDataTable = $("#OfertaDataTable").DataTable({
      cache: true,
      responsive: true,
      ajax: {
        url: `${URL}/Ofertas/${Id_Rol}`,
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
                  color = "#1976d2";
                  break;
                case 2:
                  color = "#5c4ac7";
                  break;
                case 3:
                  color = "#24bd2c";
                  break;
                case 4:
                  color = "#c310b1";
                  break;
                case 5:
                  color = "#10a6c3";
                  break;
                case 6:
                  color = "#00897b";
                  break;
                case 7:
                  color = "#be3434";
                  break;
                case 8:
                  color = "#6F210C";
                  break;
                case 9:
                  color = "#b7a502";
                  break;
                case 10:
                  color = "#FF8000";
                  break;
                case 11:
                  color = "#FF8000";
                  break;
                case 12:
                  color = "#FF8000";
                  break;
                case 13:
                  color = "#FF8000";
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
          data: "Id_Estado_Oferta",
          className: "all",
          render: function (data, datatype) {
            if (datatype === "display") {
              return `
                      <div class="text-center">
                        <div class="btn-group">
                          <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
                          <div class="dropdown-menu">
                              ${GenerarOpcionesEstados(data)}
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
          $("#Filtro_Operador").find(
            "option[value='" + data.Id_Operador_O + "']"
          ).length == 0
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
  });

  // Habilitar los tooltips
  InicializarToltips();
});

$(document).on("click", "#btnDetalles", function () {
  let data = OfertaDataTable.row($(this).parents("tr")).data();
  CargarDatosModalDetalles(data);
});

$(document).on("click", "#btnCambiarEstado", function () {
  ObtenerSession().then((dataSession) => {
    // Ocultar dropdown
    $(this).parents(".dropdown-menu").removeClass("show");
    MostrarLoaderPuntos();
    let data = OfertaDataTable.row($(this).parents("tr")).data();
    let Id_Usuario = dataSession.session.Id_Usuario;
    let Id_Estado = ValidarEstadoElemento(this);
    let dataCambioEstado = {
      Id_Usuario: Id_Usuario,
      Id_Oferta: data.Id_Oferta,
      Id_Estado: Id_Estado,
    };
    console.log(dataCambioEstado);
    $.ajax({
      url: `${URL}/Ofertas`,
      type: "patch",
      datatype: "json",
      data: JSON.stringify(dataCambioEstado),
      success: function (datos) {
        RecargarDataTable();
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
});

let GenerarOpcionesEstados = (idEstado) => {
  let opciones = "";
  switch (idEstado) {
    case "1":
      opciones = `
        <a id="btnCambiarEstado" class="dropdown-item Negociacion"><i class="fa fa-phone-square"></i> Iniciar negociación</a>
      `;
      break;
    case "2":
      opciones = `
        <a class="dropdown-item" data-toggle="modal" data-target="#ModalEditarOfertas"><i class="fa fa-edit"></i> Editar oferta</a>
        <a id="btnCambiarEstado" class="dropdown-item Aceptada" ><i class="fa fa-phone-square"></i> Aceptar oferta</a>
        <a id="btnCambiarEstado" class="dropdown-item Rechazada"><i class="fa fa-phone-square"></i> Rechazar oferta</a>
        <a id="btnCambiarEstado" class="dropdown-item NoContestaron"><i class="fa fa-phone-square"></i> No contestaron oferta</a>
      `;
      break;
    case "3":
      opciones = `
        <a id="btnCambiarEstado" class="dropdown-item SinVerificar"><i class="fa fa-phone-square"></i> Iniciar activación</a>
        <a id="btnCambiarEstado" class="dropdown-item Rechazada"><i class="fa fa-phone-square"></i> Rechazar oferta</a>
      `;
      break;
    case "4":
      opciones = `
        <a id="btnCambiarEstado" class="dropdown-item SinActivar"><i class="fa fa-phone-square"></i> Verificar oferta</a>
        <a id="btnCambiarEstado" class="dropdown-item Rechazada"><i class="fa fa-phone-square"></i> Rechazar oferta</a>
        <a class="dropdown-item"><i class="fa fa-phone-square"></i> Invalidar oferta</a>
      `;
      break;
    case "5":
      opciones = `
        <a id="btnCambiarEstado" class="dropdown-item Activada"><i class="fa fa-phone-square"></i> Activar oferta</a>
      `;
      break;
    case "6":
      opciones = `
        <a class="dropdown-item" data-toggle="modal" data-target="#ModalEditarOfertas"><i class="fa fa-edit"></i> Editar oferta</a>
      `;
      break;
    case "7":
      opciones = `
        <a id="btnCambiarEstado" class="dropdown-item Negociacion Renegociar"><i class="fa fa-phone-square"></i> Renegociar oferta</a>
      `;
      break;
    case "8":
      opciones = `
        <a id="btnCambiarEstado" class="dropdown-item Negociacion Renegociar"><i class="fa fa-phone-square"></i> Renegociar oferta</a>
        <a id="btnCambiarEstado" class="dropdown-item Rechazada"><i class="fa fa-phone-square"></i> Rechazar oferta</a>
      `;
      break;
    case "9":
      opciones = `
        <a id="btnCambiarEstado" class="dropdown-item SinActivar"><i class="fa fa-phone-square"></i> Verificar oferta</a>
        <a id="btnCambiarEstado" class="dropdown-item Rechazada"><i class="fa fa-phone-square"></i> Rechazar oferta</a>
      `;
      break;
    case "10":
      opciones = `
        <a id="btnCambiarEstado" class="dropdown-item Negociacion"><i class="fa fa-phone-square"></i> Negociar oferta</a>
      `;
      break;
    case "11":
      opciones = `
      <a id="btnCambiarEstado" class="dropdown-item SinActivar"><i class="fa fa-phone-square"></i> Verificar oferta</a>
      <a id="btnCambiarEstado" class="dropdown-item Rechazada"><i class="fa fa-phone-square"></i> Rechazar oferta</a>
      <a class="dropdown-item"><i class="fa fa-phone-square"></i> Invalidar oferta</a>
      `;
      break;
    case "12":
      opciones = `
        <a id="btnCambiarEstado" class="dropdown-item SinActivar"><i class="fa fa-phone-square"></i> Verificar oferta</a>
      `;
      break;
    case "13":
      opciones = `
      <a class="dropdown-item" data-toggle="modal" data-target="#ModalEditarOfertas"><i class="fa fa-edit"></i> Editar oferta</a>
      <a id="btnCambiarEstado" class="dropdown-item Aceptada" ><i class="fa fa-phone-square"></i> Aceptar oferta</a>
      <a id="btnCambiarEstado" class="dropdown-item Rechazada"><i class="fa fa-phone-square"></i> Rechazar oferta</a>
      <a id="btnCambiarEstado" class="dropdown-item NoContestaron"><i class="fa fa-phone-square"></i> No contestaron oferta</a>
      `;
      break;
  }
  return opciones;
};

let ValidarEstadoElemento = (elemento) =>{
  let Id_Estado;
  if ($(elemento).hasClass("Aceptada")) {
    Id_Estado = 3;
  } 
  else if ($(elemento).hasClass("Rechazada")) {
    Id_Estado = 7;
  } 
  else if ($(elemento).hasClass("NoContestaron")) {
    Id_Estado = 8;
  }
  else if ($(elemento).hasClass("SinVerificar")) {
    Id_Estado = 4;
  }
  else if ($(elemento).hasClass("Negociacion")) {
    Id_Estado = 2;
  }
  else if ($(elemento).hasClass("SinActivar")) {
    Id_Estado = 5;
  }
  else if ($(elemento).hasClass("Activada")) {
    Id_Estado = 6;
  }
  return Id_Estado;
};

let RecargarDataTable = () => {
  OfertaDataTable.ajax.reload(function(json){
    OcultarLoaderPuntos();
  });
};

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
