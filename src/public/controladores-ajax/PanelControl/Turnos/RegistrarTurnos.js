let RegistrarTurnos = () => {

    let datos = {
        Nombre: $("#TxtTurno").val(),
        Inicio: $("#Inicio").val(),
        Fin:    $("#Fin").val(),
        Estado: parseInt(1),
     
    };

    $.ajax({
        url: `${URL}/Turnos`,
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal({
                title: "Felicidades",
                text: "Turno registrado correctamente",
                type: "success",
                confirmButtonClass: "btn-success",
                confirmButtonText: "Ok",
              },
              function(){
                ListarTurnos();
              });
        }else{
            swal({
                title: "Error",
                text: "Error al registrar",
                type: "error",
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Ok",
              },
              function(){
                 
              });    
        }
    }).fail(error => {
        swal({
            title: "Error",
            text: "Error al registrar",
            type: "error",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Ok",
          },
          function(){
           
          }); 
    });
}
$(function (){



    $("#FormTurnos").validate({
        submitHandler: function(){
                RegistrarTurnos();
        },
        rules:{
            VaTurno: {
                required:true,
                SoloAlfanumericos:true,
                minlength:2,
                maxlength:45
            },
            VaInicio: {
                required:true,
            },
            VaFin:{
                required:true,
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