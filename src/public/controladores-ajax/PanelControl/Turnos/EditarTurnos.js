let EditarTurno = () => {

    let datos = {
        Id_Turno: parseInt(Id_Turnos),
        Nombre: $("#TxtTurnoEdit").val(),
        Inicio: $("#InicioEdit").val(),
        Fin: $("#FinEdit").val(),
    };
    $.ajax({
        url: `${URL}/Turnos`,
        dataType: 'json',
        type: 'put',
        contentType: 'application/json',
        data: JSON.stringify(datos),
        processData: false,
    }).done(respuesta => {
        if(respuesta.data.ok){
            swal("Excelente", 
            "Turno modificado correctamente", "success");
            $("#ModificarTurno").modal("hide");
            ListarTurnos();
        }else{
            swal("Error al modificar", 
            "Ha ocurrido un error al modificar, intenta de nuevo", 
            "error")
        }
    }).fail(error => {
        console.log(error);
    });
}

$("#FormTurnosEdit").validate({
    submitHandler: function(){
            EditarTurno();
    },
    rules:{
        VaTurnoEdit: {
            required:true,
            minlength:2,
            maxlength:45
        },
        VaInicioEdit: {
            required:true,
            SoloHoras:true,
            minlength:2,
            maxlength:45
        },
        VaFinEdit: {
            required:true,
            SoloHoras:true,
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
