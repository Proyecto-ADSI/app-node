let RegistrarSexo = () => {

    let datos = {
        Nombre: $("#TxtSexo").val(),
        Estado: parseInt(1),
     
    };

    $.ajax({
        url: `${URL}/Sexo`,
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal({
                title: "Felicidades",
                text: "Sexo registrado correctamente",
                type: "success",
                confirmButtonClass: "btn-success",
                confirmButtonText: "Ok",
              },
              function(){
              
                  ListarSexo();
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
            text: "Error al registrar",
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



    $("#FormSexo").validate({
        submitHandler: function(){
                RegistrarSexo();

                $("#TxtSexo").val("")

                $("#FormSexo .form-group").removeClass("has-success")
                $("#FormSexo .form-control").removeClass("form-control-sucess")
        },
        rules:{
            Sexo: {
                required:true,
                SoloLetras:true,
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