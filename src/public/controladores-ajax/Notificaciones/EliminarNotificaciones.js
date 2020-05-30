EliminarNotificacion = (id_notificacion) => {

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
      function(isConfirm) {
        if(isConfirm){
            $.ajax({
                url: `${URL}/Notificaciones/${id_notificacion}`,
                type: 'delete',
                datatype: 'json',
                success: function (datos) {
                    if(datos.data.Eliminar){
                        RecargarDataTable();
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
        }
      })
}

let RecargarDataTable = () => {

    DataTableNotificaciones.ajax.reload();
    swal("Registro eliminado!", "Se ha eliminado la notificación.", "success");   
}