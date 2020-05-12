let EditarCalificacion = () => {

    let datos = {
        Id_Calificacion_Operador: parseInt(Id_Calificacion_Operador),
        Calificacion: $("#TxtCalificacionEdit").val(),
    };
    $.ajax({
        url: `${URL}/Calificaciones`,
        dataType: 'json',
        type: 'put',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal("Excelente", 
            "¡Registro modificado correctamente!", "success");
            $("#ModificarCalificacion").modal("hide");
            ListarCalificacion();
        }else{
            swal("Error al modificar", 
            "Ha ocurrido un error al modificar, intenta de nuevo", 
            "error")
        }
    }).fail(error => {
        console.log(error);
    });
}

$("#FormCalificacionEdit").validate({
    submitHandler: function(){
            EditarCalificacion();
    },
    rules:{
        CalificacionEdit: {
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
