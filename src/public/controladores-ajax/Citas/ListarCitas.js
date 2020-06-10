var DataTableCitas = null;
var GuardarFilaSeleccionada = [];
var NumeroSelec = null;



$(document).on("click","#BtnReporte", function(){
  if(GuardarFilaSeleccionada == null){
    swal({
      title: "No hay datos seleccionados",
      text: "Selecciona una cita para cambiar el estado",
      type: "error",
      confirmButtonClass: "btn-danger",
      confirmButtonText: "Ok",
    })
 }
})

$(document).on("click","#BtnInterna", function(){
  if(GuardarFilaSeleccionada == null){
    swal({
      title: "No hay datos seleccionados",
      text: "Selecciona una cita para cambiar el estado",
      type: "error",
      confirmButtonClass: "btn-danger",
      confirmButtonText: "Ok",
    })
 }
})
 



$(function () {

    DataTableCitas = $("#CitasDataTable").DataTable({
    ajax: {
      url: `${URL}/Citas`,
      deferRender: true,
      error: function (error) {
        console.log("Eror al listar citas " + error);
      },
    },
    columns: [
      {data: "Id_Estado_Cita",

      render:function(data,type,FullData){

         let Numero = FullData.Id_Cita

         let Numero1 = Math.random(Numero);

         if(data == 3){

          return `<div class='MyStyle_demo-checkbox'><input type='checkbox' class="CheckCitas" id='basic_checkbox_1${Numero1}' hidden /><label for='basic_checkbox_1${Numero1}'></label></div>`

        }
        else{
          return null
        }

       }
      },
      {data: "Razon_Social" },
       {data: "Nombre_Operador",
         render: function(data, type, FullData){
           return `<div class="label label-table" style="background:${FullData.Color_Operador};">${data}</div>`
         }},
         {data: "Fecha_Cita",
         render: function(data){
             let Fecha =  new Date(data)
  
             let Mes = Fecha.getMonth()+1
             let Dia = Fecha.getDate()
             let Año = Fecha.getFullYear()

             for (var i = 1; i < 9; i++) {

              if(Dia == i){
                   return "0" + Dia + "/" +"0"+Mes + "/" + Año;
                }

             }

             let Fecha1 = Dia + "/" +"0"+Mes + "/" + Año;
  
             return Fecha1
         }},
       {data: "Fecha_Cita",
        render: function(data){
            let Hora = new Date(data)

            let Hora1 = Hora.getHours()
            let Minutos = Hora.getMinutes()
            let Segundos = Hora.getSeconds()

            let HoraReal = Hora1 + ":" + Minutos 

            if(Minutos == 0){
             
              return Hora1 + ":" + Minutos + "0"
              
            }
            return HoraReal
        }},
         {data: "Id_Estado_Cita",
         render: function(data,type,FullData){

          if (data == 1) {
            return `<div class="label label-table" style='background:#FF5733;'>${FullData.Estado_Cita}</div>`
          } 
          else if(data == 2) {
            return `<div class="label label-table label-warning">${FullData.Estado_Cita}</div>`
          }
          else if(data == 3){
            return `<div class="label label-table" style='background:#00897b;'>${FullData.Estado_Cita}</div>`
          }
          else if(data == 4){
            return `<div class="label label-table" style='background:#1596DF;'>${FullData.Estado_Cita}</div>`
          }
          else if(data == 5){
            return `<div class="label label-table label-primary">${FullData.Estado_Cita}</div>`
          }
          else if(data == 6){
            return `<div class="label label-table" style='background:#19C046 ;'>${FullData.Estado_Cita}</div>`
          }
          else if(data == 7){
            return `<div class="label label-table" style='background:#E1149A;'>${FullData.Estado_Cita}</div>`
          }
          else if(data == 8){
            return `<div class="label label-table" style='background:#30CA92;'>${FullData.Estado_Cita}</div>`
          }
          else if(data == 9){
            return `<div class="label label-table label-danger">${FullData.Estado_Cita}</div>`
          }
          

          }},

      {data:"Id_Estado_Cita",
       render: function(data,type,FullData){
         
         if (data == 2 || data == 3) {
           return `
           <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
              data-target=".ModalDetalles">
              <i class="fa  fa-eye"></i>
          </button>
      
          <button type="button" data-toggle="tooltip"
              data-original-title="Editar" class="btn btn-info">
              <i class="fa fa-pencil"></i>
          </button>
      
          <button type="button" data-toggle="tooltip" data-original-title="Eliminar"
              class="btn btn-danger">
              <i class="fa fa-close"></i>
          </button>

          <input type="checkbox" id="Switch_Cita" class="js-switch"/>
      `
         }
         else{
        return  `

       <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
          data-target=".ModalDetalles">
          <i class="fa  fa-eye"></i>
      </button>
  
      <button type="button" data-toggle="tooltip"
          data-original-title="Editar" class="btn btn-info">
          <i class="fa fa-pencil"></i>
      </button>
  
      <button type="button" data-toggle="tooltip" data-original-title="Eliminar"
          class="btn btn-danger">
          <i class="fa fa-close"></i>
      </button>
  `
         }
       }}
    ], 
    language: Español, 
    select: {
      style: 'multi',
      info:true,
      selector: `.CheckCitas`,
    },
    dom: "<'col-sm-12 col-md-12'B>"+
    "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
    "<'row'<'col-sm-12'tr>>" +
    "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    buttons:[
      {
        extend:'pdfHtml5',
        text:'<i class="fa fa-file-pdf-o" style="color:#fff;"></i>',
        titleAttr:'Exportar a PDF',
        className:'btn btn-danger',
        //Atajo rapido para hacer funcionalidad del boton tecla + D y saldra el pdf
        key:{
          key:'d',
          shiftKey:true,
        }
      },
      {
        extend:'excelHtml5',
        text:'<i class="fa fa-file-excel-o" style="color:#fff;"></i>',
        titleAttr:'Exportar a excel',
        className:'btn btn-info',
        //Atajo rapido para hacer funcionalidad del boton tecla + x y exportara a excel
        key:{
          key:'x',
          ctrlKey:true,
          }
      },
    ],   
    createdRow: function (row, data, index) {
      
       Estado_Cita = parseInt(data.Id_Estado_Cita);

      let switchElem = Array.prototype.slice.call($(row).find(".js-switch"));

      switchElem.forEach(function (html) {
        let s = new Switchery(html, {
          color: "#00897b",
          secondaryColor: "#ffb22b",
          size: "small",
          className:'switchery SwitchCitas'    
        });

        if (Estado_Cita == 2) {
          s.setPosition(false, true);
        } else if (Estado_Cita == 3) {
          s.setPosition(true, true);
        }
      });
    },
  });

  // $('#TablaCategorias tbody').on( 'click', '#BtnEditar', function () {

  //    Editar = DataTableCategorias.row($(this).parents('tr')).data(); 
    
  //    ObtenerCategoria(Editar);
  // }); 

  $('#CitasDataTable tbody').on( 'click', '#BtnCitasDetalle', function () {
  
    var DetallesCitas = DataTableCitas.row($(this).parents('tr')).data();
    
     DetallesCitass(DetallesCitas);
  });  

  //  $('#TablaCategorias tbody').on( 'click', '#BtnEliminar', function () {

//   Eliminar = DataTableCategorias.row($(this).parents('tr')).data();
// }); 



    //Seleccionar citas
    DataTableCitas.on('select', function(){
    Filas = DataTableCitas.rows( '.selected' ).indexes();
    GuardarFilaSeleccionada = DataTableCitas.rows(Filas).data().toArray(); 

    // NumeroSelec = DataTableCitas.rows( '.selected' ).count()

    // $("#CitasSelect").html(NumeroSelec)

      $.toast({
       heading: 'Perfecto',
       text: 'Cita seleccionada',
       position: 'top-right',
       loaderBg:'#ff6849',
       showHideTransition: 'plain',
       icon: 'success',
       hideAfter: 1350, 
       stack: false
     });
  })
    
    DataTableCitas.on('deselect',function(){
 
      Filas1 = DataTableCitas.rows('.selected').indexes();
      GuardarFilaSeleccionada = DataTableCitas.rows(Filas1).data().toArray();

      // NumeroSelec = DataTableCitas.rows( '.selected' ).count()

      // $("#CitasNum").html(NumeroSelec)
      $.toast({
        heading: 'Perfecto',
        text: 'Cita deseleccionada',
        position: 'top-right',
        loaderBg:'#ff6849',
        showHideTransition: 'plain',
        icon: 'error',
        hideAfter: 1350, 
        stack: false
      });     
  })

  $('#CitasDataTable tbody').on( 'click', '.SwitchCitas', function () {

 
    let fila = $(this).closest("tr");
    let switchElem = fila.find('.js-switch')[0];

    DataCitasVg = DataTableCitas.row($(this).parents('tr')).data();
  
    let Id_Cita = DataCitasVg.Id_Cita
    
    let Estadovg;
    if(switchElem.checked){
        Estadovg = 3;
    }else{
        Estadovg = 2;  
    } 
  
    let DataVg = {
      Id_Cita: parseInt(Id_Cita),
      Estadovg : Estadovg
    }
  
    $.ajax({
        url: `${URL}/Citas/CambioEstado`,
        type: 'put',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(DataVg),
        processData: false,
        success: function (data) {
          RecargarDataTable(); 
          GuardarFilaSeleccionada = []
        },
        error: function (error) {
            console.log(error);
        }
    });
  });


  


  $("#BtnReporte").on("click", function(){

    if(Object.entries(GuardarFilaSeleccionada).length === 0){
      swal({
        title: "No hay datos seleccionados",
        text: "Selecciona una cita para cambiar el estado",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
      })
    }else{

    let ArrayCitasId = []

     GuardarFilaSeleccionada.forEach(element => {
       let Cita = {
          Id: parseInt(element.Id_Cita),
          Estado: 4
        }   
        ArrayCitasId.push(Cita)
     });
     CambiarEstadoCitas(ArrayCitasId)
    }
  })

  $("#BtnInterna").on("click", function(){

    if(Object.entries(GuardarFilaSeleccionada).length === 0){
     location.href = "/App/Admin/Agenda"
    }else{
      
    let ArrayCitasId = []

     GuardarFilaSeleccionada.forEach(element => {
       let Cita = {
          Id: parseInt(element.Id_Cita),
          Estado: 5
        }   
        ArrayCitasId.push(Cita)
     });
     CambiarEstadoCitas(ArrayCitasId)
    }
  })

 let CambiarEstadoCitas = (ArrayCitasId) => {

  $.ajax({
    url: `${URL}/Citas/CambioEstado/Multiple`,
    dataType: "json",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(ArrayCitasId),
    processData: false,
    success: function(data){
      RecargarDataTable();    
      GuardarFilaSeleccionada = []
    },
    error:function(error){
      swal({
        title: "No hay datos seleccionados",
        text: "Selecciona una cita para cambiar el estado",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
      })
      // console.log(error)
    }
  })
    .fail((error) => {
      swal({
        title: "No hay datos seleccionados",
        text: "Selecciona una cita para cambiar el estado",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
      })
      // console.log(error);
    });
  }
});

