// $("#txtDireccion").on('click', function(){
//     $("#modalDireccion").modal('show')
// })

var Editar = null;

$("#CitasDataTable tbody").on("click", "#EditarCita", function () {
  
     Editar = DataTableCitas.row($(this).parents("tr")).data();

     $("#Encargado_Cita").val(Editar.Encargado_Cita)
     $("#Ext_Tel_Contacto_Cita").val(Editar.Ext_Tel_Contacto_Cita)
     $("#Fecha_Cita").val(Editar.Fecha_Cita)
     $("#txtDireccion").val(Editar.Direccion_Cita)
     $('#EditCitas_Barrios_Veredas').val(Editar.Id_Barrios_Veredas);
     $("#Lugar_Referencia").val(Editar.Lugar_Referencia)
     $("#Operadores_EditCit").val(Editar.Id_Operador)


    if (parseInt(Editar.Representante_Legal) == 1 ) {
        $("#switchCitas1").children("label").children("input").trigger("click")
        $("#switchCitas2").val(1)
    }
     
    //  Editar.Representante_Legal == 1 ? $("#switchCitas2").prop("checked", true)  
    //  : EditarCita.Representante_Legal == 0 , $("#switchCitas2").prop("checked", false)

    $.ajax({
        url: `${URL}/BarriosVeredas`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#EditCitas_Barrios_Veredas").empty();
        $("#EditCitas_Barrios_Veredas").append(`

        <option  disabled value="">Seleccione barrio o vereda</option>

            `);

        respuesta.data.forEach(element => {
            
            $("#EditCitas_Barrios_Veredas").append(`

            <option value="${element.Id_Barrios_Veredas}">${element.Nombre_Barrio_Vereda}</>
    
                `);
        });
    })

    $.ajax({
        url: `${URL}/Operador`,
        dataType: 'json',
        type: 'GET',
    }).done(respuesta =>{
        $("#Operadores_EditCit").empty();
        $("#Operadores_EditCit").append(`

        <option  disabled value="">Seleccione un operador</option>

            `);

        respuesta.data.forEach(element => {
            
            $("#Operadores_EditCit").append(`

            <option value="${element.Id_Operador}">${element.Nombre_Operador}</option>
    
                `);
        });
    })
})


let EditarCita = () =>{

    let EditarCitas = {
        Id_Cita: Editar.Id_Cita,
        Encargado:  $("#Encargado_Cita").val(),
        Ext_Tel:   $("#Ext_Tel_Contacto_Cita").val(),
        Representante: parseInt($("#switchCitas2").val()),
        Fecha_Cita:  $("#Fecha_Cita").val(),
        Direccion: $("#txtDireccion").val(),
        Id_Barrios_Vereda: parseInt($("#EditCitas_Barrios_Veredas  option:selected").val()),
        Lugar_Referencia:   $("#Lugar_Referencia").val(),
        Id_Operador: parseInt($("#Operadores_EditCit  option:selected").val())
    }

    $.ajax({
        url: `${URL}/Citas/Editar`,
        type: 'patch',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(EditarCitas),
        processData:false,
        success: function(){
            swal("Excelente", 
            "Cita modificada correctamente", "success");
            $(".ModalEditarCitas").modal("hide");
            RecargarDataTable();
        },
        error: function(){
            swal("Error al modificar", 
            "Ha ocurrido un error al modificar, intenta de nuevo", 
            "error")
        }
    })
}



$(function (){
    $("#EditarCitas_Form").validate({
        submitHandler: function(){
                EditarCita();
        },
        rules:{
            Encargado_Cita: {
                required:true,
                SoloAlfanumericos:true,
                minlength:2,
                maxlength:45
            },
            Ext_Tel_Contacto_Cita:{
                required:true,
                SoloNumeros:true,
                minlength: 7,
                maxlength: 7,
            },
            Representante_Legal:{
                required:true
            },
            Fecha_Cita:{
                required:true
            },
            txtDireccion:{
                required:true
            },
            Barrios_Veredas: {
                required:true,
            },
            Lugar_Referencia:{
                required:true,
                SoloAlfanumericos:true,
                minlength:2,
                maxlength:45
            },
            Operadores_EditCit:{
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