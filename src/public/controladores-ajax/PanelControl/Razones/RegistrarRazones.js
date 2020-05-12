let RegistrarRazones = () => {

    let datos = {
        Razon: $("#txtRazones").val(),
        Tipo_Razon: $("#txtTipo_Razon").val()
    }
   
    $.ajax({
        url: `${URL}/Razones`,
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
       
        if(respuesta.data.ok){
            swal({
                title: "¡Registro exitoso!",
                type: "success",
                confirmButtonClass: "btn-success",
                confirmButtonText: "Ok",
              },
              function(){
                $("#txtRazones").val("");
                ListarRazones();
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

    $("#FormRazones").validate({
        submitHandler: function(){
                RegistrarRazones();
        },
        rules:{
            txtRazones: {
                required:true,
                SoloAlfanumericos:true,
                minlength:2,
                maxlength:45
            },
            txtTipo_Razon: "required"

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