let RecargarDataTable = () =>{
  DataTableCitas.ajax.reload();
}




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
        1: ", Filas seleccionadas: 1"
    }
}
,
  sProcessing: "Procesando...",

}

$("#Fecha-Cita").datepicker({
  language: "es",
  format: "dd/mm/yyyy",
  autoclose: true,
  todayHighlight: true,
});

$("#Empresa-Cita").on('keyup', function(){
  DataTableCitas.columns(1).search(this.value).draw();
})

$("#Cita-Operador-Filtro").on('keyup', function(){
  DataTableCitas.columns(2).search(this.value).draw();
})

$("#Fecha-Cita-Inicio").on('change',function(){
  DataTableCitas.columns(3).search(this.value).draw();
})

$("#Hora-Cita-Filtro").on('keyup', function(){
  DataTableCitas.columns(4).search(this.value).draw();
})

$("#Cita-Estado-Filtro").on('keyup', function(){
  DataTableCitas.columns(5).search(this.value).draw();
})

let LimpiarFiltroCitas = () =>{
  $("#Empresa-Cita").val('')
  $("#Cita-Operador-Filtro").val('')
  $("#Fecha-Cita-Inicio").val('')
  $("#Hora-Cita-Filtro").val('')
  $("#Cita-Estado-Filtro").val('')
  
  DataTableCitas.columns().search('').draw()
}







 



  





  



 







