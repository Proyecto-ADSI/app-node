EliminarCalificacion = (Id_Calificacion) => {

    swal({
        title: "¿Desea eliminar este registro?",
        text: "El registro será eliminado y no se podrá recuperar!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false,
        closeOnCancel: true
      },
      function() {
     
       $.ajax({
        url: `${URL}/Calificaciones/${Id_Calificacion}`,
        type: 'delete',
        datatype: 'json',
        success: function (datos) {

            if(datos.data.Eliminar){

                swal("Eliminado!", "¡Registro eliminado correctamente!", "success");
                ListarCalificacion();
            }
            else{

                 swal({
                    title: "¡Error al eliminar!",
                    type: "error",
                    text: "No se puede eliminar el registro, debido a que está asociado a otro registro.",
                    showCancelButton: false,
                    confirmButtonColor: "#1976d2",
                    confirmButtonText: "Cerrar",
                    closeOnConfirm: true,
                });

            }
        },
        error: function (error) {

            swal({
                title: "Error al eliminar.",
                type: "error",
                text: "No se pudo realizar la petición, intente más tarde.",
                showCancelButton: false,
                confirmButtonColor: "#2F6885",
                confirmButtonText: "Cerrar",
                closeOnConfirm: true,
            });
            console.log(error);
        }
    });
});

}


