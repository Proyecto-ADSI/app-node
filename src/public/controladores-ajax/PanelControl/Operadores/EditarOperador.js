let EditarOperador = () => {

    let datos = {
        Id_Operador: parseInt(Id_Operadorr),
        Nombre: $("#TxtOperadorEdit").val(),
        Color: ColorSeleccionadoEdit
    };
    $.ajax({
        url: `${URL}/Operador`,
        dataType: 'json',
        type: 'put',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal("Excelente", 
            "Operador modificado correctamente", "success");
            $("#ModificarOperador").modal("hide");
            ListarOperador();
        }else{
            swal("Error al modificar", 
            "Ha ocurrido un error al modificar, intenta de nuevo", 
            "error")
        }
    }).fail(error => {
        console.log(error);
    });
}

$("#FormOperadorEdit").validate({
    submitHandler: function(){
            EditarOperador();
    },
    rules:{
        OperadorEdit: {
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
