DataTableCitas = null;
var GuardarFilaSeleccionada = [];
var NumeroSelec = null;
var DataTableReporte = null;
var ArrayCitasId = [];
let NombrePDF;
let InformacionPDF;

$("#DescargarPdf").hide()


$(function () {
  DataTableCitas = $("#CitasDataTable").DataTable({
    responsive:true,
    ajax: {
      url: `${URL}/Citas`,
      deferRender: true,
      error: function (error) {
        // console.log("Eror al listar citas " + error);
      },
    },
    columns: [
      {
        data: null,

        render: function (data, type, FullData) {
          let Numero = FullData.Id_Cita;

          let Numero1 = Math.random(Numero);
          
          if (FullData.Estado_Cita == "Verificada") {
            return `<div class='MyStyle_demo-checkbox' id='CheckboxCitas'><input type='checkbox' class="CheckCitas" id='basic_checkbox_1${Numero1}' hidden /><label for='basic_checkbox_1${Numero1}'></label></div>`;
          }
          else{
            return null;
          }
        },
      },
      { data: "Razon_Social" },
      {
        data: "Nombre_Operador",
        render: function (data, type, FullData) {
          return `<div class="label label-table" style="background:${FullData.Color_Operador};">${data}</div>`;
        },
      },
      {
        data: "Fecha_Cita",
        render: function (data) {
          let Fecha = new Date(data);

          let Mes = Fecha.getMonth() + 1;
          let Dia = Fecha.getDate();
          let Año = Fecha.getFullYear();

          for (var i = 1; i < 9; i++) {
            if (Dia == i) {
              return "0" + Dia + "/" + "0" + Mes + "/" + Año;
            }
          }

          let Fecha1 = Dia + "/" + "0" + Mes + "/" + Año;

          return Fecha1;
        },
      },
      {
        data: "Fecha_Cita",
        render: function (data) {
          let Hora = new Date(data);

          let Hora1 = Hora.getHours();
          let Minutos = Hora.getMinutes();
          let Segundos = Hora.getSeconds();

          let HoraReal = Hora1 + ":" + Minutos;

          if (Minutos == 0) {
            return Hora1 + ":" + Minutos + "0";
          }
          return HoraReal;
        },
      },
      {
        data: null,
        render: function (data, type, FullData) {
          if (FullData.Estado_Cita == "Sin confirmar") {
            return `<div class="label label-table" style='background:#FF5733;'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "Sin recordar") {
            return `<div class="label label-table label-warning">${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "No confirmada") {
            return `<div class="label label-table" style='background:#932C42'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "Sin gestionar") {
            return `<div class="label label-table" style='background:#AC7424'>${FullData.Estado_Cita}</div>`;
          }
          // else if (FullData.Estado_Cita == "No recordada") {
          //   return `<div class="label label-table label-primary">${FullData.Estado_Cita}</div>`;
          // }
          else if (FullData.Estado_Cita == "Verificada") {
            return `<div class="label label-table" style='background:#19C046 ;'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "Inválida") {
            return `<div class="label label-table" style='background:#A80202B3'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "No gestionada") {
            return `<div class="label label-table" style='background:#F49308;'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "En reporte") {
            return `<div class="label label-table" style='background:#1596DF;'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "Sin asignar") {
            return `<div class="label label-table label-danger">${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "Asignada") {
            return `<div class="label label-table" style='background:#00897b;'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "No asignada") {
            return `<div class="label label-table" style='background:#7B1949;'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "En desarrollo") {
            return `<div class="label label-table" style='background:#7A66AA;'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "No realizada") {
            return `<div class="label label-table" style='background:#F86868;'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "Realizada") {
            return `<div class="label label-table" style='background:#2F9358;'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "Reagendada") {
            return `<div class="label label-table" style='background:#7B783A;'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "Cancelada") {
            return `<div class="label label-table" style='background:#F60055F2;'>${FullData.Estado_Cita}</div>`;
          } else if (FullData.Estado_Cita == "Cliente no agendó") {
            return `<div class="label label-table label-danger">${FullData.Estado_Cita}</div>`;
          }
        },
      },

      {
        data: "Id_Estado_Cita",
        render: function (data, type, FullData) {
          if (FullData.Estado_Cita == "Sin confirmar") {
            return `

          <div class="btn-group">
            <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
                <div class="dropdown-menu animated flipInX" id='Action'>
                    <a class="dropdown-item" data-toggle="modal" data-target=".ModalEditarCitas"  id="EditarCita"><i class="fa fa-edit"></i> Editar cita</a>
                    <a class="dropdown-item"><i class="fa fa-phone-square"></i> Llamar</a>
              </div>
              </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "Sin recordar") {
            return `

          <div class="btn-group">
            <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
                <div class="dropdown-menu animated flipInX" id='Action'>
                    <a class="dropdown-item" data-toggle="modal" data-target=".ModalEditarCitas" id="EditarCita"><i class="fa fa-edit"></i> Editar cita</a>
                    <a class="dropdown-item"><i class="fa fa-phone-square"></i> Llamar</a>
                    <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
              </div>
              </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "No confirmada") {
            return `

          <div class="btn-group">
            <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
                <div class="dropdown-menu animated flipInX" id='Action'>
                    <a class="dropdown-item" data-toggle="modal" data-target=".ModalEditarCitas" id="EditarCita"><i class="fa fa-edit"></i> Editar cita</a>
                    <a class="dropdown-item"><i class="fa fa-phone-square"></i> Llamar</a>
              </div>
              </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "Sin gestionar") {
            return `
          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated flipInX" id='Action'>
                  <a class="dropdown-item" data-toggle="modal" data-target=".ModalEditarCitas" id="EditarCita"><i class="fa fa-edit"></i> Editar cita</a>
                  <a id='Verificar' class="dropdown-item"><i class="fa fa-check-square-o"></i> Verificar</a>
                  <a id='Invalida' class="dropdown-item"><i class="fa fa-frown-o"></i> Inválidar</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          }
          else if (FullData.Estado_Cita == "Verificada") {
            return `
          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated flipInX">
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
            </div>
            </div>
  
         <button type="button"  id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "Inválida") {
            return `
          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated flipInX">
                  <a id='SinGestionar' class="dropdown-item"><i class="fa fa-phone-square"></i> Llamar</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "No gestionada") {
            return `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated flipInX">
              <a id='Invalida' class="dropdown-item"><i class="fa fa-frown-o"></i> Inválidar</a>
              <a id='Verificar' class="dropdown-item"><i class="fa fa-check-square-o"></i> Verificar</a>
              <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "En reporte") {
            return `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated flipInX">
                  <a id='Realizada' class="dropdown-item"><i class="fa fa-star-half-o"></i> Realizar</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "Sin asignar") {
            return `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated flipInX">
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "Asignada") {
            return `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated flipInX">
                  <a id='Desarrollo' class="dropdown-item"><i class="fa fa-handshake-o"></i> Atender</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "No asignada") {
            return `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-sm btn-primary dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated flipInX">
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "En desarrollo") {
            return `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-sm btn-primary dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated flipInX">
                  <a id='Realizada' class="dropdown-item"><i class="fa fa-star-half-o"></i> Realizada</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "No realizada") {
            return `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated flipInX">
                  <a id='Reagendada' class="dropdown-item"><i class="fa fa-calendar"></i> Reagendar</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "Realizada") {
            return `
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "Reagendada") {
            return `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-sm btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated flipInX">
              <a id='Verificar' class="dropdown-item"><i class="fa fa-check-square-o"></i> Verificar</a>
              <a id='Invalida' class="dropdown-item"><i class="fa fa-frown-o"></i> Inválidar</a>
              <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelar</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "Cancelada") {
            return `

         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          } else if (FullData.Estado_Cita == "Cliente no agendó") {
            return `

         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-sm btn-primary"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `;
          }
        },
      },
    ],
    language: Español,
    select: {
      style: "multi",
      info: true,
      selector: `.CheckCitas`,
    },
    dom:
      "<'col-sm-12 col-md-12'B>" +
      "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    buttons: [
      {
        extend: "pdfHtml5",
        text: '<i class="fa fa-file-pdf-o" style="color:#fff;"></i>',
        titleAttr: "Exportar a PDF",
        className: "btn btn-danger mr-2",
        attr: {
          id: "Btn-Pdf-Data",
        },
        //Atajo rapido para hacer funcionalidad del boton tecla + D y saldra el pdf
        key: {
          key: "d",
          shiftKey: true,
        },
      },
      {
        extend: "excelHtml5",
        text: '<i class="fa fa-file-excel-o" style="color:#fff;"></i>',
        titleAttr: "Exportar a excel",
        className: "btn btn-info mr-2",
        attr: {
          id: "Btn-Excel-Data",
        },
        //Atajo rapido para hacer funcionalidad del boton tecla + x y exportara a excel
        key: {
          key: "x",
          ctrlKey: true,
        },
      },
      {
        text: '<i class="fa fa-question-circle" style="color:#fff;"></i>',
        className: "btn btn-warning",
        titleAttr: "¿Qué es esto?",
        attr: {
          id: "Btn-Helped",
        },
        action: function () {
          $("#AyudaExportar").modal("show");
        },
        //Atajo rapido para hacer funcionalidad del boton tecla + x y exportara a excel
        key: {
          key: "x",
          ctrlKey: true,
        },
      },
    ],
  });
  $("#CitasDataTable tbody").on("click", "#BtnCitasDetalle", function () {
     DetallesCitas = DataTableCitas.row($(this).parents("tr")).data();

    DetallesCitass(DetallesCitas);
  });

  //Seleccionar citas
  DataTableCitas.on("select", function () {
    Filas = DataTableCitas.rows(".selected").indexes();
    GuardarFilaSeleccionada = DataTableCitas.rows(Filas).data().toArray();

    $.toast({
      heading: "¡Perfecto!",
      text: '<p class="jq-toast-body">Cita seleccionada</p>',
      position: "top-right",
      loaderBg: "#ff6849",
      showHideTransition: "plain",
      icon: "success",
      hideAfter: 2500,
      stack: false,
    });


  });

  DataTableCitas.on("deselect", function () {
    Filas1 = DataTableCitas.rows(".selected").indexes();
    GuardarFilaSeleccionada = DataTableCitas.rows(Filas1).data().toArray();

    $.toast({
      heading: "¡Perfecto!",
      text: '<p class="jq-toast-body">Cita deseleccionada</p>',
      position: "top-right",
      loaderBg: "#ff6849",
      showHideTransition: "plain",
      icon: "error",
      hideAfter: 2500,
      stack: false,
    });
  });
});

let RecargarDataTable = () => {
  DataTableCitas.ajax.reload(function(){
      OcultarLoaderPuntos();
  });
};

var Español = {
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
  select: {
    rows: {
      _: ", Filas seleccionadas: %d",
      1: ", Filas seleccionadas: 1",
    },
  },
  sProcessing: "Procesando...",
};

$("#Fecha-Cita").datepicker({
  language: "es",
  format: "dd/mm/yyyy",
  autoclose: true,
  todayHighlight: true,
});

$("#Empresa-Cita").on("keyup", function () {
  DataTableCitas.columns(1).search(this.value).draw();
});

$("#Cita-Operador-Filtro").on("keyup", function () {
  DataTableCitas.columns(2).search(this.value).draw();
});

$("#Fecha-Cita-Inicio").on("change", function () {
  DataTableCitas.columns(3).search(this.value).draw();
});

$("#Hora-Cita-Filtro").on("change", function () {
  DataTableCitas.columns(4).search(this.value).draw();
});

$("#Cita-Estado-Filtro").on("keyup", function () {
  DataTableCitas.columns(5).search(this.value).draw();
});

let LimpiarFiltroCitas = () => {
  $("#Empresa-Cita").val("");
  $("#Cita-Operador-Filtro").val("");
  $("#Fecha-Cita-Inicio").val("");
  $("#Hora-Cita-Filtro").val("");
  $("#Cita-Estado-Filtro").val("");

  DataTableCitas.columns().search("").draw();
};

$(function () {
  $(".clockpicker").clockpicker();
  $("#Btn-Pdf-Data").css("border-radius", "40px");
  $("#Btn-Excel-Data").css({
    "border-radius": "40px",
    "margin-left": "0.2rem",
    "background-color": "#00897b",
    "border-color": "#00897b",
  });
  $("#Btn-Helped").css({ "border-radius": "40px", "margin-left": "0.2rem" });

  $("#Fecha-Cita-Inicio, #Fecha-Cita-Fin").change(function () {
    DataTableCitas.draw();
  });
});

$("#BtnInterna1").on('click', function(){

  $("#ModalInterna").modal("show");

  DataTableInterna = $("#CitasInternaDataTable").DataTable({
    destroy:true,
    data: GuardarFilaSeleccionada,
    columns: [
      
        {data: "Razon_Social"},
        {data: "Nombre_Operador",
         render: function(data,type,FullDataa){
                 if (type == 'display') {
                  return `<div class="label label-table" style="background:${FullDataa.Color_Operador};">${data}</div>`
                 }else{
                   return false
                 }
         }},
        {data: "Fecha_Cita",
        render: function(data){
          let Fecha = new Date(data);

          let Mes = Fecha.getMonth() + 1;
          let Dia = Fecha.getDate();
          let Año = Fecha.getFullYear();

          for (var i = 1; i < 9; i++) {
            if (Dia == i) {
              return "0" + Dia + "/" + "0" + Mes + "/" + Año;
            }
          }

          let Fecha1 = Dia + "/" + "0" + Mes + "/" + Año;

          return Fecha1;
        }},
        {data: "Fecha_Cita",
        render: function(data){
          let Hora = new Date(data);

          let Hora1 = Hora.getHours();
          let Minutos = Hora.getMinutes();
          let Segundos = Hora.getSeconds();

          let HoraReal = Hora1 + ":" + Minutos;

          if (Minutos == 0) {
            return Hora1 + ":" + Minutos + "0";
          }
          return HoraReal;
        }},
        {data: "Estado_Cita",
         render: function(data,type,FullDataa){
               if (type == 'display') {
                return `<div class="label label-table" style='background:#19C046 ;'>${data}</div>`
               }
               else{
                 return false
               } 
         }}

    ],

    language: Español,
  });

  $("#CitasInternaDataTable").css({"width":"965px"})
})

$("#BtnInterna").on("click", function () {
    if (Object.entries(GuardarFilaSeleccionada).length === 0) {
      swal({
        title: "No hay datos seleccionados",
        text: "Selecciona una cita para cambiar el estado",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
      });
    } else {
      swal({
        title: "¿Desea cambiar estado a las citas?",
        text: "Las citas seleccionadas cambiaran de estado",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      }, function () {
        setTimeout(function () {  
       let ArrayCitasId = [];

      GuardarFilaSeleccionada.forEach((element) => {
        if (element.Id_Estado_Cita == "4") {

          let Cita = {
            Id_Cita: parseInt(element.Id_Cita),
            Estado: 6,
          };

          ArrayCitasId.push(Cita);
        } 
      });

      $.ajax({
        url: `${URL}/Citas/Interna/Estado/Multiple`,
        dataType: "json",
        type: "patch",
        contentType: "application/json",
        data: JSON.stringify(ArrayCitasId),
        processData: false,
        success: function (data) { 
          swal("Excelente", 
            "Cambio de estado exitoso", "success"); 
          RecargarDataTable();
          GuardarFilaSeleccionada = [];
          DataTableInterna.clear().draw();
        },
        error: function (error) {
          swal({
            title: "Error",
            text: "Error en el servidor",
            type: "error",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Ok",
          });
        },
      }).fail((error) => {
        swal({
          title: "Error",
          text: "Error en el servidor",
          type: "error",
          confirmButtonClass: "btn-danger",
          confirmButtonText: "Ok",
        });
      });
    }, 2000);
    })
  }
  });





$("#BtnReporte1").on('click', function(){

  if (Object.entries(GuardarFilaSeleccionada).length === 0) {
    // $('#SelectAsesorEx-er').remove();
    $("#SelectAsesorEx").append(`<option selected disabled value="">No hay datos seleccionados</option>`)
  }else{
    $.ajax({
        url: `${URL}/Citas/Asesores/Externos`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#SelectAsesorEx").empty();
        $("#SelectAsesorEx").append(`
        <option selected disabled value="">Seleccione un asesor</option>
            `);
            respuesta.data.results.forEach(element => {
              $("#SelectAsesorEx").append(`
              <option value="${element.id}">${element.text}</option>
                  `);
            }); 
    }).fail(error =>{
        // console.log(error);
    });
    // $("#SelectAsesorEx").select2({
    //   placeholder: "Seleccione un asesor",
    //   language: "es",
    //   allowClear: true,
    //   maximumInputLength: 20,
    //   ajax: {
    //     url: `${URL}/Citas/Asesores/Externos`,
    //     dataType: "json",
    //     delay: 250,
    //     type: "get",
    //     data: function (params) {
    //       var query = {
    //         search: params.term,
    //       };
    //       return query;
    //     },
    //     processResults: function (respuesta) {
    //       console.log(respuesta.data)
    //       return {
    //         results: respuesta.data,
    //       };
    //     },
    //   },
    // });
  }

  $("#ModalReporte").modal("show");

  DataTableReporte = $("#CitasReporteDataTable").DataTable({
    destroy:true,
    data: GuardarFilaSeleccionada,
    columns: [
      
        {data: "Razon_Social"},
        {data: "Nombre_Operador",
         render: function(data,type,FullDataa){
                 if (type == 'display') {
                  return `<div class="label label-table" style="background:${FullDataa.Color_Operador};">${data}</div>`
                 }else{
                   return false
                 }
         }},
        {data: "Fecha_Cita",
        render: function(data){
          let Fecha = new Date(data);

          let Mes = Fecha.getMonth() + 1;
          let Dia = Fecha.getDate();
          let Año = Fecha.getFullYear();

          for (var i = 1; i < 9; i++) {
            if (Dia == i) {
              return "0" + Dia + "/" + "0" + Mes + "/" + Año;
            }
          }

          let Fecha1 = Dia + "/" + "0" + Mes + "/" + Año;

          return Fecha1;
        }},
        {data: "Fecha_Cita",
        render: function(data){
          let Hora = new Date(data);

          let Hora1 = Hora.getHours();
          let Minutos = Hora.getMinutes();
          let Segundos = Hora.getSeconds();

          let HoraReal = Hora1 + ":" + Minutos;

          if (Minutos == 0) {
            return Hora1 + ":" + Minutos + "0";
          }
          return HoraReal;
        }},
        {data: "Estado_Cita",
         render: function(data,type,FullDataa){
               if (type == 'display') {
                return `<div class="label label-table" style='background:#19C046 ;'>${data}</div>`
               }
               else{
                 return false
               } 
         }}

    ],

    language: Español,
  });

  $("#CitasReporteDataTable").css({"width":"965px"})
})

 let CambiarEstadoCitas = () => {

  if (Object.entries(GuardarFilaSeleccionada).length === 0) {
    swal({
      title: "No hay datos seleccionados",
      text: "Selecciona una cita para cambiar el estado",
      type: "error",
      confirmButtonClass: "btn-danger",
      confirmButtonText: "Ok",
    });
  } else {
    let Cita = {};
    GuardarFilaSeleccionada.forEach((element) => {
      if (element.Id_Estado_Cita == "4") {
          Cita = {
          Id_Cita: parseInt(element.Id_Cita),
          Estado_Cita: 5,
          TipoVisita:1,
          Id_Asesor_Externoo:parseInt($("#SelectAsesorEx option:selected").val()),
          Id_Estado_Visitaa:1,
          InformacionPDF: element
        };
        ArrayCitasId.push(Cita);
      } 
    });
  }
  swal({
    title: "¿Desea cambiar estado?",
    text: "Las citas seleccionadas cambiaran de estado y seran externas",
    type: "info",
    showCancelButton: true,
    closeOnConfirm: false,
    showLoaderOnConfirm: true
  }, function () {
    setTimeout(function () {  
    $.ajax({
      url: `${URL}/Citas/CambioEstado/Multiple`,
      dataType: "json",
      type: "post",
      contentType: "application/json",
      data: JSON.stringify(ArrayCitasId),
      processData: false,
      success: function (data) {  
          let PDF = JSON.stringify(data) 
          NombrePDF = PDF.substr(26,31)
          swal(
            {
              title: "Perfecto",
              text: "Cambio de estado satisfactorio",
              type: "success",
              showCancelButton: false,
              confirmButtonClass: "btn-info",
              confirmButtonText: "Ok",
              closeOnConfirm: true,
            },
          );

      DataTableReporte.clear().draw(); 
      $("#DescargarPdf").show()  
      $("#DescargarPdf").attr('href',`${URL}/Reportes/${PDF.substr(26,31)}`)

      $("#DescargarPdf").on('click', function(){
        $("#DescargarPdf").hide()
        EliminarPDF(NombrePDF);
      })

        RecargarDataTable();
        GuardarFilaSeleccionada = [];
      },
      error: function (error) {
        console.log(error)
        swal({
          title: "Error",
          text: "Error en el servidor",
          type: "error",
          confirmButtonClass: "btn-danger",
          confirmButtonText: "Ok",
        });
      },
    }).fail((error) => {
      swal({
        title: "Error",
        text: "Error en el servidor",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
      });
    });
  }, 2000);
});

  };


  const EliminarPDF = NombrePDF =>{

    let PDF = {
      NombrePDF: NombrePDF
    }

    $.ajax({
      url:`${URL}/Citas/EliminarPDF`,
      type:'post',
      dataType:'json',
      contentType:'application/json',
      processData:false,
      data: JSON.stringify(PDF),
      success: function(Response){

        console.log(Response.data.Ok)

      }

    })

  }

  // $("#Asesor_Ext").select2({
  //   language: "es",
  //   containerCssClass: "form-control custom-select",
  //   maximumInputLength: 20,
  //   ajax: {
  //     url: `${URL}/Citas/Asesores/Externos`,
  //     dataType: "json",
  //     delay: 250,
  //     type: "get",
  //     data: function (params) {
  //       var query = {
  //         palabra: params.term,
  //       };
  //       console.log(query)
  //       return query;
       
  //     },
  //     processResults: function (respuesta) {
  //       var data = {
  //         results: respuesta.data.results
  //       };

  //       return data
  //     },
  //     cache: true,
  //   },
  //   placeholder: 'Search for a repository',
  //   minimumInputLength: 1,
  //   templateResult: formatRepo,
  //   templateSelection: formatRepoSelection
  // });
  
  // function formatRepo (repo) {
  //   console.log(repo)
  //   if (repo.loading) {
  //     return repo.text;
  //   }
  
  //   var $container = $(
  //     "<div class='select2-result-repository clearfix'>" +
  //     `<div class='select2-result-repository__avatar'><img src="${URL}/Images/Usuarios/${repo.Imagen}"/></div>` +
  //       "<div class='select2-result-repository__meta'>" +
  //         "<div class='select2-result-repository__title'></div>" +
  //         "<div class='select2-result-repository__description'></div>" +
  //         "<div class='select2-result-repository__statistics'>" +
  //           "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> </div>" +
  //           "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> </div>" +
  //           "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> </div>" +
  //         "</div>" +
  //       "</div>" +
  //     "</div>"
  //   );
  
  //   $container.find(".select2-result-repository__title").text(repo.text);
  //   $container.find(".select2-result-repository__description").text(repo.Rol);
  
  //   return $container;
  // }
  
  // function formatRepoSelection (repo) {
  //   return repo.text;
  // }

  $(function (){
    $("#FormAsesores").validate({
        submitHandler: function(){
          if (Object.entries(GuardarFilaSeleccionada).length === 0) {
            swal({
              title: "No hay datos seleccionados",
              text: "Selecciona una cita para cambiar el estado",
              type: "error",
              confirmButtonClass: "btn-danger",
              confirmButtonText: "Ok",
            });

            $("#SelectAsesorEx").val("");
          }else{      
                CambiarEstadoCitas(ArrayCitasId);
                $("#SelectAsesorEx").val("");
          }
        },
        rules:{
          SelectAseExt: {
                required:true
            }
        },
        errorClass: "form-control-feedback",
        errorElement: "div",
        highlight: function (element) {
            $(element).parents(".form-group").addClass("has-danger").removeClass("has-success");
            $(element).addClass("form-control-danger").removeClass("form-control-success");
        },
        unhighlight: function (element) {

            $(element).parents(".form-group").addClass("has-success").removeClass("has-danger");
            $(element).addClass("form-control-success").removeClass("form-control-danger");
        },
        errorPlacement: function (error, element) {
                error.insertAfter(element.parent(".input-group"));
            
        }
        
    });
})



