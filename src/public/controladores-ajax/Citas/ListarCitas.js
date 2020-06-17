 DataTableCitas = null;
var GuardarFilaSeleccionada = [];
var NumeroSelec = null;

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

         

          return `<div class='MyStyle_demo-checkbox'><input type='checkbox' class="CheckCitas" id='basic_checkbox_1${Numero1}' hidden /><label for='basic_checkbox_1${Numero1}'></label></div>`

      
       

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
         {data: null,
         render: function(data,type,FullData){

          if (FullData.Estado_Cita == "Sin confirmar") {
            return `<div class="label label-table" style='background:#FF5733;'>${FullData.Estado_Cita}</div>`
          } 
          else if(FullData.Estado_Cita == "Sin recordar") {
            return `<div class="label label-table label-warning">${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "No confirmada"){
            return `<div class="label label-table" style='background:#932C42'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "Sin gestionar"){
            return `<div class="label label-table" style='background:#AC7424'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "No recordada"){
            return `<div class="label label-table label-primary">${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "Verificada"){
            return `<div class="label label-table" style='background:#19C046 ;'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "Inválida"){
            return `<div class="label label-table" style='background:#A80202B3'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "No gestionada"){
            return `<div class="label label-table" style='background:#F49308;'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "En reporte"){
            return `<div class="label label-table" style='background:#1596DF;'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "Sin asignar"){
            return `<div class="label label-table label-danger">${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "Asignada"){
            return `<div class="label label-table" style='background:#00897b;'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "No asignada"){
            return `<div class="label label-table" style='background:#7B1949;'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "En desarrollo"){
            return `<div class="label label-table" style='background:#7A66AA;'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "No realizada"){
            return `<div class="label label-table" style='background:#F86868;'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "Realizada"){
            return `<div class="label label-table" style='background:#2F9358;'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "Reagendada"){
            return `<div class="label label-table" style='background:#7B783A;'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "Cancelada"){
            return `<div class="label label-table" style='background:#F60055F2;'>${FullData.Estado_Cita}</div>`
          }
          else if(FullData.Estado_Cita == "Cliente no agendo"){
            return `<div class="label label-table label-danger">${FullData.Estado_Cita}</div>`
          }
          

          }},

      {data:"Id_Estado_Cita",
       render: function(data,type,FullData){
      

        if (FullData.Estado_Cita == "Sin confirmar") {
          return  `

          <div class="btn-group">
            <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
                <div class="dropdown-menu animated rubberBand">
                    <a class="dropdown-item"><i class="fa fa-edit"></i> Editar cita</a>
                    <a id='SinRecordar' class="dropdown-item"><i class="fa fa-question-circle"></i> Sin recordar</a>
                    <a class="dropdown-item"><i class="fa fa-exclamation-triangle"></i> No confirmada</a>
                    <a id='SinGestionar' class="dropdown-item"><i class="fa fa-handshake-o"></i> Sin gestionar</a>
              </div>
              </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        } 
        else if (FullData.Estado_Cita == "Sin recordar") {
          return  `

          <div class="btn-group">
            <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
                <div class="dropdown-menu animated rubberBand">
                    <a class="dropdown-item"><i class="fa fa-edit"></i> Editar cita</a>
                    <a id='SinGestionar' class="dropdown-item"><i class="fa fa-handshake-o"></i> Sin gestionar</a>
                    <a class="dropdown-item"><i class="fa fa-phone-square"></i> Llamada</a>
                   
                    <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
              </div>
              </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        } 
        else if (FullData.Estado_Cita == "No confirmada") {
          return  `

          <div class="btn-group">
            <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
                <div class="dropdown-menu animated rubberBand">
                    <a class="dropdown-item"><i class="fa fa-phone-square"></i> Llamada<br>(No confirmada)</a>
              </div>
              </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        } 
        else if (FullData.Estado_Cita == "Sin gestionar") {
          return  `
          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
                  <a class="dropdown-item"><i class="fa fa-edit"></i> Editar cita</a>
                  <a id='Verificar' class="dropdown-item"><i class="fa fa-check-square-o"></i> Verificar</a>
                  <a id='Invalida' class="dropdown-item"><i class="fa fa-frown-o"></i> Inválida</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }
        else if (FullData.Estado_Cita == "No recordada") {
          return  `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
                 
                  <a class="dropdown-item"><i class="fa fa-phone-square"></i> Llamada <br>(No recordada)</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
                
            </div>
            </div>
            
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        } 
        else if (FullData.Estado_Cita == "Verificada") {
          return  `
          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
                  
            </div>
            </div>
  
         <button type="button"  id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        } 
        else if (FullData.Estado_Cita == "Inválida") {
          return  `
          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
                  <a id='SinGestionar' class="dropdown-item"><i class="fa fa-handshake-o"></i> Sin gestionar</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        } 
        else if (FullData.Estado_Cita == "No gestionada") {
          return  `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
              <a id='Invalida' class="dropdown-item"><i class="fa fa-frown-o"></i> Inválida</a>
              <a id='Verificar' class="dropdown-item"><i class="fa fa-check-square-o"></i> Verificar</a>
              <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }
        else if (FullData.Estado_Cita == "En reporte") {
          return  `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
                  <a id='Realizada' class="dropdown-item"><i class="fa fa-star-half-o"></i> Realizada</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }
        else if (FullData.Estado_Cita == "Sin asignar") {
          return  `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }  
        else if (FullData.Estado_Cita == "Asignada") {
          return  `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
                  <a id='Desarrollo' class="dropdown-item"><i class="fa fa-handshake-o"></i> En desarrollo</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }  
        else if (FullData.Estado_Cita == "No asignada") {
          return  `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }  
        else if (FullData.Estado_Cita == "En desarrollo") {
          return  `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
                  <a id='Realizada' class="dropdown-item"><i class="fa fa-star-half-o"></i> Realizada</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }
        else if (FullData.Estado_Cita == "No realizada") {
          return  `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
                  <a id='Reagendada' class="dropdown-item"><i class="fa fa-calendar"></i> Reagendada</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }
  else if (FullData.Estado_Cita == "Realizada") {
          return  `
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }
        else if (FullData.Estado_Cita == "Reagendada") {
          return  `

          <div class="btn-group">
          <button type="button" id='BtnOpciones' class="btn btn-info dropdown-toggle mr-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-spin fa-gear"></i></button>
              <div class="dropdown-menu animated rubberBand">
                  <a id='SinRecordar' class="dropdown-item"><i class="fa fa-question-circle"></i> Sin recordar</a>
                  <a id='Cancelada' class="dropdown-item"><i class="fa fa-times-rectangle"></i> Cancelada</a>
                  
            </div>
            </div>
  
         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }
        else if (FullData.Estado_Cita == "Cancelada") {
          return  `

         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }
        else if (FullData.Estado_Cita == "Cliente no agendo") {
          return  `

         <button type="button" id="BtnCitasDetalle" data-toggle="modal" class="btn btn-warning"
            data-target=".ModalDetalles">
            <i class="fa  fa-eye"></i>
        </button>
    `
        }
       }},
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
        className:'btn btn-danger mr-2',  
        attr:  {
          id: 'Btn-Pdf-Data'
      },
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
        className:'btn btn-info mr-2',
        attr:  {
          id: 'Btn-Excel-Data'
      },
        //Atajo rapido para hacer funcionalidad del boton tecla + x y exportara a excel
        key:{
          key:'x',
          ctrlKey:true,
          }
      },
      {
        text:'<i class="fa fa-question-circle" style="color:#fff;"></i>',
        className:'btn btn-warning',
        titleAttr:"¿Qué es esto?",
        attr:  {
          id: 'Btn-Helped'
      },
      action: function(){
            $("#AyudaExportar").modal("show")
      },
        //Atajo rapido para hacer funcionalidad del boton tecla + x y exportara a excel
        key:{
          key:'x',
          ctrlKey:true,
          }
      },
    ],   
  });
  $('#CitasDataTable tbody').on( 'click', '#BtnCitasDetalle', function () {
  
    var DetallesCitas = DataTableCitas.row($(this).parents('tr')).data();

    console.log(DetallesCitas)
    
     DetallesCitass(DetallesCitas);
  });  




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


  $("#BtnReporte").on("click", function(){


    if(Object.entries(GuardarFilaSeleccionada).length === 0){
      swal({
        title: "No hay datos seleccionados",
        text: "Selecciona una cita para cambiar el estado",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
      })
    }
    else{
      GuardarFilaSeleccionada.forEach(element => {

     if (element.Id_Estado_Cita == "6") {

      let ArrayCitasId = [] 
       let Cita = {
          Id: parseInt(element.Id_Cita),
          Estado: 9
        }   
        ArrayCitasId.push(Cita)

     CambiarEstadoCitas(ArrayCitasId)
    }
    else {
      swal({
        title: "Cita en estado no verficada",
        text: "Solo las citas verificadas pueden agregarse al reporte",
        type: "warning",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
      })

      RecargarDataTable();
      GuardarFilaSeleccionada = []
    }
  });
}
  })

  $("#BtnInterna").on("click", function(){

    if(Object.entries(GuardarFilaSeleccionada).length === 0){
     location.href = "/App/Admin/Agenda"
    }else{
      
    GuardarFilaSeleccionada.forEach(element => {

      if (element.Id_Estado_Cita == "6") {

        let ArrayCitasId = []

       let Cita = {
          Id: parseInt(element.Id_Cita),
          Estado: 10
        }   

        ArrayCitasId.push(Cita)
    
     CambiarEstadoCitas(ArrayCitasId)  

      } else {

        swal({
          title: "Cita en estado no verficada",
          text: "Solo las citas verificadas pueden agregarse a internas",
          type: "warning",
          confirmButtonClass: "btn-danger",
          confirmButtonText: "Ok",
        })
        RecargarDataTable();
        GuardarFilaSeleccionada = []     
      }
    });
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

$("#Hora-Cita-Filtro").on('change', function(){
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

$(function(){
  $('.clockpicker').clockpicker();
  $("#Btn-Pdf-Data").css("border-radius","40px")
  $("#Btn-Excel-Data").css({"border-radius":"40px","margin-left":"0.2rem","background-color":"#00897b","border-color":"#00897b"})
  $("#Btn-Helped").css({"border-radius":"40px","margin-left":"0.2rem"})

  $('#Fecha-Cita-Inicio, #Fecha-Cita-Fin').change( function() {
    DataTableCitas.draw();
} );
  // $(".Cita-Sin-Confirmar").css({"cursor":"poiner"})
})

 



  





  



 







