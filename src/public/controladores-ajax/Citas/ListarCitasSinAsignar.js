var DataTableCitasSinAsignar = null;
var GuardarCitasSinAsignar = [];
var ArrayCitasInterId = [];
// var NumeroSelec = null;


$(function () {

    
    DataTableCitasSinAsignar = $("#SinAsignarDataTable").DataTable({
    ajax: {
      url: `${URL}/Citas/SinAsignar`,
      error: function (error) {
        console.log("Eror al listar citas " + error);
      },
    },
    columns: [
      {
        data: null,

        render: function (data, type, FullData) {
          let Numero = FullData.Id_Cita;

          let Numero1 = Math.random(Numero);

          return `<div class='MyStyle_demo-checkbox' id='CheckboxCitas'><input type='checkbox' class="CheckCitasSinAsignar" id='basic_checkbox_1${Numero1}' hidden /><label for='basic_checkbox_1${Numero1}'></label></div>`;
        }
      },
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
        {data: "Estado_Cita",
        render: function(data,type,FullDataa){
              if (type == 'display') {
               return `<div class="label label-table label-danger">${data}</div>`
              }
              else{
                return false
              } 
        }}
    ], 

    language: Español, 
    select: {
      style: "multi",
      info: true,
      selector: `.CheckCitasSinAsignar`,
    }
  })
 
  $('#SinAsignarDataTable tbody').on( 'click', '#BtnDetallesSinAsignar', function () {
  
    var DetallesCitasSinAsignar = DataTableCitasSinAsginar.row($(this).parents('tr')).data();

  }); 
   //Seleccionar citas
   DataTableCitasSinAsignar.on("select", function () {
    Filas2 = DataTableCitasSinAsignar.rows(".selected").indexes();
    GuardarCitasSinAsignar = DataTableCitasSinAsignar.rows(Filas2).data().toArray();
   

    $.toast({
      heading: "Perfecto",
      text: "Cita seleccionada",
      position: "top-right",
      loaderBg: "#ff6849",
      showHideTransition: "plain",
      icon: "success",
      hideAfter: 1350,
      stack: false,
    });


  });

  DataTableCitasSinAsignar.on("deselect", function () {
    Filas3 = DataTableCitasSinAsignar.rows(".selected").indexes();
    GuardarCitasSinAsignar = DataTableCitasSinAsignar.rows(Filas3).data().toArray();

    
    $.toast({
      heading: "Perfecto",
      text: "Cita deseleccionada",
      position: "top-right",
      loaderBg: "#ff6849",
      showHideTransition: "plain",
      icon: "error",
      hideAfter: 1350,
      stack: false,
    });
  });
});

$("#SinAsignar").on('click', function(){

 $.ajax({
   url: `${URL}/Citas/Asesores/Internos`,
   dataType: 'json',
   type: 'GET',
    }).done(respuesta =>{
      $(`#SelectAsesorIn`).empty();
      $(`#SelectAsesorIn`).append(`
            
      <option selected disabled value="disabled">Seleccione un asesor</option>
            
      `);
      respuesta.data.forEach(element => {
                    
      $(`#SelectAsesorIn`).append(
            
      ` <option value='${element.Id_Usuario}'>${element.Nombre_Completo}</option> `
                        
       );
         });
    }).fail(error =>{
       console.log(error);
    });
  })
    
  let AsignarCitasInternas = () => {

    if (Object.entries(GuardarCitasSinAsignar).length === 0) {
      swal({
        title: "No hay datos seleccionados",
        text: "Selecciona una cita para asignar",
        type: "error",
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Ok",
      });
    } else {
      GuardarCitasSinAsignar.forEach((element) => {
        if (element.Id_Estado_Cita == "6") {
          let CitaInt = {
            Id_Cita: parseInt(element.Id_Cita),
            Estado_Cita: 7,
            TipoVisita:0,
            Id_Asesor_Interno:parseInt($("#SelectAsesorIn option:selected").val()),
            Id_Estado_Visitaa:1
          };
          ArrayCitasInterId.push(CitaInt);
        } 
      });
    }
    swal({
      title: "¿Desea asignar las citas?",
      text: "Las citas seleccionadas cambiaran de estado y seran asignadas",
      type: "info",
      showCancelButton: true,
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    }, function () {
      setTimeout(function () {  
      $.ajax({
        url: `${URL}/Citas/Asignar/Internas`,
        dataType: "json",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(ArrayCitasInterId),
        processData: false,
        success: function (data) { 
          swal({
            title: "Excelente",
            text: "Cambio de estado exitoso y se asignaron las citas como internas",
            type: "success",
            confirmButtonClass: "btn-success",
            confirmButtonText: "Ok",
          },
          function(){
            window.location.reload()
          });
         $("#ModalSinAsignar").modal("hide")  
         RecargarDataTableSinAsignar();
         $("#SelectAsesorIn").val("disabled");
          GuardarCitasSinAsignar = [];
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





  $(function (){
    $("#FormAsesorInt").validate({
        submitHandler: function(){
          if (Object.entries(GuardarCitasSinAsignar).length === 0) {
            swal({
              title: "No hay datos seleccionados",
              text: "Selecciona una cita para asignar",
              type: "error",
              confirmButtonClass: "btn-danger",
              confirmButtonText: "Ok",
            });

            $("#SelectAsesorIn").val("disabled");
          }else{      
                AsignarCitasInternas(ArrayCitasInterId);
          }
        },
        rules:{
          SelectAseInter: {
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



let RecargarDataTableSinAsignar = () =>{
  DataTableCitasSinAsignar.ajax.reload();
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


$("#SinAsignar").on('click', function(){

  $("#ModalSinAsignar").modal('show')
  $("#SinAsignarDataTable").css({"width":"965px"})
});








 



  





  



 







