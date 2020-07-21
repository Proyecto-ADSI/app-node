var DataTableVisitas = null;


$(function () {
    DataTableVisitas = $("#DataTableVisitas").DataTable({
      ajax: {
        url: `${URL}/Visitas`,
        deferRender: true,
        error: function (error) {
          // console.log("Eror al listar citas " + error);
        },
      },
      columns: [
        { data: "Razon_Social" },

        {data: "NIT_CDV"},

        // {data:"Id_Estado_Cita",
        //  render: function(data, type, fullData){
        //      if (data == 7) {
        //          return `<div class="label label-table" style='background:#00897b;'>Asignada</div>`;
        //      } else if(data == 5) {
        //          return `<div class="label label-table" style='background:#1596DF;'>En reporte</div>`;
        //      }
        //  }},

        {data: "Operador_Cita",
         render: function(data, type, fullData){
            return `<div class="label label-table" style='background:${fullData.Color};'>${data}</div>`
         }},

        {data: "Usuario"},

        {data: "Fecha_Visita"},

        {data: "Estado_Visita",
        render: function(data,type,FullData){
             if (data == "1") {
              return `<div class="label label-table" style='background:#F49308;'>Sin realizar</div>`
             }
             else if (data =="2"){
              return `<div class="label label-table" style='background:#1596DF;'>En negociación</div>`
             }
             else if(data == "3"){
              return `<div class="label label-table" style='background:#19C046;'>Efectiva</div>`
             }
             else if(data == "4"){
              return `<div class="label label-table"  style='background:#7B1949;'>No efectiva</div>`
             }
             else if(data == "5"){
              return `<div class="label label-table" style='background:#F60055F2;'>Cancelada</div>`
             }
        }},
        {data: null,
        render: function(){
            return `<button id="BtnDetallesVI" class="btn btn-sm btn-primary" data-toggle="modal"  data-target=".ModalDetallesVisitas" title="Detalles">
            <i class="fa  fa-eye"></i></button>`
        }}
      ],
      language: Español,
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
            id: "Btn-Pdf-Data1",
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
            id: "Btn-Excel-Data1",
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
            id: "Btn-Helped1",
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
    $("#DataTableVisitas tbody").on("click", "#BtnDetallesVI", function () {
       DetalleVisitas = DataTableVisitas.row($(this).parents("tr")).data();
  
      DetallesVisitas(DetalleVisitas);
    });
  });

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

  $(function () {
    $("#Btn-Pdf-Data1").css("border-radius", "40px");
    $("#Btn-Excel-Data1").css({
      "border-radius": "40px",
      "margin-left": "0.2rem",
      "background-color": "#00897b",
      "border-color": "#00897b",
    });
    $("#Btn-Helped1").css({ "border-radius": "40px", "margin-left": "0.2rem" });
  });
  