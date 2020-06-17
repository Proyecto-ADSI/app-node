var DataTableCitasSinAsignar = null;
var GuardarFilaSeleccionada = [];
var NumeroSelec = null;

$(function () {
    DataTableCitasSinAsginar = $("#SinAsignarDataTable").DataTable({
    ajax: {
      url: `${URL}/Citas/SinAsignar`,
      deferRender: true,
      error: function (error) {
        console.log("Eror al listar citas " + error);
      },
    },
    columns: [
      {data: "Razon_Social"},
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
        {data:null,
         render: function(data,type,fullData){
             

            $.ajax({
                url: `${URL}/Citas/Asesores/Internos`,
                dataType: 'json',
                type: 'GET',
            }).done(respuesta =>{
                $(`.SelectAsesor`).empty();
                $(`.SelectAsesor`).append(`
            
                <option selected disabled value="">Seleccione un asesor</option>
            
                    `);
                respuesta.data.forEach(element => {
                    
                    $(`.SelectAsesor`).append(
            
                     ` <option value='${element.Id_Usuario}'>${element.Nombre_Completo}</option> `
                        
                        );
                    });
            }).fail(error =>{
                console.log(error);
            });
            
             

             return '<select class="form-control SelectAsesor" id="Select-Asesor"></select>'
            
         }},
        { defaultContent: 
            `
    
            <button id="BtnDetallesSinAsignar" data-toggle="modal" data-target="#Detalles"  class="btn btn-warning">
            <i class="fa fa-eye"></i>
            </button>
    `}
    ], 

    language: Español, 
  });

  $('#SinAsignarDataTable tbody').on( 'click', '#BtnDetallesSinAsignar', function () {
  
    var DetallesCitasSinAsignar = DataTableCitasSinAsginar.row($(this).parents('tr')).data();

    console.log(DetallesCitasSinAsignar)
    
  }); 

$.ajax({
    url: `${URL}/Operador`,
    dataType: 'json',
    type: 'GET',
}).done(respuesta =>{
    $("#List-Operadores").empty();

    respuesta.data.forEach(element => {
        
        $("#List-Operadores").append(

         `<div class="MyStyle_Calentar_List"><i class="fa fa-circle" style='color:${element.Color};'></i>
          ${element.Nombre_Operador}
         </div> `
            
            );
        });
}).fail(error =>{
    console.log(error);
});



});

let RecargarDataTable = () =>{
  DataTableCitasSinAsginar.ajax.reload();
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


$(function(){
    $("#Btn-Pdf-Data").css("border-radius","40px")
    $("#Btn-Excel-Data").css({"border-radius":"40px","margin-left":"0.2rem","background-color":"#00897b","border-color":"#00897b"})
    $("#Btn-Helped").css({"border-radius":"40px","margin-left":"0.2rem"})
    // $(".Cita-Sin-Confirmar").css({"cursor":"poiner"})
  })








 



  





  



 







