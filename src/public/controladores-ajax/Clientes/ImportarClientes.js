$(function(){

    $("#formArchivo").validate({
        submitHandler: function(){

            ImportarClientes();
        },
        rules: {
            archivoClientes: "required"
        },
        errorClass: "form-control-feedback",
        errorElement: "div",
        highlight: function (element) {
            $(element).parents(".dropify-wrapper").addClass("has-danger").removeClass("has-success");
        },
        unhighlight: function (element) {

            $(element).parents(".dropify-wrapper").addClass("has-success").removeClass("has-danger");
            
        },
        errorPlacement: function (error, element) {
            element.parent(".dropify-wrapper").append(error);
        }
    });
});


let ImportarClientes = () => {

    let formData = new FormData();
    let file = $('#archivoClientes')[0].files[0];
    formData.append('Archivo_Clientes', file);
            
    $.ajax({
        url: `${URL}/Cliente/ImportarClientes`,
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
    }).done(respuesta=>{

        if(respuesta.data.Importacion){

            if(respuesta.data.Errores){
                
                // Manipular errores de importación.

            }else{

                $('.importarClientes').modal('hide');

                DataTable.ajax.reload();
                
                swal({
                    title: "Importación de clientes satisfactoria.",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonColor: "#2F6885",
                    confirmButtonText: "Continuar",
                    closeOnConfirm: true,
                });

               
            }
            

        }else{
            swal({
                title: "Error al importar clientes.",
                text: "Ha ocurrido un error al importar, intenta de nuevo",
                type: "error",
                showCancelButton: false,
                confirmButtonColor: "#2F6885",
                confirmButtonText: "Continuar",
                closeOnConfirm: true,
            });
        }
        

    }).fail(error =>{
        console.log(error);
    });

}
