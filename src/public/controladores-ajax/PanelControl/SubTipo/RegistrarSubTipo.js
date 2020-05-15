let RegistrarSubTipo = () => {

    let datos = {
        SubTipo: $("#TxtSubTipo").val(),
        Estado: parseInt(1),
     
    };

    $.ajax({
        url: `${URL}/SubTipo`,
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal({
                title: "Felicidades",
                text: "Sub tipo registrado correctamente",
                type: "success",
                confirmButtonClass: "btn-success",
                confirmButtonText: "Ok",
              },
              function(){
                ListarSubTipo();
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
                location.href = "/App/Administrador/Panel Control/Panel.html";
              });    
        }
    }).fail(error => {
        swal({
            title: "Error",
            text: "No has crear un documento",
            type: "error",
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Ok",
          },
          function(){
            location.href = "/App/Administrador/Panel Control/Panel.html";
          }); 
    });
}
$(function (){



    $("#FormSubTipo").validate({
        submitHandler: function(){
                RegistrarSubTipo();

                $("#TxtSubTipo").val("")
             
                $("#FormSubTipo .form-group").removeClass("has-success")
                $("#FormSubTipo .form-control").removeClass("form-control-sucess")
        },
        rules:{
            SubTipo: {
                required:true,
                SoloAlfanumericos:true,
                minlength:2,
                maxlength:45
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