let EditarRazones = () => {

    let datos = {
        Id_Razon_Calificacion: parseInt(Id_Razones_Operador),
        Razon: $("#TxtRazonesEdit").val(),
        Tipo_Razon: $("#txtTipo_RazonEdit").val()
    };
    $.ajax({
        url: `${URL}/Razones`,
        dataType: 'json',
        type: 'put',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal("Excelente","¡Registro modificado correctamente!", "success");
            $("#ModificarRazones").modal("hide");
            ListarRazones();
        }else{
            swal("Error al modificar", "Ha ocurrido un error al modificar, intenta de nuevo", "error")
        }
    }).fail(error => {
        console.log(error);
    });
}

$("#FormRazonesEdit").validate({
    submitHandler: function(){
            EditarRazones();
    },
    rules:{
        RazonesEdit: {
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
