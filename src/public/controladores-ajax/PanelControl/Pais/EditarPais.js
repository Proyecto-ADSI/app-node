let EditarPais = () => {

    let datos = {
        Id_Pais: parseInt(Id_Paiss),
        Nombre: $("#TxtPaisEdit").val(),
    };
    $.ajax({
        url: `${URL}/Pais`,
        dataType: 'json',
        type: 'put',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal("Excelente", 
            "País modificado correctamente", "success");
            $("#ModificarPais").modal("hide");
            ListarPais();
        }else{
            swal("Error al modificar", 
            "Ha ocurrido un error al modificar, intenta de nuevo", 
            "error")
        }
    }).fail(error => {
        console.log(error);
    });
}

$("#FormPaisEdit").validate({
    submitHandler: function(){
            EditarPais();
            console.clear();
    },
    rules:{
        PaisEdit: {
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
