let EditarMunicipio = () => {

    let datos = {
        Id_Municipios: parseInt(Id_Municipios),
        Nombre: $("#TxtMunicipioEdit").val(),
        Id_Departamento: parseInt($("#SelectDepartamentoEdit option:selected").val()),
    };
    $.ajax({
        url: `${URL}/Municipio`,
        dataType: 'json',
        type: 'put',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal("Excelente", 
            "Municipio modificado correctamente", "success");
            $("#ModificarMunicipio").modal("hide");
            ListarMunicipio();
        }else{
            swal("Error al modificar", 
            "Ha ocurrido un error al modificar, intenta de nuevo", 
            "error")
        }
    }).fail(error => {
        console.log(error);
    });
}

$("#FormMunicipioEdit").validate({
    submitHandler: function(){
            EditarMunicipio();
    },
    rules:{
        MunicipioEdit: {
            required:true,
            SoloAlfanumericos:true,
            minlength:2,
            maxlength:45
        },
        SeleDepartamentoEdit:{
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
