let EditarBarrioVereda = () => {

    let datos = {
        Id_Barrios_Veredas: parseInt(Id_Barrios_Veredass),
        Codigo: $("#TxtCodigoEdit").val(),
        Nombre: $("#TxtBarrioVeredaEdit").val(),
        Id_SubTipo_Barrio_Vereda: parseInt($("#SelectSubTipoEdit1 option:selected").val()),
        Id_Municipio: parseInt($("#SelectMunicipioEdit1 option:selected").val()),
    };
    $.ajax({
        url: `${URL}/BarriosVeredas`,
        dataType: 'json',
        type: 'put',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal("Excelente", 
            "Barrio o vereda modificado correctamente", "success");
            $("#ModificarBarrioVereda").modal("hide");
            ListarBarrioVereda();
        }else{
            swal("Error al modificar", 
            "Ha ocurrido un error al modificar, intenta de nuevo", 
            "error")
        }
    }).fail(error => {
        console.log(error);
    });
}

$(function (){



    $("#FormBarrioVeredaEdit").validate({
        submitHandler: function(){
                EditarBarrioVereda();
        },
        rules:{
            CodigoEdit: {
                required:true,
                SoloNumeros:true,
                minlength:2,
                maxlength:45
            },
            BarrioVeredaEdit: {
                required:true,
                SoloAlfanumericos:true,
                minlength:2,
                maxlength:45
            },
            SeleSubTipoEdit1:{
                required:true
            },
            SeleMunicipioEdit1:{
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
})
