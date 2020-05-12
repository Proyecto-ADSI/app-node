let EditarDocumento = () => {

    let datos = {
        Id_Documento: parseInt(Id_Documentos),
        Nombre: $("#TxtDocumentoEdit").val(),
    };
    $.ajax({
        url: `${URL}/Documento`,
        dataType: 'json',
        type: 'put',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal("Excelente", 
            "Documento modificado correctamente", "success");
            $("#ModificarDocumento").modal("hide");
            ListarDocumento();
        }else{
            swal("Error al modificar", 
            "Ha ocurrido un error al modificar, intenta de nuevo", 
            "error")
        }
    }).fail(error => {
        console.log(error);
    });
}

$("#FormDocumentoEdit").validate({
    submitHandler: function(){
            EditarDocumento();
            console.clear();
    },
    rules:{
        DocumentoEdit: {
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
