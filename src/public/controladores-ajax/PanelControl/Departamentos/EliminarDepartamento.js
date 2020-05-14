EliminarDepartamento = (Id_Departamento) => {

    swal({
        title: "¿Desea eliminar este departamento?",
        text: "El departamento será eliminado y no se podra recuperar!",
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
        url: `${URL}/Departamento/${Id_Departamento}`,
        type: 'delete',
        datatype: 'json',
        success: function (datos) {

            if(datos.data.Eliminar){

                swal("Eliminado!", "Departamento eliminado correctamente.", "success");
                ListarDepartamento();
            }
            else{

                 swal({
                    title: "Error al eliminar.",
                    type: "error",
                    text: "No se puede eliminar el departamento, debido a que está asociado a un registro de un empleado",
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


